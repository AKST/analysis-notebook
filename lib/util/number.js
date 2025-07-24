/**
 * @param {number} value
 * @param {number | null} min
 * @param {number | null} max
 * @returns {number}
 */
export function clamp(value, min, max) {
  const maxxed = max != null ? Math.min(value, max) : value;
  return min != null ? Math.max(min, maxxed) : maxxed;
}

/**
 * @param {number} a
 * @param {number} b
 */
export function compare(a, b) {
  return a - b;
}

/**
 * @param {number} a
 * @param {number} b
 */
export function compareInv(a, b) {
  return b - a;
}

/**
 * @param {readonly number[]} cumulative
 * @returns {number[]}
 */
export function marginal(cumulative) {
  return cumulative.map((v, i) => i === 0 ? v : v - cumulative[i-1]);
}

/**
 * @param {readonly number[]} marginal
 * @returns {number[]}
 */
export function cumulative(marginal) {
  let acc = 0;
  return marginal.map(v => {
    const result = acc + v;
    acc += v;
    return result;
  });
}

/**
 * @param {readonly number[]} values
 * @param {number} margin
 */
export function marginThrottle(values, margin) {
  let lastShown = 0;
  return values.filter((v, i, vs) => {
    if (i === 0) return true;
    if (Math.abs(vs[lastShown] - v) < margin) return false;
    lastShown = i;
    return true
  });
}
