import { beforeEach, expect, describe, it } from 'vitest';
import { render } from '@base/dsl-dom/render.js';
import * as doc from '@base/dsl-dom/helper/html.js';
import * as mathml from '@base/dsl-dom/helper/mathml.js';
import { fontsize, responsiveGridAutoRow } from '../layout.js';
import { dashbox, note, noteOn, clsRef } from '../components.js';
import { annotationUnder, annotationOver } from '../mathml.js';

describe('layout', () => {
  beforeEach(() => { document.body.innerHTML = ''; });

  it('fontsize', () => {
    const el = render(fontsize(doc.span`test`, 14));
    expect(el.outerHTML).toMatchSnapshot();
  });

  it('responsiveGridAutoRow', () => {
    const el = render(responsiveGridAutoRow(
      [doc.div.c('a'), doc.div.c('b')],
      { columns: { slim: '1fr', mobile: '1fr 1fr', desktop: '1fr 1fr 1fr' } }
    ));
    expect(el.outerHTML).toMatchSnapshot();
  });
});

describe('components', () => {
  beforeEach(() => { document.body.innerHTML = ''; });

  it('dashbox', () => {
    const el = render(dashbox(doc.p`content`));
    expect(el.outerHTML).toMatchSnapshot();
  });

  it('note', () => {
    const el = render(note(doc.li`item`));
    expect(el.outerHTML).toMatchSnapshot();
  });

  it('noteOn', () => {
    const el = render(noteOn('topic')(doc.li`item`));
    expect(el.outerHTML).toMatchSnapshot();
  });

  it('clsRef', () => {
    const el = render(clsRef({ lec: { id: [1], slide: 5 } }, doc.h2`Title`));
    expect(el.outerHTML).toMatchSnapshot();
  });
});

describe('mathml', () => {
  beforeEach(() => { document.body.innerHTML = ''; });

  it('annotationUnder', () => {
    const el = render(annotationUnder({ label: mathml.mi`x`, labelSize: 12 }).c(mathml.mi`y`));
    expect(el.outerHTML).toMatchSnapshot();
  });

  it('annotationOver', () => {
    const el = render(annotationOver({ label: mathml.mi`x`, labelSize: 12 }).c(mathml.mi`y`));
    expect(el.outerHTML).toMatchSnapshot();
  });
});
