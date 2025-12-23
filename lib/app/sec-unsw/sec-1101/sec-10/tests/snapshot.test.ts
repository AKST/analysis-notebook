import { beforeEach, expect, describe, it } from 'vitest';
import { renderWidget } from '@base/runtime/testing/test-multi.js';
import * as doc from '../doc.js';

describe('app(unsw::1101::10).widgets', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
  });

  it('header', () => {
    const el = renderWidget(doc.header);
    expect(el.outerHTML).toMatchSnapshot();
  });

  it('curveInformation', () => {
    const el = renderWidget(doc.curveInformation);
    expect(el.outerHTML).toMatchSnapshot();
  });

  it('aggregatingDemandForPublicGoods', () => {
    const el = renderWidget(doc.aggregatingDemandForPublicGoods);
    expect(el.outerHTML).toMatchSnapshot();
  });

  it('freeRiding', () => {
    const el = renderWidget(doc.freeRiding);
    expect(el.outerHTML).toMatchSnapshot();
  });

  it('marketFailure', () => {
    const el = renderWidget(doc.marketFailure);
    expect(el.outerHTML).toMatchSnapshot();
  });
});
