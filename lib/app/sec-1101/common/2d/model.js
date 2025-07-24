/**
 * @import {
 *   Econ,
 *   Renderer,
 *   Vec2,
 *   RenderContextInit as Init,
 * } from '../../../prelude-type.ts';
 *
 * @typedef {{
 *   readonly line: number,
 *   readonly area: number,
 * }} CurveStyle
 *
 * @typedef {{
 *   readonly fontSize: number,
 *   readonly demand: CurveStyle,
 *   readonly supply: CurveStyle,
 * }} ModelStyle
 */
import {
  v2,
  math,
  TextRenderer,
  Grid,
  PolygonRenderer,
  LineRenderer,
} from '../../../prelude.js';

/**
 * @param {Init & { style?: Partial<ModelStyle> }} cfg
 */
export function createModelRenderer({ renderer, viewport, style }) {
  const grid = new Grid(renderer, viewport);
  const text = new TextRenderer(renderer, viewport);
  const line = new LineRenderer(renderer, viewport);
  const poly = new PolygonRenderer(renderer, viewport);
  return new ModelRenderer(
    renderer,
    poly,
    line,
    text,
    grid,
    style,
  );
}

export class ModelRenderer {
  /** @type {Renderer} */ #renderer;
  /** @type {PolygonRenderer} */ #poly;
  /** @type {LineRenderer} */ #line;
  /** @type {TextRenderer} */ #text;
  /** @type {Grid} */ #grid;
  /** @type {ModelStyle} */ style

  /**
   * @param {Renderer} renderer
   * @param {PolygonRenderer} poly
   * @param {LineRenderer} line
   * @param {TextRenderer} text
   * @param {Grid} grid
   * @param {Partial<ModelStyle>} [style]
   */
  constructor(
    renderer,
    poly,
    line,
    text,
    grid,
    style = {},
  ) {
    this.#renderer = renderer
    this.#poly = poly;
    this.#line = line;
    this.#text = text;
    this.#grid = grid;
    this.style = {
      fontSize: 10,
      demand: { line: 0x66ff00, area: 0x669933 },
      supply: { line: 0x0066ff, area: 0x336699 },
      ...style,
    };
  }

  /**
   * @param {Econ.ModelState} inputs
   * @param {Econ.ModelSnapshot} snapshot
   * @param {Vec2} bounds
   */
  plotWithInputs(inputs, snapshot, bounds) {
    this.plotGrid(bounds);
    this.plotCurveLines(snapshot, bounds);
    this.plotSurplus(snapshot, bounds);
    this.plotEquilibrium(snapshot, bounds);
    this.plotPolicy(snapshot, inputs.policy, bounds);
  }

  /**
   * @param {Econ.ModelSnapshot} snapshot
   * @param {Vec2} bounds
   */
  plotCurveLines(snapshot, bounds) {
    const { consumer: c, producer: p } = snapshot;
    const { demand: dStyle, supply: sStyle } = this.style;

    this.#line.drawVector(
      plotLine(c.line, bounds),
      { stroke: dStyle.line, width: 4 });

    this.#line.drawVector(
      plotLine(p.line, bounds),
      { stroke: sStyle.line, width: 4 });
  }

  /**
   * @param {Econ.ModelSnapshot} snapshot
   * @param {Vec2} bounds
   */
  plotSurplus(snapshot, bounds) {
    const { consumer: c, producer: p } = snapshot;
    const { demand: dStyle, supply: sStyle } = this.style;
    const cSurplus = bound(c.surplus.geom, bounds);
    const pSurplus = bound(p.surplus.geom, bounds);
    this.#poly.draw(cSurplus, { closed: true, fill: dStyle.area });
    this.#poly.draw(pSurplus, { closed: true, fill: sStyle.area });
  }

  /**
   * @param {Econ.ModelSnapshot} snapshot
   * @param {Vec2} bounds
   */
  plotEquilibrium(snapshot, bounds) {
    const { producer: { alloc: eq } } = snapshot;
    this.#plotCrossHair(eq, bounds);
  }

  /**
   * @param {Econ.ModelSnapshot} snapshot
   * @param {Econ.ModelState['policy']} policyInputs
   * @param {Vec2} bounds
   */
  plotPolicy(snapshot, policyInputs, bounds) {
    const { consumer, producer } = snapshot;
    const { anchor: { price: { floor, ceiling } } } = policyInputs;
    const f = floor != null && v2(100000, floor);
    const c = ceiling != null && v2(100000, ceiling);

    if (f) this.#plotCrossHair(f, bounds)
    if (c) this.#plotCrossHair(c, bounds)

    const dp = v2(10000, consumer.alloc.vec[1]);
    const sp = v2(10000, producer.alloc.vec[1]);
    if (dp.vec[1] === sp.vec[1]) return;

    this.#plotCrossHair(dp, bounds)
    this.#plotCrossHair(sp, bounds)
  }



  /**
   * @param {Vec2} bounds
   */
  plotGrid(bounds) {
    this.#renderer.setGlobalCompositeOperation('source-over');
    this.#grid.draw({ step: gridStepFromBounds(bounds) });
    this.#renderer.setGlobalCompositeOperation('screen');
  }

  /**
   * @param {Vec2} target
   * @param {Vec2} bounds
   */
  #plotCrossHair(target, bounds) {
    const bounded = math.el.div(target, bounds);

    const a = v2(0, bounded.vec[1]);
    const b = v2(bounded.vec[0], 0);
    const ta = v2(bounded.vec[0], -0.025);
    const tb = v2(-0.01, bounded.vec[1])
    const tas = target.vec[0].toFixed(2);
    const tab = target.vec[1].toFixed(2);

    this.#line.drawVector([a, bounded, b], {
      width: 2,
      lineDash: [5, 5] });

    this.#text.draw(ta, tas, {
      fontSize: this.style.fontSize,
      textBaseline: 'top' });

    this.#text.draw(tb, tab, {
      fontSize: this.style.fontSize,
      textBaseline: 'middle',
      textAlign: 'right' });
  }
}

/**
 * @param {Vec2[]} items
 * @param {Vec2} bounds
 * @returns {Vec2[]}
 */
function bound(items, bounds) {
  return items.map(v => math.el.div(v, bounds));
}

/**
 * @param {Econ.Line} agent
 * @param {Vec2} bounds
 * @returns {[Vec2, Vec2]}
 */
function plotLine({ src, dst }, bounds) {
  const { div } = math.el;
  return [div(src, bounds), div(dst, bounds)];
}


/**
 * @param {Vec2} bounds
 * @returns {Vec2}
 */
function gridStepFromBounds(bounds, mod=100) {
  return math.el.inv(math.el.mod(bounds, mod));
}
