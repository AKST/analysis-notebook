/**
 * @import { E } from '@app/prelude-type.ts';
 * @import * as Econ from '@base/econ/micro/type.ts';
 */
import { frag, enumerate, doc } from '@app/prelude.js';
import * as econFirm from '@base/econ/micro/firm.js';
import { text } from '@prelude-uni/components.js';

/** @param {number | undefined} n @param {string} [str] */
const fmtNum = (n, str='/') => (n == null || Number.isNaN(n)) ? str : n.toFixed(2);

/**
 * @template A
 * @template {Record<string, readonly A[]>} Table
 * @template [B=A]
 * @param {Table} table
 * @param {readonly (keyof Table)[]} [keysIn]
 * @param {(val: A, key: keyof Table, row: number) => B} [applyPairIn]
 * @returns B[][]
 */
export function tableToRows(table, keysIn, applyPairIn) {
  const keys = keysIn ?? Object.keys(table);
  if (keys.length === 0) throw new TypeError('TODO');

  const size = table[keys[0]].length;
  for (const k of keys) if (table[k].length !== size) throw new TypeError('TODO');

  const applyPair = applyPairIn ?? (v => v);

  return Array.from({ length: size }, (_, row) => (
    keys.map(k => applyPair(table[k][row], k, row))
  ));
}

/**
 * @param {Econ.Firm.BehaviourTable} focus
 * @param {Econ.Firm.BehaviourTable} other
 * @param {{ unit: string; cost: string }} label
 * @returns {E.Item}
 */
export function margins(
  focus,
  other,
  { unit, cost },
) {
  if (focus == null) return;
  if (other == null) return;

  const getRows = function *() {
    for (const [index, cost] of enumerate(focus.costTotal)) {
      yield doc.tr(
        doc.td.of(index+1),
        doc.td.of(fmtNum(cost)),
        doc.td.of(fmtNum(focus.marginalCost[index])),
        doc.td.of(fmtNum(focus.revenue[index])),
        doc.td.of(fmtNum(focus.marginalBenefit[index])),
        doc.td.of(fmtNum(other.price[0] * focus.marginalCost[index])),
      );
    }
  };

  return doc.table.of(
    doc.caption({ className: 'footerCap' }).t`Marginal cost is the amount earnable doing something else`,
    doc.thead(doc.tr(
      doc.th`${unit}`,
      doc.th`Total ${cost}`,
      doc.th`Marginal ${cost}`,
      doc.th`Total Profit`,
      doc.th`Marginal Benefit`,
      doc.th`Marginal Cost`,
    )),
    doc.tbody(...Array.from(getRows())),
  );
}

/**
 * @template A
 * @param {number} afterIndex
 * @param {A} value
 */
export function insertCol(afterIndex, value) {
  /** @param {A[]} row */
  return row => row.slice(0, afterIndex).concat([value, ...row.slice(afterIndex)]);
}

/**
 * @param {number} fixedCost
 * @param {Econ.Firm.BehaviourTable} fTable
 * @returns {E.Item}
 */
export function firmSupplyCurve(fixedCost, fTable) {
  /** @param {number} n */
  const r = n => fmtNum(n)

  const rowSet1 = tableToRows(fTable, ['workers', 'units', 'costVar', 'costTotal'], (v, k) => {
    return ['workers', 'units'].includes(k) ? `${v}` : r(v);
  }).map(insertCol(2, r(fixedCost)));

  rowSet1.unshift(
    ['0', '0', fmtNum(fixedCost), fmtNum(0), fmtNum(fixedCost)],
  );

  const rowSet2 = tableToRows(fTable, [
    'units', 'workers', 'price', 'avgCostVar',
    'avgCostTotal', 'marginalCost',
  ]).map(([units, workers, price, ...tail], index) => {
    const feasible = units === 0 || tail[2] <= price ? '✅' : '❌';
    return [workers, ...tail.map(r), feasible, r(fTable.profit[index])];
  });

  rowSet2.unshift(
    ['0', '/', '/', '/', ' ', fmtNum(-fixedCost)],
  );

  const t1 = doc.table(
    doc.thead(doc.tr(doc.th`W`, doc.th`Q`, doc.th`FC`, doc.th`VC`, doc.th`TC`)),
    doc.tbody(...rowSet1.map(row => doc.tr(...row.map(c => doc.td.of(c))))),
  );
  const t2 = doc.table(
    doc.thead(doc.tr(doc.th`W`, doc.th`AVC`, doc.th`ATC`, doc.th`MC`, doc.th`Feasible`, doc.th`П`)),
    doc.tbody(...rowSet2.map(row => doc.tr(...row.map(c => doc.td.of(c))))),
  );

  return frag(
    ['div', { className: 'c2 supplycurvetable' }, [t1, t2]],
    ['h4', 'Legend'],
    ['dl', { className: 'legendInfo' }, [
      ['dt', 'P'], ['dd', 'Price'],
      ['dt', 'W'], ['dd', 'Workers'],
      ['dt', 'Q'], ['dd', 'Quantity'],
      ['dt', 'FC'], ['dd', 'Fixed Cost'],
      ['dt', 'VC'], ['dd', 'Variable Cost'],
      ['dt', 'TC'], ['dd', 'Total Cost'],
      ['dt', 'AVC'], ['dd', 'Average VC'],
      ['dt', 'ATC'], ['dd', 'Average  TC'],
      ['dt', 'MC'], ['dd', 'Marginal Cost'],
      ['dt', 'П'], ['dd', 'Profit'],
    ]],
  );
}

