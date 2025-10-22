/**
 * @import { E } from '../../prelude-type.ts';
 */
import { mathml, doc } from '../../prelude.js';
import { mathmlHelper } from '../prelude.js';
export { createFigure as createMLR, sizeKMLR as mlrExamples } from '../sec-02-1/mathml.js';

const { mi, mo, mtext, mrow, mn, msup, msub, msubsup, msqrt, munder, mspace, mfrac } = mathml;
const {
  bigMath,
  rows, parensB, SPECIAL, abs, annotationOver,
  parensA, call, table, op, annotationUnder, set
} = mathmlHelper;
const { eqId, mul0, eq, add, minus, div, mul } = op;
const { greek } = SPECIAL;

const Se = call.attr({ fn: mtext`Se` });

export const functionalForms = {
  log: doc.figure(
    bigMath(
      rows(
        eq(
          call.attr({ fn: mtext`log` })(mi`y`),
          add(
            msub(mi`β`, mn(0)),
            mul(msub(mi`β`, mn(1)), call.attr({ fn: mtext`log` })(msub(mi`x`, mn(1)))),
            add(
              add(msub(mi`β`, mn(2)), mul(msub(mi`β`, mn(2)), msub(mi`x`, mn(2)))),
              mi`u`
            ),
          )
        ),

        mrow(
          annotationOver.attr({ label:  mtext`with x₁ fixed` })(
            eq(
              mi`%Δŷ`,
              mul(
                mn(100),
                minus.paren(
                  call.attr({ fn: mtext`exp` })(mul(msub(mi`β`, mn(2)), msub(mi`Δx`, mn(2)))),
                  mn(1)
                )
              )
            ),
          ),
          mspace(32),
          annotationOver.attr({ label: mtext`with x₂ fixed` })(
            eq(
              mi`%Δŷ`,
              mul(msub(mi`β`, mn(1)), mi`%Δx₁`)
            ),
          ),
        ),
      )
    ),
    doc.figcaption`
      Interpretations of changes in x₁ and x₂ in a semilog model
    `
  ),
  quadratic: doc.figure(
    bigMath(
      table.attr({ columnalign: 'right centre left' })(
        [
          mi`y`,
          mo`=`,
          add(
            msub(mi`β`, mn(0)),
            mul(msub(mi`β`, mn(1)), msub(mi`x`, mn(1))),
            add(
              mul(msub(mi`β`, mn(2)), msup(msub(mi`x`, mn(1)), mn(2))),
              mi`u`
            )
          ),
        ],

        [
          mi`ŷ`,
          mo`=`,
          add(
            msub(SPECIAL.greek.circumflex.beta, mn(0)),
            mul(msub(SPECIAL.greek.circumflex.beta, mn(1)), msub(mi`x`, mn(1))),
            mul(msub(SPECIAL.greek.circumflex.beta, mn(2)), msup(msub(mi`x`, mn(1)), mn(2)))
          ),
        ],

        [
          mi`Δŷ`,
          mo`≈`,
          mul(
            parensA(
              add(
                msub(SPECIAL.greek.circumflex.beta, mn(1)),
                mul(mn(2), mul(msub(SPECIAL.greek.circumflex.beta, mn(2)), msub(mi`x`, mn(1)))),
              )
            ),
            msub(mi`Δx`, mn(1))
          ),
        ],

        [
          mfrac(mi`Δŷ`, msub(mi`Δx`, mn(1))),
          mo`≈`,
          add(
            msub(SPECIAL.greek.circumflex.beta, mn(1)),
            mul(mn(2), mul(msub(SPECIAL.greek.circumflex.beta, mn(2)), msub(mi`x`, mn(1)))),
          ),
        ],
      ),
    ),
    doc.figcaption`Quadratic-in-x₁ model, fitted form, and marginal effect`
  ),
  quadraticTurningPoint: doc.figure(
    mathml.math(
      mrow(
        msup(mi`x`, mo`*`),
        mspace(4), mo`=`, mspace(4),
        abs(
          mfrac(
            msub(SPECIAL.greek.circumflex.beta, mn(1)),
            mul(mn(2), msub(SPECIAL.greek.circumflex.beta, mn(2)))
          )
        ),
      ),
    ),
    doc.figcaption`Quadratic Turning Point`
  ),
  logQuadratic: doc.figure(
    bigMath(
      table.attr({ columnalign: 'right center left' })(
        // Row 1: log(y) = β0 + β1·log(x1) + β2·(log(x1))²
        [
          call.attr({ fn: mtext`log` })(mi`y`),
          mo`=`,
          add(
            msub(SPECIAL.greek.beta, mn(0)),
            mul(msub(SPECIAL.greek.beta, mn(1)), call.attr({ fn: mtext`log` })(msub(mi`x`, mn(1)))),
            mul(
              msub(SPECIAL.greek.beta, mn(2)),
              msup(parensA(call.attr({ fn: mtext`log` })(msub(mi`x`, mn(1)))), mn(2))
            )
          ),
        ],

        // Row 2: %Δy ≈ [β1 + 2·β2·log(x1)] · %Δx1
        [
          mi`%Δy`,
          mo`≈`,
          mul(
            mrow(
              mo`[`,
              add(
                msub(SPECIAL.greek.beta, mn(1)),
                mul(
                  mn(2),
                  mul(
                    msub(SPECIAL.greek.beta, mn(2)),
                    call.attr({ fn: mtext`log` })(msub(mi`x`, mn(1)))
                  ),
                )
              ),
              mo`]`,
            ),
            mi`%Δx₁`
          ),
        ],
      ),
    ),
    doc.figcaption`Semilog quadratic model and %Δy interpretation`
  ),
  interactions: doc.figure(
    bigMath(
      rows(
        mrow(
          mi`y`,
          mspace(4), mo`=`, mspace(4),
          add(
            msub(SPECIAL.greek.beta, mn(0)),
            add(
              mul(msub(SPECIAL.greek.beta, mn(1)), msub(mi`x`, mn(1))),
              mul(msub(SPECIAL.greek.beta, mn(2)), msub(mi`x`, mn(2))),
            ),
            add(
              mul(msub(SPECIAL.greek.beta, mn(3)), msub(mi`x`, mn(1)), msub(mi`x`, mn(2))),
              mi`u`
            )
          ),
        ),

        mrow(
          mfrac(mi`Δy`, msub(mi`Δx`, mn(2))),
          mspace(4), mo`=`, mspace(4),
          add(
            msub(SPECIAL.greek.beta, mn(2)),
            mul(msub(SPECIAL.greek.beta, mn(3)), msub(mi`x`, mn(1)))
          ),
        ),
      )
    ),
    doc.figcaption`Marginal effect of interaction model`
  ),
  partialEffect: doc.figure(
    mathml.math.attr({ className: 'big-math' })(
      mrow(
        eq(mi`y`, add(
          msub(mi`α`, mn(0)),
          mul(msub(mi`𝛿`, mn(1)), msub(mi`x`, mn(1))),
          add(
            mul(msub(mi`𝛿`, mn(2)), msub(mi`x`, mn(2))),
            add(
              mul(
                msub(SPECIAL.greek.beta, mn(3)),
                minus.paren(msub(mi`x`, mn(1)), msub(mi`𝜇`, mn(1))),
                minus.paren(msub(mi`x`, mn(2)), msub(mi`𝜇`, mn(2))),
              ),
              mi`u`
            ),
          ),
        )),
      ),
    ),
    doc.figcaption`Parital Effect`
  ),
  ape: doc.figure(
    mathml.math.attr({ className: 'big-math' })(
      rows(
        mrow(
          mi`y`,
          mspace(4), mo`=`, mspace(4),
          add(
            msub(SPECIAL.greek.beta, mn(0)),
            mul(msub(SPECIAL.greek.beta, mn(1)), msub(mi`x`, mn(1))),
            add(
              mul(msub(SPECIAL.greek.beta, mn(2)), msub(mi`x`, mn(2))),
              mul(msub(SPECIAL.greek.beta, mn(3)), msup(msub(mi`x`, mn(1)), mn(2))),
              add(
                mul(msub(SPECIAL.greek.beta, mn(4)), msub(mi`x`, mn(1)), msub(mi`x`, mn(2))),
                mi`u`
              )
            )
          ),
        ),

        mrow(
          mfrac(mi`Δy`, msub(mi`Δx`, mn(1))),
          mspace(4), mo`=`, mspace(4),
          add(
            msub(SPECIAL.greek.beta, mn(1)),
            mul(mn(2), mul(msub(SPECIAL.greek.beta, mn(3)), msub(mi`x`, mn(1)))),
            mul(msub(SPECIAL.greek.beta, mn(4)), msub(mi`x`, mn(2)))
          ),
        ),

        mrow(
          msub(mi`APE`, msub(mi`x`, mn(1))),
          mspace(4), mo`=`, mspace(4),
          add(
            msub(SPECIAL.greek.circumflex.beta, mn(1)),
            mul(mn(2), mul(msub(SPECIAL.greek.beta, mn(3)), msub(mi`x̄`, mn(1)))),
            mul(msub(SPECIAL.greek.beta, mn(4)), msub(mi`x̄`, mn(2)))
          ),
        ),
      )
    ),
    doc.figcaption`Average partial effect and marginal response in a quadratic interaction model`
  ),
};

