import { beforeEach, expect, describe, it } from 'vitest';
import { renderWidget } from '@base/runtime/testing/test-multi.js';
import * as doc from '../doc.js';

describe('app(unsw::2206::07.1).widgets', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
  });

  it('intro', () => {
    const el = renderWidget(doc.intro);
    expect(el.outerHTML).toMatchSnapshot();
  });

  it('functionalFormMisspecification', () => {
    const el = renderWidget(doc.functionalFormMisspecification);
    expect(el.outerHTML).toMatchSnapshot();
  });

  it('usingProxyVariables', () => {
    const el = renderWidget(doc.usingProxyVariables);
    expect(el.outerHTML).toMatchSnapshot();
  });

  it('modelsWithRandomSlopes', () => {
    const el = renderWidget(doc.modelsWithRandomSlopes);
    expect(el.outerHTML).toMatchSnapshot();
  });

  it('olsUnderMeasurementError', () => {
    const el = renderWidget(doc.olsUnderMeasurementError);
    expect(el.outerHTML).toMatchSnapshot();
  });

  it('missingDataAndOutliers', () => {
    const el = renderWidget(doc.missingDataAndOutliers);
    expect(el.outerHTML).toMatchSnapshot();
  });

  it('leastAbsoluteDeviations', () => {
    const el = renderWidget(doc.leastAbsoluteDeviations);
    expect(el.outerHTML).toMatchSnapshot();
  });
});
