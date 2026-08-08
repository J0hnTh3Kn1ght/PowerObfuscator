import { quotedSpans, type Span } from "../spans";


interface LiteralEdit {
  start: number;
  end: number;
  replacement: string;
}

interface EligibleLiteral { 
  start: number; 
  end: number; 
  quote: string; 
  inner: string 
}

const CMDLET_TAIL = /(?:^|[^A-Za-z0-9_-])[A-Za-z]+-[A-Za-z]+$/;
const ECHO_TAIL = /(?:^|[^A-Za-z0-9_])(?:echo|write|print)$/i;
const METHOD_TAIL = /(?:\.|::)[A-Za-z_][A-Za-z0-9_]*$/;
const PARAM_TAIL = /(?:^|\s)-[A-Za-z][A-Za-z0-9]*$/;
const OPERATOR_TAIL = /(?:^|\s)-(?:eq|ne|like|notlike|match|notmatch|contains|notcontains|in|notin|replace|split|join|is|isnot|as|f|band|bor|bxor|and|or|not|xor|ceq|cne|clike|cnotlike|cmatch|cnotmatch)$/i;




function is_Splittable_Context(payload: string, start: number, spans: readonly Span[]): boolean {
  let j = start - 1;

  while (j >= 0) {
    const c = payload[j]!;
    if (c === " " || c === "\t" || c === "," || c === "(") { j--; continue; }
    const prev = spans.find((s) => s[1] - 1 === j);
    if (prev) { j = prev[0] - 1; continue; }
    break;
  }

  if (j < 0) return true;
  const c = payload[j]!;
  if (c === "=" || c === "|" || c === ";" || c === "+" || c === "&" || c === "(" || c === "," || c === "\n" || c === "\r" || c === "{") return true;
  
  const tail = payload.slice(0, j + 1);

  return CMDLET_TAIL.test(tail) || ECHO_TAIL.test(tail) || METHOD_TAIL.test(tail) || PARAM_TAIL.test(tail) || OPERATOR_TAIL.test(tail);
}




function LiteralSpans(payload: string, spans: readonly Span[], minInnerLength: number): EligibleLiteral[] {
  
  const out: EligibleLiteral[] = [];
  let hashDepth = 0;
  let scanPos = 0;

  for (const [start, end] of spans) {
    while (scanPos < start) {
      if (payload[scanPos] === "@" && payload[scanPos + 1] === "{") { hashDepth++; scanPos += 2; continue; }
      if (payload[scanPos] === "{" && hashDepth > 0) hashDepth++;
      else if (payload[scanPos] === "}" && hashDepth > 0) hashDepth--;
      scanPos++;
    }
    scanPos = end;

    const raw = payload.slice(start, end);
    if (raw.startsWith("@")) continue;
    const quote = raw[0]!;
    if (quote !== "'" && quote !== '"') continue;
    const inner = raw.slice(1, -1);
    if (inner.length < minInnerLength) continue;
    if (quote === '"' && /[$`]/.test(inner)) continue;
    if (!is_Splittable_Context(payload, start, spans)) continue;
    if (hashDepth > 0) continue;

    out.push({ start, end, quote, inner });
  }

  return out;
}




function apply(payload: string, edits: readonly LiteralEdit[]): string {
  if (!edits.length) return payload;

  let out = "";
  let cursor = 0;
  for (const e of edits) {
    out += payload.slice(cursor, e.start) + e.replacement;
    cursor = e.end;
  }
  
  return out + payload.slice(cursor);
}




export function stringConcatSplit(payload: string): string {
  const spans = quotedSpans(payload);
  const edits: LiteralEdit[] = [];

  for (const { start, end, quote, inner } of LiteralSpans(payload, spans, 2)) {
    const parts: string[] = [];
    
    for (let i = 0; i < inner.length; i++) {
      if (quote === "'" && inner[i] === "'" && inner[i + 1] === "'") { parts.push("''"); i++; continue; }
      parts.push(inner[i]!);
    }
    
    if (parts.length < 2) continue;
    edits.push({ start, end, replacement: `(${parts.map((p) => quote + p + quote).join("+")})` });
  }

  return apply(payload, edits);
}




export function bytesToChars(payload: string): string {

  const DOUBLE_QUOTE_ESCAPES: Record<string, string> = {
  n: "\n", r: "\r", t: "\t", "0": "\0", a: "\x07", b: "\b", f: "\f", v: "\v",
};

  const spans = quotedSpans(payload);
  const edits: LiteralEdit[] = [];

  for (const { start, end, quote, inner } of LiteralSpans(payload, spans, 1)) {
    const decoded = quote === "'"
      ? inner.replace(/''/g, "'")
      : inner.replace(/`(.)/g, (_, c: string) => DOUBLE_QUOTE_ESCAPES[c] ?? c);
    const chars: string[] = [];

    for (const ch of decoded) {
      const code = ch.charCodeAt(0);
      if (code > 0xff) { chars.length = 0; break; }
      chars.push(`[char]([byte]0x${code.toString(16).padStart(2, "0")})`);
    }

    if (!chars.length) continue;
    edits.push({ start, end, replacement: `"$(${chars.join("+")})"` });
  }

  return apply(payload, edits);
}
