export class Unreachable extends Error {
  /** @param {never} value */
  constructor(value) {
    super(`Unreachable case: ${value}`);
    /** @ts-ignore - because */
    this.value = value;
  }
}

/**
 * @template T
 * @param {T} item
 * @returns {item is NonNullable<T>}
 */
export function isNotNull(item) {
  return item != null;
}
