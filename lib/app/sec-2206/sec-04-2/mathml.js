/**
 * @import { E } from '../../prelude-type.ts';
 */
import { frag, mathml, mathml2, doc } from '../../prelude.js';
import { components, mathmlHelper } from '../prelude.js';
export { createFigure as createMLR, sizeKMLR as mlrExamples } from '../sec-02-1/mathml.js';

const {
  call, n, sup, sub, sum, subsup, table,
  paren, row, rows, text, space, over, frac,
  SPECIAL, inv, sqrt, under, multiscripts, abs,
} = mathml;

const { mi, mo } = mathml2;

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
          mathml.call('log', mi`y`),
          add3(
            sub(mi`β`, n(0)),
            mul2(sub(mi`β`, n(1)), mathml.call('log', sub(mi`x`, n(1)))),
            add(
              add(sub(mi`β`, n(2)), mul2(sub(mi`β`, n(2)), sub(mi`x`, n(2)))),
              mi`u`
            ),
          )
        ),

        row([
          over(
            over(
              mathml.text('with x₁ fixed'),
              mo`⏞`
            ),
            row([
              eq(
                mi`%Δŷ`,
                mul2(
                  n(100),
                  minusP(
                    mathml.call('exp', mul2(sub(mi`β`, n(2)), sub(mi`Δx`, n(2)))),
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
              mo`⏞`
            ),
            row([
              eq(
                mi`%Δŷ`,
                mul2(sub(mi`β`, n(1)), mi`%Δx₁`)
              ),
            ])
          ),
        ]),
      ]),
    ]),
    doc.figcaption`Interpretations of changes in x₁ and x₂ in a semilog model`
  ),
  quadratic: doc.figure(
    mathml([
      mathml.table([
        [
          mi`y`,
          mo`=`,
          add3(
            sub(mi`β`, n(0)),
            mul2(sub(mi`β`, n(1)), sub(mi`x`, n(1))),
            add(
              mul2(sub(mi`β`, n(2)), sup(sub(mi`x`, n(1)), n(2))),
              mi`u`
            )
          ),
        ],

        [
          mi`ŷ`,
          mo`=`,
          add3(
            sub(mathml.SPECIAL.greek.circumflex.beta, n(0)),
            mul2(sub(mathml.SPECIAL.greek.circumflex.beta, n(1)), sub(mi`x`, n(1))),
            mul2(sub(mathml.SPECIAL.greek.circumflex.beta, n(2)), sup(sub(mi`x`, n(1)), n(2)))
          ),
        ],

        [
          mi`Δŷ`,
          mo`≈`,
          mul2(
            mathml.paren([
              add(
                sub(mathml.SPECIAL.greek.circumflex.beta, n(1)),
                mul2(n(2), mul2(sub(mathml.SPECIAL.greek.circumflex.beta, n(2)), sub(mi`x`, n(1)))),
              )
            ]),
            sub(mi`Δx`, n(1))
          ),
        ],

        [
          frac([mi`Δŷ`], [sub(mi`Δx`, n(1))]),
          mo`≈`,
          add(
            sub(mathml.SPECIAL.greek.circumflex.beta, n(1)),
            mul2(n(2), mul2(sub(mathml.SPECIAL.greek.circumflex.beta, n(2)), sub(mi`x`, n(1)))),
          ),
        ],
      ], { columnalign: 'right centre left' }),
    ]),
    doc.figcaption`Quadratic-in-x₁ model, fitted form, and marginal effect`
  ),
  quadraticTurningPoint: doc.figure(
    mathml([
      row([
        sup(mi`x`, mo`*`),
        space(4), mo`=`, space(4),
        mathml.abs(
          frac(
            [ sub(mathml.SPECIAL.greek.circumflex.beta, n(1)) ],
            [ mul2(n(2), sub(mathml.SPECIAL.greek.circumflex.beta, n(2))) ]
          )
        ),
      ]),
    ]),
    doc.figcaption`Quadratic Turning Point`
  ),
  logQuadratic: doc.figure(
    mathml([
      mathml.table([
        // Row 1: log(y) = β0 + β1·log(x1) + β2·(log(x1))²
        [
          mathml.call('log', mi`y`),
          mo`=`,
          add3(
            sub(mathml.SPECIAL.greek.beta, n(0)),
            mul2(sub(mathml.SPECIAL.greek.beta, n(1)), mathml.call('log', sub(mi`x`, n(1)))),
            mul2(
              sub(mathml.SPECIAL.greek.beta, n(2)),
              sup(paren([mathml.call('log', sub(mi`x`, n(1)))]), n(2))
            )
          ),
        ],

        // Row 2: %Δy ≈ [β1 + 2·β2·log(x1)] · %Δx1
        [
          mi`%Δy`,
          mo`≈`,
          mul2(
            row([
              mo`[`,
              add(
                sub(mathml.SPECIAL.greek.beta, n(1)),
                mul2(
                  n(2),
                  mul2(
                    sub(mathml.SPECIAL.greek.beta, n(2)),
                    mathml.call('log', sub(mi`x`, n(1)))
                  ),
                )
              ),
              mo`]`,
            ]),
            mi`%Δx₁`
          ),
        ],
      ], { columnalign: 'right center left' }),
    ]),
    doc.figcaption`Semilog quadratic model and %Δy interpretation`
  ),
  interactions: doc.figure(
    mathml([
      rows([
        row([
          mi`y`,
          space(4), mo`=`, space(4),
          add3(
            sub(mathml.SPECIAL.greek.beta, n(0)),
            add(
              mul2(sub(mathml.SPECIAL.greek.beta, n(1)), sub(mi`x`, n(1))),
              mul2(sub(mathml.SPECIAL.greek.beta, n(2)), sub(mi`x`, n(2))),
            ),
            add(
              mul3(sub(mathml.SPECIAL.greek.beta, n(3)), sub(mi`x`, n(1)), sub(mi`x`, n(2))),
              mi`u`
            )
          ),
        ]),

        row([
          frac([mi`Δy`], [sub(mi`Δx`, n(2))]),
          space(4), mo`=`, space(4),
          add(
            sub(mathml.SPECIAL.greek.beta, n(2)),
            mul2(sub(mathml.SPECIAL.greek.beta, n(3)), sub(mi`x`, n(1)))
          ),
        ]),
      ]),
    ]),
    doc.figcaption`Marginal effect of interaction model`
  ),
  partialEffect: doc.figure(
    mathml([
      row([
        eq(mi`y`, add3(
          sub(mi`α`, n(0)),
          mul2(sub(mi`𝛿`, n(1)), sub(mi`x`, n(1))),
          add(
            mul2(sub(mi`𝛿`, n(2)), sub(mi`x`, n(2))),
            add(
              mul3(
                sub(mathml.SPECIAL.greek.beta, n(3)),
                minusP(sub(mi`x`, n(1)), sub(mi`𝜇`, n(1))),
                minusP(sub(mi`x`, n(2)), sub(mi`𝜇`, n(2))),
              ),
              mi`u`
            ),
          ),
        )),
      ]),
    ]),
    doc.figcaption`Parital Effect`
  ),
  ape: doc.figure(
    mathml([
      mathml.rows([
        row([
          mi`y`,
          space(4), mo`=`, space(4),
          add3(
            sub(mathml.SPECIAL.greek.beta, n(0)),
            mul2(sub(mathml.SPECIAL.greek.beta, n(1)), sub(mi`x`, n(1))),
            add3(
              mul2(sub(mathml.SPECIAL.greek.beta, n(2)), sub(mi`x`, n(2))),
              mul2(sub(mathml.SPECIAL.greek.beta, n(3)), sup(sub(mi`x`, n(1)), n(2))),
              add(
                mul3(sub(mathml.SPECIAL.greek.beta, n(4)), sub(mi`x`, n(1)), sub(mi`x`, n(2))),
                mi`u`
              )
            )
          ),
        ]),

        row([
          frac([mi`Δy`], [sub(mi`Δx`, n(1))]),
          space(4), mo`=`, space(4),
          add3(
            sub(mathml.SPECIAL.greek.beta, n(1)),
            mul2(n(2), mul2(sub(mathml.SPECIAL.greek.beta, n(3)), sub(mi`x`, n(1)))),
            mul2(sub(mathml.SPECIAL.greek.beta, n(4)), sub(mi`x`, n(2)))
          ),
        ]),

        row([
          sub(mi`APE`, sub(mi`x`, n(1))),
          space(4), mo`=`, space(4),
          add3(
            sub(mathml.SPECIAL.greek.circumflex.beta, n(1)),
            mul2(n(2), mul2(sub(mathml.SPECIAL.greek.beta, n(3)), sub(mi`x̄`, n(1)))),
            mul2(sub(mathml.SPECIAL.greek.beta, n(4)), sub(mi`x̄`, n(2)))
          ),
        ]),
      ]),
    ]),
    doc.figcaption`Average partial effect and marginal response in a quadratic interaction model`
  ),
};
