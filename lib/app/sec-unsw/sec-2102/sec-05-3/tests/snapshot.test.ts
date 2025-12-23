import { beforeEach, expect, describe, it } from 'vitest';
import { renderWidget } from '@base/runtime/testing/test-multi.js';
import * as doc from '../doc.js';

describe('app(unsw::2102::05.3).widgets', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
  });

  it('header', () => {
    const el = renderWidget(doc.header);
    expect(el.outerHTML).toMatchSnapshot();
  });

  it('intro', () => {
    const el = renderWidget(doc.intro);
    expect(el.outerHTML).toMatchSnapshot();
  });

  it('theMPCurve1', () => {
    const el = renderWidget(doc.theMPCurve1);
    expect(el.outerHTML).toMatchSnapshot();
  });

  it('theMPCurve2', () => {
    const el = renderWidget(doc.theMPCurve2);
    expect(el.outerHTML).toMatchSnapshot();
  });

  it('philipCurve', () => {
    const el = renderWidget(doc.philipCurve);
    expect(el.outerHTML).toMatchSnapshot();
  });

  it('usingShortRunModel', () => {
    const el = renderWidget(doc.usingShortRunModel);
    expect(el.outerHTML).toMatchSnapshot();
  });

  it('microFoundations1', () => {
    const el = renderWidget(doc.microFoundations1);
    expect(el.outerHTML).toMatchSnapshot();
  });

  it('microFoundations2', () => {
    const el = renderWidget(doc.microFoundations2);
    expect(el.outerHTML).toMatchSnapshot();
  });

  it('insideTheFed', () => {
    const el = renderWidget(doc.insideTheFed);
    expect(el.outerHTML).toMatchSnapshot();
  });
});
