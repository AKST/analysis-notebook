/**
 * @import { E } from '@app/prelude-type.ts';
 * @import { GoodUtility } from './type.ts';
 *
 * @typedef {{
 *   marginalUtilPer$?: boolean,
 *   reservationPriceFor: GoodUtility | undefined,
 * }} UtilConfig
 *
 * @typedef {{
 *   marginalUtilPer$?: boolean,
 *   reservationPrice?: boolean,
 *   relativeValue?: boolean,
 * }} TableConfig
 */
import { doc, arrays, enumerate } from '@app/prelude.js';
import { twoColumns } from '@prelude-uni/layout.js';

/**
 * @param {GoodUtility} good
 * @param {string} name
 * @param {UtilConfig} cfg
 * @returns {E.Item}
 */
function utilityTable(good, name, cfg) {
  const quantity = arrays.fromIndex(good.marginal.length, i => i);

  const headers = [
    'Q',
    'TU',
    'MU',
    cfg.marginalUtilPer$ ? 'MU/$ [1]' : '',
    cfg.reservationPriceFor ? 'RP [2]' : '',
  ].filter(it => it);

  /**
   * @param {number} q
   * @returns {Iterable<string|number>}
   */
  const getRow = function *(q) {
    yield q;
    yield good.total[q].toFixed(2);
    yield good.marginal[q].toFixed(2);
    if (cfg.marginalUtilPer$) {
      yield good.marginalPer$[q]?.toFixed(2) ?? '/';
    }
    if (cfg.reservationPriceFor && q > 0) {
      const alt = cfg.reservationPriceFor;
      const denom = alt.marginal[q] / alt.price
      const rp = good.marginal[q] / denom
      yield `\$${rp.toFixed(2)}`
    } else if (cfg.reservationPriceFor) {
      yield '/';
    }
  }

  const caption = [];
  if (cfg.marginalUtilPer$) {
    const price = good.price.toFixed(2)
    caption.push(`[1] Utility for ${name} (price = \$${price}).`)
  }

  if (cfg.reservationPriceFor) {
    const price = cfg.reservationPriceFor.price;
    caption.push(`[2] When alternative Good costs  \$${price.toFixed(2)})`)
  }

  return doc.table(
    doc.caption({ className: 'headingCap' }).of(name),
    doc.thead(doc.tr(...headers.map(h => doc.th.of(h)))),
    doc.tbody(...quantity.map(q => doc.tr(...Array.from(getRow(q), v => doc.td.of(v))))),
    doc.caption({ className: 'footerCap' }).of(caption.join(' ')),
  );
}

/**
 * @param {{ donuts: GoodUtility, muffins: GoodUtility }} state
 * @param {TableConfig} cfg
 * @returns {E.Item}
 */
export function utilityTables({ donuts, muffins }, cfg) {
  return twoColumns(
    utilityTable(muffins, 'Muffins', {
      marginalUtilPer$: cfg.marginalUtilPer$,
      reservationPriceFor: (
        (cfg.reservationPrice || cfg.relativeValue)
          ? donuts
          : undefined
      ),
    }),
    utilityTable(donuts, 'Donuts', {
      marginalUtilPer$: (cfg.reservationPrice || cfg.marginalUtilPer$),
      reservationPriceFor: cfg.relativeValue ? muffins : undefined,
    }),
  );
}

/**
 * @param {{ donuts: GoodUtility, muffins: GoodUtility }} state
 * @returns {E.Item}
 */
