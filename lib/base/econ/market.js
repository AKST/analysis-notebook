/**
 * @import { VectorOf } from '../math/type.ts';
 * @import { Vec2 } from '../geom_2d/type.ts';
 * @import {
 *   CurveParams,
 *   CurveStatus,
 *   ModelState,
 *   ModelOutput,
 *   ModelPartipantOutput,
 *   Space,
 * } from './type.ts';
 *
 * @typedef {{
 *   market: Vec2,
 *   quantity: number,
 *   supplyPrice: number,
 *   demandPrice: number,
 * }} PolicyAllocation
 */
import { vector } from '../math/value.js';
import { v2, clip, shoelaceArea } from '../geom_2d/index.js';
import { calcP, calcQ } from './curve.js';
import { solve } from './solver.js';

/**
 * @param {ModelState} model
 * @returns {ModelOutput<'snapshot'> | undefined}
 */
export function getMarketSnapshot(model) {
  const status = solve(model);
  if (status == null) return undefined;

  return {
    consumer: partipantSnapshot(model, model.market.demand, status.demand),
    producer: partipantSnapshot(model, model.market.supply, status.supply),
  };
}

/**
 * @param {ModelState} model
 * @param {CurveParams} curve
 * @param {CurveStatus} status,
 * @returns {ModelPartipantOutput<'snapshot'>}
 */
export function partipantSnapshot(model, curve, status) {
  /** @type {Vec2[]} */
  const geom = [v2(0, status.effectivePrice)];

  if (curve.i < 0) {
    geom.push(v2(0, 0));
    geom.push(v2(calcQ(0, curve), 0));
  } else {
    geom.push(v2(0, curve.i));
  }

  geom.push(v2(status.quantity, status.reservePrice));
  if (status.reservePrice != status.effectivePrice) {
    geom.push(v2(status.quantity, status.effectivePrice));
  }

  return {
    line: getLine(model, curve),
    alloc: v2(status.quantity, status.reservePrice),
    surplus: space(geom),
  };
}

/**
 * @param {ModelState} model
 * @param {CurveParams} curve
 * @returns {ModelPartipantOutput<'snapshot'>['line']}
 */
function getLine(model, curve) {
  const { market: { demand } } = model;
  const source = vector(2)(0, curve.i);

  let destination;
  if (curve.kind === 'supply') {
    const p = Math.max(demand.i, calcP(calcQ(0, demand), curve));
    destination = v2(calcQ(p, curve), p);
  } else {
    destination = v2(calcQ(0, curve), 0);
  }

  return { src: source, dst: destination };
}


/**
 * @param {VectorOf<'r', 2>[]} geom
 * @returns {Space}
 */
function space(geom) {
  const geomClip = clip({ y: { floor: 0 }, x: { floor: 0 } }, geom);
  return { geom: geomClip, size: shoelaceArea(geomClip) };
}
