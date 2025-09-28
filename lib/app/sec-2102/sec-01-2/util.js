/**
 * @import { Vec2, MakeConfigKnobs } from '../../prelude-type.ts';
 * @import { Config, State, Event } from './type.ts';
 */
import { v2, math } from '../../prelude.js';

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
      of: { periodMs: 1000 },
      group: {
        periodMs: {
          kind: 'number',
          label: 'Milliseconds Per Period',
          range: [100, 1000],
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
        ...restartDynamics(event.config),
      };

    case 'config': switch (event.source.join(':')) {
      //case 'exogenous:capitalInit': {
      default: {
        return {
          ...state,
          ...restartDynamics(event.config),
        };
      }

      //default:
      //  return state;
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
  return onUpdate({
    dynamics: {
      start: 0,
      state: 0,
    },
  }, {
    kind: 'init',
    config,
  });
}

/**
 * @param {Config} config
 * @returns {Pick<State, 'chart' | 'capitalDynamics'>}
 */
function restartDynamics(config) {
  const start = performance.now();
  const { capitalInit: k0 } = config.exogenous;
  const steadyState = steadState(config);
  const fauxState = { capitalDynamics: { steadyState } };
  const k99 = k0 + (steadyState - k0) * 0.999;
  const periods = timeTillK(config, fauxState, k99)
  const trajectory = Array.from({ length: Math.ceil(periods) }, (_, t) => (
    v2(t, solveAtT(t, fauxState, config))
  ));
  const { bounds, translate } = getCamera(trajectory);
  return {
    capitalDynamics: {
      start,
      state: config.exogenous.capitalInit,
      steadyState,
    },
    chart: {
      bounds,
      translate,
      trajectory: trajectory.map(p => (
        math.el.div(math.el.sub(p, translate), bounds)
      )),
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
 * @param {Config} config
 * @param {{ capitalDynamics: Pick<State['capitalDynamics'], 'steadyState'> }} state
 * @param {number} k
 * @returns {number}
 */
export function timeTillK(config, state, k) {
  const { alpha, capitalInit: k0, depreciationRate: d } = config.exogenous;
  const { capitalDynamics: { steadyState: kSS } } = state;
  const m = 2 - alpha;
  return (1/(m*d)) * Math.log((kSS**m - k0**m) / (kSS**m - k**m))
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
