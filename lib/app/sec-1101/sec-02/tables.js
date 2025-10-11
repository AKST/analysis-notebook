/**
 * @import { Econ, E } from '../../prelude-type.ts';
 */
import { econFirm, enumerate, doc, table } from '../../prelude.js';

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

  const getRows = function *() {;
    for (const [index, cost] of enumerate(focus.costTotal)) {
      yield [
        index+1,
        fmtNum(cost),
        fmtNum(focus.marginalCost[index]),
        fmtNum(focus.revenue[index]),
        fmtNum(focus.marginalBenefit[index]),
        fmtNum(other.price[0] * focus.marginalCost[index]),
      ];
    }
  };

  return table([
    unit,
    `Total ${cost}`,
    `Marginal ${cost}`,
    'Total Profit',
    'Marginal Benefit',
    'Marginal Cost',
  ], Array.from(getRows()), {
    caption: 'Marginal cost is the amount earnable doing something else',
  })
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

  const t1 = table(['W', 'Q', 'FC', 'VC', 'TC'], rowSet1);
  const t2 = table(['W', 'AVC', 'ATC', 'MC', 'Feasible', 'П'], rowSet2)

  return doc.frag(
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

  return table(['Condition', 'Operate?', 'When W = ?'], [
    ['Short Run', cond(shortRun), show(shortRun)],
    ['Long Run', cond(longRun), show(longRun)],
  ], {
    firstColumnHeader: true,
    caption: doc.p`* Output within time frame`,
  });
}

export function elasticityConditions() {
  return table(['State', 'Implication'], [
    ['ε < 1', 'Inelastic'],
    ['ε = 1', 'Unit elastic'],
    ['ε > 1', 'Elastic'],
  ]);
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

  return table([
    doc.frag('Q', ['sub', 'n']),
    doc.frag('Q', ['sub', 'n - 1']),
    'ΔQ',
    doc.frag('P', ['sub', 'n']),
    doc.frag('P', ['sub', 'n - 1']),
    'ΔP',
    doc.frag('ε (point', ['sup', 1], ')'),
  ], [
    ['0', '/', '/', '/', '/', '/', '/'],
    ...rows.map((row, i) => {
      const lastUnits = i === 0 ? 0 : rows[i - 1].units;
      const deltaUnits = row.units - lastUnits;
      const lastMCost = i === 0 ? undefined : rows[i - 1].marginalCost;
      const deltaMCost = lastMCost && row.marginalCost - lastMCost;
      return [
        row.units,
        lastUnits,
        deltaUnits,
        row.marginalCost,
        lastMCost,
        deltaMCost,
        i === 0 ? undefined : elasicity[i-1],
      ].map(r);
    }),
  ]);
}
