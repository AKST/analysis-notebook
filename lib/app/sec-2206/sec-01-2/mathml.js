/**
 * @import { E } from '../../prelude-type.ts';
 */

import { frag, mathml } from '../../prelude.js';
import { mathmlHelper_2 as mathmlHelper } from '../prelude.js';

const {
  mo, mi, mn, msup, msub, msubsup,
  mrow, mtext, mspace, mfrac,
} = mathml;



const {
  eqId, eq, add, cond,
  mul0: mul, mul0PB: mulPB,
  rows, parensA, parensC, call,
  minus, minusPA, minusPB, sum,
  inv, table, SPECIAL, gt,
} = mathmlHelper;

const {
  greek: {
    beta,
    Delta,
    rho,
    sigma,
    circumflex: {
      sigma: sigmaCrfx,
      beta: betaCrfx,
      rho: rhoCrfx,
    },
  },
} = mathmlHelper.SPECIAL;

const vars = {
  y: mi`y`,
  yi: msub(mi`y`, mi`i`),
  yEst: mi`ŷ`,
  yEstI: msub(mi`ŷ`, mi`i`),
  ysm: mi`ȳ`,
  u: mi`u`,
  ui: msub(mi`u`, mi`i`),
  uEst: mi`û`,
  uEstI: msub(mi`û`, mi`i`),
  x: mi`x`,
  xi: msub(mi`x`, mi`i`),
  xsm: mi`x̄`,

  b0: msub(beta, mn(0)),
  b1: msub(beta, mn(1)),
  b0Est: msub(betaCrfx, mn(0)),
  b1Est: msub(betaCrfx, mn(1)),
  colXY: msub(rho, mrow(mi`x`, mi`y`)),
  colXYEst: msub(rhoCrfx, mrow(mi`x`, mi`y`)),
  stddevX: msub(sigma, mi`x`),
  stddevXEst: msub(sigmaCrfx, mi`x`),
  stddevY: msub(sigma, mi`y`),
  stddevYEst: msub(sigmaCrfx, mi`y`),
};

/** @param {...E.Item} body */
const E = (...body) => call({ fn: mi`E` })(frag([...body]))

/** @type {(a: E.Item, b: E.Item) => E.Item} */
const Covar = call({ fn: mtext`Covar` });

const Var = call({ fn: mtext`Var` })
const Range = call({ fn: mtext`Range` })

/** @param {...E.Item} items */
const summaise = (...items) => sum.attr({
  max: mi`n`,
  inc: mrow(mi`i`, mo`=`, mn(0)),
})(...items);

export const simpleLinearRegresion = mathml.math(
  eq(vars.y, add(vars.b0, frag([vars.b1, vars.x]), vars.u)),
);

export const simpleLinearRegresionSample = mathml.math(
  eq(vars.yi, add(vars.b0, mul(vars.b1, vars.xi), vars.ui)),
);

export const xyFunctionalRelationship = mathml.math(
  eq(frag([Delta, vars.y]), frag([vars.b1, Delta, vars.x])),
  mspace(16), mtext`if`, mspace(16),
  eq(frag([Delta, vars.u]), mn(0)),
);

export const assumeExpectedUToBe0 = mathml.math(
  eq(E(vars.u), mn(0)),
);

export const assumeExpectedUDoesNotDependOnX = mathml.math(
  eq(E(cond(vars.u, vars.x)), E(vars.u)),
);

export const assumeZeroConditionalMean = mathml.math(
  eq(E(cond(vars.u, vars.x)), mn(0)),
);

export const populationRegressionFunction = mathml.math(
  eq(E(cond(vars.y, vars.x)), add(vars.b0, mul(vars.b1, vars.x))),
);

export const populationRegressionFunctionSimple = mathml.math(
  eq(vars.yi, add(vars.b0, mul(vars.b1, vars.xi), vars.ui)),
);

export const indexSyntax = mathml.math(
  mrow(
    mtext`Let`, mspace(8),
    parensC(
      parensA(vars.xi, mo`,`, vars.yi), mo`:`,
      mspace(8),
      mn(1), mo`,`,
      mspace(4), SPECIAL.ellipse.h, mo`,`,
      mspace(4), mi`n`
    ),
  ),
);

