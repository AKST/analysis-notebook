import { beforeEach, expect, describe, it } from 'vitest';
import { renderWidget } from '@base/runtime/testing/test-multi.js';
import * as doc from '../doc.js';

describe('app(unsw::2206::08.1).widgets', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
  });

  it('intro', () => {
    const el = renderWidget(doc.intro);
    expect(el.outerHTML).toMatchSnapshot();
  });

  it('natureOfTimeSeriesData', () => {
    const el = renderWidget(doc.natureOfTimeSeriesData);
    expect(el.outerHTML).toMatchSnapshot();
  });

  it('examplesOfTimeSeriesModels', () => {
    const el = renderWidget(doc.examplesOfTimeSeriesModels);
    expect(el.outerHTML).toMatchSnapshot();
  });

  it('finiteSamplePropertiesOLS', () => {
    const el = renderWidget(doc.finiteSamplePropertiesOLS);
    expect(el.outerHTML).toMatchSnapshot();
  });

  it('functionalFormDummyVariables', () => {
    const el = renderWidget(doc.functionalFormDummyVariables);
    expect(el.outerHTML).toMatchSnapshot();
  });

  it('trendsAndSeasonality', () => {
    const el = renderWidget(doc.trendsAndSeasonality);
    expect(el.outerHTML).toMatchSnapshot();
  });
});
