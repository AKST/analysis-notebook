/**
 * @import { Widget } from '@app/prelude-type.ts';
 * @import { Knobs, Config, State } from './type.ts';
 */
import * as render from './render.js';
import * as documents from './doc.js';

export { getConfig, onUpdate, createState } from './util.js';

export const meta = {
  kind: 'multi',
  sheets: [
    import.meta.resolve('@prelude-uni/styles.css'),
    import.meta.resolve('./styles.css'),
  ],
  layout: {
    gridTemplateColumns: ['1fr', '1fr', '1fr', '1fr'],
    breakpoints: { s: 620, m: 900 },
  },
};

/**
 * @type {Widget<any, State, Config>[]}
 */
export const children = [
  documents.createPlaceholder('document horizontal intepretation of curve'),
  documents.intro,
  documents.example,
  ...render.renderMarginalCosts(),
  documents.quantity,
  ...render.renderQuantityProduced(),
  documents.kindsOfCosts,
  render.renderFirmSupplyCurve(),
  documents.elascity,
  documents.createPlaceholder('Graph elasitcity'),
  documents.deriveAtcAndAvcFromMC,
];
