// @ts-nocheck
import { expect, describe, it, beforeEach } from 'vitest';
import { renderDocument as r, updateElement, frag } from '../render.js';

const SVG_NS = 'http://www.w3.org/2000/svg';
const HTML_NS = 'http://www.w3.org/1999/xhtml';

describe('Element namespace and fragment handling', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
  });

  function assertNamespace(element: Element, expectedNS: string | null, description: string) {
    const actualNS = element.namespaceURI === HTML_NS ? null : element.namespaceURI;
    expect(actualNS).toBe(expectedNS);
  }

  function assertTagName(element: Element, expectedTag: string, description: string) {
    expect(element.tagName.toLowerCase()).toBe(expectedTag.toLowerCase());
  }

  describe('Basic element creation', () => {
    it('creates HTML elements with null namespace', () => {
      const htmlDiv = r(['div', { className: 'test' }, ['Hello']], null, null) as any;
      assertNamespace(htmlDiv, null, 'HTML div should have null namespace');
      assertTagName(htmlDiv, 'div', 'Should create div element');
      expect(htmlDiv.className).toBe('test');
      expect(htmlDiv.textContent).toBe('Hello');
    });

    it('creates SVG elements with explicit namespace', () => {
      const svgRect = r(['rect', { ns: SVG_NS, x: '10', y: '20' }, []], null, null) as any;
      assertNamespace(svgRect, SVG_NS, 'SVG rect should have SVG namespace');
      assertTagName(svgRect, 'rect', 'Should create rect element');
      expect(svgRect.getAttribute('x')).toBe('10');
    });
  });

  describe('Namespace inheritance', () => {
    it('inherits SVG namespace to child elements', () => {
      const svgWithChildren = r(['svg', { ns: SVG_NS }, [
        ['circle', { cx: '50', cy: '50', r: '40' }, []],
        ['rect', { x: '10', y: '10' }, []]
      ]], null, null) as any;

      assertNamespace(svgWithChildren, SVG_NS, 'SVG root should have SVG namespace');
      assertNamespace(svgWithChildren.children[0], SVG_NS, 'SVG circle should inherit SVG namespace');
      assertNamespace(svgWithChildren.children[1], SVG_NS, 'SVG rect should inherit SVG namespace');
    });
  });

  describe('Fragment flattening', () => {
    it('flattens fragments correctly', () => {
      const fragContent = frag(
        ['p', {}, ['First paragraph']],
        ['p', {}, ['Second paragraph']],
        frag(
          ['p', {}, ['Nested first']],
          ['p', {}, ['Nested second']]
        )
      );

      const containerWithFrag = r(['div', {}, [
        ['h1', {}, ['Title']],
        fragContent,
        ['footer', {}, ['End']]
      ]], null, null) as any;

      expect(containerWithFrag.children.length).toBe(6);
      expect(containerWithFrag.children[0].tagName).toBe('H1');
      expect(containerWithFrag.children[1].tagName).toBe('P');
      expect(containerWithFrag.children[4].textContent).toBe('Nested second');
      expect(containerWithFrag.children[5].tagName).toBe('FOOTER');
    });
  });

  describe('Content handling', () => {
    it('handles mixed number and string content', () => {
      const mixedContent = r(['div', {}, [
        'Plain text',
        42,
        ['span', {}, ['Span content']],
        3.14
      ]], null, null) as any;

      expect(mixedContent.childNodes.length).toBe(4);
      expect(mixedContent.childNodes[0].textContent).toBe('Plain text');
      expect(mixedContent.childNodes[1].textContent).toBe('42');
      expect(mixedContent.childNodes[3].textContent).toBe('3.14');
    });
  });

  describe('updateElement functionality', () => {
    it('replaces element when namespace changes', () => {
      let htmlDiv2 = r(['div', {}, ['Original content']], null, null) as any;

      const replacement2 = updateElement(htmlDiv2, ['svg', { ns: SVG_NS }, [
        ['circle', { cx: '50', cy: '50', r: '40' }, []]
      ]], null, null);

      expect(replacement2).not.toBe(null);
      assertNamespace(replacement2!, SVG_NS, 'Replacement should have SVG namespace');
      assertTagName(replacement2!, 'svg', 'Replacement should be SVG element');
    });

    it('replaces element when tag name changes', () => {
      let divElement = r(['div', { className: 'original' }, ['Content']], null, null) as any;

      const replacement3 = updateElement(divElement, ['span', { className: 'updated' }, ['New content']], null, null) as any;

      expect(replacement3).not.toBe(null);
      assertTagName(replacement3!, 'span', 'Replacement should be span element');
      expect(replacement3!.className).toBe('updated');
      expect(replacement3!.textContent).toBe('New content');
    });
  });

  describe('Complex mixed namespace documents', () => {
    it('handles complex mixed namespace structure', () => {
      const complexDoc = r(['html', {}, [
        ['body', {}, [
          ['div', { className: 'container' }, [
            ['h1', {}, ['SVG Demo']],
            ['svg', { ns: SVG_NS, width: '100', height: '100' }, [
              ['circle', { cx: '50', cy: '50', r: '40', fill: 'red' }, []],
              ['rect', { x: '10', y: '10', width: '20', height: '20', fill: 'blue' }, []]
            ]],
            frag(
              ['p', {}, ['This paragraph comes from a fragment']],
              ['p', {}, ['This is another fragment paragraph']]
            )
          ]]
        ]]
      ]], null, null) as any;

      assertNamespace(complexDoc, null, 'HTML root should have null namespace');
      const svgEl = complexDoc.querySelector('svg')!;
      assertNamespace(svgEl, SVG_NS, 'SVG element should have SVG namespace');
      assertNamespace(svgEl.children[0], SVG_NS, 'SVG circle should have SVG namespace');
      assertNamespace(svgEl.children[1], SVG_NS, 'SVG rect should have SVG namespace');

      const paragraphs = complexDoc.querySelectorAll('p');
      expect(paragraphs.length).toBe(2);
      expect(paragraphs[0].textContent).toBe('This paragraph comes from a fragment');
    });
  });
});
