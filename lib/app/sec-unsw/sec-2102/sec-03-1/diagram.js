import { svg, rect } from '@base/dom_app/helper/svg.js'

const histogramBins = [
  0.03125, 0.0625, 0.09375, 0.15625, 0.21875, 0.84375, 0.5, 0.71875, 0.875, 0.96875,
  1.0, 0.9375, 0.84375, 0.6875, 0.5625, 0.4375, 0.34375, 0.28125, 0.21875, 0.16875,
  0.1375, 0.10625, 0.08125, 0.0625, 0.04375, 0.03125, 0.01875, 0.0125
];

export const wageRigidity = svg.attr({
  viewBox: '0 0 400 130',
  width: '100%'
}).of(...histogramBins.map((value, i, data) => {
  const gapPercent = 0.2; // 20% of each bar's space is gap
  const barWidth = (100 / data.length) * (1 - gapPercent);
  const totalWidth = 100 / data.length;
  const x = `${(i / data.length) * 100 + (totalWidth * gapPercent / 2)}%`;
  const height = `${value * 100}%`;
  const y = `${100 - value * 100}%`;
  const color = `color-mix(in srgb, #ff3366 ${value * 100}%, cyan ${(1 - value) * 100}%)`;

  return rect({ x, y, width: `${barWidth}%`, height, fill: color });
}));
