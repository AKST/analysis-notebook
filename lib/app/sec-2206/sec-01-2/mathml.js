/**
 * @import { E } from '../../prelude-type.ts';
 */

import { frag, mathml2, mathml } from '../../prelude.js';
import { mathmlHelper_2 as mathmlHelper } from '../prelude.js';

const { i, o, n, row } = mathml;

const {
  mo, mi, mn, msup, msub, msubsup,
  mrow, mtext, mspace, mfrac,
} = mathml2;



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
  yEst: i('ŷ'),
  yEstI: msub(i('ŷ'), i('i')),
  ysm: i('ȳ'),
  u: i('u'),
  ui: msub(i('u'), i('i')),
  uEst: i('û'),
  uEstI: msub(i('û'), i('i')),
  x: i('x'),
  xi: msub(i('x'), i('i')),
  xsm: i('x̄'),

  b0: msub(beta, n(0)),
  b1: msub(beta, n(1)),
  b0Est: msub(betaCrfx, n(0)),
  b1Est: msub(betaCrfx, n(1)),
  colXY: msub(rho, row([i('x'), i('y')])),
  colXYEst: msub(rhoCrfx, row([i('x'), i('y')])),
  stddevX: msub(sigma, i('x')),
  stddevXEst: msub(sigmaCrfx, i('x')),
  stddevY: msub(sigma, i('y')),
  stddevYEst: msub(sigmaCrfx, i('y')),
};

/** @param {...E.Item} body */
const E = (...body) => call({ fn: i('E') })(frag([...body]))

/** @type {(a: E.Item, b: E.Item) => E.Item} */
const Covar = call({ fn: mtext`Covar` });

const Var = call({ fn: mtext`Var` })
const Range = call({ fn: mtext`Range` })

/** @param {...E.Item} items */
const summaise = (...items) => sum.attr({
  max: i('n'),
  inc: row([i('i'), o('='), n(0)]),
})(...items);

export const simpleLinearRegresion = mathml([
  eq(vars.y, add(vars.b0, frag([vars.b1, vars.x]), vars.u)),
]);

export const simpleLinearRegresionSample = mathml([
  eq(vars.yi, add(vars.b0, mul(vars.b1, vars.xi), vars.ui)),
]);

export const xyFunctionalRelationship = mathml([
  eq(frag([Delta, vars.y]), frag([vars.b1, Delta, vars.x])),
  mspace(16), mtext`if`, mspace(16),
  eq(frag([Delta, vars.u]), n(0)),
]);

export const assumeExpectedUToBe0 = mathml([
  eq(E(vars.u), n(0)),
]);

export const assumeExpectedUDoesNotDependOnX = mathml([
  eq(E(cond(vars.u, vars.x)), E(vars.u)),
]);

export const assumeZeroConditionalMean = mathml([
  eq(E(cond(vars.u, vars.x)), n(0)),
]);

export const populationRegressionFunction = mathml([
  eq(E(cond(vars.y, vars.x)), add(vars.b0, mul(vars.b1, vars.x))),
]);

export const populationRegressionFunctionSimple = mathml([
  eq(vars.yi, add(vars.b0, mul(vars.b1, vars.xi), vars.ui)),
]);

export const indexSyntax = mathml([
  row([
    mtext`Let`, mspace(8),
    parensC(
      parensA(vars.xi, o(','), vars.yi), o(':'),
      mspace(8),
      n(1), o(','),
      mspace(4), SPECIAL.ellipse.h, o(','),
      mspace(4), i('n')
    ),
  ]),
]);

export const idealProperitesOfUnobserved = {
  p2_10: mathml([eq(E(i('u')), n(0))]),
  p2_11: mathml([
    eq(Covar(vars.x, vars.u), eq(E(i('xu')), n(0))),
  ]),
};

