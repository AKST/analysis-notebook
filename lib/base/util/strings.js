/**
 * @param {string} str
 * @returns {string}
 */
export function camelToKebab(str) {
  return str.replace(/[A-Z]/g, letter => `-${letter.toLowerCase()}`);
}

/**
 * @param {string} str
 * @returns {string}
 */
export function capitalize(str) {
  if (str.length < 2) return str;
  return str
    .split(' ')
    .map(s => s[0].toUpperCase() + s.slice(1).toLowerCase())
    .join(' ');
}

/**
 * @param {number} n
 */
export function diff(n, decimals=2) {
  const sign = Math.sign(n) < 0 ? '-' : '+';
  return sign + Math.abs(n).toFixed(decimals);
}
