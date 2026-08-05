export type Span = readonly [number, number];

const QUOTED = /@"[\s\S]*?"@|@'[\s\S]*?'@|"(?:`.|[^"])*"|'(?:''|[^'])*'/g;




export function quotedSpans(payload: string): Span[] {
  const spans: Span[] = [];
  let m: RegExpExecArray | null;
  while ((m = QUOTED.exec(payload))) spans.push([m.index, m.index + m[0].length]);
  return spans;
}




export function inSpans(spans: readonly Span[], pos: number): boolean {
  for (const [a, b] of spans) if (a <= pos && pos < b) return true;
  return false;
}
