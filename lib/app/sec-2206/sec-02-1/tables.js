import { doc, table } from '../../prelude.js';

export const bias = doc.figure(
  table(['', 'Corr(x₁,x₂) > 0', 'Corr(x₁,x₂) < 0'], [
    ['𝛽₂ > 0', 'Positive bias', 'Negative bias'],
    ['𝛽₂ < 0', 'Negative bias', 'Positive bias'],
  ], { style: 'width: 100%' }),
  'Summary of Bias in 𝛽̃₁ when x₂ is an Omitted Variable',
);