/**
 * @param {number} fixedCost
 * @param {Econ.Firm.BehaviourTable} fTable
 * @returns {E.Item}
 */
export function shutdownConditions(fixedCost, fTable) {
  const shortRun = fTable.profit.map((profit) => {
    return !(profit < -fixedCost);
  });

  const longRun = fTable.profit.map((profit) => {
    return !(profit < 0);
  })

  /** @template A @param {(A | undefined)[]} outcomes */
  const yes = outcomes => outcomes.some(it => it);

  /** @template A @param {(A | undefined)[]} outcomes */
  const cond = outcomes => yes(outcomes) ? '✅' : '❌';

  /** @template A @param {(A | undefined)[]} outcomes */
  const show = outcomes => {
    if (!yes(outcomes)) return '/';
    return outcomes
      .map((it, index) => it ? fTable.workers[index] : undefined)
      .filter(it => it)
      .join(', ');
  }

  return doc.table(
    doc.caption({ className: 'footerCap' }).of(text.p.l`* Output within time frame`),
    doc.thead(doc.tr(doc.th`Condition`, doc.th`Operate?`, doc.th`When W = ?`)),
    doc.tbody(
      doc.tr(doc.th`Short Run`, doc.td.of(cond(shortRun)), doc.td.of(show(shortRun))),
      doc.tr(doc.th`Long Run`, doc.td.of(cond(longRun)), doc.td.of(show(longRun))),
    ),
  );
}

export function elasticityConditions() {
  return doc.table(
    doc.thead(doc.tr(doc.th`State`, doc.th`Implication`)),
    doc.tbody(
      doc.tr(doc.td`ε < 1`, doc.td`Inelastic`),
      doc.tr(doc.td`ε = 1`, doc.td`Unit elastic`),
      doc.tr(doc.td`ε > 1`, doc.td`Elastic`),
    ),
  );
}

/**
 * @param {Econ.Firm.BehaviourTable} fTable
 * @returns {E.Item}
 */
export function elasicityTable(fTable) {
  /** @param {number | undefined} n */
  const r = n => fmtNum(n)
  const elasicity = Array.from(econFirm.supplyElasicity(fTable))
  const rows = Array.from(econFirm.firmBehaviourTableIter(fTable));

  return doc.table(
    doc.thead(doc.tr(
      doc.th`Q${doc.sub`n`}`,
      doc.th`Q${doc.sub`n - 1`}`,
      doc.th`ΔQ`,
      doc.th`P${doc.sub`n`}`,
      doc.th`P${doc.sub`n - 1`}`,
      doc.th`ΔP`,
      doc.th`ε (point${doc.sup`1`})`,
    )),
    doc.tbody(
      doc.tr(doc.td`0`, doc.td`/`, doc.td`/`, doc.td`/`, doc.td`/`, doc.td`/`, doc.td`/`),
      ...rows.map((row, i) => {
        const lastUnits = i === 0 ? 0 : rows[i - 1].units;
        const deltaUnits = row.units - lastUnits;
        const lastMCost = i === 0 ? undefined : rows[i - 1].marginalCost;
        const deltaMCost = lastMCost && row.marginalCost - lastMCost;
        return doc.tr(
          doc.td.of(r(row.units)),
          doc.td.of(r(lastUnits)),
          doc.td.of(r(deltaUnits)),
          doc.td.of(r(row.marginalCost)),
          doc.td.of(r(lastMCost)),
          doc.td.of(r(deltaMCost)),
          doc.td.of(r(i === 0 ? undefined : elasicity[i-1])),
        );
      }),
    ),
  );
}
