import { beforeEach, expect, describe, it } from 'vitest';
import { renderWidget } from '@base/runtime/testing/test-multi.js';
import * as doc from '../doc.js';

describe('app(unsw::1101::07).widgets', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
  });

  it('header', () => {
    const el = renderWidget(doc.header);
    expect(el.outerHTML).toMatchSnapshot();
  });

  it('originsOfMonopolies', () => {
    const el = renderWidget(doc.originsOfMonopolies);
    expect(el.outerHTML).toMatchSnapshot();
  });

  it('costBenefitPrinciple', () => {
    const el = renderWidget(doc.costBenefitPrinciple);
    expect(el.outerHTML).toMatchSnapshot();
  });

  it('profitMaximisingForMonopolies', () => {
    const el = renderWidget(doc.profitMaximisingForMonopolies);
    expect(el.outerHTML).toMatchSnapshot();
  });

  it('deadWeightLoss', () => {
    const el = renderWidget(doc.deadWeightLoss);
    expect(el.outerHTML).toMatchSnapshot();
  });

  it('monopolyRegulation', () => {
    const el = renderWidget(doc.monopolyRegulation);
    expect(el.outerHTML).toMatchSnapshot();
  });

  it('priceDiscrimination', () => {
    const el = renderWidget(doc.priceDiscrimination);
    expect(el.outerHTML).toMatchSnapshot();
  });
});