export const jointProbabilityDistributionOfXAndYInPop = {
  p2_12: mathml([eq(E(minus(vars.y, vars.b0, mul(vars.b1, vars.x))), n(0))]),
  p2_13: mathml([eq(
    row([
      i('E'),
      mulPB(vars.x, minusPA(minus(vars.y, vars.b0), mul(vars.b1, vars.x))),
    ]),
    n(0),
  )]),
};

export const sumOfFirstOrderConditions = {
  a: mathml([eq(
    frag([
      inv(i('n')),

      summaise(
        minusPA(minus(vars.yi, vars.b0Est), frag([vars.b1Est, vars.xi])),
      ),
    ]),
    n(0),
  )]),
  b: mathml([eq(
    mul(
      inv(i('n')),
      summaise(
        vars.xi,
        minusPA(minus(vars.yi, vars.b0Est), mul(vars.b1Est, vars.xi)),
      ),
    ),
    n(0),
  )]),
  rewrite: mathml([
    eq(vars.ysm, add(vars.b0Est, frag([vars.b1Est, vars.xsm]))),
  ]),
  betaZeroEstimate: mathml([
    eq(vars.b0Est, minus(vars.ysm, frag([vars.b1Est, vars.xsm]))),
  ]),
};

export const betaOneEstimation = {
  assumption: mathml([
    summaise(
      gt(msup(minusPA(vars.xi, vars.xsm), n(2)), n(0)),
    ),
  ]),
  rearrangingAbove: mathml([
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
        n(0),
      ),
      eq(
        summaise(mul(vars.xi, minusPA(vars.yi, vars.ysm))),
        mul(vars.b1Est, summaise(mul(vars.xi, minusPA(vars.xi, vars.xsm)))),
      ),
    )
  ]),
  alsoNotingThat: mathml([
    rows(
      eq(
        summaise(mul(vars.xi, minusPA(vars.xi, vars.xsm))),
        summaise(msup(minusPA(vars.xi, vars.xsm), n(2))),
      ),
      eq(
        summaise(mul(vars.xi, minusPA(vars.yi, vars.ysm))),
        summaise(mul(minusPA(vars.xi, vars.xsm), minusPA(vars.yi, vars.ysm))),
      ),
    ),
  ]),
  betaOneOLS: mathml([
    row([
      eq(vars.b1Est, mfrac(
        summaise(mul(minusPA(vars.xi, vars.xsm), minusPA(vars.yi, vars.ysm))),
        msup(summaise(minusPA(vars.xi, vars.xsm)), n(2)),
      )),
    ])
  ]),
  betaOneOLSSimplied: mathml([
    eq(vars.b1Est, mul(vars.colXYEst, mfrac(vars.stddevXEst, vars.stddevYEst))),
  ]),
  populationBetaOneOLSSimplied: mathml([
    eq(vars.b1, mul(vars.colXY, mfrac(vars.stddevX, vars.stddevY))),
  ]),
};

export const fittedValueOfYi = mathml([
  eq(vars.yEstI, add(vars.b0Est, mul(vars.b1Est, vars.xi))),
])

export const sampleRegressionFunction = mathml([
  eq(vars.yEst, add(vars.b0Est, mul(vars.b1Est, vars.x))),
]);

export const fittedValueResiduals = mathml([
  eq(
    vars.uEstI,
    minus(vars.yi, vars.yEstI),
    minus(vars.yi, add(vars.b0Est, mul(vars.b1Est, vars.xi))),
  ),
]);

export const sumOfSquares = {
  sst: mathml([eqId(i('SST'), summaise(msup(minusPA(vars.yi, vars.ysm), n(2))))]),
  sse: mathml([eqId(i('SSE'), summaise(msup(minusPA(vars.yEstI, vars.ysm), n(2))))]),
  ssr: mathml([eqId(i('SSR'), summaise(msubsup(vars.uEst, i('i'), n(2))))]),
  relation: mathml([eq(i('SST'), add(i('SSE'), i('SSR')))]),
};

export const rSquared = mathml([
  eqId(msup(i('R'), n(2)), eq(
    mfrac(i('SSE'), i('SST')),
    minus(n(1), mfrac(i('SSR'), i('SST'))),
  )),
]);

