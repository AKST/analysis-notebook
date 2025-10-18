/**
 * @import { E } from '../../prelude-type.ts';
 */

import { frag, mathml } from '../../prelude.js';
import { mathmlHelper_2 as mathmlHelper } from '../prelude.js';

const {
  o, i, n, sup, sub, subsup,
  row, text, space, frac,
} = mathml;



const {
  eqId, eq, add, cond,
  mul0: mul, mul0PB: mulPB,
  rows, parensA, parensC, call,
  minus, minusPA, minusPB, sum,
  inv, table, SPECIAL,
} = mathmlHelper;

const {
  greek: {
    beta,
    delta,
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
  y: i('y'),
  yi: sub(i('y'), i('i')),
  yEst: i('ŷ'),
  yEstI: sub(i('ŷ'), i('i')),
  ysm: i('ȳ'),
  u: i('u'),
  ui: sub(i('u'), i('i')),
  uEst: i('û'),
  uEstI: sub(i('û'), i('i')),
  x: i('x'),
  xi: sub(i('x'), i('i')),
  xsm: i('x̄'),

  b0: sub(beta, n(0)),
  b1: sub(beta, n(1)),
  b0Est: sub(betaCrfx, n(0)),
  b1Est: sub(betaCrfx, n(1)),
  colXY: sub(rho, row([i('x'), i('y')])),
  colXYEst: sub(rhoCrfx, row([i('x'), i('y')])),
  stddevX: sub(sigma, i('x')),
  stddevXEst: sub(sigmaCrfx, i('x')),
  stddevY: sub(sigma, i('y')),
  stddevYEst: sub(sigmaCrfx, i('y')),
};

/** @param {...E.Item} body */
const E = (...body) => call({ fn: i('E') })(frag([...body]))

/** @type {(a: E.Item, b: E.Item) => E.Item} */
const Covar = call({ fn: text('Covar') });

const Var = call({ fn: text('Var') })
const Range = call({ fn: text('Range') })

/** @param {...E.Item} items */
const summaise = (...items) => sum.attr({
  max: i('n'),
  inc: row([i('i'), o('='), n(0)]),
}).of(space(4), ...items);

export const simpleLinearRegresion = mathml([
  eq(vars.y, add(vars.b0, frag([vars.b1, vars.x]), vars.u)),
]);

export const simpleLinearRegresionSample = mathml([
  eq(vars.yi, add(vars.b0, mul(vars.b1, vars.xi), vars.ui)),
]);

export const xyFunctionalRelationship = mathml([
  eq(frag([delta, vars.y]), frag([vars.b1, delta, vars.x])),
  space(16), text('if'), space(16),
  eq(frag([delta, vars.u]), n(0)),
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
    text('Let'), space(8),
    parensC(
      parensA(vars.xi, o(','), vars.yi), o(':'), space(8),
      n(1), o(','),
      space(4), SPECIAL.ellipse.h, o(','),
      space(4), i('n')
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
      sup(minusPA(vars.xi, vars.xsm), n(2)),
      space(4), o('>'), space(4), n(0),
    ),
  ]),
  rearrangingAbove: mathml([
    rows.of(
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
    rows.of(
      eq(
        summaise(mul(vars.xi, minusPA(vars.xi, vars.xsm))),
        summaise(sup(minusPA(vars.xi, vars.xsm), n(2))),
      ),
      eq(
        summaise(mul(vars.xi, minusPA(vars.yi, vars.ysm))),
        summaise(mul(minusPA(vars.xi, vars.xsm), minusPA(vars.yi, vars.ysm))),
      ),
    ),
  ]),
  betaOneOLS: mathml([
    row([
      eq(vars.b1Est, frac([
        summaise(mul(minusPA(vars.xi, vars.xsm), minusPA(vars.yi, vars.ysm))),
      ], [
        sup(summaise(minusPA(vars.xi, vars.xsm)), n(2)),
      ])),
    ])
  ]),
  betaOneOLSSimplied: mathml([
    eq(vars.b1Est, mul(vars.colXYEst, frac([vars.stddevXEst], [vars.stddevYEst]))),
  ]),
  populationBetaOneOLSSimplied: mathml([
    eq(vars.b1, mul(vars.colXY, frac([vars.stddevX], [vars.stddevY]))),
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
  sst: mathml([eqId(i('SST'), summaise(sup(minusPA(vars.yi, vars.ysm), n(2))))]),
  sse: mathml([eqId(i('SSE'), summaise(sup(minusPA(vars.yEstI, vars.ysm), n(2))))]),
  ssr: mathml([eqId(i('SSR'), summaise(subsup(vars.uEst, i('i'), n(2))))]),
  relation: mathml([eq(i('SST'), add(i('SSE'), i('SSR')))]),
};

export const rSquared = mathml([
  eqId(sup(i('R'), n(2)), eq(
    frac([i('SSE')], [i('SST')]),
    minus(n(1), frac([i('SSR')], [i('SST')])),
  )),
]);

export const rSquareFull = mathml([
  eq(
    sup(i('R'), n(2)),
    frac(
      [
        sup(
          parensA(
            summaise(
              minusPA(sub(i('y'), i('i')), i('ȳ')),
              minusPA(sub(i('ŷ'), i('i')), i('ŷ̄'))
            ),
          ),
          n(2)
        )
      ],
      [
        mul(
          parensA(
            summaise(sup(
              parensA(
                sub(i('y'), i('i')), space(2), o('-'), space(2), i('ȳ')
              ),
              n(2)
            )),
          ),
          parensA(
            summaise(sup(
              parensA(
                sub(i('ŷ'), i('i')), space(2), o('-'), space(2), i('ŷ̄')
              ),
              n(2)
            )),
          ),
        )
      ]
    )
  )
]);

export const whatIsOrdinaryLeastSquares = mathml([
  eq(
    row([text('min'), space(4), summaise(subsup(vars.uEst, i('i'), n(2)))]),
    text('min'),
    summaise(
      sup(minusPB(vars.yi, add(vars.b0, mul(vars.b1, vars.xi))), n(2)),
    ),
  ),
]);

export const slrAssumptions = {
  slr3: mathml([Range(parensC(
    vars.xi, o(':'), space(4),
    eq(i('i'), frag([n(1), SPECIAL.ellipse.h, i('n')])),
  )), space(4), o('>'), space(4), n(0)]),
  slr4: mathml([eq(E(cond(vars.u, vars.x)), n(0))]),
  slr5: mathml([eq(Var(cond(vars.u, vars.x)), vars.x)]),
};

export const simpleLinearRegressionAnalysis = {
  varB1EstA: mathml([
    eq(
      Var(vars.b1Est),
      frac([sup(sigma, n(2))], [
        summaise(sup(minusPA(vars.xi, vars.xsm), n(2))),
      ]),
      frac([sup(sigma, n(2))], [sub(i('SST'), vars.x)]),
    ),
  ]),
  varB1EstB: mathml([
    eq(Var(vars.b1Est), frac([
      sup(sigma, n(2)),
      inv(i('n')),
      summaise(subsup(vars.x, i('i'), n(2))),
    ], [
      summaise(sup(minusPA(vars.xi, vars.xsm), n(2))),
    ])),
  ]),
  varB1EstC: mathml([
    table({ columnalign: 'right center left center left' }).of(
      [
        Var(vars.b1Est),
        o('='), mul(
          sup(parensA(inv(sub(i('SST'), i('x')))), n(2)),
          Var(summaise(mul(vars.ui, minusPA(vars.xi, vars.xsm)))),
        ),
        o('='), mul(
          sup(parensA(inv(sub(i('SST'), i('x')))), n(2)),
          mul(
            summaise(sup(minusPA(vars.xi, vars.xsm), n(2))),
            Var(vars.ui),
          ),
        ),
      ],
      [
        space(0),
        o('='), mul(
          sup(parensA(inv(sub(i('SST'), vars.x))), n(2)),
          summaise(
            sup(sigma, n(2)),
            sup(minusPA(vars.xi, vars.xsm), n(2)),
          ),
        ),
        o('='), space(0),
      ],
      [
        space(0),
        o('='), row([
          mul(
            sup(sigma, n(2)),
            sup(parensA(inv(sub(i('SST'), vars.x))), n(2)),
            summaise(sup(minusPA(vars.xi, vars.xsm), n(2))),
          ),
        ]),
        o('='), eq(
          row([
            mul(
              sup(sigma, n(2)),
              sup(parensA(inv(sub(i('SST'), vars.x))), n(2)),
              sub(i('SST'), vars.x),
            ),
          ]),
          frac([
            sup(sigma, n(2)),
          ], [
            sub(i('SST'), vars.x),
          ]),
        ),
      ],
    ),
  ]),
};

