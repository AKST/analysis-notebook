/**
 * @import { E } from '../../../prelude-type.ts';
 */

import * as prelude from '../prelude.js';
import { mathml, doc } from '../../../prelude.js';

const { mi, mo, mtext, mrow, mn, msup, msub, msubsup, msqrt, munder, mspace, mfrac } = mathml;
const { parensB, SPECIAL, abs, annotationOver, rows, parensA, call, table, op } = prelude.mathmlHelper;
const { eqId, eq, add, minus, div, mul } = op;

// Export your MathML formulas here
