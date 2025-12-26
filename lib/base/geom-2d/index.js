/**
 * @import { Vec2 } from './type.ts';
 */
import { vector } from '../math/value.js';
import * as m from '../math/value.js';

/** @param {number} a @param {number} b */
export const v2 = (a, b) => vector(2)(a, b);

/**
 * @param {Vec2[]} vs
 */
export function shoelaceArea(vs) {
  const l = vs.length;
  const crossProducts = vs.map((v, i) => m.vector.cross2d(v, vs[(i+1)%l]))
  return Math.abs(crossProducts.reduce((a, b) => a + b, 0) / 2);
}

/**
 * @typedef {(
 *   | { kind: 'this', min: number, max: number }
 *   | { kind: 'max-safe' }
 *   | { kind: 'calc' }
 * )} Bounds
 *
 * https://en.wikipedia.org/wiki/Sutherland–Hodgman_algorithm
 *
 * @param {{
 *   x?: { floor?: number, ceil?: number },
 *   y?: { floor?: number, ceil?: number },
 * }} clip
 * @param {Vec2[]} points
 * @param {{ x?: Bounds, y?: Bounds } | undefined} bounds
 * @returns {Vec2[]}
 */
export function clip(
  clip,
  points,
  bounds = {},
) {
  let xMin = Number.MIN_SAFE_INTEGER;
  let xMax = Number.MAX_SAFE_INTEGER;
  let yMin = Number.MIN_SAFE_INTEGER;
  let yMax = Number.MAX_SAFE_INTEGER;

  const xBounds = bounds.x ?? { kind: 'max-safe' };
  switch (xBounds.kind) {
    case 'max-safe':
      break;

    case 'this':
      xMin = xBounds.min;
      xMax = xBounds.max;
      break;

    case 'calc':
      xMin = points.reduce((a, b) => Math.min(a, b.vec[0]), Number.MAX_SAFE_INTEGER);
      xMax = points.reduce((a, b) => Math.max(a, b.vec[0]), Number.NEGATIVE_INFINITY);
      break;
  }

  const yBounds = bounds.x ?? { kind: 'max-safe' };
  switch (yBounds.kind) {
    case 'max-safe':
      break;

    case 'this':
      yMin = yBounds.min;
      yMax = yBounds.max;
      break;

    case 'calc':
      yMin = points.reduce((a, b) => Math.min(a, b.vec[1]), Number.MAX_SAFE_INTEGER);
      yMax = points.reduce((a, b) => Math.max(a, b.vec[1]), Number.NEGATIVE_INFINITY);
      break;
  }

  let result = points;

  if (clip.x?.floor != null) {
    const a = v2(clip.x.floor, yMax);
    const b = v2(clip.x.floor, yMin);
    result = clipAgainstLine(result, a, b);
  }

  if (clip.y?.floor != null) {
    const a = v2(xMin, clip.y.floor);
    const b = v2(xMax, clip.y.floor);
    result = clipAgainstLine(result, a, b);
  }

  if (clip.x?.ceil != null) {
    const a = v2(clip.x.ceil, yMin);
    const b = v2(clip.x.ceil, yMax);
    result = clipAgainstLine(result, a, b);
  }

  if (clip.y?.ceil != null) {
    const a = v2(xMin, clip.y.ceil);
    const b = v2(xMax, clip.y.ceil);
    result = clipAgainstLine(result, a, b);
  }

  return result;
}

/**
 * Clip against arbitrary directed line using cross product
 * @param {Vec2[]} points
 * @param {Vec2} lineStart
 * @param {Vec2} lineEnd
 * @returns {Vec2[]}
 */
