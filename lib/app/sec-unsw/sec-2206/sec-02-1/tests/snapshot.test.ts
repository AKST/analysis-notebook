import { beforeEach, expect, describe, it } from 'vitest';
import { renderWidget } from '@base/runtime/testing/test-multi.js';
import * as doc from '../doc.js';

describe('app(unsw::2206::02.1).widgets', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
  });

  it('intro', () => {
    const el = renderWidget(doc.intro);
    expect(el.outerHTML).toMatchSnapshot();
  });

  it('motivationForMultiRegression', () => {
    const el = renderWidget(doc.motivationForMultiRegression);
    expect(el.outerHTML).toMatchSnapshot();
  });

  it('mechanicsOfOLS', () => {
    const el = renderWidget(doc.mechanicsOfOLS);
    expect(el.outerHTML).toMatchSnapshot();
  });

  it('expectedOLSEstimators', () => {
    const el = renderWidget(doc.expectedOLSEstimators);
    expect(el.outerHTML).toMatchSnapshot();
  });

  it('expectedOLSEstimatorsIrrelevantVars', () => {
    const el = renderWidget(doc.expectedOLSEstimatorsIrrelevantVars);
    expect(el.outerHTML).toMatchSnapshot();
  });

  it('expectedOLSEstimatorsOmittedVariableBias', () => {
    const el = renderWidget(doc.expectedOLSEstimatorsOmittedVariableBias);
    expect(el.outerHTML).toMatchSnapshot();
  });

  it('expectedOLSEstimatorsVariance', () => {
    const el = renderWidget(doc.expectedOLSEstimatorsVariance);
    expect(el.outerHTML).toMatchSnapshot();
  });

  it('varianceInMisspecifedModels', () => {
    const el = renderWidget(doc.varianceInMisspecifedModels);
    expect(el.outerHTML).toMatchSnapshot();
  });

  it('estimatingStandardErrorOfOLSEstimators', () => {
    const el = renderWidget(doc.estimatingStandardErrorOfOLSEstimators);
    expect(el.outerHTML).toMatchSnapshot();
  });

  it('efficiencyOfOLS', () => {
    const el = renderWidget(doc.efficiencyOfOLS);
    expect(el.outerHTML).toMatchSnapshot();
  });

  it('other', () => {
    const el = renderWidget(doc.other);
    expect(el.outerHTML).toMatchSnapshot();
  });

  it('beyondTheScope', () => {
    const el = renderWidget(doc.beyondTheScope);
    expect(el.outerHTML).toMatchSnapshot();
  });
});
