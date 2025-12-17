import { makeVoidHelper, makeHelper } from '../helper.js';

export const rect = makeVoidHelper('svg', 'rect')();
export const svg = makeHelper('svg', 'svg')();
export const text = makeHelper('svg', 'text')();
