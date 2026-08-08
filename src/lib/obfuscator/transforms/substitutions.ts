import { pick, type RNG } from "../rng";

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
