/**
 * @import { E } from '../../prelude-type.ts';
 */
import { frag, mathml, doc } from '../../prelude.js';
import { components, mathmlHelper } from '../prelude.js';
export { createFigure as createMLR, sizeKMLR as mlrExamples } from '../sec-02-1/mathml.js';

const {
  call, o, i, n, sup, sub, sum, subsup, table,
  paren, row, rows, text, space, over, frac,
  SPECIAL, inv, sqrt, under, multiscripts, abs,
} = mathml;

const { todo } = components;

const {
  eqId, eq, add, minusSqP,
  minus, minusP, div, divP, add3,
} = mathmlHelper;

/** @param {E.Item} a @param {E.Item} b */
const mul2 = (a, b) => row([a, space(4), b]);

/** @param {E.Item} a @param {E.Item} b @param {E.Item} c */
const mul3 = (a, b, c) => row([a, space(4), b, space(4), c]);

export const functionalForms = {
  log: doc.figure(
    mathml([
      mathml.rows([
        eq(
          mathml.call('log', i('y')),
          add3(
            sub(i('β'), n(0)),
            mul2(sub(i('β'), n(1)), mathml.call('log', sub(i('x'), n(1)))),
            add(
              add(sub(i('β'), n(2)), mul2(sub(i('β'), n(2)), sub(i('x'), n(2)))),
              i('u')
            ),
          )
        ),

        row([
          over(
            over(
              mathml.text('with x₁ fixed'),
              o('⏞')
            ),
            row([
              eq(
                i('%Δŷ'),
                mul2(
                  n(100),
                  minusP(
                    mathml.call('exp', mul2(sub(i('β'), n(2)), sub(i('Δx'), n(2)))),
                    n(1)
                  )
                )
              ),
            ])
          ),
          space(32),
          over(
            over(
              mathml.text('with x₂ fixed'),
              o('⏞')
            ),
            row([
              eq(
                i('%Δŷ'),
                mul2(sub(i('β'), n(1)), i('%Δx₁'))
              ),
            ])
          ),
        ]),
      ]),
    ]),
    'Interpretations of changes in x₁ and x₂ in a semilog model'
  ),
  quadratic: doc.figure(
    mathml([
      mathml.table([
        [
          i('y'),
          o('='),
          add3(
            sub(i('β'), n(0)),
            mul2(sub(i('β'), n(1)), sub(i('x'), n(1))),
            add(
              mul2(sub(i('β'), n(2)), sup(sub(i('x'), n(1)), n(2))),
              i('u')
            )
          ),
        ],

        [
          i('ŷ'),
          o('='),
          add3(
            sub(mathml.SPECIAL.greek.circumflex.beta, n(0)),
            mul2(sub(mathml.SPECIAL.greek.circumflex.beta, n(1)), sub(i('x'), n(1))),
            mul2(sub(mathml.SPECIAL.greek.circumflex.beta, n(2)), sup(sub(i('x'), n(1)), n(2)))
          ),
        ],

        [
          i('Δŷ'),
          o('≈'),
          mul2(
            mathml.paren([
              add(
                sub(mathml.SPECIAL.greek.circumflex.beta, n(1)),
                mul2(n(2), mul2(sub(mathml.SPECIAL.greek.circumflex.beta, n(2)), sub(i('x'), n(1)))),
              )
            ]),
            sub(i('Δx'), n(1))
          ),
        ],

        [
          frac([i('Δŷ')], [sub(i('Δx'), n(1))]),
          o('≈'),
          add(
            sub(mathml.SPECIAL.greek.circumflex.beta, n(1)),
            mul2(n(2), mul2(sub(mathml.SPECIAL.greek.circumflex.beta, n(2)), sub(i('x'), n(1)))),
          ),
        ],
      ], { columnalign: 'right centre left' }),
    ]),
    'Quadratic-in-x₁ model, fitted form, and marginal effect'
  ),
  quadraticTurningPoint: doc.figure(
    mathml([
      row([
        sup(i('x'), o('*')),
        space(4), o('='), space(4),
        mathml.abs(
          frac(
            [ sub(mathml.SPECIAL.greek.circumflex.beta, n(1)) ],
            [ mul2(n(2), sub(mathml.SPECIAL.greek.circumflex.beta, n(2))) ]
          )
        ),
      ]),
    ]),
    'Quadratic Turning Point'
  ),
  logQuadratic: doc.figure(
    mathml([
      mathml.table([
        // Row 1: log(y) = β0 + β1·log(x1) + β2·(log(x1))²
        [
          mathml.call('log', i('y')),
          o('='),
          add3(
            sub(mathml.SPECIAL.greek.beta, n(0)),
            mul2(sub(mathml.SPECIAL.greek.beta, n(1)), mathml.call('log', sub(i('x'), n(1)))),
            mul2(
              sub(mathml.SPECIAL.greek.beta, n(2)),
              sup(paren([mathml.call('log', sub(i('x'), n(1)))]), n(2))
            )
          ),
        ],

        // Row 2: %Δy ≈ [β1 + 2·β2·log(x1)] · %Δx1
        [
          i('%Δy'),
          o('≈'),
          mul2(
            row([
              o('['),
              add(
                sub(mathml.SPECIAL.greek.beta, n(1)),
                mul2(
                  n(2),
                  mul2(
                    sub(mathml.SPECIAL.greek.beta, n(2)),
                    mathml.call('log', sub(i('x'), n(1)))
                  ),
                )
              ),
              o(']'),
            ]),
            i('%Δx₁')
          ),
        ],
      ], { columnalign: 'right center left' }),
    ]),
    'Semilog quadratic model and %Δy interpretation'
  ),
  interactions: doc.figure(
    mathml([
      rows([
        row([
          i('y'),
          space(4), o('='), space(4),
          add3(
            sub(mathml.SPECIAL.greek.beta, n(0)),
            add(
              mul2(sub(mathml.SPECIAL.greek.beta, n(1)), sub(i('x'), n(1))),
              mul2(sub(mathml.SPECIAL.greek.beta, n(2)), sub(i('x'), n(2))),
            ),
            add(
              mul3(sub(mathml.SPECIAL.greek.beta, n(3)), sub(i('x'), n(1)), sub(i('x'), n(2))),
              i('u')
            )
          ),
        ]),

        row([
          frac([i('Δy')], [sub(i('Δx'), n(2))]),
          space(4), o('='), space(4),
          add(
            sub(mathml.SPECIAL.greek.beta, n(2)),
            mul2(sub(mathml.SPECIAL.greek.beta, n(3)), sub(i('x'), n(1)))
          ),
        ]),
      ]),
    ]),
    'Marginal effect of interaction model'
  ),
  partialEffect: doc.figure(
    mathml([
      row([
        eq(i('y'), add3(
          sub(i('α'), n(0)),
          mul2(sub(i('𝛿'), n(1)), sub(i('x'), n(1))),
          add(
            mul2(sub(i('𝛿'), n(2)), sub(i('x'), n(2))),
            add(
              mul3(
                sub(mathml.SPECIAL.greek.beta, n(3)),
                minusP(sub(i('x'), n(1)), sub(i('𝜇'), n(1))),
                minusP(sub(i('x'), n(2)), sub(i('𝜇'), n(2))),
              ),
              i('u')
            ),
          ),
        )),
      ]),
    ]),
    'Parital Effect'
  ),
  ape: doc.figure(
    mathml([
      mathml.rows([
        row([
          i('y'),
          space(4), o('='), space(4),
          add3(
            sub(mathml.SPECIAL.greek.beta, n(0)),
            mul2(sub(mathml.SPECIAL.greek.beta, n(1)), sub(i('x'), n(1))),
            add3(
              mul2(sub(mathml.SPECIAL.greek.beta, n(2)), sub(i('x'), n(2))),
              mul2(sub(mathml.SPECIAL.greek.beta, n(3)), sup(sub(i('x'), n(1)), n(2))),
              add(
                mul3(sub(mathml.SPECIAL.greek.beta, n(4)), sub(i('x'), n(1)), sub(i('x'), n(2))),
                i('u')
              )
            )
          ),
        ]),

        row([
          frac([i('Δy')], [sub(i('Δx'), n(1))]),
          space(4), o('='), space(4),
          add3(
            sub(mathml.SPECIAL.greek.beta, n(1)),
            mul2(n(2), mul2(sub(mathml.SPECIAL.greek.beta, n(3)), sub(i('x'), n(1)))),
            mul2(sub(mathml.SPECIAL.greek.beta, n(4)), sub(i('x'), n(2)))
          ),
        ]),

        row([
          sub(i('APE'), sub(i('x'), n(1))),
          space(4), o('='), space(4),
          add3(
            sub(mathml.SPECIAL.greek.circumflex.beta, n(1)),
            mul2(n(2), mul2(sub(mathml.SPECIAL.greek.beta, n(3)), sub(i('x̄'), n(1)))),
            mul2(sub(mathml.SPECIAL.greek.beta, n(4)), sub(i('x̄'), n(2)))
          ),
        ]),
      ]),
    ]),
    'Average partial effect and marginal response in a quadratic interaction model'
  ),

};
