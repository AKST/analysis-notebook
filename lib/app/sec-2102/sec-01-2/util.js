/**
 * @import { Vec2, MakeConfigKnobs } from '../../prelude-type.ts';
 * @import { Config, State, Event } from './type.ts';
 */
import { Unreachable, v2, math } from '../../prelude.js';

/**
 * @returns {MakeConfigKnobs<Config>}
 */
export function getConfig() {
  return {
    exogenous: {
      kind: 'group',
      label: 'Exogenous',
      of: {
        alpha: (2/3),
        technology: 2,
        labour: 10000,
        capitalInit: 1000,
        investmentFactor: 0.25,
        depreciationRate: 0.02,
      },
      group: {
        alpha: {
          kind: 'number',
          label: '𝛼',
          range: [0, 1],
        },
        investmentFactor: {
          kind: 'number',
          label: 's̄',
          range: [0, 1],
        },
        depreciationRate: {
          kind: 'number',
          label: 'd̄',
          range: [0, 1],
        },
        technology: {
          kind: 'number',
          label: 'A',
          range: [1, 1000],
        },
        labour: {
          kind: 'number',
          label: 'L',
          range: [1, 5000000],
        },
        capitalInit: {
          kind: 'number',
          label: 'K₀',
          range: [1000, 50000],
        },
      },
    },
    dynamics: {
      kind: 'group',
      label: 'Dynamics',
      of: { periodMs: 1000, discrete: false },
      group: {
        periodMs: {
          kind: 'number',
          label: 'Milliseconds Per Period',
          range: [100, 1000],
        },
        discrete: {
          kind: 'boolean',
          label: 'Discrete Dynamics',
        }
      },
    },
  }
}

/**
 * @param {State} state
 * @param {Event} event
 * @returns {State}
 */
export function onUpdate(state, event) {
  switch (event.kind) {
    case 'init':
      return {
        ...state,
        ...calibrateDynamics({ kind: 'restart' }, event.config),
      };

    case 'config': switch (event.source.join(':')) {
      case 'exogenous:capitalInit':
        return {
          ...state,
          ...calibrateDynamics({ kind: 'restart' }, event.config),
        };

      case 'dynamics:periodMs': {
        const now = performance.now();
        return updatePeriod(state, event.config, now);
      }

      default:
        return {
          ...state,
          ...calibrateDynamics({ kind: 'update', state }, event.config),
        };
    }

    default:
      return state;
  }
}

/**
 * @param {Config} config
 * @returns {State}
 */
export function createState(config) {
  return onUpdate(
    // @ts-ignore - doesn't matter
    {},
    { kind: 'init', config },
  );
}

/**
 * @param {(
 *   | { kind: 'restart' }
 *   | { kind: 'update', state: State }
 * )} variant
 * @param {Config} config
 * @returns {Pick<State, 'capitalDynamics'>}
 */
function calibrateDynamics(variant, config) {
  const now = performance.now();
  const steadyState = steadState(config);
  const fauxState = { capitalDynamics: { steadyState } };

  let k0, startTime;
  switch (variant.kind) {
    case 'restart':
      k0 = config.exogenous.capitalInit;
      startTime  = now;
      break;

    case 'update': {
      const { state: { capitalDynamics } } = variant;
      startTime = capitalDynamics.start.time;
      k0 = solveAtT(startTime, fauxState, config);
      break;
    }

    default:
      throw new Unreachable(variant);
  }

  const k99 = k0 + (steadyState - k0) * 0.999;
  const periods = timeTillK(k0, config, fauxState, k99)
  const trajectory = Array.from({ length: Math.ceil(periods) }, (_, t) => (
    v2(t, solveAtT(t, fauxState, config))
  ));
  const { bounds, translate } = getCamera(trajectory);
  return {
    capitalDynamics: {
      state: config.exogenous.capitalInit,
      steadyState,
      start: {
        time: startTime,
        capital: k0,
      },
      chart: {
        period: config.dynamics.periodMs,
        bounds,
        translate,
        trajectory: trajectory.map(p => (
          math.el.div(math.el.sub(p, translate), bounds)
        )),
      },
    },
  };
}

/**
 * @param {Pick<State, 'capitalDynamics'>} state
 * @param {Config} config
 * @param {number} now
 * @returns {Pick<State, 'capitalDynamics'>}
 */
function updatePeriod(state, config, now) {
  const { start, chart } = state.capitalDynamics;
  const oldPeriod = chart.period;
  const oldTime = start.time;
  const t = (now - oldTime) / oldPeriod;

  const newPeriod = config.dynamics.periodMs;
  const newTime = now - (t * newPeriod);
  return {
    ...state,
    capitalDynamics: {
      ...state.capitalDynamics,
      start: { ...start, time: newTime },
      chart: { ...chart, period: newPeriod },
    },
  };
}

/**
 * @param {readonly Vec2[]} vectors
 * @returns {{ dst: Vec2, translate: Vec2, bounds: Vec2 }}
 */
export function getCamera(vectors) {
  const first = vectors[0];
  const last = vectors[vectors.length-1];

  let min, max;
  if (first.vec[1] < last.vec[1]) {
    min = first, max = last;
  } else {
    min = last, max = first;
  }

  const dst = v2(last.vec[0], max.vec[1] - min.vec[1]);
  const bounds = math.el.mul(dst, v2(1.1, 1.1));
  const translate = v2(0, min.vec[1]);
  return { dst, translate, bounds };
}

/**
 * @param {Config} config
 * @returns {number}
 */
export function steadState(config) {
  const {
    alpha, labour, technology,
    investmentFactor, depreciationRate: d,
  } = config.exogenous;

  const sALExpAlpha = investmentFactor * technology * (labour ** alpha);
  return (sALExpAlpha / d) ** (1 / (2 - alpha));
}

/**
 * @param {number} k0
 * @param {Config} config
 * @param {{ capitalDynamics: Pick<State['capitalDynamics'], 'steadyState'> }} state
 * @param {number} k
 * @returns {number}
 */
export function timeTillK(k0, config, state, k) {
  const { alpha, depreciationRate: d } = config.exogenous;
  const { capitalDynamics: { steadyState: kSS } } = state;
  const m = 2 - alpha;

  const kSSm = kSS ** m;
  const k0m  = k0  ** m;
  const km   = k   ** m;

  const num = Math.abs(kSSm - k0m);
  const den = Math.abs(kSSm - km);
  if (den === 0) return Infinity;

  return (1 / (m * d)) * Math.log(num / den);
}

/**
 * @param {number} t
 * @param {{ capitalDynamics: Pick<State['capitalDynamics'], 'steadyState'> }} state
 * @param {Pick<Config, 'exogenous'>} config
 * @returns {number}
 */
export function solveAtT(t, state, config) {
  const { capitalDynamics: { steadyState: kSS } } = state;
  const { alpha, capitalInit: k0, depreciationRate: d } = config.exogenous;

  const m = 2 - alpha;
  const eMDT = Math.exp(-m * d * t);
  const kSSm = kSS ** m;
  const k0m  = k0  ** m;

  // K(t) = [K*ᴹ - (K*ᴹ - K₀ᴹ)e^(-m*d*t)]^(1/m)
  return Math.pow(kSSm - (kSSm - k0m) * eMDT, 1/m);
}
