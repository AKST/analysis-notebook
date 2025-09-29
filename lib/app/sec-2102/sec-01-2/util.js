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
        technology: 50,
        labour: 10000,
        capitalInit: 1000,
        investmentFactor: 0.4,
        depreciationRate: 0.07,
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

  let trajectoryInit;
  let k0, timeAnimation, currentT;
  switch (variant.kind) {
    case 'restart':
      trajectoryInit = undefined;
      k0 = config.exogenous.capitalInit;
      timeAnimation = now;
      currentT = 0;
      break;

    case 'update': {
      const {
        start, steadyState,
        trajectory, chart, exogenous,
      } = variant.state.capitalDynamics
      const fauxState = { capitalDynamics: { steadyState } };

      trajectoryInit = trajectory;
      timeAnimation = start.timeAnimation;
      currentT = (now - start.timeAnimation) / chart.period;

      const t = (now - start.timeTrajectory) / chart.period;
      k0 = solveAtT(t, start.capital, fauxState, exogenous);
      break;
    }

    default:
      throw new Unreachable(variant);
  }

  const steadyState = steadState(config);
  const fauxState = { capitalDynamics: { steadyState } };
  const k99 = k0 + (steadyState - k0) * 0.999;
  const periods = timeTillK(k0, config, fauxState, k99)
  const trajectory = Array.from({ length: Math.ceil(periods) }, (_, t) => (
    v2(currentT + t, solveAtT(t, k0, fauxState, config.exogenous))
  ));
  const { dst, bounds, translate } = getCamera(
    trajectoryInit != null
      ? trajectory.concat(trajectoryInit)
      : trajectory
  );
  return {
    capitalDynamics: {
      steadyState,
      exogenous: { ...config.exogenous },
      trajectory: trajectoryInit ?? trajectory,
      start: {
        timeAnimation,
        timeTrajectory: now,
        capital: k0,
      },
      chart: {
        period: config.dynamics.periodMs,
        dst,
        bounds,
        translate,
        trajectoryInit: trajectoryInit?.map(p => (
          math.el.div(math.el.sub(p, translate), bounds)
        )),
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
  const oldTimeA = start.timeAnimation;
  const oldTimeT = start.timeTrajectory;
  const tA = (now - oldTimeA) / oldPeriod;
  const tT = (now - oldTimeT) / oldPeriod;

  const newPeriod = config.dynamics.periodMs;
  const newTimeA = now - (tA * newPeriod);
  const newTimeT = now - (tT * newPeriod);
  return {
    ...state,
    capitalDynamics: {
      ...state.capitalDynamics,
      start: {
        ...start,
        timeAnimation: newTimeA,
        timeTrajectory: newTimeT,
      },
      chart: { ...chart, period: newPeriod },
    },
  };
}

/**
 * @param {readonly Vec2[]} vectors
 * @returns {{ dst: Vec2, translate: Vec2, bounds: Vec2 }}
 */
export function getCamera(vectors) {
  let min = vectors[0], max = vectors[1], last = vectors[0];
  for (const item of vectors) {
    if (min.vec[1] > item.vec[1]) min = item;
    if (max.vec[1] < item.vec[1]) max = item;
    if (last.vec[0] < item.vec[0]) last = item;
  }

  const xMax = last.vec[0], yMax = max.vec[1];
  const yRng = max.vec[1] - min.vec[1];
  const dst = v2(xMax, yMax);
  const bounds = math.el.mul(v2(xMax, yRng), v2(1.1, 1.1));
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
 * @param {number} k0
 * @param {{ capitalDynamics: Pick<State['capitalDynamics'], 'steadyState'> }} state
 * @param {Config['exogenous']} exogenous
 * @returns {number}
 */
export function solveAtT(t, k0, state, exogenous) {
  const { capitalDynamics: { steadyState: kSS } } = state;
  const { alpha, depreciationRate: d } = exogenous;

  const m = 2 - alpha;
  const eMDT = Math.exp(-m * d * t);
  const kSSm = kSS ** m;
  const k0m  = k0  ** m;

  // K(t) = [K*ᴹ - (K*ᴹ - K₀ᴹ)e^(-m*d*t)]^(1/m)
  return Math.pow(kSSm - (kSSm - k0m) * eMDT, 1/m);
}
