/**
 * @param {Object} obj
 * @returns {boolean}
 */
export function isEmpty(obj) {
  for (const prop in obj) {
    if (Object.hasOwn(obj, prop)) {
      return false;
    }
  }

  return true;
}

/**
 * @template A
 * @template B
 * @template {string} K
 * @param {Record<K, A>} object
 * @param {(v: A, k: K) => B} fn
 * @returns {Record<K, B>}
 */
export function mapEntries(object, fn) {
  const iEntries = Object.entries(object);
  const oEntries = iEntries.map(([k, cfg]) => [
    k,
    /** @ts-ignore - dont care */
    fn(cfg, k),
  ]);
  return Object.fromEntries(oEntries);
}

/**
 * @template A
 * @template B
 * @template {string} K
 * @param {Record<K, A>} object
 * @param {(v: A, k: K) => B} fn
 */
export function forEachEntries(object, fn) {
  Object.entries(object).forEach(([k, cfg]) => (
    /** @ts-ignore - dont care */
    fn(cfg, k)
  ));
}

/**
 * @template T, U
 * @param {Record<string, T>} obj
 * @param {(value: T) => U} f
 * @returns {Record<string, U>}
 */
export function map(obj, f) {
  return Object.fromEntries(Object.entries(obj).map(([k, v]) => [k, f(v)]));
}

/**
 * Non descructively updates obj. `update`
 * is a function that takes the current value
 * and returns a new value, which gets specified
 * in the position of `path`.
 * @template T
 * @param {T} obj
 * @param {string | string[]} path
 * @param {(value: any) => any} updateFn
 * @returns {T}
 */
export function update(obj, path, updateFn) {
  if (typeof path === 'string') {
    // @ts-ignore - shhh
    return { ...obj, [path]: updateFn(obj[path]) };
  }

  if (Array.isArray(path)) {
    if (path.length === 0) {
      return updateFn(obj);
    }

    const [head, ...tail] = path;
    return {
      ...obj,
      // @ts-ignore - shhh
      [head]: update(obj[head] || {}, tail, updateFn)
    };
  }

  throw new Error('Path must be a string or array of strings');
}
