/**
 * @import { E } from '../type.ts'
 * @import { Helper } from './type.ts'
 */
import { frag as _frag } from '../core/render.js';
import {
  makeVoidHelper,
  makeHelper,
} from './util.js';

const namespace = 'http://www.w3.org/2000/svg';
export const svg = makeHelper((attr, body) => ['svg', { ns: namespace, ...attr }, body]);
export const rect = makeVoidHelper((attr) => ['rect', attr]);