export const idealProperitesOfUnobserved = {
  p2_10: mathml.math(eq(E(mi`u`), mn(0))),
  p2_11: mathml.math(
    eq(Covar(vars.x, vars.u), E(mi`xu`), mn(0)),
  ),
};

export const jointProbabilityDistributionOfXAndYInPop = {
  p2_12: mathml.math(eq(E(minus(vars.y, vars.b0, mul(vars.b1, vars.x))), mn(0))),
  p2_13: mathml.math(eq(
    mrow(
      mi`E`,
      mulPB(vars.x, minusPA(minus(vars.y, vars.b0), mul(vars.b1, vars.x))),
    ),
    mn(0),
  )),
};

export const sumOfFirstOrderConditions = {
  a: mathml.math(eq(
    frag([
      inv(mi`n`),

      summaise(
        minusPA(minus(vars.yi, vars.b0Est), frag([vars.b1Est, vars.xi])),
      ),
    ]),
    mn(0),
  )),
  b: mathml.math(eq(
    mul(
      inv(mi`n`),
      summaise(
        vars.xi,
        minusPA(minus(vars.yi, vars.b0Est), mul(vars.b1Est, vars.xi)),
      ),
    ),
    mn(0),
  )),
  rewrite: mathml.math(
    eq(vars.ysm, add(vars.b0Est, frag([vars.b1Est, vars.xsm]))),
  ),
  betaZeroEstimate: mathml.math(
    eq(vars.b0Est, minus(vars.ysm, frag([vars.b1Est, vars.xsm]))),
  ),
};

export const betaOneEstimation = {
  assumption: mathml.math(
    summaise(
      gt(msup(minusPA(vars.xi, vars.xsm), mn(2)), mn(0)),
    ),
  ),
  rearrangingAbove: mathml.math(
    rows(
      eq(
        summaise(
          mul(
            vars.xi,
            minusPB(
              minus(vars.yi, minusPA(vars.ysm, mul(vars.b1Est, vars.xsm))),
              mul(vars.b1Est, vars.xi),
            ),
          ),
        ),
        mn(0),
      ),
      eq(
        summaise(mul(vars.xi, minusPA(vars.yi, vars.ysm))),
        mul(vars.b1Est, summaise(mul(vars.xi, minusPA(vars.xi, vars.xsm)))),
      ),
    )
  ),
  alsoNotingThat: mathml.math(
    rows(
      eq(
        summaise(mul(vars.xi, minusPA(vars.xi, vars.xsm))),
        summaise(msup(minusPA(vars.xi, vars.xsm), mn(2))),
      ),
      eq(
        summaise(mul(vars.xi, minusPA(vars.yi, vars.ysm))),
        summaise(mul(minusPA(vars.xi, vars.xsm), minusPA(vars.yi, vars.ysm))),
      ),
    ),
  ),
  betaOneOLS: mathml.math(
    eq(vars.b1Est, mfrac(
      summaise(mul(minusPA(vars.xi, vars.xsm), minusPA(vars.yi, vars.ysm))),
      msup(summaise(minusPA(vars.xi, vars.xsm)), mn(2)),
    )),
  ),
  betaOneOLSSimplied: mathml.math(
    eq(vars.b1Est, mul(vars.colXYEst, mfrac(vars.stddevXEst, vars.stddevYEst))),
  ),
  populationBetaOneOLSSimplied: mathml.math(
    eq(vars.b1, mul(vars.colXY, mfrac(vars.stddevX, vars.stddevY))),
  ),
};

export const fittedValueOfYi = mathml.math(
  eq(vars.yEstI, add(vars.b0Est, mul(vars.b1Est, vars.xi))),
)

export const sampleRegressionFunction = mathml.math(
  eq(vars.yEst, add(vars.b0Est, mul(vars.b1Est, vars.x))),
);

export const fittedValueResiduals = mathml.math(
  eq(
    vars.uEstI,
    minus(vars.yi, vars.yEstI),
    minus(vars.yi, add(vars.b0Est, mul(vars.b1Est, vars.xi))),
  ),
);

export const sumOfSquares = {
  sst: mathml.math(eqId(mi`SST`, summaise(msup(minusPA(vars.yi, vars.ysm), mn(2))))),
  sse: mathml.math(eqId(mi`SSE`, summaise(msup(minusPA(vars.yEstI, vars.ysm), mn(2))))),
  ssr: mathml.math(eqId(mi`SSR`, summaise(msubsup(vars.uEst, mi`i`, mn(2))))),
  relation: mathml.math(eq(mi`SST`, add(mi`SSE`, mi`SSR`))),
};