export const rSquared = {
  sample: doc.figure(
    mathml.math(
      mrow(
        eq(
          msup(mi`R`, mn(2)),
          minus(
            mn(1),
            parensB(mfrac(
              div.paren(mi`SSR`, mi`n`),
              div.paren(mi`SST`, mi`n`)
            ))
          )
        )
      )
    ),
    doc.figcaption`R-Squared`
  ),
  population: doc.figure(
    mathml.math(
      mrow(
        eq(
          msup(mi`ρ`, mn(2)),
          minus(
            mn(1),
            parensB(mfrac(
              msubsup(mi`σ`, mi`u`, mn(2)),
              msubsup(mi`σ`, mi`y`, mn(2))
            )),
          )
        )
      )
    ),
    doc.figcaption`Population R-Squared`
  ),
  adjustedRSquared: doc.figure(
    mathml.math(
      table.attr({ columnalign: 'right center left' })(
        [
          msup(mi`R̄`, mn(2)),
          mo`=`,
          minus(
            mn(1),
            parensB(mfrac(
              div(mi`SSR`, minus.paren(mi`n`, mi`k`, mn(1))),
              div(mi`SST`, minus.paren(mi`n`, mn(1)))
            )),
          )
        ],
        [mrow(), mrow(), mrow()],
        [
          mrow(),
          mo`=`,
          minus(
            mn(1),
            div(
              msup(mi`σ̂`, mn(2)),
              div.square(mi`SST`, minus.paren(mi`n`, mn(1)))
            )
          )
        ]
      )
    ),
    doc.figcaption`Adjusted R-Squared`
  ),
};

