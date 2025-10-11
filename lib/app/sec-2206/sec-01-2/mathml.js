/**
 * @import { E } from '../../prelude-type.ts';
 */

import { frag, mathml } from '../../prelude.js';
import { mathmlHelper } from '../prelude.js';

const {
  call, o, i, n, sup, sub, sum, subsup,
  paren, row, rows, text, space, over, frac,
  SPECIAL, inv,
} = mathml;

const {
  greek: {
    beta, betaCrfx, Delta,
    rho, rhoCrfx,
    sigma, sigmaCrfx,
  },
} = mathml.SPECIAL;

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

const {
  eqId, eq, add, mul2, mul3, minusSqP,
  minus, minusP, add3,
} = mathmlHelper;

/** @param {...E.Item} body */
const E = (...body) => call('E', frag([...body]))

/** @param {E.Item} a @param {E.Item} b */
const Covar = (a, b) => call('Covar', a, b)

const summaise = sum(i('n'), row([i('i'), o('='), n(0)]));

export const simpleLinearRegresion = mathml([
  eq(vars.y, add3(vars.b0, frag([vars.b1, vars.x]), vars.u)),
]);

export const simpleLinearRegresionSample = mathml([
  eq(vars.yi, add3(vars.b0, frag([vars.b1, vars.xi]), vars.ui)),
]);

export const xyFunctionalRelationship = mathml([
  eq(frag([Delta, vars.y]), frag([vars.b1, Delta, vars.x])),
  space(16), text('if'), space(16),
  eq(frag([Delta, vars.u]), n(0)),
]);

export const assumeExpectedUToBe0 = mathml([
  eq(E(vars.u), n(0)),
]);

export const assumeExpectedUDoesNotDependOnX = mathml([
  eq(E(vars.u, o('|'), vars.x), E(vars.u)),
]);

export const assumeZeroConditionalMean = mathml([
  eq(E(vars.u, o('|'), vars.x), n(0)),
]);

export const populationRegressionFunction = mathml([
  eq(
    E(vars.y, o('|'), vars.x),
    add(vars.b0, frag([vars.b1, vars.x])),
  ),
]);

export const populationRegressionFunctionSimple = mathml([
  eq(
    vars.yi,
    add(
      add(vars.b0, frag([vars.b1, vars.xi])),
      vars.ui
    ),
  ),
]);

export const indexSyntax = mathml([
  row([
    text('Let'), space(8),
    row([o('{'), row([
      paren([vars.xi, o(','), vars.yi]), o(':'), space(8),
      n(1), o(','),
      space(4), SPECIAL.ellipse.h, o(','),
      space(4), i('n')
    ]), o('}')]),
  ]),
]);

export const idealProperitesOfUnobserved = {
  p2_10: mathml([eq(E(i('u')), n(0))]),
  p2_11: mathml([
    eq(Covar(vars.x, vars.u), eq(E(i('xu')), n(0))),
  ]),
};

export const jointProbabilityDistributionOfXAndYInPop = {
  p2_12: mathml([eq(
    E(minus(minus(vars.y, vars.b0), frag([vars.b1, vars.x]))),
    n(0),
  )]),
  p2_13: mathml([eq(
    row([
      i('E'),
      o('['),
      row([
        vars.x,
        minusP(
          minus(vars.y, vars.b0),
          frag([vars.b1, vars.x]),
        ),
      ]),
      o(']'),
    ]),
    n(0),
  )]),
};

