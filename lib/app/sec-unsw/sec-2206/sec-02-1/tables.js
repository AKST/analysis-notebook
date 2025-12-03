import { doc, table } from '@app/prelude.js';
import { text } from '@prelude-uni/components.js';

export const bias = text.figure(
  table(['', 'Corr(x₁,x₂) > 0', 'Corr(x₁,x₂) < 0'], [
    ['β₂ > 0', 'Positive bias', 'Negative bias'],
    ['β₂ < 0', 'Negative bias', 'Positive bias'],
  ], { style: 'width: 100%' }),
  doc.figcaption`Summary of Bias in β̃₁ when x₂ is an Omitted Variable`,
);
