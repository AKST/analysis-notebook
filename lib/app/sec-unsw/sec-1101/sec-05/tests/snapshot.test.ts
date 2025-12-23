import { beforeEach, expect, describe, it } from 'vitest';
import { renderWidget } from '@base/runtime/testing/test-multi.js';
import * as doc from '../doc.js';

describe('app(unsw::1101::05).widgets', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
  });

  it('header', () => {
    const el = renderWidget(doc.header);
    expect(el.outerHTML).toMatchSnapshot();
  });

  it('priceControls', () => {
    const el = renderWidget(doc.priceControls);
    expect(el.outerHTML).toMatchSnapshot();
  });

  it('taxesAndSubsidies', () => {
    const el = renderWidget(doc.taxesAndSubsidies);
    expect(el.outerHTML).toMatchSnapshot();
  });

  it('taxBurdenTable', () => {
    const el = renderWidget(doc.taxBurdenTable);
    expect(el.outerHTML).toMatchSnapshot();
  });
});
