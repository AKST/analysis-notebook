/**
 * @template T
 * @param {T[] | Iterable<T>} array
 * @returns {Iterable<[number, T]>}
 */
export const enumerate = function *(array) {
  let i = 0;
  for (const el of array) {
    yield [i, el];
    i += 1;
  }
}
