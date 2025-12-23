import { beforeEach, expect, describe, it } from 'vitest';
import { renderWidget } from '@base/runtime/testing/test-multi.js';
import * as doc from '../doc.js';

describe('app(unsw::2206::04.2).widgets', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
  });

  it('intro', () => {
    const el = renderWidget(doc.intro);
    expect(el.outerHTML).toMatchSnapshot();
  });

  it('dataScaling', () => {
    const el = renderWidget(doc.dataScaling);
    expect(el.outerHTML).toMatchSnapshot();
  });

  it('moreOnFunctionalForm', () => {
    const el = renderWidget(doc.moreOnFunctionalForm);
    expect(el.outerHTML).toMatchSnapshot();
  });

  it('moreOnGoodnessOfFit', () => {
    const el = renderWidget(doc.moreOnGoodnessOfFit);
    expect(el.outerHTML).toMatchSnapshot();
  });

  it('predictionAndResidualAnalysis', () => {
    const el = renderWidget(doc.predictionAndResidualAnalysis);
    expect(el.outerHTML).toMatchSnapshot();
  });
});