export const predictions = {
  stdErr: doc.figure(
    bigMath(
      rows.attr({ style: 'text-align: left' })(
        table.attr({ columnalign: 'right center left' })(
          [
            mi`y`,
            mo`=`,
            add(
              msub(SPECIAL.greek.beta, mn(0)),
              mul0(msub(SPECIAL.greek.beta, mn(1)), msub(mi`x`, mn(1))),
              mo`⋯`,
              add(
                mul0(msub(SPECIAL.greek.beta, mi`k`), msub(mi`x`, mi`k`)),
                mi`u`
              )
            ),
          ],
          [
            msub(SPECIAL.greek.circumflex.theta, mn(0)),
            mo`=`,
            add(
              msub(SPECIAL.greek.circumflex.beta, mn(0)),
              mul0(msub(SPECIAL.greek.circumflex.beta, mn(1)), msub(mi`c`, mn(1))),
              mul0(msub(SPECIAL.greek.circumflex.beta, mn(2)), msub(mi`c`, mn(2))),
              mo`⋯`,
              mul0(msub(SPECIAL.greek.circumflex.beta, mi`k`), msub(mi`c`, mi`k`))
            ),
          ],
        ),
        mrow(
          mtext`Let c in `,
          mspace(8),
          set(...[mn(1), mn(2)].map(t => msub(mi`c`, t)), mo`⋯`, msub(mi`c`, mi`k`)),
          mspace(8),
          mtext` be values from a predicted observation.`,
        ),
        annotationOver.attr({
          label: mtext`Compute new model, Use intercept as Standard Error`,
        })(
          table.attr({ columnalign: 'right center left' })(
            [
              mi`y`,
              mo`=`,
              add(
                annotationUnder.attr({
                  label: mtext`Std Err`,
                })(msub(SPECIAL.greek.theta, mn(0))),
                mul0(
                  msub(SPECIAL.greek.beta, mn(1)),
                  minus.paren(msub(mi`x`, mn(1)), msub(mi`c`, mn(1)))
                ),
                mul0(
                  msub(SPECIAL.greek.beta, mn(2)),
                  minus.paren(msub(mi`x`, mn(2)), msub(mi`c`, mn(2)))
                ),
                mo`⋯`,
                add(
                  mul0(
                    msub(SPECIAL.greek.beta, mi`k`),
                    minus.paren(msub(mi`x`, mi`k`), msub(mi`c`, mi`k`))
                  ),
                  mi`u`
                )
              ),
            ],
          ),
        ),
      ),
    ),
    doc.figcaption`Obtaining a prediction Standard Error`
  ),
  ci: doc.figure(
    mathml.math(
      rows(
        eq(
          Se(msub(greek.circumflex.theta, mn(0))),
          msub(greek.theta, mn(0)),
        ),
        op.addMinus(
          msub(greek.circumflex.theta, mn(0)),
          mul(
            mn(2),
            Se(msub(greek.circumflex.theta, mn(0))),
          ),
        ),
      ),
    ),
    doc.figcaption`Confindence Interval`,
  ),
};
