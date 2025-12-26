/**
 * @import { VoidHelper } from '../helper-type.ts';
 */
import { makeVoidHelper, makeHelper } from '../helper.js';

// ** @type {VoidHelper<'svg', 'rect'>} */
export const rect = makeVoidHelper({ of: ['svg', 'rect'] });
export const svg = makeHelper({ of: ['svg', 'svg'] });
export const text = makeHelper({ of: ['svg', 'text'] });
