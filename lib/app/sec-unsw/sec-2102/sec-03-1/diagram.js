import { doc, svg } from '@app/prelude.js';
import { text } from '@prelude-uni/components.js';

const { figure } = text;

const GAP_PERCENT = 0.2;
const histogramBins = [
  0.03125, 0.06250, 0.09375, 0.15625, 0.21875, 0.84375, 0.50000, 0.71875,
  0.87500, 0.96875, 1.00000, 0.93750, 0.84375, 0.68750, 0.56250, 0.43750,
  0.34375, 0.28125, 0.21875, 0.16875, 0.13750, 0.10625, 0.08125, 0.06250,
  0.04375, 0.03125, 0.01875, 0.01250
];

export const wageRigidity = figure({
  style: 'margin-inline: 16px',
}).c(
  svg.svg({
    viewBox: '0 0 400 120',
    width: '100%'
  }).c(...histogramBins.map((value, i, data) => {
    const totalWidth = 100 / data.length;

    return svg.rect({
      y: `${100 - value * 100}%`,
      x: `${(i / data.length) * 100 + (totalWidth * GAP_PERCENT / 2)}%`,
      width: `${totalWidth * (1 - GAP_PERCENT)}%`,
      height: `${value * 100}%`,
      fill: `color-mix(in srgb, #ff3366 ${value * 100}%, cyan ${(1 - value) * 100}%)`,
    });
  })),
  doc.figcaption`Wage Rigidity Example`,
);
