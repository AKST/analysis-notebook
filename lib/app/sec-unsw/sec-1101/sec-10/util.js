/**
 * @import { Econ } from '../../../prelude-type.ts';
 * @import { Behaviour, Config, State, Event } from './type.ts';
 */
import { math, econCurve as curves, objects, v2 } from '../../../prelude.js';

/**
 * @param {State} state
 * @param {Event} event
 * @returns {State}
 */
export function onUpdate(state, event) {
  switch (event.kind) {
    case 'config': {
      const update = onConfigUpdate(event.config);
      if (!update.ok) console.error(update);
      return update.ok ? update.value : state;
    }

    default:
      return state;
  }
}

/**
 * @param {Config} config
 * @returns {{ ok: true, value: State } | { ok: false, reason: string }}
 */
export function onConfigUpdate(config) {
  const { marginalCost } = config;

  const dCurves = objects.mapEntries(config.consumers, ([i, m]) => {
    return /** @type {Econ.Curve.Continious} */ (
      { kind: 'continious', i, m, dir: -1 }
    );
  });

  const names = Object.keys(config.consumers).sort((a, b) => {
    return dCurves[b].i - dCurves[a].i;
  });

  const aggregateDemand = curves.summiseVerticalAll(Object.values(dCurves));

  const maxQ = curves.getQuantityAtPrice(aggregateDemand, 0);
  if (!maxQ.ok) return maxQ;

  const aggregateQMaybe = curves.getQuantityAtPrice(aggregateDemand, marginalCost);
  const bounds = math.el.mul(v2(maxQ.q, aggregateDemand.i), 1.1);
  const aggregateQ = aggregateQMaybe.ok ? aggregateQMaybe.q : 0;

  const freeRidePayer = names[0];
  const freeRide = curves.getQuantityAtPrice(dCurves[freeRidePayer], marginalCost);
  const freeRideQ = freeRide.ok ? freeRide.q : 0;

  const consumers = objects.flatMapEntries(dCurves, (c, name) => {
    const freerideP = curves.getPriceAtQuantity(c, freeRideQ);
    if (!freerideP.ok) return freerideP;

    /** @type {Econ.Model.Geom.Space} */
    let freeRide;
    if (freeRideQ > 0) {
      freeRide = {
        geom: [],
        size: (
          (0.5 * ((c.i - freerideP.p) * freerideP.q)) +
          (freerideP.p * freerideP.q)
        ),
      };
    } else {
      freeRide = { size: 0, geom: [] };
    }

    const lindahlP = curves.getPriceAtQuantity(c, aggregateQ);
    if (!lindahlP.ok) return lindahlP;

    /** @type {Econ.Model.Geom.Space} */
    const contribute = {
      geom: [],
      size: (0.5 * (c.i - lindahlP.p) * lindahlP.q),
    };

    return {
      ok: true,
      value: /** @type {Behaviour} */ ({
        behaviour: name === freeRidePayer ? 'contribute' : 'freeRide',
        curve: c,
        lindahlPrice: lindahlP.p,
        surplus: {
          contribute,
          freeRide,
        },
      }),
    };
  });

  return {
    ok: true,
    value: {
      bounds,
      produced: {
        contribute: aggregateQ,
        freeRide: freeRideQ,
      },
      consumers: consumers.ok ? consumers.value : ({}),
      marginalCost,
      aggregateDemand,
    },
  };
}
