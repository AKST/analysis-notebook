/**
 * @import { MakeVariantKnob, MakeConfigKnobs } from '@app/prelude-type.ts';
 * @import { Widget } from '@app/prelude-type.ts';
 * @import { RateOfChangeCfg, Config, State, Event } from './type.ts';
 */
import { container } from '@prelude-uni/layout.js';
import * as doc from './doc.js';
import * as render from './render.js';

export { getConfig, onUpdate, createState } from './util.js';

export const meta = {
  kind: 'multi',
  sheets: [import.meta.resolve('@prelude-uni/styles.css')],
  layout: {
    gridTemplateColumns: ['1fr', '1fr', '1fr', '1fr'],
    breakpoints: { s: 620, m: 900 },
  },
};

/**
 * @type {Widget<any, State, Config>[]}
 */
export const children = [
  doc.header,
  doc.createPlaceholder(`
    Market Power And Demand, Showing Supply and
    Demand, as well as a firm curve in perfect
    competition
  `),
  doc.originsOfMonopolies,
  doc.costBenefitPrinciple,
  doc.profitMaximisingForMonopolies,
  render.renderExampleA,
  doc.exampleA,
  render.renderExampleB(false),
  render.renderExampleB(true),
  doc.deadWeightLoss,
  doc.monopolyRegulation,
  doc.priceDiscrimination,
  doc.exampleC,
];