export const sumOfFirstOrderConditions = {
  a: mathml([eq(
    frag([
      inv(i('n')),
      row([
        summaise,
        minusP(minus(vars.yi, vars.b0Est), frag([vars.b1Est, vars.xi])),
      ]),
    ]),
    n(0),
  )]),
  b: mathml([eq(
    frag([
      inv(i('n')),
      row([
        summaise,
        space(4),
        vars.xi,
        minusP(minus(vars.yi, vars.b0Est), frag([vars.b1Est, vars.xi])),
      ]),
    ]),
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
    row([
      sup(row([summaise, space(4), minusP(vars.xi, vars.xsm)]), n(2)),
      space(4), o('>'), space(4), n(0),
    ]),
  ]),
  rearrangingAbove: mathml([
    rows([
      eq(
        row([
          summaise,
          space(4),
          vars.xi,
          minusSqP(
            minus(
              vars.yi,
              minusP(vars.ysm, frag([vars.b1Est, vars.xsm])),
            ),
            frag([vars.b1Est, vars.xi]),
          ),
        ]),
        n(0),
      ),
      eq(
        row([summaise, space(4), vars.xi, minusP(vars.yi, vars.ysm)]),
        row([vars.b1Est, summaise, space(4), vars.xi, minusP(vars.xi, vars.xsm)]),
      ),
    ])
  ]),
  alsoNotingThat: mathml([
    rows([
      eq(
        row([summaise, space(4), vars.xi, minusP(vars.xi, vars.xsm)]),
        sup(row([summaise, space(4), minusP(vars.xi, vars.xsm)]), n(2)),
      ),
      eq(
        row([summaise, space(4), vars.xi, minusP(vars.yi, vars.ysm)]),
        row([summaise, space(4), minusP(vars.xi, vars.xsm), minusP(vars.yi, vars.ysm)]),
      ),
    ]),
  ]),
  betaOneOLS: mathml([
    row([
      eq(vars.b1Est, frac([
        row([summaise, space(4), minusP(vars.xi, vars.xsm), minusP(vars.yi, vars.ysm)]),
      ], [
        sup(row([summaise, space(4), minusP(vars.xi, vars.xsm)]), n(2)),
      ])),
    ])
  ]),
  betaOneOLSSimplied: mathml([
    eq(vars.b1Est, mul2(vars.colXYEst, frac([vars.stddevXEst], [vars.stddevYEst]))),
  ]),
  populationBetaOneOLSSimplied: mathml([
    eq(vars.b1, mul2(vars.colXY, frac([vars.stddevX], [vars.stddevY]))),
  ]),
};

export const fittedValueOfYi = mathml([
  eq(vars.yEstI, add(vars.b0Est, frag([vars.b1Est, vars.xi]))),
])

export const sampleRegressionFunction = mathml([
  eq(vars.yEst, add(vars.b0Est, frag([vars.b1Est, vars.x]))),
]);

export const fittedValueResiduals = mathml([
  eq(vars.uEstI, eq(
    minus(vars.yi, vars.yEstI),
    minus(vars.yi, add(vars.b0Est, frag([vars.b1Est, vars.xi]))),
  )),
]);

export const sumOfSquares = {
  sst: mathml([eqId(i('SST'), row([
    summaise,
    sup(minusP(vars.yi, vars.ysm), n(2)),
  ]))]),
  sse: mathml([eqId(i('SSE'), row([
    summaise,
    sup(minusP(vars.yEstI, vars.ysm), n(2)),
  ]))]),
  ssr: mathml([eqId(i('SSR'), row([
    summaise, subsup(vars.uEst, i('i'), n(2)),
  ]))]),
  relation: mathml([eq(i('SST'), add(i('SSE'), i('SSR')))]),
}

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
          paren([
            sum(i('n'), row([i('i'), o('='), n(1)])),
            paren([
              sub(i('y'), i('i')), space(2), o('-'), space(2), i('ȳ')
            ]),
            paren([
              sub(i('ŷ'), i('i')), space(2), o('-'), space(2), i('ŷ̄')
            ])
          ]),
          n(2)
        )
      ],
      [
        mul2(
          paren([
            sum(i('n'), row([i('i'), o('='), n(1)])),
            sup(
              paren([
                sub(i('y'), i('i')), space(2), o('-'), space(2), i('ȳ')
              ]),
              n(2)
            )
          ]),
          paren([
            sum(i('n'), row([i('i'), o('='), n(1)])),
            sup(
              paren([
                sub(i('ŷ'), i('i')), space(2), o('-'), space(2), i('ŷ̄')
              ]),
              n(2)
            )
          ])
        )
      ]
    )
  )
]);

export const whatIsOrdinaryLeastSquares = mathml([
  eq(row([text('min'), space(4), summaise, subsup(vars.uEst, i('i'), n(2))]), eq(
    text('min'), space(4), summaise,
    sup(minusSqP(vars.yi, add(vars.b0, row([vars.b1, vars.xi]))), n(2)),
  )),
]);

export const slrAssumptions = {
  slr3: mathml([call('Range', row([
    o('{'), vars.xi, o(','), space(4),
    eq(i('i'), frag([n(1), SPECIAL.ellipse.h, i('n')])),
    o('}'),
  ])), space(4), o('>'), space(4), n(0)]),
  slr4: mathml([eq(E(vars.u, o('|'), vars.x), n(0))]),
  slr5: mathml([eq(call('Var', frag([vars.u, o('|'), vars.x])), vars.x)]),
};

export const simpleLinearRegressionAnalysis = {
  varB1EstA: mathml([
    eq(call('Var', vars.b1Est), eq(
      frac([sup(sigma, n(2))], [
        summaise, sup(minusP(vars.xi, vars.xsm), n(2)),
      ]),
      frac([sup(sigma, n(2))], [
        sub(i('SST'), vars.x),
      ]),
    )),
  ]),
  varB1EstB: mathml([
    eq(call('Var', vars.b1Est), frac([
      sup(sigma, n(2)),
      inv(i('n')),
      summaise, subsup(vars.x, i('i'), n(2)),
    ], [
      summaise, sup(minusP(vars.xi, vars.xsm), n(2)),
    ])),
  ]),
  varB1EstC: mathml([
    mathml.table([
      [
        call('Var', vars.b1Est),
        o('='), mul2(
          sup(paren([inv(sub(i('SST'), i('x')))]), n(2)),
          call('Var', frag([
            summaise,
            vars.ui, minusP(vars.xi, vars.xsm),
          ])),
        ),
        o('='), mul2(
          sup(paren([inv(sub(i('SST'), i('x')))]), n(2)),
          frag([
            summaise,
            sup(minusP(vars.xi, vars.xsm), n(2)),
            call('Var', vars.ui),
          ]),
        ),
      ],
      [
        space(0),
        o('='), mul2(
          sup(paren([inv(sub(i('SST'), vars.x))]), n(2)),
          frag([
            summaise,
            sup(sigma, n(2)),
            sup(minusP(vars.xi, vars.xsm), n(2)),
          ]),
        ),
        o('='), space(0),
      ],
      [
        space(0),
        o('='), row([
          mul3(
            sup(sigma, n(2)),
            sup(paren([inv(sub(i('SST'), vars.x))]), n(2)),
            frag([
              summaise, sup(minusP(vars.xi, vars.xsm), n(2)),
            ]),
          ),
        ]),
        o('='), eq(
          row([
            mul3(
              sup(sigma, n(2)),
              sup(paren([inv(sub(i('SST'), vars.x))]), n(2)),
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
    ]),
  ]),
};

