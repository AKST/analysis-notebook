/**
 * @import { E } from '../../prelude-type.ts';
 */

import { doc, table } from '../../prelude.js';
import { components } from '../prelude.js';

const { clsRef, todo } = components;

export const moneyTerms = doc.figure(
  ['div', { style: 'display: grid; grid-template-columns: 1fr' }, [
    table(['Identifier', 'Meaning'], [
      ['C', 'Currency'],
      ['MB', 'Monetary Base = currency plus reserves'],
      ['M1', 'Currency plus demand deposits (e.g. checking accounts)'],
      ['M2', 'M1 plus savings deposits and indivisual money market accounts'],
    ]),
  ]],
  'Different Measure of money'
);
