import type { RNG } from "../rng";

export function renameVars(payload: string, iterLength: number, iterChar: string, rng: RNG): string {
  const used = new Set<string>();
  const src = iterChar.length > 0 ? iterChar : "f";
  let length = iterLength;

  const defs = [...new Set(Array.from(payload.matchAll(/\$[a-zA-Z0-9_]* *=/g)).map((m) => m[0].replace(/[\n \r\t=]/g, "")))].sort((a, b) => b.length - a.length);

  for (const varName of defs) {
    let newName = "";

    for (let guard = 0; guard < 1000; guard++) {
      const idLen = length++;
      if (src.length === 1) {
        newName = src.repeat(idLen);
      } 
      else {
        newName = "";
        for (let i = 0; i < idLen; i++) newName += src[Math.floor(rng() * src.length)];
      }
      if (used.has(newName) || payload.includes(newName)) continue;
      used.add(newName);
      break;
    }
    payload = payload.replaceAll(varName, "$" + newName);
  }

  return payload;
}
