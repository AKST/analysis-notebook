/**
 * @import { Vec2, MakeConfigKnobs } from '../../prelude-type.ts';
 * @import { CameraMap, CameraTransform, TrajectoryMap, Config, State, Event } from './type.ts';
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
      of: { periodMs: 1000 },
      group: {
        periodMs: {
          kind: 'number',
          label: 'Milliseconds Per Period',
          range: [100, 1000],
        },
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
  const now = performance.now();
  switch (event.kind) {
    case 'init':
      return {
        ...state,
        ...calibrateDynamics({ kind: 'restart' }, event.config, now),
      };

    case 'config': switch (event.source.join(':')) {
      case 'exogenous:capitalInit':
        return {
          ...state,
          ...calibrateDynamics({ kind: 'restart' }, event.config, now),
        };

      case 'dynamics:periodMs':
        return updatePeriod(state, event.config, now);

      default:
        return {
          ...state,
          ...calibrateDynamics({ kind: 'update', state }, event.config, now),
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
 * @param {number} now
 * @returns {Pick<State, 'solowSwan'>}
 */
function calibrateDynamics(variant, config, now) {
  let trajectoryInit;
  let capitalZero, timeAnimation, currentT;
  switch (variant.kind) {
    case 'restart':
      trajectoryInit = undefined;
      capitalZero = config.exogenous.capitalInit;
      timeAnimation = now;
      currentT = 0;
      break;

    case 'update': {
      const { time, model, trajectory } = variant.state.solowSwan;
      trajectoryInit = trajectory;
      timeAnimation = time.start;
      currentT = (now - time.start) / time.period;
      capitalZero = solveCapitalAtT(model, (now - time.branch) / time.period);
      break;
    }

    default:
      throw new Unreachable(variant);
  }

  const steadyState = steadState(config);
  const model = { capitalZero, steadyState, inputs: { ...config.exogenous } };
  const periods = timeTillK(model, capitalZero + (steadyState - capitalZero) * 0.999)

  /** @type {TrajectoryMap} */
  const trajectory = {
    capital: Array.from({ length: Math.ceil(periods) }, (_, t) => (
      v2(currentT + t, solveCapitalAtT(model, t))
    )),
    output: Array.from({ length: Math.ceil(periods) }, (_, t) => (
      v2(currentT + t, solveOutputAtT(model, t))
    )),
  };

  const camera = getCamera(trajectory, trajectoryInit);

  return {
    solowSwan: {
      trajectory: trajectoryInit ?? trajectory,
      model,
      time: {
        start: timeAnimation,
        branch: now,
        period: config.dynamics.periodMs,
      },
      chart: {
        camera,
        prerenderedTrajectory: {
          current: projectMap(trajectory, camera),
          initial: trajectoryInit && (
            projectMap(trajectoryInit, camera)
          ),
        },
      },
    },
  };
}

/**
 * @param {Pick<State, 'solowSwan'>} state
 * @param {Config} config
 * @param {number} now
 * @returns {Pick<State, 'solowSwan'>}
 */
function updatePeriod(state, config, now) {
  const { time } = state.solowSwan;
  const oldPeriod = time.period;
  const oldTimeA = time.start;
  const oldTimeT = time.branch;
  const tA = (now - oldTimeA) / oldPeriod;
  const tT = (now - oldTimeT) / oldPeriod;

  const newPeriod = config.dynamics.periodMs;
  const newTimeA = now - (tA * newPeriod);
  const newTimeT = now - (tT * newPeriod);
  return {
    ...state,
    solowSwan: {
      ...state.solowSwan,
      time: {
        branch: newTimeT,
        period: newPeriod,
        start: newTimeA,
      },
    },
  };
}

/**
 * @param {TrajectoryMap} map
 * @param {CameraMap} cameraMap
 * @returns {TrajectoryMap}
 */
function projectMap(map, cameraMap) {
  /** @param {CameraTransform} camera */
  function projectPoint({ translate, bounds }) {
    /** @param {Vec2} p */
    return p => math.el.div(math.el.sub(p, translate), bounds)
  }

  return {
    capital: map.capital.map(projectPoint(cameraMap.capital)),
    output: map.output.map(projectPoint(cameraMap.output)),
  };
}

/**
 * @param {TrajectoryMap} map
 * @param {TrajectoryMap | undefined} mmap
 */
function * trajectoryMapToVectors(map, mmap) {
  yield * map.capital;
  yield * map.output;

  if (mmap) {
    yield * mmap.capital;
    yield * mmap.output;
  }
}

/**
 * @param {TrajectoryMap} map
 * @param {TrajectoryMap | undefined} mmap
 * @returns {CameraMap}
 */
export function getCamera(map, mmap) {
  /** @param {Vec2[]} vectors @returns {CameraTransform} */
  function getCameraForVectors(vectors) {
    let min = vectors[0],
        max = vectors[1],
        last = vectors[0];

    for (const item of vectors) {
      if (min.vec[1] > item.vec[1]) min = item;
      if (max.vec[1] < item.vec[1]) max = item;
      if (last.vec[0] < item.vec[0]) last = item;
    }

    const xMax = last.vec[0], yMax = max.vec[1];
    const yRng = max.vec[1] - min.vec[1];
    const dest = v2(xMax, yMax);
    const bounds = math.el.mul(v2(xMax, yRng), v2(1.15, 1.05));
    const translate = v2(0, min.vec[1]);
    return { dest, translate, bounds };
  }

  const allVectors = Array.from(trajectoryMapToVectors(map, mmap));
  const capital = map.capital.concat(mmap?.capital ?? []);
  const output = map.output.concat(mmap?.output ?? []);

  return {
    capital: getCameraForVectors(capital),
    output: getCameraForVectors(output),
    allAgg: getCameraForVectors(allVectors),
  }
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
 * @param {State['solowSwan']['model']} model
 * @param {number} k
 * @returns {number}
 */
export function timeTillK(model, k ) {
  const { alpha, depreciationRate: d } = model.inputs;
  const m = 2 - alpha;

  const kSSm = model.steadyState ** m;
  const k0m  = model.capitalZero ** m;
  const km   = k ** m;

  const num = Math.abs(kSSm - k0m);
  const den = Math.abs(kSSm - km);
  if (den === 0) return Infinity;

  return (1 / (m * d)) * Math.log(num / den);
}

/**
 * @param {State['solowSwan']['model']} model
 * @param {number} t
 * @returns {number}
 */
export function solveCapitalAtT(model, t) {
  const { alpha, depreciationRate: d } = model.inputs;

  const m = 2 - alpha;
  const eMDT = Math.exp(-m * d * t);
  const kSSm = model.steadyState ** m;
  const k0m = model.capitalZero ** m;

  // K(t) = [K*ᴹ - (K*ᴹ - K₀ᴹ)e^(-m*d*t)]^(1/m)
  return Math.pow(kSSm - (kSSm - k0m) * eMDT, 1/m);
}

/**
 * @param {State['solowSwan']['model']} model
 * @param {number} t
 * @returns {number}
 */
export function solveOutputAtT(model, t) {
  const { technology, labour, alpha } = model.inputs;
  const K = solveCapitalAtT(model, t);
  return technology * (labour ** alpha) * (K ** (1 - alpha));
}
