import { beforeEach, expect, describe, it } from 'vitest';
import { renderWidget } from '@base/runtime/testing/test-multi.js';
import * as doc from '../doc.js';

describe('app(unsw::2206::05.1).widgets', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
  });

  it('intro', () => {
    const el = renderWidget(doc.intro);
    expect(el.outerHTML).toMatchSnapshot();
  });

  it('describingQualitativeInformation', () => {
    const el = renderWidget(doc.describingQualitativeInformation);
    expect(el.outerHTML).toMatchSnapshot();
  });

  it('aSingleDummyIndependentVariable', () => {
    const el = renderWidget(doc.aSingleDummyIndependentVariable);
    expect(el.outerHTML).toMatchSnapshot();
  });

  it('dummyVariablesForMultiCategories', () => {
    const el = renderWidget(doc.dummyVariablesForMultiCategories);
    expect(el.outerHTML).toMatchSnapshot();
  });

  it('dummyInteractions', () => {
    const el = renderWidget(doc.dummyInteractions);
    expect(el.outerHTML).toMatchSnapshot();
  });

  it('binaryDependentVariable', () => {
    const el = renderWidget(doc.binaryDependentVariable);
    expect(el.outerHTML).toMatchSnapshot();
  });

  it('policyAnalysis', () => {
    const el = renderWidget(doc.policyAnalysis);
    expect(el.outerHTML).toMatchSnapshot();
  });

  it('interpretingRegressionResults', () => {
    const el = renderWidget(doc.interpretingRegressionResults);
    expect(el.outerHTML).toMatchSnapshot();
  });
});