export const rSquareFull = mathml([
  eq(
    msup(i('R'), n(2)),
    mfrac(
      msup(
        parensA(
          summaise(
            minusPA(msub(i('y'), i('i')), i('ȳ')),
            minusPA(msub(i('ŷ'), i('i')), i('ŷ̄'))
          ),
        ),
        n(2)
      ),
      mul(
        parensA(
          summaise(msup(
            parensA(
              msub(i('y'), i('i')),
              mspace(2), o('-'),
              mspace(2), i('ȳ')
            ),
            n(2)
          )),
        ),
        parensA(
          summaise(msup(
            parensA(
              msub(i('ŷ'), i('i')),
              mspace(2), o('-'),
              mspace(2), i('ŷ̄')
            ),
            n(2)
          )),
        ),
      )
    )
  )
]);

export const whatIsOrdinaryLeastSquares = mathml([
  eq(
    row([
      mtext`min`,
      mspace(4),
      summaise(msubsup(vars.uEst, i('i'), n(2))),
    ]),
    mtext`min`,
    summaise(
      msup(minusPB(vars.yi, add(vars.b0, mul(vars.b1, vars.xi))), n(2)),
    ),
  ),
]);

export const slrAssumptions = {
  slr3: mathml([Range(parensC(
    vars.xi, o(':'), mspace(4),
    eq(i('i'), frag([n(1), SPECIAL.ellipse.h, i('n')])),
  )), mspace(4), o('>'), mspace(4), n(0)]),
  slr4: mathml([eq(E(cond(vars.u, vars.x)), n(0))]),
  slr5: mathml([eq(Var(cond(vars.u, vars.x)), vars.x)]),
};

export const simpleLinearRegressionAnalysis = {
  varB1EstA: mathml([
    eq(
      Var(vars.b1Est),
      mfrac(msup(sigma, n(2)), summaise(msup(minusPA(vars.xi, vars.xsm), n(2)))),
      mfrac(msup(sigma, n(2)), msub(i('SST'), vars.x)),
    ),
  ]),
  varB1EstB: mathml([
    eq(Var(vars.b1Est), mfrac(mrow(
      msup(sigma, n(2)),
      inv(i('n')),
      summaise(msubsup(vars.x, i('i'), n(2))),
    ), summaise(msup(minusPA(vars.xi, vars.xsm), n(2))))),
  ]),
  varB1EstC: mathml([
    table({ columnalign: 'right center left center left' })(
      [
        Var(vars.b1Est),
        o('='), mul(
          msup(parensA(inv(msub(i('SST'), i('x')))), n(2)),
          Var(summaise(mul(vars.ui, minusPA(vars.xi, vars.xsm)))),
        ),
        o('='), mul(
          msup(parensA(inv(msub(i('SST'), i('x')))), n(2)),
          mul(
            summaise(msup(minusPA(vars.xi, vars.xsm), n(2))),
            Var(vars.ui),
          ),
        ),
      ],
      [
        mrow(),
        o('='), mul(
          msup(parensA(inv(msub(i('SST'), vars.x))), n(2)),
          summaise(
            msup(sigma, n(2)),
            msup(minusPA(vars.xi, vars.xsm), n(2)),
          ),
        ),
        o('='), mrow(),
      ],
      [
        mrow(),
        o('='), row([
          mul(
            msup(sigma, n(2)),
            msup(parensA(inv(msub(i('SST'), vars.x))), n(2)),
            summaise(msup(minusPA(vars.xi, vars.xsm), n(2))),
          ),
        ]),
        o('='), eq(
          row([
            mul(
              msup(sigma, n(2)),
              msup(parensA(inv(msub(i('SST'), vars.x))), n(2)),
              msub(i('SST'), vars.x),
            ),
          ]),
          mfrac(msup(sigma, n(2)), msub(i('SST'), vars.x)),
        ),
      ],
    ),
  ]),
};

