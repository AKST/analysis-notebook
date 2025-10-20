/**
 * @import { E, ElAttributes } from '../type.ts'
 */
import { frag as _frag } from '../core/render.js';

export const mathml = {}

/**
 * @type {(i: string) => E.Item}
 */
const i = value => ['mi', value];

/**
 * @type {(o: string) => E.Item}
 */
const o = v => ['mo', v];

mathml.SPECIAL = {
  because: o('∵'),
  therefore: o('∴'),
  ellipse: {
    h: o('…'),
    h2: o('⋯'),
    v: o('⋮'),
    d1: o('⋱'),
  },
  operation: {
    dot: o('·'),
    exists: o('∈'),
    integral: o('∫'),
    plusMinus: o('±'),
  },
  sets: {
    real: i('ℝ'),
    nat: i('ℕ'),
  },
  greek: {
    alpha: i('α'),
    beta: i('𝛽'),
    Delta: i('Δ'),
    Theta: i('Θ'),
    theta: i('θ'),
    gamma: i('ɣ'),
    eplison: i('ε'),
    sigma: i('𝜎'),
    Sigma: i('∑'),
    Pi: i('Π'),
    rho: i('𝜌'),
    circumflex: {
      beta: i('𝛽̂'),
      gamma: i('ɣ̂'),
      mu: i('μ̂'),
      sigma: i('σ̂'),
    },
  },
}
