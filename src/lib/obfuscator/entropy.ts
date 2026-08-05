export function entropy(input: string): number {
  if (!input) return 0;
  const bytes = new TextEncoder().encode(input);
  const counts = new Map<number, number>();
  for (const b of bytes) counts.set(b, (counts.get(b) ?? 0) + 1);
  let h = 0;
  for (const c of counts.values()) {
    const p = c / bytes.length;
    h -= p * Math.log2(p);
  }
  return h;
}
