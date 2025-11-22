/**
 * @import { MakeConfigKnobs, Vec2 } from '@app/prelude-type.ts';
 * @import { ComparisonChart2d, Chart2d, Config, State, Event } from './type.ts';
 */
import { v2 } from '@app/prelude.js';

/**
 * @returns {MakeConfigKnobs<Config>}
 */
export function getConfig() {
  return {
    production: {
      kind: 'group',
      label: "Production",
      of: {
        technology: 30,
        capital: 50000,
        labour: 40000,
        alpha: (2/3),
      },
      group: {
        technology: { kind: 'number', range: [0, 100], label: 'Technology (A)' },
        capital: { kind: 'number', range: [0, 10**6], label: 'Capital (K)' },
        labour: { kind: 'number', range: [0, 10**6], label: 'Labour (L)' },
        alpha: { kind: 'number', range: [0, 1], label: 'Alpha (𝛼)' },
      },
    },
    ces: {
      kind: 'group',
      label: "CES",
      of: {
        rho: -10,
        xi: 1,
      },
      group: {
        rho: { kind: 'number', range: [-12, 1], label: 'Rho (𝜌)' },
        xi: { kind: 'number', range: [-1, 10], label: 'Xi (𝜉)' },
      },
    },
  }
}

/**
 * @param {Config} config
 * @returns {State}
 */
export function createState(config,) {
  return onUpdate({
    aggregate: {
      output: 0,
      realWage: 0,
      realRentOfCapital: 0,
    },
    charts: {},
  }, { kind: 'config', config });
}

/**
 * @param {State} state
 * @param {Event} event
 * @returns {State}
 */
export function onUpdate(state, event) {
  switch (event.kind) {
    case 'config': {
      const { production: p } = event.config;
      const cfg = { min: 0, max: 10000, step: 10, tick: v2(500, 50000) };
      const cfgMp = { min: 1, tick: v2(10000, 10) };
      const output = p.technology * p.capital ** (1 - p.alpha) * p.labour ** p.alpha
      const realWage = p.alpha * (output / p.labour);
      const realRentOfCapital = (1-p.alpha) * (output / p.capital);

      const yBoundMax = Math.max(realRentOfCapital, realWage) * 5;

      const marginalProductOfLabor = createChart({
        ...cfgMp,
        yBoundMax,
        step: p.labour / 100,
        max: p.labour * 1.5
      }, l => {
        const y = p.technology * p.capital ** (1 - p.alpha) * l ** p.alpha;
        const mpl = p.alpha * y * (1/l);
        return v2(l, mpl);
      });

      const marginalProductOfCapital = createChart({
        ...cfgMp,
        yBoundMax,
        step: p.capital / 100,
        max: p.capital * 1.25
      }, k => {
        const y = p.technology * k ** (1 - p.alpha) * p.labour ** p.alpha;
        const mpk = (1 - p.alpha) * y * (1/k);
        return v2(k, mpk);
      });

      return {
        ...state,
        aggregate: {
          output,
          realWage,
          realRentOfCapital,
        },
        charts: {
          marginalProductOfLabor,
          marginalProductOfCapital,
          productivityOverLabour: createChart(cfg, l => {
            return v2(l, p.technology * p.capital ** (1 - p.alpha) * l ** p.alpha);
          }),
          productivityOverCapital: createChart(cfg, k => {
            return v2(k, p.technology * k ** (1 - p.alpha) * p.labour ** p.alpha);
          }),
          equilibriumLabour: {
            ...marginalProductOfLabor,
            eq: v2(p.labour, realWage),
          },
          equilibriumCapital: {
            ...marginalProductOfCapital,
            eq: v2(p.capital, realRentOfCapital),
          },
          usaVsChina: createComparisonChart({
            min: 0.1,
            step: 0.1,
            max: 4,
            tick: v2(1, 0.2),
          }, {
            USA: {
              colour: 0x0000ff,
              f: k => v2(k, 1 * (k ** (1 - p.alpha))),
            },
            China: {
              colour: 0xff0000,
              f: k => v2(k, 0.327 * (k ** (1 - p.alpha))),
            },
          }),
        },
      };
    }

    default:
      return state;
  }
}

/**
 * @param {{
 *   min: number,
 *   max: number,
 *   step: number,
 *   tick: number | Vec2,
 *   yBoundMax?: number,
 * }} cfg
 * @param {(v: number) => Vec2} f
 * @returns {Chart2d}
 */
export function createChart({
  min, max, step, tick,
  yBoundMax = Infinity,
}, f) {
  const range = (max - min) / step;
  const series = Array.from({ length: range }, (_, i) => i * step + min);
  const points = series.map(f);
  const yBound = Math.min(yBoundMax, Math.max(...points.map(p => p.vec[1])));
  return {
    bounds: v2(max, yBound),
    points,
    tick,
  };
}

/**
 * @param {{
 *   min: number,
 *   max: number,
 *   step: number,
 *   tick: number | Vec2,
 * }} cfg
 * @param {Record<string, { colour: number, f: (v: number) => Vec2 }>} plots
 * @returns {ComparisonChart2d}
 */
export function createComparisonChart({
  min, max, step, tick,
}, plots) {
  const range = (max - min) / step;
  const series = Array.from({ length: range }, (_, i) => i * step + min);
  let maxY = -Infinity;

  /** @type {any} */
  const points = {};
  for (const [k, { f, colour }] of Object.entries(plots)) {
    const subPoints = series.map(f);
    maxY = Math.max(maxY, ...subPoints.map(p => p.vec[1]));
    points[k] = { points: subPoints, colour };
  }

  return {
    bounds: v2(max, maxY),
    points,
    tick,
  };
}
