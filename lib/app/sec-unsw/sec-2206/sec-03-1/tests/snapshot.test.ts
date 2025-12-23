import { beforeEach, expect, describe, it } from 'vitest';
import { renderWidget } from '@base/runtime/testing/test-multi.js';
import * as doc from '../doc.js';

describe('app(unsw::2206::03.1).widgets', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
  });

  it('intro', () => {
    const el = renderWidget(doc.intro);
    expect(el.outerHTML).toMatchSnapshot();
  });

  it('samplingDistribution', () => {
    const el = renderWidget(doc.samplingDistribution);
    expect(el.outerHTML).toMatchSnapshot();
  });

  it('hypothesisTestingTDist', () => {
    const el = renderWidget(doc.hypothesisTestingTDist);
    expect(el.outerHTML).toMatchSnapshot();
  });

  it('hypothesisTestingTStat', () => {
    const el = renderWidget(doc.hypothesisTestingTStat);
    expect(el.outerHTML).toMatchSnapshot();
  });

  it('hypothesisTestingOneSided', () => {
    const el = renderWidget(doc.hypothesisTestingOneSided);
    expect(el.outerHTML).toMatchSnapshot();
  });

  it('hypothesisTestingTwoSided', () => {
    const el = renderWidget(doc.hypothesisTestingTwoSided);
    expect(el.outerHTML).toMatchSnapshot();
  });

  it('stataOutputExample', () => {
    const el = renderWidget(doc.stataOutputExample);
    expect(el.outerHTML).toMatchSnapshot();
  });

  it('significaneLevelTable', () => {
    const el = renderWidget(doc.significaneLevelTable);
    expect(el.outerHTML).toMatchSnapshot();
  });

  it('typeErrors', () => {
    const el = renderWidget(doc.typeErrors);
    expect(el.outerHTML).toMatchSnapshot();
  });

  it('pValues', () => {
    const el = renderWidget(doc.pValues);
    expect(el.outerHTML).toMatchSnapshot();
  });

  it('confindenceIntervals', () => {
    const el = renderWidget(doc.confindenceIntervals);
    expect(el.outerHTML).toMatchSnapshot();
  });

  it('testingHypothesisAboutASingleLinearCombinationOfParameters', () => {
    const el = renderWidget(doc.testingHypothesisAboutASingleLinearCombinationOfParameters);
    expect(el.outerHTML).toMatchSnapshot();
  });

  it('fTest', () => {
    const el = renderWidget(doc.fTest);
    expect(el.outerHTML).toMatchSnapshot();
  });

  it('fDistribution', () => {
    const el = renderWidget(doc.fDistribution);
    expect(el.outerHTML).toMatchSnapshot();
  });
});
