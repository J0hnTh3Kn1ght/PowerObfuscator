export type RNG = () => number;

export const defaultRng: RNG = () => Math.random();




export function pick<T>(arr: readonly T[], rng: RNG): T {
  return arr[Math.floor(rng() * arr.length)]!;
}




export function sample<T>(arr: readonly T[], k: number, rng: RNG): T[] {
  const pool = arr.slice();
  const out: T[] = [];
  const n = Math.min(k, pool.length);
  for (let i = 0; i < n; i++) {
    const idx = Math.floor(rng() * pool.length);
    out.push(pool.splice(idx, 1)[0]!);
  }
  return out;
}
