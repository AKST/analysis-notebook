import { beforeEach, expect, describe, it } from 'vitest';
import { renderWidget } from '@base/runtime/testing/test-multi.js';
import * as doc from '../doc.js';

describe('app(unsw::2206::09.1).widgets', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
  });

  it('intro', () => {
    const el = renderWidget(doc.intro);
    expect(el.outerHTML).toMatchSnapshot();
  });

  it('poolingIndependentCrossSections', () => {
    const el = renderWidget(doc.poolingIndependentCrossSections);
    expect(el.outerHTML).toMatchSnapshot();
  });

  it('policyAnalysisPooledCrossSections', () => {
    const el = renderWidget(doc.policyAnalysisPooledCrossSections);
    expect(el.outerHTML).toMatchSnapshot();
  });

  it('twoPeriodPanelDataAnalysis', () => {
    const el = renderWidget(doc.twoPeriodPanelDataAnalysis);
    expect(el.outerHTML).toMatchSnapshot();
  });

  it('policyAnalysisTwoPeriodPanelData', () => {
    const el = renderWidget(doc.policyAnalysisTwoPeriodPanelData);
    expect(el.outerHTML).toMatchSnapshot();
  });

  it('differencingMoreThanTwoTimePeriods', () => {
    const el = renderWidget(doc.differencingMoreThanTwoTimePeriods);
    expect(el.outerHTML).toMatchSnapshot();
  });
});
