/**
 * @param {number} ms
 * @returns {Promise<void>}
 */
export function wait(ms) {
  const { resolve, promise } = Promise.withResolvers();
  setTimeout(() => resolve(undefined), ms);
  return promise;
}
