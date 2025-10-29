/**
 * @import { E } from '../../../prelude-type.ts';
 */

import * as prelude from '../../prelude.js';
import { mathml, doc } from '../../../prelude.js';

const { mi, mover, mo, mtext, mrow, mn, msup, msub, msubsup, msqrt, munder, mspace, mfrac, munderover } = mathml;
const { parensC,parensB, SPECIAL, abs, annotationOver, rows, parensA, call, table, op, sum, piecewise, neg } = prelude.mathmlHelper;
const { eqId, eq, add, minus, div, mul0, mul, gteq, lt } = op;
const { beta, mu, delta, kappa, nu, Gamma, tau, theta, sigma, rho, omega, alpha, xi, zeta, phi, pi } = SPECIAL.greek;
const { exists } = SPECIAL.rel;
const { and } = SPECIAL.operation;


