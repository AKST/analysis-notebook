import { beforeEach, expect, describe, it } from 'vitest';
import { renderWidget } from '@base/runtime/testing/test-multi.js';
import * as doc from '../doc.js';

describe('app(unsw::2206::01.1).widgets', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
  });

  it('intro', () => {
    const el = renderWidget(doc.intro);
    expect(el.outerHTML).toMatchSnapshot();
  });

  it('about', () => {
    const el = renderWidget(doc.about);
    expect(el.outerHTML).toMatchSnapshot();
  });

  it('structureOfEconomicData', () => {
    const el = renderWidget(doc.structureOfEconomicData);
    expect(el.outerHTML).toMatchSnapshot();
  });

  it('causality', () => {
    const el = renderWidget(doc.causality);
    expect(el.outerHTML).toMatchSnapshot();
  });
});
