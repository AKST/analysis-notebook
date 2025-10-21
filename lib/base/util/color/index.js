export { COLOR } from './const.js';

/**
 * Convert hex color number to CSS hex string
 * @param {number} hex - Color as hex number (e.g., 0xff0000)
 * @returns {string} CSS hex string (e.g., "#ff0000")
 */
export function colorHex(hex) {
  const hexStr = hex.toString(16).padStart(6, '0');
  return `#${hexStr}`;
}

/**
 * Convert CSS hex string to hex color number
 * @param {string} hexString - CSS hex string (e.g., "#ff0000")
 * @returns {number} Color as hex number (e.g., 0xff0000)
 */
export function hexToColor(hexString) {
  const hex = hexString.replace('#', '');
  return parseInt(hex, 16);
}
