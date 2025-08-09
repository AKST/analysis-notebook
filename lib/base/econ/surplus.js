/**
 * @import { Curve, Model } from './type.ts';
 * @import { Vec2 } from '../geom_2d/type.ts';
 */
import * as math from '../math/index.js';
import { v2, clip, shoelaceArea } from '../geom_2d/index.js';
import { Unreachable } from '../../util/type.js';

/**
 * @param {Model.Desc.Alloc} alloc
 * @returns {number}
 */
export const maxAllocUnits = alloc => alloc.kind === 'mono-alloc'
  ? alloc.value.quantity
  : alloc.world.quantity;

/**
 * @param {number} q0
 * @param {number} p0
 * @param {number} qn
 * @param {number} pn
 * @returns {Model.Geom.Space}
 */
export function rect(q0, p0, qn, pn) {
  if ((qn * pn) === 0) return { size: 0, geom: [] };

  return {
    size: qn * pn,
    geom: [
      v2(q0, p0),
      v2(q0+qn, p0),
      v2(q0+qn, p0-pn),
      v2(q0, p0-pn),
    ],
  };
}

/**
 * @param {(
 *   | { shear: 'horizontal', y1: Vec2, y2: Vec2, units: number }
 *   | { shear: 'vertical', x1: Vec2, x2: Vec2, price: number }
 * )} shearInfo
 * @returns {Model.Geom.Space}
 */
export function parallelogram(shearInfo) {
  switch (shearInfo.shear) {
    case 'horizontal': {
      const { y1, y2, units } = shearInfo;
      const size = (y1.vec[1] - y2.vec[1]) * units;
      if (size === 0) return { size: 0, geom: [] };

      return {
        size,
        geom: [
          y1,
          math.el.add(y1, v2(units, 0)),
          math.el.add(y2, v2(units, 0)),
          y2,
        ],
      };
    }

    case 'vertical': {
      const { x1, x2, price } = shearInfo;
      const size = (x1.vec[1] - x2.vec[1]) * price;
      if (size === 0) return { size: 0, geom: [] };

      return {
        size,
        geom: [
          x1,
          math.el.add(x1, v2(0, price)),
          math.el.add(x2, v2(0, price)),
          x2,
        ],
      };
    }

    default:
      throw new Unreachable(shearInfo);
  }
}

/**
 * @param {Model.Desc.Alloc} alloc
 * @param {Vec2[]} belowCurve
 * @returns {Model.Geom.Space}
 */
export function shape(alloc, belowCurve) {
  const aboveCurve = []

  switch (alloc.kind) {
    case 'mono-alloc':
      aboveCurve.push(v2(alloc.value.quantity, alloc.value.effectivePrice));
      aboveCurve.push(v2(0, alloc.value.effectivePrice));
      break;

    case 'dual-alloc':
      aboveCurve.push(v2(alloc.world.quantity, alloc.world.effectivePrice));
      aboveCurve.push(v2(alloc.local.quantity, alloc.world.effectivePrice));
      aboveCurve.push(v2(alloc.local.quantity, alloc.local.effectivePrice));
      aboveCurve.push(v2(0, alloc.local.effectivePrice));
      break;

    default:
      throw new Unreachable(alloc);
  }

  const config = { x: { ceil: maxAllocUnits(alloc) } }
  const geom = clip(config, aboveCurve.concat(belowCurve));
  const size = shoelaceArea(geom);
  return size === 0 ? ({ size, geom: [] }) : ({ size, geom });
}
