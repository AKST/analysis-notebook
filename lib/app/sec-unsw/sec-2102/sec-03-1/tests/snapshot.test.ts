import { beforeEach, expect, describe, it } from 'vitest';
import { renderWidget } from '@base/runtime/testing/test-multi.js';
import * as doc from '../doc.js';

describe('app(unsw::2102::03.1).widgets', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
  });

  it('header', () => {
    const el = renderWidget(doc.header);
    expect(el.outerHTML).toMatchSnapshot();
  });

  it('intro', () => {
    const el = renderWidget(doc.intro);
    expect(el.outerHTML).toMatchSnapshot();
  });

  it('unemploymentRate', () => {
    const el = renderWidget(doc.unemploymentRate);
    expect(el.outerHTML).toMatchSnapshot();
  });

  it('supplyAndDemand', () => {
    const el = renderWidget(doc.supplyAndDemand);
    expect(el.outerHTML).toMatchSnapshot();
  });

  it('bathtubModel', () => {
    const el = renderWidget(doc.bathtubModel);
    expect(el.outerHTML).toMatchSnapshot();
  });

  it('labourMarketsAroundTheWorld', () => {
    const el = renderWidget(doc.labourMarketsAroundTheWorld);
    expect(el.outerHTML).toMatchSnapshot();
  });

  it('valueOfHumanCapital', () => {
    const el = renderWidget(doc.valueOfHumanCapital);
    expect(el.outerHTML).toMatchSnapshot();
  });

  it('risingReturnToEducation', () => {
    const el = renderWidget(doc.risingReturnToEducation);
    expect(el.outerHTML).toMatchSnapshot();
  });

  it('economicGrowthAndIncomeInequality', () => {
    const el = renderWidget(doc.economicGrowthAndIncomeInequality);
    expect(el.outerHTML).toMatchSnapshot();
  });
});
