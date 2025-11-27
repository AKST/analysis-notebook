import { doc, table } from '@app/prelude.js';
import { text } from '@prelude-uni/components.js';

export const bias = text.figure(
  table(['', 'Corr(x₁,x₂) > 0', 'Corr(x₁,x₂) < 0'], [
    ['𝛽₂ > 0', 'Positive bias', 'Negative bias'],
    ['𝛽₂ < 0', 'Negative bias', 'Positive bias'],
  ], { style: 'width: 100%' }),
  doc.figcaption`Summary of Bias in 𝛽̃₁ when x₂ is an Omitted Variable`,
);
