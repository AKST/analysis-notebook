/**
 * @import { E, DocumentWidget, Widget } from '../../prelude-type.ts';
 * @import { Config, State } from './type.ts';
 */
import { doc } from '../../prelude.js';
import * as prelude from '../prelude.js';
import * as mathml from './mathml.js';
import * as tables from './tables.js';

const { twoColumns, twoThree, container } = prelude.layout;
const {
  clsRef, infobox, ulLight,
  dashbox, noteOn, note, todo,
} = prelude.components;
const { createDoc } = prelude.util;

/**
 * @type {Record<string, E.Item>}
 */
const LINKS = {
};

/**
 * @type {Record<string, E.Item>}
 */
const INFOBOX = {
  rSquaredJ: infobox('R²j', [container(
    doc.p('R²j is the R² of the following regression'),
    doc.quote('Xj = ⍺₀ + ⍺₁X₁ + ... + 𝛼ₖXₖ + V'),
    doc.p(`
      When R²j is high, it brings very
      little information, this is
      Multicollinearity.
    `),
  )]),
};

/**
 * @param {string} label
 * @returns {Widget<any, State, Config>}
 */
export const createPlaceholder = (label) => (
  createDoc(() => container(
    todo({}, `for "${label.trim()}"`),
  ))
);

export const intro = createDoc(() => container(
  twoThree(
    container(
      ['h1', [
        'Multi Linear Regression', ['br'],
        ['small', { style: 'color: #aaaaff' }, ['ECON2206, W2-W3, Lecture 1']],
      ]],
    ),
    infobox('Resources', [container(
      ulLight([
        'Chapter 3 of the textbook'
      ]),
    )]),
  ),
));

export const motivationForMultiRegression = createDoc(() => dashbox(
  ['h2', 'Motivation for Multiple Regression'],
  note(),
));

export const mechanicsOfOLS = createDoc(() => dashbox(
  ['h2', 'Mechanics and interpretations of OLS'],
  note(),
));

export const expectedOLSEstimators = createDoc(() => dashbox(
  ['h2', 'Expected Values of OLS Estimators'],
  note(),
  ['h3', 'MLR Assumptions'],
  todo({}, 'Assumptions'),
  ['h3', 'MLR.3 Multi Linear Collinearity'],
));

export const expectedOLSEstimatorsIrrelevantVars = createDoc(() => dashbox(
  clsRef({ lec: { id: [3, 'M'],  slide: 8 } }, (
    ['h3', 'Irrelevant Variables in a regression Model']
  )),
  note(
    doc.span`Say you make a model ${doc.b`Y = θ0 + θ1*X1 + θ2*X2 + θ3*X3 + V`}`,
    doc.span`Say the True model is ${doc.b`Y = B0 + B1*X1 + B2*X2 + U`}`,
    doc.span`At the very least there won't be a bias${ulLight([
      'E(U|X1,X2) = 0 => E(V|X1,X2,X3)',
      'X3 is irrelevant: θ3 = 0',
    ])}`,
  ),
  twoColumns(
    container(
      clsRef({ lec: { id: [3, 'M'], slide: 11 } }, ['h4', 'No Perfect Collinearity']),
      note(
        'See MLR 3, this is an extension of SLR 3',
        'no releation amoung the independent variables',
      ),
    ),
    container(
      clsRef({ lec: { id: [3, 'M'], slide: 12 } }, ['h4', 'Zero Conditional mean']),
      note(
        'For this reason it is safe to over specify variables, provide the above isn\'t violated',
      ),
    ),
  ),
  container(
    clsRef({ lec: { id: [3, 'M'], slide: 13 } }, ['h4', 'Exogenous And Endogenous Variables']),
    note(
      doc.span`Exogenous${ulLight([
        'These are characterised by uncorrelatled variables',
        'Where Z is the variable E(U|X0...Xn) = E(Z|X0...Xn) = 0',
      ])}`,
      doc.span`Endogenous${ulLight([
        'These are characterised by correlated variables E(U|X0...Xn) = 0',
        'Where Z is the variable E(U|X0...Xn) = E(Z|X0...Xn) ≠ 0',
      ])}`,
    ),
  ),
  container(
    clsRef({ lec: { id: [3, 'M'], slide: 13 } }, ['h4', 'Endogenous Vs Exogenous']),
    note(
      doc.span`Exogenous${ulLight([
        'These are characterised by uncorrelatled variables',
        'Where Z is the variable E(U|X0...Xn) = E(Z|X0...Xn) = 0',
      ])}`,
      doc.span`Endogenous${ulLight([
        'These are characterised by correlated variables E(U|X0...Xn) = 0',
        'Where Z is the variable E(U|X0...Xn) = E(Z|X0...Xn) ≠ 0',
      ])}`,
    ),
  ),
));

