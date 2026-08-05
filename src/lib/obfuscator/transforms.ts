import { pick, sample, type RNG } from "./rng";
import { inSpans, quotedSpans } from "./spans";

/** 
 * I still have a lot of research (and work) ahead of me... Replacing commands goes far beyond just changing `pwd` in a script. 
 * I'll be adding more options in the future, but for now, this should do the trick.
 * 
 * */   

const PWD_ALTS = [
  `$($p = (Split-Path "$PWD\\0x00"); if ($p.trim() -eq '') {echo 'C:\\'} else {echo $p})`,
  "gl",
  "get-location",
  "cmd.exe /c chdir",
  "[System.IO.Directory]::GetCurrentDirectory()",
];

// "Boolean typecast of literally anything that is not 0 or Null or an empty string, will return True" - PowerShell-Obfuscation-Bible

const BOOL_ALTS = [
  "[bool][bool]",
  "[bool][char]",
  "[bool][int]",
  "[bool][string]",
  "[bool][double]",
  "[bool][int16]",
  "[bool][decimal]",
  "[bool][byte]",
  "[bool][timespan]",
  "[bool][datetime]",
  "[bool]1254",
  "[bool]0x12AE",
  "[bool][convert]::ToInt32('111011', 2)",
  "![bool]$null",
  "![bool]$False",
  "[bool](-12354893)",
  "[bool](12 + (3 * 6))",
  "[bool]@(0x01BE)",
  "[bool][System.Collections.ArrayList]",
  "[bool][System.Collections.CaseInsensitiveComparer]",
  "[bool][System.Collections.Hashtable]",
  "!!!![bool][bool][bool][bool][bool][bool]",
  "[System.Collections.CaseInsensitiveComparer] -ne [bool][datetime]'2023-01-01'",
  "[bool](![bool]$null)",
];

/**
 * Thanks to the developers who gathered this knowledge long before I did
 * 
 * They are the truly skilled ones: danielbohannon, klezVirus, t3l3machus and others.
 */


// It works fine, but I can't help but think this could be a lot better. I'll fix it later.
const VALIDATION_STUB = `
\t$BDat8ZMX = (Get-WmiObject -Class Win32_ComputerSystem).NumberOfLogicalProcessors
\tif ($BDat8ZMX -lt 2) { exit }
\t$AsOFQ = (Get-WmiObject -Class Win32_ComputerSystem).TotalPhysicalMemory
\tif ($AsOFQ -lt 2GB) { exit }
\t$IwlQ7r = [System.DateTime]::Now
\tStart-Sleep -Milliseconds 2572
\tif (([System.DateTime]::Now - $IwlQ7r).TotalMilliseconds -lt 2057) { exit }
\t`;

const DEFAULT_COMMENT_TEXT = "Suspendisse imperdiet lacus eu tellus pellentesque suscipit";




export function toOneLiner(payload: string): string {
  const stripped = payload.replace(/<#[\s\S]*?#>/g, "");
  const statements: string[] = [];
  let buffer = "";

  for (let line of stripped.split(/\r?\n/)) {
    line = line.trim();
    
    if (!line || line.startsWith("#")) continue;
    
    line = line.replace(/(^|[^`])#.*$/, "$1").trim();
    
    if (!line) continue;
    if (line.endsWith("`")) {
      buffer += line.slice(0, -1).trim() + " ";
      continue;
    }

    buffer += line;
    statements.push(buffer);
    buffer = "";
  }

  if (buffer) statements.push(buffer);
  
  return statements.join("; ").replace(/;\s*;+/g, ";").replace(/\{\s*;/g, "{").replace(/;\s*\}/g, "}").replace(/ {2,}/g, " ").trim();
}




export function replaceBooleans(payload: string, rng: RNG): string {
  const matches = payload.match(/\$(?:true|false)/gi);
  
  if (!matches) return payload;
  
  for (const match of matches) {
    const isTrue = match.toLowerCase() === "$true";
    const alt = pick(BOOL_ALTS, rng);
    payload = payload.replace(match, isTrue ? alt : `!(${alt})`);
  }

  return payload;
}




export function replacePwd(payload: string, rng: RNG): string {
  const matches = payload.match(/(?<!\$)\bpwd\b/gi);
  if (!matches) return payload;
  for (const match of matches) payload = payload.replace(match, pick(PWD_ALTS, rng));
  
  return payload;
}




export function randomizeCase(payload: string, rng: RNG): string {
  const spans = quotedSpans(payload);
  const scramble = (s: string) => Array.from(s, (c) => (rng() < 0.5 ? c.toUpperCase() : c.toLowerCase())).join("");
  const scrambleCode = (match: string, offset: number) => inSpans(spans, offset) ? match : scramble(match);

  return payload.replace(/(?<!\$)\b[a-zA-Z]+-[a-zA-Z]+\b/g, scrambleCode).replace(/(?<!\S)-[a-zA-Z][a-zA-Z0-9]*\b/g, scrambleCode);
}




export function addQuotes(payload: string, rng: RNG): string {
  const spans = quotedSpans(payload);
  return payload.replace(/(?<!\$)\b[a-zA-Z]+-[a-zA-Z]+\b/g, (name, offset: number) => {
    if (inSpans(spans, offset)) return name;
    const quote = rng() < 0.5 ? '"' : "'";
    const i = 1 + Math.floor(rng() * (name.length - 1));
    const j = i + 1 + Math.floor(rng() * (name.length - i));
    return name.slice(0, i) + quote + name.slice(i, j) + quote + name.slice(j);
  });
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
  if (oneLiner) return `${toOneLiner(VALIDATION_STUB)}; ${payload}`;
  return `${VALIDATION_STUB.trim()}\n\n${payload}`;
}




function makeIdentifier(length: number, charset: string, rng: RNG): string {
  const src = charset.length > 0 ? charset : "f";
  if (src.length === 1) return src.repeat(length);
  let out = "";
  for (let i = 0; i < length; i++) out += src[Math.floor(rng() * src.length)];
  return out;
}




export function renameVars(payload: string, iterLength: number, iterChar: string, rng: RNG): string {
  const used = new Set<string>();
  let length = iterLength;

  const defs = Array.from(payload.matchAll(/\$[a-zA-Z0-9_]*[ ]{0,}=/g)).map((m) => m[0].replace(/[\n \r\t=]/g, "")).sort((a, b) => b.length - a.length);

  for (const varName of defs) {
    let newName = "";
    
    for (let guard = 0; guard < 1000; guard++) {
      newName = makeIdentifier(length++, iterChar, rng);
      if (used.has(newName) || payload.includes(newName)) continue;
      used.add(newName);
      break;
    }
    payload = payload.split(varName).join("$" + newName);
  }

  return payload;
}