export const rSquared = mathml.math(
  eqId(msup(mi`R`, mn(2)), eq(
    mfrac(mi`SSE`, mi`SST`),
    minus(mn(1), mfrac(mi`SSR`, mi`SST`)),
  )),
);

export const rSquareFull = mathml.math(
  eq(
    msup(mi`R`, mn(2)),
    mfrac(
      msup(
        parensA(
          summaise(
            minusPA(msub(mi`y`, mi`i`), mi`ȳ`),
            minusPA(msub(mi`ŷ`, mi`i`), mi`ŷ̄`)
          ),
        ),
        mn(2)
      ),
      mul(
        parensA(
          summaise(msup(minusPA(msub(mi`y`, mi`i`), mi`ȳ`), mn(2))),
        ),
        parensA(
          summaise(msup(minusPA(msub(mi`ŷ`, mi`i`), mi`ŷ̄`), mn(2))),
        ),
      )
    )
  )
);

export const whatIsOrdinaryLeastSquares = mathml.math(
  eq(
    mrow(
      mtext`min`,
      mspace(4),
      summaise(msubsup(vars.uEst, mi`i`, mn(2))),
    ),
    mtext`min`,
    summaise(
      msup(minusPB(vars.yi, add(vars.b0, mul(vars.b1, vars.xi))), mn(2)),
    ),
  ),
);

export const slrAssumptions = {
  slr3: mathml.math(Range(parensC(
    vars.xi, mo`:`, mspace(4),
    eq(mi`i`, frag([mn(1), SPECIAL.ellipse.h, mi`n`])),
  )), mspace(4), mo`>`, mspace(4), mn(0)),
  slr4: mathml.math(eq(E(cond(vars.u, vars.x)), mn(0))),
  slr5: mathml.math(eq(Var(cond(vars.u, vars.x)), vars.x)),
};

export const simpleLinearRegressionAnalysis = {
  varB1EstA: mathml.math(
    eq(
      Var(vars.b1Est),
      mfrac(msup(sigma, mn(2)), summaise(msup(minusPA(vars.xi, vars.xsm), mn(2)))),
      mfrac(msup(sigma, mn(2)), msub(mi`SST`, vars.x)),
    ),
  ),
  varB1EstB: mathml.math(
    eq(Var(vars.b1Est), mfrac(mrow(
      msup(sigma, mn(2)),
      inv(mi`n`),
      summaise(msubsup(vars.x, mi`i`, mn(2))),
    ), summaise(msup(minusPA(vars.xi, vars.xsm), mn(2))))),
  ),
  varB1EstC: mathml.math(
    table({ columnalign: 'right center left center left' })(
      [
        Var(vars.b1Est),
        mo`=`, mul(
          msup(parensA(inv(msub(mi`SST`, mi`x`))), mn(2)),
          Var(summaise(mul(vars.ui, minusPA(vars.xi, vars.xsm)))),
        ),
        mo`=`, mul(
          msup(parensA(inv(msub(mi`SST`, mi`x`))), mn(2)),
          mul(
            summaise(msup(minusPA(vars.xi, vars.xsm), mn(2))),
            Var(vars.ui),
          ),
        ),
      ],
      [
        mrow(),
        mo`=`, mul(
          msup(parensA(inv(msub(mi`SST`, vars.x))), mn(2)),
          summaise(
            msup(sigma, mn(2)),
            msup(minusPA(vars.xi, vars.xsm), mn(2)),
          ),
        ),
        mo`=`, mrow(),
      ],
      [
        mrow(),
        mo`=`, mrow(
          mul(
            msup(sigma, mn(2)),
            msup(parensA(inv(msub(mi`SST`, vars.x))), mn(2)),
            summaise(msup(minusPA(vars.xi, vars.xsm), mn(2))),
          ),
        ),
        mo`=`, eq(
          mrow(
            mul(
              msup(sigma, mn(2)),
              msup(parensA(inv(msub(mi`SST`, vars.x))), mn(2)),
              msub(mi`SST`, vars.x),
            ),
          ),
          mfrac(msup(sigma, mn(2)), msub(mi`SST`, vars.x)),
        ),
      ],
    ),
  ),
};