export const expectedOLSEstimatorsOmittedVariableBias = createDoc(() => dashbox(
  clsRef({ lec: { id: [3, 'M'], slide: 3 } }, ['h3', 'Omitted Variable Bias']),
  note(
    doc.span`Say you make a model ${doc.b`Y = θ0 + θ1*X1 + V`}`,
    doc.span`Say the True model is ${doc.b`Y = B0 + B1*X1 + B2*X2 + U`}`,
    doc.span`As we omitted X2, it would be an omitted variable`,
    doc.span`The omission of this variable will lead to bias in our specified estimators`,
    'If E(X2|X1) ≠ 0 then X2 is related to X1',
    'If B2 ≠ 0: X2 has an effect on Y',
  ),
  mathml.concequenceOfOmittedVariableBias,
  container(
    clsRef({ lec: { id: [3, 'M'], slide: 5 } }, ['h4', 'Measuring Correlations between Variables']),
    note(
      'Given X2 = D0 + D1X + W',
      'D1 measures the linear correlation between X2 and X1',
      doc.span`Subsubstitute in the true model${ulLight([
        'Y = B0 + B1*X1 + B2*(D0 + D1*X1 + W) + U',
        'Y = (B0 + B2*D0) + (B1 + B2*D1)*X1 + (B2*W + U)',
      ])}`,
      doc.span`Given ${doc.b`E(θ1) = B1 + B2*D1`}${ulLight([
        'if θ1 is unbias it will be equal to B1',
        'if θ1 is bias it will be equal to B1 + B2*D1',
      ])}`,
      doc.span`positive bias means the estimator overestimates the value${ulLight([
        'E(01) - B1 = B2D1 > 0',
        todo({}, 'example of positive bias'),
      ])}`,
      doc.span`negative bias means the estimator underestimates the value${ulLight([
        'E(01) - B1 = B2D1 < 0',
        todo({}, 'example of negative bias'),
      ])}`,
    ),
    todo({}, 'Show the above in the form of math'),
  ),
));

export const expectedOLSEstimatorsVariance = createDoc(() => dashbox(
  clsRef({ lec: { id: [3, 'M'], slide: 14 } }, ['h3', 'Variance of OLS Estimators']),
  note(),
  clsRef({ lec: { id: [3, 'M'], slide: 15 } }, ['h4', 'Components of OLS variance']),
  noteOn('Var(βᵢ)')(
    'increase in 𝜎² suggests noise',
    'decreases with SSTᵢ',
  ),
));

export const expectedOLSEstimatorsMulticollinearity = createDoc(() => dashbox(
  clsRef({ lec: { id: [3, 'M'], slide: 16 } }, ['h3', 'Multicollinearity']),
  twoThree(
    note(
      'This is when explainatory variables are colleralated, and explain themselves',
      'It is difficult to attribute the impact of one variable from the other',
      'Sometimes its better to lump those variables together',
    ),
    INFOBOX.rSquaredJ,
  ),
));
