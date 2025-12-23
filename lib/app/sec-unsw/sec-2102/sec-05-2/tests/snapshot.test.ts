import { beforeEach, expect, describe, it } from 'vitest';
import { renderWidget } from '@base/runtime/testing/test-multi.js';
import * as doc from '../doc.js';

describe('app(unsw::2102::05.2).widgets', () => {
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

  it('settingUpTheEconomony', () => {
    const el = renderWidget(doc.settingUpTheEconomony);
    expect(el.outerHTML).toMatchSnapshot();
  });

  it('derivingTheIsCurve', () => {
    const el = renderWidget(doc.derivingTheIsCurve);
    expect(el.outerHTML).toMatchSnapshot();
  });

  it('usingTheIsCurve', () => {
    const el = renderWidget(doc.usingTheIsCurve);
    expect(el.outerHTML).toMatchSnapshot();
  });

  it('microfoundations', () => {
    const el = renderWidget(doc.microfoundations);
    expect(el.outerHTML).toMatchSnapshot();
  });

  it('tutorialNotes', () => {
    const el = renderWidget(doc.tutorialNotes);
    expect(el.outerHTML).toMatchSnapshot();
  });
});