function clipAgainstLine(points, lineStart, lineEnd) {
  /**
   * @param {Vec2} a - Line start
   * @param {Vec2} b - Line end
   * @param {Vec2} q - Test point
   * @returns {number} > 0 left, < 0 right, = 0 collinear
   */
  function sideTest(a, b, q) {
    return vector.cross2d(m.el.sub(b, a), m.el.sub(q, a));
  }

  /**
   * @param {Vec2} p1
   * @param {Vec2} p2
   * @param {Vec2} p3
   * @param {Vec2} p4
   * @returns {Vec2 | undefined}
   */
  function lineLineIntersection(p1, p2, p3, p4) {
    const d1 = m.el.sub(p2, p1);
    const d2 = m.el.sub(p4, p3);
    const d3 = m.el.sub(p3, p1);

    const denom = vector.cross2d(d1, d2);
    if (Math.abs(denom) < 1e-10) return undefined; // Parallel lines

    const t = vector.cross2d(d3, d2) / denom;

    return v2(
      p1.vec[0] + t * d1.vec[0],
      p1.vec[1] + t * d1.vec[1]
    );
  }

  if (points.length < 3) return points;

  const out = [];

  for (let i = 0; i < points.length; i++) {
    const curr = points[i];
    const next = points[(i + 1) % points.length];

    // Use cross product to determine if points are on "inside" side
    const currInside = sideTest(lineStart, lineEnd, curr) >= 0 ? 1 : 0;
    const nextInside = sideTest(lineStart, lineEnd, next) >= 0 ? 1 : 0;

    if (currInside) {
      out.push(curr);
    }

    if (currInside ^ nextInside) {
      const intersection = lineLineIntersection(curr, next, lineStart, lineEnd);
      if (intersection) out.push(intersection);
    }
  }

  return out;
}


/**
 * @param {Vec2[]} points
 * @param {Vec2} origin
 * @returns {Vec2[]}
 */
export function convexHull(points, origin) {
  return computeConvexHull([
    ...generateProductionCombinations(points),
    origin,
  ]);
}

/**
 * @param {Vec2} v2
 * @returns {[number, number]}
 */
const xy = (v2) =>
  // @ts-ignore - for now
  [v2.vec[0], v2.vec[1]];

/** @param {Vec2} v2 */
const atan2 = v2 =>
  // @ts-ignore - for now
  Math.atan2(v2.vec[1], v2.vec[0]);

/**
 * @param {Vec2[]} points
 * @returns {Vec2[]}
 */
function computeConvexHull(points) {
  const { sub, pow } = m.el;

  if (points.length < 3) return points;
  const start = points.reduce((min, p) => {
    const [px, py] = xy(p);
    const [minx, miny] = xy(min);
    return py < miny || (py === miny && px < minx) ? p : min;
  });

  // Sort by polar angle from start point
  const sorted = points
    .filter(p => p !== start)
    .sort((a, b) => {
      const angleA = atan2(sub(a, start));
      const angleB = atan2(sub(b, start));
      const difference = angleA - angleB;
      if (difference) return difference;

      const [x, y] = xy(sub(pow(sub(a, start), 2), pow(sub(b, start), 2)));
      return x + y;
    });

  // Graham scan
  const hull = [start, sorted[0]];
  for (let i = 1; i < sorted.length; i++) {
    while (
      hull.length > 1 &&
      // @ts-ignore - its fine
      crossProduct(hull.at(-2), hull.at(-1), sorted[i]) <= 0
    ) {
      hull.pop();
    }
    hull.push(sorted[i]);
  }

  return hull;
}

/**
 * @param {Vec2[]} points
 * @returns {Iterable<Vec2>}
 */
function* generateProductionCombinations(points) {
  /**
   * @param {number} i
   * @param {number} a
   * @param {number} b
   * @returns {Iterable<Vec2>}
   */
  function* generateCombos(i, a, b) {
    if (i === points.length) {
      yield vector(2)(a, b);
      return;
    }

    const [nextA, nextB] = xy(points[i]);
    yield* generateCombos(i + 1, a + nextA, b);     // Agent does A
    yield* generateCombos(i + 1, a, b + nextB);     // Agent does B
  };

  yield * generateCombos(0, 0, 0)
}

/**
 * @param {Vec2} a
 * @param {Vec2} b
 * @param {Vec2} c
 * @returns {number}
 */
function crossProduct(a, b, c) {
  const [ax, ay] = xy(a);
  const [bx, by] = xy(b);
  const [cx, cy] = xy(c);
  return (bx - ax) * (cy - ay) - (by - ay) * (cx - ax);
}
