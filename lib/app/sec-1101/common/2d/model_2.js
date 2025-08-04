/**
 * @import {
 *   Econ2 as Econ,
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
  econSolve_2 as econ,
  TextRenderer,
  Grid,
  PolygonRenderer,
  LineRenderer,
  Unreachable,
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
   * @param {Econ.ModelOut.T} snapshot
   * @param {Vec2} bounds
   */
  plotWithInputs(inputs, snapshot, bounds) {
    this.plotGrid(bounds);
    this.plotCurveLines(snapshot, bounds);
    this.plotSurplus(snapshot, bounds);
    this.plotCrossHairs(snapshot, inputs.policy, bounds);
  }

  /**
   * @param {Econ.ModelOut.T} snapshot
   * @param {Vec2} bounds
   */
  plotCurveLines(snapshot, bounds) {
    const { demand: d, supply: s } = snapshot;
    const { demand: dStyle, supply: sStyle } = this.style;

    /** @type {{ width: number }} */
    const priCfg = { width: 3 };

    /** @type {{ width: number, lineDash: [number, number] }} */
    const pubCfg = { width: 2, lineDash: [5, 5] };

    const demandPrivate = plotLine(d.market, bounds);
    this.#line.drawVector(demandPrivate, { stroke: dStyle.line, ...priCfg });
    if (!d.equal) {
      const demandPublic = plotLine(d.social, bounds);
      this.#line.drawVector(demandPublic, { stroke: dStyle.line, ...pubCfg });
    }

    const supplyPrivate = plotLine(s.market, bounds);
    this.#line.drawVector(supplyPrivate, { stroke: sStyle.line, ...priCfg });
    if (!s.equal) {
      const supplyPublic = plotLine(s.social, bounds);
      this.#line.drawVector(supplyPublic, { stroke: sStyle.line, ...pubCfg });
    }
  }

  /**
   * @param {Econ.ModelOut.T} snapshot
   * @param {Vec2} bounds
   */
  plotSurplus(snapshot, bounds) {
    const { demand: d, supply: s } = snapshot;
    const { demand: dStyle, supply: sStyle } = this.style;
    const cSurplus = bound(d.market.surplus.geom, bounds);
    const pSurplus = bound(s.market.surplus.geom, bounds);
    this.#poly.draw(cSurplus, { closed: true, fill: dStyle.area });
    this.#poly.draw(pSurplus, { closed: true, fill: sStyle.area });
  }

  /**
   * @param {Econ.ModelOut.T} snapshot
   * @param {Econ.ModelState['policy']} policy
   * @param {Vec2} bounds
   */
  plotCrossHairs(snapshot, policy, bounds) {
    const { world: w, demand: d, supply: s } = snapshot;
    const ps = new Set(), qs = new Set();

    if (policy.anchor.price.floor != null) {
      ps.add(policy.anchor.price.floor);
    }
    if (policy.anchor.price.ceiling != null) {
      ps.add(policy.anchor.price.ceiling);
    }

    if (d.alloc.kind === 'dual-alloc') {
      ps.add(d.alloc.world.reservationPrice);
      ps.add(d.alloc.world.effectivePrice);
      qs.add(d.alloc.world.quantity);
      ps.add(d.alloc.local.reservationPrice);
      ps.add(d.alloc.local.effectivePrice);
      qs.add(d.alloc.local.quantity);
    } else {
      ps.add(d.alloc.value.reservationPrice);
      ps.add(d.alloc.value.effectivePrice);
      qs.add(d.alloc.value.quantity);
    }

    if (s.alloc.kind === 'dual-alloc') {
      ps.add(s.alloc.world.reservationPrice);
      ps.add(s.alloc.world.effectivePrice);
      qs.add(s.alloc.world.quantity);
      ps.add(s.alloc.local.reservationPrice);
      ps.add(s.alloc.local.effectivePrice);
      qs.add(s.alloc.local.quantity);
    } else {
      ps.add(s.alloc.value.reservationPrice);
      ps.add(s.alloc.value.effectivePrice);
      qs.add(s.alloc.value.quantity);
    }

    if (w.export.binding || w.import.binding) {
      ps.add(w.price);
    }
    if (w.export.binding) {
      ps.add(w.export.price);
    }
    if (w.import.binding) {
      ps.add(w.import.price);
    }

    for (const price of ps) {
      this.#plotCrossHair(v2(100000, price), bounds);
    }
    for (const quantity of qs) {
      this.#plotCrossHair(v2(quantity, 100000), bounds);
    }
  }



  /**
   * @param {Vec2} bounds
   */
  plotGrid(bounds) {
    this.#renderer.setGlobalCompositeOperation('source-over');
    this.#grid.draw({
      step: gridStepFromBounds(bounds),
      lineDash: { tick: [1, 1] },
    });
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
 * @param {Econ.ModelOut.MarginalValue} mv
 * @param {Vec2} bounds
 * @returns {Vec2[]}
 */
function plotLine(mv, bounds) {
  const { div } = math.el;
  return mv.line.map(p => div(p, bounds));
}


/**
 * @param {Vec2} bounds
 * @returns {Vec2}
 */
function gridStepFromBounds(bounds, mod=100) {
  return math.el.inv(math.el.mod(bounds, mod));
}
