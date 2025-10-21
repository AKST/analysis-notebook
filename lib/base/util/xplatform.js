/**
 * @returns {boolean}
 */
export function isChrome() {
  // @ts-ignore hacky
  return typeof globalThis.chrome === "object"
      && navigator.userAgent.indexOf("Edge") === -1;
}