export function choiceOfGood({ donuts, muffins }) {
  /**
   * @param {number} curr
   * @param {number} prev
   * @returns {E.Item}
   */
  const goodCount = (curr, prev) => ['span', {
    className: curr === prev ? 'choiceSame' : 'choiceInc',
  }, curr+''];

  /**
   * @returns {Iterable<{
   *   tUtility: number,
   *   mUtility: number,
   *   spent: number,
   *   donuts: E.Item,
   *   muffins: E.Item,
   * }>}
   */
  function * choices() {
    let di = 0, mi = 0, spent = 0, utility = 0;
    while (
      (di+1) < donuts.marginalPer$.length &&
      (mi+1) < muffins.marginalPer$.length
    ) {
      const dip = di, mip = mi, up = utility;
      const du = donuts.marginalPer$[di+1];
      const mu = muffins.marginalPer$[mi+1];

      if (du === mu) {
        utility += donuts.marginal[di];
        utility += muffins.marginal[mi];
        di += 1;
        mi += 1;
        spent += donuts.price;
        spent += muffins.price;
      } else if (du > mu) {
        utility += donuts.marginal[di];
        di += 1;
        spent += donuts.price;
      } else if (du < mu) {
        utility += muffins.marginal[mi];
        mi += 1;
        spent += muffins.price;
      }


      yield {
        spent,
        tUtility: utility,
        mUtility: utility - up,
        donuts: goodCount(di, dip),
        muffins: goodCount(mi, mip),
      };
    }
  }


  const headers = [];

  /** @type {E.Item[]} */
  const donutRow = [];
  /** @type {E.Item[]} */
  const muffinRow = [];
  const spendRow = [];
  const tUtilRow = [];
  const mUtilRow = [];

  for (const [i, {
    spent,
    mUtility,
    tUtility,
    donuts,
    muffins,
  }] of enumerate(choices())) {
    headers.push(''+(i+1));
    muffinRow.push(muffins);
    donutRow.push(donuts);
    spendRow.push(spent);
    tUtilRow.push(tUtility);
    mUtilRow.push(mUtility);
  }

  /** @param {number} v */
  const str = v => v.toString();

  return doc.table(
    doc.thead(doc.tr(doc.th`Action`, ...headers.map(h => doc.th.of(h)))),
    doc.tbody(
      doc.tr(doc.th`Muffins`, ...muffinRow.map(v => doc.td.of(v))),
      doc.tr(doc.th`Donuts`, ...donutRow.map(v => doc.td.of(v))),
      doc.tr(doc.th`$`, ...spendRow.map(v => doc.td.of('$'+v.toFixed(2)))),
      doc.tr(doc.th`Util Σ`, ...tUtilRow.map(v => doc.td.of(str(v)))),
      doc.tr(doc.th`Util Δ`, ...mUtilRow.map(v => doc.td.of(str(v)))),
    ),
  );
}

export function elasticityConditions() {
  return doc.table(
    doc.thead(doc.tr(doc.th`State`, doc.th`Implication`)),
    doc.tbody(
      doc.tr(doc.td`ε < -1`, doc.td`Inelastic`),
      doc.tr(doc.td`ε = -1`, doc.td`Unit elastic`),
      doc.tr(doc.td`ε > -1`, doc.td`Elastic`),
    ),
  );
}

/**
 * @param {{ donuts: GoodUtility, muffins: GoodUtility }} state
 * @returns {E.Item}
 */
export function elasicityTable({
  donuts: d,
  muffins: m,
}) {
  /** @param {number} d */
  const sign = d => (Math.sign(d)<0 ? '-' : '+');
  /** @param {number} d */
  const $ = d => sign(d)+'$'+Math.abs(d).toFixed(2);
  /** @param {number} d */
  const f = d => sign(d)+Math.abs(d).toFixed(2);

  /**
   * @param {number} index
   * @returns {number}
   */
  function calcp(index) {
    return m.marginal[index] / (d.marginal[1] / d.price)
  }

  /**
   * @param {number} index
   * @returns {Iterable<string|number>}
   */
  const getRow = function *(index) {
    // price of current
    const priceC = index > 0 ? calcp(index) : undefined;

    // price of previous
    const priceP = index > 1 ? calcp(index-1) : undefined;

    // price of delta
    const priceD = priceC && priceP && (priceC - priceP);

    // price of elasicity
    const priceE = priceC && priceD && (priceC / priceD);

    yield index;
    yield priceC != null ? $(priceC) : '/';
    yield priceD != null ? 1 : '/';
    yield priceD != null ? $(priceD) : '/';
    yield priceE != null ? f(priceE) : '/';

  }

  return doc.table(
    doc.thead(doc.tr(doc.th`Q ${doc.sub`n`}`, doc.th`P ${doc.sub`n`}`, doc.th`ΔQ`, doc.th`ΔP`, doc.th`ε`)),
    doc.tbody(...m.total.map((_, i) => doc.tr(...Array.from(getRow(i), v => doc.td.of(v))))),
  );
}
