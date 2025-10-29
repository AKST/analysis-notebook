/**
 * @import * as Econ from '@base/econ/type.ts';
 * @import { Vec2 } from '@base/geom_2d/type.ts';
 * @import { Renderer } from '@base/canvas_2d/type.ts';
 * @import { RenderContextInit as Init } from '@base/runtime/type.ts';
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
 *   readonly rent: CurveStyle
 *   readonly world: { line: number },
 *   readonly govt: { area: number },
 * }} ModelStyle
 */
import { v2 } from '@base/geom_2d/index.js';
import * as curve from '@base/econ/curve.js';
import * as numbers from '@base/util/number.js';
import * as math from '@base/math/value.js';
import { Grid } from '@base/canvas_2d/renders/grid.js';
import { LineRenderer } from '@base/canvas_2d/renders/line-renderer.js';
import { PolygonRenderer } from '@base/canvas_2d/renders/polygon-renderer.js';
import { TextRenderer } from '@base/canvas_2d/renders/text-renderer.js';

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
      demand: { line: 0x00ff66, area: 0x44cc99 },
      supply: { line: 0x0066ff, area: 0x4499cc },
      world: { line: 0xffffff },
      rent: { line: 0xcccccc, area: 0xaaaaaa },
      govt: { area: 0xccbb55 },
      ...style,
    };
  }

  /**
   * @param {Econ.Model.Config.T} inputs
   * @param {Econ.Model.Desc.T} snapshot
   * @param {Vec2} bounds
   * @parmm {{ showWorld?: boolean }} [options]
   */
  plotWithInputs(inputs, snapshot, bounds, { showWorld = true } = {}) {
    this.plotGrid(bounds);
    this.plotSurplus(snapshot, bounds);
    this.plotWorldPrice(inputs, bounds, { showWorld });
    this.plotCurveLines(snapshot, bounds);
    this.plotCrossHairs(snapshot, inputs, bounds, { showWorld });
  }

  /**
   * @param {Econ.Model.Desc.T} snapshot
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
   * @param {Econ.Model.Config.T} inputs
   * @param {Vec2} bounds
   * @param {{ showWorld?: boolean }} cfg
   */
  plotWorldPrice(
      { policy: { permit }, world: { price: worldPrice } },
      bounds,
      { showWorld = false },
  ) {
    this.#renderer.setGlobalCompositeOperation('source-over');
    const anyPermittedTrade = permit.importing || permit.exporting;
    if (showWorld || anyPermittedTrade) {
      const y = worldPrice / bounds.vec[1];
      const points = [v2(0, y), v2(1, y)];
      this.#line.drawVector(points, {
        lineDash: [5, 5, 5],
        stroke: this.style.world.line,
        width: 3,
      });

      const textPos = v2(0.98, y + 0.02);
      this.#text.draw(textPos, 'world', {
        fontSize: 10,
        textAlign: 'right',
        textBaseline: 'bottom',
      });
    }
    this.#renderer.setGlobalCompositeOperation('screen');
  }

  /**
   * @param {Econ.Model.Desc.T} desc
   * @param {Vec2} bounds
   */
  plotSurplus(desc, bounds) {
    const { demand: d, supply: s, rentier: r, govt: g } = desc;

    const cSurplus = bound(d.market.surplus.geom, bounds);
    this.#poly.draw(cSurplus, { closed: true, fill: this.style.demand.area });

    const pSurplus = bound(s.market.surplus.geom, bounds);
    this.#poly.draw(pSurplus, { closed: true, fill: this.style.supply.area });

    const rSurplus = bound(r.importQuota.rent.geom, bounds);
    this.#poly.draw(rSurplus, { closed: true, fill: this.style.rent.area });

    const dTax = bound(g.demand.revenue.geom, bounds);
    this.#poly.draw(dTax, { closed: true, fill: this.style.govt.area });

    const sTax = bound(g.supply.revenue.geom, bounds);
    this.#poly.draw(sTax, { closed: true, fill: this.style.govt.area });

    const iTariff = bound(g.import.revenue.geom, bounds);
    this.#poly.draw(iTariff, { closed: true, fill: this.style.govt.area });

    const eTariff = bound(g.export.revenue.geom, bounds);
    this.#poly.draw(eTariff, { closed: true, fill: this.style.govt.area });
  }

  /**
   * @param {Econ.Model.Desc.T} snapshot
   * @param {Econ.Model.Config.T} config
   * @param {Vec2} bounds
   * @param {{ showWorld?: boolean }} [cfg]
   */
  plotCrossHairs(snapshot, config, bounds, { showWorld = false } = {}) {
    const { world: w, demand: d, supply: s } = snapshot;
    const policy = config.policy;
    const ps = new Set(), qs = new Set();
    const willShowWorld = w.export.binding || w.import.binding || showWorld;

    if (willShowWorld) {
      ps.add(w.price);
    }
    if (w.export.binding || showWorld) {
      ps.add(w.export.price);
    }
    if (w.import.binding || showWorld) {
      ps.add(w.import.price);
    }

    for (const [sa, sb] of [
      [s.market.curve, s.social.curve],
      [s.social.curve, s.market.curve],
    ]) {
      for (const [da, db] of [
        [d.market.curve, d.social.curve],
        [d.social.curve, d.market.curve],
      ]) {
        const eq = curve.equilibrium(da, sa);
        if (!eq.ok) continue;
        ps.add(eq.p);
        qs.add(eq.q);

        const ppa = curve.getPriceAtQuantity(sb, eq.q);
        if (ppa.ok) ps.add(ppa.p);

        const ppb = curve.getPriceAtQuantity(db, eq.q);
        if (ppb.ok) ps.add(ppb.p);
      }
    }

    for (const anyCurve of [
      s.market.curve,
      s.social.curve,
      d.market.curve,
      d.social.curve,
    ]) {
      if (!willShowWorld) {
        const qa = curve.getQuantityAtPrice(anyCurve, config.world.price);
        if (qa.ok) qs.add(qa.q);
      }

      const pAnchor = policy.anchor.price;
      const qb = pAnchor.floor != null && curve.getQuantityAtPrice(anyCurve, pAnchor.floor);
      if (qb && qb.ok) qs.add(qb.q);

      const qc = pAnchor.ceiling != null && curve.getQuantityAtPrice(anyCurve, pAnchor.ceiling);
      if (qc && qc.ok) qs.add(qc.q);
    }

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

    const pAxis = new Set();
    const qAxis = new Set();

    /**
     * @param {'q' | 'p'} value
     * @param {{ ok: true, p: number, q: number } | { ok: false }} result
     */
    const addOk = (value, result) => {
      if (!result.ok) return;
      if (value === 'q') qAxis.add(result.q);
      if (value === 'p') pAxis.add(result.p);
    };


    addOk('p', curve.getPriceAtQuantity(s.social.curve, 0));
    addOk('p', curve.getPriceAtQuantity(s.market.curve, 0));
    addOk('p', curve.getPriceAtQuantity(d.social.curve, 0));
    addOk('p', curve.getPriceAtQuantity(d.market.curve, 0));
    addOk('q', curve.getQuantityAtPrice(s.social.curve, 0));
    addOk('q', curve.getQuantityAtPrice(s.market.curve, 0));
    addOk('q', curve.getQuantityAtPrice(d.social.curve, 0));
    addOk('q', curve.getQuantityAtPrice(d.market.curve, 0));

    for (const price of ps) {
      // large numbers warp the filtering of close numbers
      if (price < bounds.vec[1]) pAxis.add(price);

      this.#plotCrossHair(v2(100000, price), bounds);
    }
    for (const quantity of qs) {
      // large numbers warp the filtering of close numbers
      if (quantity < bounds.vec[0]) qAxis.add(quantity);

      this.#plotCrossHair(v2(quantity, 100000), bounds);
    }
    for (const q of thresholdedValues(qAxis, 0.05)) {
      this.#axisTick('x', q, bounds);
    }

    for (const p of thresholdedValues(pAxis, 0.05)) {
      this.#axisTick('y', p, bounds);
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

    this.#line.drawVector([
      v2(0, bounded.vec[1]),
      bounded,
      v2(bounded.vec[0], 0),
    ], {
      width: 1,
      lineDash: [5, 5],
    });
  }

  /**
   * @param {'x' | 'y'} axis
   * @param {number} position
   * @param {Vec2} bounds
   */
  #axisTick(axis, position, bounds) {
    if (axis === 'x') {
      const x = position / bounds.vec[0];
      this.#text.draw(v2(x, -0.025), position.toFixed(2), {
        fontSize: this.style.fontSize,
        textBaseline: 'top'
      });
    } else {
      const y = position / bounds.vec[1];
      this.#text.draw(v2(-0.01, y), position.toFixed(2), {
        fontSize: this.style.fontSize,
        textBaseline: 'middle',
        textAlign: 'right'
      });
    }
  }
}

/**
 * @param {readonly Vec2[]} items
 * @param {Vec2} bounds
 * @returns {Vec2[]}
 */
function bound(items, bounds) {
  return items.map(v => math.el.div(v, bounds));
}

/**
 * @param {Econ.Model.Desc.MarginalValue} mv
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

/**
 * @param {Set<number>} vs
 * @param {number} thresholdScale
 */
function * thresholdedValues(vs, thresholdScale) {
  const array = Array.from(vs).sort(numbers.compare);
  const last = array.at(-1);
  if (last == null) return;

  const range = last - array[0];
  yield last;

  let lastYielded = array.length-1;
  for (let i = array.length-2; i >= 0; i--) {
    if (array[lastYielded] - array[i] < range * thresholdScale) continue;
    lastYielded = i;
    yield array[i];
  }

}
