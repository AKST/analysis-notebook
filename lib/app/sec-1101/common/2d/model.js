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
  numbers,
  econCurve as curve,
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
   * @param {Econ.Model.Config.T} inputs
   * @param {Econ.Model.Desc.T} snapshot
   * @param {Vec2} bounds
   */
  plotWithInputs(inputs, snapshot, bounds) {
    this.plotGrid(bounds);
    this.plotCurveLines(snapshot, bounds);
    this.plotSurplus(snapshot, bounds);
    this.plotCrossHairs(snapshot, inputs.policy, bounds);
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
   * @param {Econ.Model.Desc.T} snapshot
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
   * @param {Econ.Model.Desc.T} snapshot
   * @param {Econ.Model.Config.T['policy']} policy
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
      pAxis.add(price);
      this.#plotCrossHair(v2(100000, price), bounds);
    }
    for (const quantity of qs) {
      qAxis.add(quantity);
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
 * @param {Vec2[]} items
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
  console.log(range * thresholdScale, array);
  for (let i = array.length-2; i >= 0; i--) {
    if (array[lastYielded] - array[i] < range * thresholdScale) continue;
    lastYielded = i;
    yield array[i];
  }

}
