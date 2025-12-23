import { beforeEach, expect, describe, it } from 'vitest';
import { renderWidget } from '@base/runtime/testing/test-multi.js';
import * as doc from '../doc.js';

describe('app(unsw::2102::01.1).widgets', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
  });

  it('intro', () => {
    const el = renderWidget(doc.intro);
    expect(el.outerHTML).toMatchSnapshot();
  });

  it('modelOfProduction', () => {
    const el = renderWidget(doc.modelOfProduction);
    expect(el.outerHTML).toMatchSnapshot();
  });

  it('deminishingReturns', () => {
    const el = renderWidget(doc.deminishingReturns);
    expect(el.outerHTML).toMatchSnapshot();
  });

  it('marginalProducts', () => {
    const el = renderWidget(doc.marginalProducts);
    expect(el.outerHTML).toMatchSnapshot();
  });

  it('modelOfFirmsBehaviour', () => {
    const el = renderWidget(doc.modelOfFirmsBehaviour);
    expect(el.outerHTML).toMatchSnapshot();
  });

  it('solvingModelEquilibrium', () => {
    const el = renderWidget(doc.solvingModelEquilibrium);
    expect(el.outerHTML).toMatchSnapshot();
  });

  it('nationalAccounting', () => {
    const el = renderWidget(doc.nationalAccounting);
    expect(el.outerHTML).toMatchSnapshot();
  });

  it('experiments', () => {
    const el = renderWidget(doc.experiments);
    expect(el.outerHTML).toMatchSnapshot();
  });

  it('whatFactorsMightCauseDiffInTFP', () => {
    const el = renderWidget(doc.whatFactorsMightCauseDiffInTFP);
    expect(el.outerHTML).toMatchSnapshot();
  });

  it('regressingCobbDouglas', () => {
    const el = renderWidget(doc.regressingCobbDouglas);
    expect(el.outerHTML).toMatchSnapshot();
  });

  it('cesProductionFunction', () => {
    const el = renderWidget(doc.cesProductionFunction);
    expect(el.outerHTML).toMatchSnapshot();
  });
});
