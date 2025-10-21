/**
 * @template T
 * @param {number} size
 * @param {(a: number) => T} f
 * @returns {T[]}
 */
export const fromIndex = function (size, f) {
  const out = [];
  for (let i = 0; i < size; i++) {
    out.push(f(i));
  }
  return out;
}
