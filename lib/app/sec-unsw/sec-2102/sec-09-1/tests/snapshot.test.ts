import { beforeEach, expect, describe, it } from 'vitest';
import { renderWidget } from '@base/runtime/testing/test-multi.js';
import * as doc from '../doc.js';

describe('app(unsw::2102::09.1).widgets', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
  });

  it('intro', () => {
    const el = renderWidget(doc.intro);
    expect(el.outerHTML).toMatchSnapshot();
  });

  it('introduction', () => {
    const el = renderWidget(doc.introduction);
    expect(el.outerHTML).toMatchSnapshot();
  });

  it('tradeAcrossTime', () => {
    const el = renderWidget(doc.tradeAcrossTime);
    expect(el.outerHTML).toMatchSnapshot();
  });

  it('tradeWithProduction', () => {
    const el = renderWidget(doc.tradeWithProduction);
    expect(el.outerHTML).toMatchSnapshot();
  });

  it('tradeInInputs', () => {
    const el = renderWidget(doc.tradeInInputs);
    expect(el.outerHTML).toMatchSnapshot();
  });

  it('costsOfTrade', () => {
    const el = renderWidget(doc.costsOfTrade);
    expect(el.outerHTML).toMatchSnapshot();
  });

  it('tradeDeficitForeignDebt', () => {
    const el = renderWidget(doc.tradeDeficitForeignDebt);
    expect(el.outerHTML).toMatchSnapshot();
  });
});
