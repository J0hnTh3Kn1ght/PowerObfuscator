/** This was pain */

const HARD_POSITIVES: RegExp[] = [
  /(^|[\s;(){}|&])\$(?:PSVersionTable|PSScriptRoot|PSCommandPath|Host|Error|Args|Input|MyInvocation|ExecutionContext|Profile)\b/,
  /\b(?:Get|Set|New|Remove|Invoke|Import|Export|Start|Stop|Test|Out|Select|Where|ForEach|ConvertTo|ConvertFrom|Add|Clear|Copy|Move|Rename|Format|Measure|Sort|Group|Write|Read|Enter|Exit|Push|Pop|Register|Unregister|Resolve|Update|Restart)-[A-Z][A-Za-z0-9]+\b/,
  /\[(?:CmdletBinding|Parameter|ValidateSet|ValidateNotNull(?:OrEmpty)?|Alias|OutputType|AllowNull|AllowEmptyString)\b[^\]]*\]/i,
  /\$PSItem\b|\$_\b/,
  /\s-(?:eq|ne|gt|lt|ge|le|match|notmatch|like|notlike|contains|notcontains|in|notin|is|isnot|as|band|bor|bxor|bnot|shl|shr|replace|split|join)\b/i,
  /\|\s*(?:Where-Object|ForEach-Object|Select-Object|Sort-Object|Group-Object|Measure-Object|Out-(?:Null|Host|File|String|GridView)|Format-(?:Table|List|Wide))\b/i,
  /\[(?:string|int|bool|byte|char|double|single|decimal|long|object|hashtable|array|scriptblock|switch|regex|datetime|timespan|guid|version|pscustomobject|type|xml)\]/i,
];

const HARD_NEGATIVES: RegExp[] = [
  /^\s*#!\s*\/(?:bin|usr)\/(?!pwsh)/m,
  /<\?php\b/,
  /^\s*(?:import|from)\s+[A-Za-z_][\w.]*\s+import\b/m,
  /\bdef\s+[A-Za-z_]\w*\s*\([^)]*\)\s*:/,
  /\bconsole\.log\s*\(/,
  /\b(?:const|let|var)\s+[A-Za-z_$][\w$]*\s*=[^=]/,
  /=>\s*[{(]/,
  /#include\s*[<"]/,
  /\bstd::/,
  /\bpublic\s+(?:static\s+)?(?:class|void|int|String)\b/,
  /\bSystem\.out\.println\b/,
  /\bfn\s+[A-Za-z_]\w*\s*\(/,
  /^\s*package\s+[a-z][\w.]*\s*;?\s*$/m,
  /\bfunc\s+[A-Za-z_]\w*\s*\(/,
  /^\s*(?:SELECT|INSERT|UPDATE|DELETE|CREATE\s+TABLE)\b/im,
  /^\s*<!DOCTYPE\s+html\b/im,
  /^\s*<html[\s>]/im,
  /\becho\s+\$[A-Za-z_]/,
  /\$\{[A-Za-z_]/,
];

const SOFT_POSITIVES: Array<[RegExp, number]> = [
  [/\$[A-Za-z_][A-Za-z0-9_]*\s*=/, 2],
  [/\b[A-Z][a-z]+-[A-Z][a-zA-Z]+\b/, 2],
  [/\bparam\s*\(\s*\[/i, 3],
  [/\bfunction\s+[A-Za-z][\w-]*\s*\{/i, 3],
  [/\$(?:true|false|null)\b/i, 2],
  [/`(?:n|r|t|0)\b/, 2],
  [/`\s*$/m, 1],
  [/\bforeach\s*\(\s*\$/i, 3],
  [/\bswitch\s*(?:-[A-Za-z]+\s+)*\(/i, 2],
  [/\btry\s*\{[\s\S]*?\}\s*catch\b/, 1],
  [/\[[A-Za-z][\w.]*\]::/, 3],
  [/\$[A-Za-z_]\w*\.[A-Za-z_]/, 1],
  [/@\{[^}]*=/, 2],
  [/@\(/, 1],
];




function stripQuotesAndComments(src: string): string {
  return src.replace(/<#[\s\S]*?#>/g, " ").replace(/(^|\s)#[^\n]*/g, "$1 ")
    .replace(/@"[\s\S]*?"@/g, ' "STR" ')
    .replace(/@'[\s\S]*?'@/g, " 'STR' ")
    .replace(/"(?:`.|[^"\\])*"/g, ' "STR" ')
    .replace(/'(?:''|[^'])*'/g, " 'STR' ");
}




export function looksLikePowerShell(src: string): boolean {
  const raw = src.trim();
  if (raw.length < 3) return true;

  const s = stripQuotesAndComments(raw);

  for (const p of HARD_POSITIVES) if (p.test(s)) return true;
  for (const p of HARD_NEGATIVES) if (p.test(s)) return false;

  let score = 0;
  for (const [p, w] of SOFT_POSITIVES) if (p.test(s)) score += w;
  return score >= 4;
}
