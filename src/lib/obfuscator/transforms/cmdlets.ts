import type { RNG } from "../rng";
import { inSpans, quotedSpans } from "../spans";

const CMDLET_NAME_RE = /(?<!\$)\b[a-zA-Z]+-[a-zA-Z]+\b/g;




export function randomizeCase(payload: string, rng: RNG): string {
  const spans = quotedSpans(payload);
  const scrambleCode = (match: string, offset: number) =>
    inSpans(spans, offset) ? match : Array.from(match, (c) => (rng() < 0.5 ? c.toUpperCase() : c.toLowerCase())).join("");

  return payload.replace(CMDLET_NAME_RE, scrambleCode).replace(/(?<!\S)-[a-zA-Z][a-zA-Z0-9]*\b/g, scrambleCode);
}




export function addQuotes(payload: string, rng: RNG): string {
  const spans = quotedSpans(payload);
  return payload.replace(CMDLET_NAME_RE, (name, offset: number) => {
    if (inSpans(spans, offset)) return name;
    const quote = rng() < 0.5 ? '"' : "'";
    const i = 1 + Math.floor(rng() * (name.length - 1));
    const j = i + 1 + Math.floor(rng() * (name.length - i));
    return name.slice(0, i) + quote + name.slice(i, j) + quote + name.slice(j);
  });
}
