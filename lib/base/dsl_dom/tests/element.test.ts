import { E } from '../type.ts';
import { expect, describe, it, beforeEach, vi } from 'vitest';
import { render, update, attr, node, frag } from '../render.js';

const SVG_NS = 'http://www.w3.org/2000/svg';
const HTML_NS = 'http://www.w3.org/1999/xhtml';
const MATH_NS = 'http://www.w3.org/1998/Math/MathML';

describe('Element namespace and fragment handling', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
  });

  describe('render', () => {
    it.each([
      [HTML_NS, node('html', 'div', attr(), [])],
      [HTML_NS, node('html', 'p', attr())],
      [HTML_NS, node('html', 'b', undefined, [])],
      [HTML_NS, node('html', 'i', attr(), undefined)],
      [HTML_NS, node('html', 's')],
      [SVG_NS, node('svg', 'rect', attr('svg', 'rect').elem('width', 2), [])],
      // apparently tagName's are in lowercase with this namespace...
      [MATH_NS, node('mathml', 'math')],
    ])('should render text %p', (ns: string, vDom: E.Node<string, string, unknown>) => {
      const aDom = render(vDom) as any;
      expect(aDom.namespaceURI).toEqual(ns);
      expect(aDom.tagName).toMatch(new RegExp(vDom.tagName, 'i'))
    });

    it('basic text', () => {
      const vDom = node('html', 'p', undefined, ['hello']);
      const aDom = render(vDom);
      expect(aDom.textContent).toEqual('hello');
    });

    it('set simple attribute', () => {
      const vDom = node('svg', 'rect', attr('html', 'div').elem('id', 'a'), []);
      const aDom = render(vDom);
      expect(aDom.getAttribute('id')).toEqual('a');
      expect(aDom.id).toEqual('a');
    });

    it('set attribute which requires normalisation', () => {
      const vDom = node('svg', 'rect', attr('svg', 'rect').elem('width', 2), []);
      const aDom = render(vDom);
      expect(aDom.getAttribute('width')).toEqual('2');
      // JSDOM won't correctly update `width.baseVal.valueInSpecifiedUnits`
    });

    it('with classList attribute', () => {
      const vAttrs = attr('html', 'div').elem('classList', ['a', 'b']);
      const vDom = node('html', 'div', vAttrs, []);
      const aDom = render(vDom);
      expect(Array.from(aDom.classList)).toEqual(['a', 'b']);
    });

    it('with className attribute', () => {
      const vAttrs = attr('html', 'div').elem('className', 'helloworld');
      const vDom = node('html', 'div', vAttrs, []);
      const aDom = render(vDom);
      expect(aDom.className).toEqual('helloworld');
      expect(Array.from(aDom.classList)).toEqual(['helloworld']);
    });

    it.each([
      ['disabled' as const, true],
      [true, true],
      [null, false],
      [undefined, false],
      [false, false],
      ['' as const, false],
    ])('with disabled attribute %s=%s', (a, b) => {
      const vAttrs = attr('html', 'input').elem('disabled', a);
      const vDom = node('html', 'input', vAttrs, []);
      const aDom = render(vDom);
      expect(aDom.disabled).toEqual(b);
    });

    it('with style single property', () => {
      const vAttrs = attr('html', 'div').style({ color: 'red' });
      const vDom = node('html', 'div', vAttrs, []);
      const aDom = render(vDom);
      expect(aDom.style.color).toEqual('red');
    });

    it('with style multiple properties', () => {
      const vAttrs = attr('html', 'div').style({
        backgroundColor: 'blue',
        fontSize: '16px',
        display: 'block'
      });
      const vDom = node('html', 'div', vAttrs, []);
      const aDom = render(vDom);
      expect(aDom.style.backgroundColor).toEqual('blue');
      expect(aDom.style.fontSize).toEqual('16px');
      expect(aDom.style.display).toEqual('block');
    });

    it('with style and elem combined', () => {
      const vAttrs = attr('html', 'div')
        .style({ color: 'red' })
        .elem('id', 'test');
      const vDom = node('html', 'div', vAttrs, []);
      const aDom = render(vDom);
      expect(aDom.style.color).toEqual('red');
      expect(aDom.id).toEqual('test');
    });

    it('render children, all vnodes', () => {
      const vDom = node('html', 'div', undefined, [
        node('html', 'p', undefined, ['hello ']),
        node('html', 'p', undefined, ['world', 1]),
      ]);

      const aDom = render(vDom);

      // preserves whitespace
      expect(aDom.textContent).toEqual('hello world1');
      expect(aDom.childNodes.length).toEqual(2);
    });

    it('render children, with domnodes', () => {
      const vDom = node('html', 'div', undefined, [
        render(node('html', 'p', undefined, ['hello '])),
        node('html', 'p', undefined, ['world', 1]),
      ]);

      const aDom = render(vDom);

      // preserves whitespace
      expect(aDom.textContent).toEqual('hello world1');
      expect(aDom.childNodes.length).toEqual(2);
    });

    it('flattens fragments', () => {
      const vDom = node('html', 'div', undefined, [
        node('html', 'h1', undefined, ['hello world']),
        frag(
          node('html', 'p', undefined, ['text 1.']),
          node('html', 'p', undefined, ['text 2.']),
        ),
      ]);
      const aDom = render(vDom);
      expect(aDom.childNodes.length).toEqual(3);
      expect(aDom.childNodes[1].textContent).toEqual('text 1.');
      expect(aDom.childNodes[2].textContent).toEqual('text 2.');
    });
  });

  describe('update', () => {
    it('replace node', () => {
      const va = node('html', 'div');
      const vb = node('html', 'span');
      const domA = render(va);
      const domB = update(domA, vb);

      expect(domB).not.toBe(null);
      expect(domB?.tagName).toMatch(/span/i);
    });

    it('basic attribute update (id)', () => {
      const vAttrA = attr('html', 'div').elem('id', 'a');
      const vDomA = node('html', 'div', vAttrA, []);
      const domA = render(vDomA);
      expect(Array.from(domA.id)).toEqual(['a']);

      const vAttrB = attr('html', 'div').elem('id', 'b');
      const vDomB = node('html', 'div', vAttrB, []);
      update(domA, vDomB);
      expect(Array.from(domA.id)).toEqual(['b']);
    });

    it('update classList attribute', () => {
      const vAttrA = attr('html', 'div').elem('classList', ['a', 'b']);
      const vDomA = node('html', 'div', vAttrA, []);
      const domA = render(vDomA);
      expect(Array.from(domA.classList)).toEqual(['a', 'b']);

      const vAttrB = attr('html', 'div').elem('classList', ['b', 'c']);
      const vDomB = node('html', 'div', vAttrB, []);
      const domB = update(domA, vDomB);
      expect(domB).toEqual(undefined);
      expect(Array.from(domA.classList)).toEqual(['b', 'c']);
      expect(domA.className).toEqual('b c');
    });

    it('update input value attribute - no unnecessary setAttribute when value unchanged', () => {
      const vAttrA = attr('html', 'input').elem('value', 100);
      const vDomA = node('html', 'input', vAttrA, []);
      const domA = render(vDomA);

      const setAttributeSpy = vi.spyOn(domA, 'setAttribute');

      const vAttrB = attr('html', 'input').elem('value', 100);
      const vDomB = node('html', 'input', vAttrB, []);
      const domB = update(domA, vDomB);
      expect(domB).toEqual(undefined);
      expect(domA.value).toEqual('100');
      expect(setAttributeSpy).not.toHaveBeenCalled();
    });

    it('update style single property', () => {
      const vAttrA = attr('html', 'div').style({ color: 'red' });
      const vDomA = node('html', 'div', vAttrA, []);
      const domA = render(vDomA);

      const vAttrB = attr('html', 'div').style({ color: 'blue' });
      const vDomB = node('html', 'div', vAttrB, []);
      update(domA, vDomB);
      expect(domA.style.color).toEqual('blue');
    });

    it('update style multiple properties', () => {
      const vAttrA = attr('html', 'div').style({ color: 'red', fontSize: '12px' });
      const vDomA = node('html', 'div', vAttrA, []);
      const domA = render(vDomA);

      const vAttrB = attr('html', 'div').style({ color: 'blue', fontSize: '16px', display: 'block' });
      const vDomB = node('html', 'div', vAttrB, []);
      update(domA, vDomB);
      expect(domA.style.color).toEqual('blue');
      expect(domA.style.fontSize).toEqual('16px');
      expect(domA.style.display).toEqual('block');
    });

    it.skip('update style remove property', () => {
      const vAttrA = attr('html', 'div').style({ color: 'red', fontSize: '12px' });
      const vDomA = node('html', 'div', vAttrA, []);
      const domA = render(vDomA);

      const vAttrB = attr('html', 'div').style({ color: 'red' });
      const vDomB = node('html', 'div', vAttrB, []);
      update(domA, vDomB);
      expect(domA.style.color).toEqual('red');
      expect(domA.style.fontSize).toEqual(undefined);
    });

    it('update style - no changes when style unchanged', () => {
      const vAttrA = attr('html', 'div').style({ color: 'red' });
      const vDomA = node('html', 'div', vAttrA, []);
      const domA = render(vDomA);

      const vAttrB = attr('html', 'div').style({ color: 'red' });
      const vDomB = node('html', 'div', vAttrB, []);
      update(domA, vDomB);
      expect(domA.style.color).toEqual('red');
    });

    /*
     * This should preserve the text node reference
     * but update the text inside the node itself.
     */
    it('update children, nested text child', () => {
      const vDomA = node('html', 'div', undefined, [
        node('html', 'p', undefined, ['hello world!'])
      ]);
      const vDomB = node('html', 'div', undefined, [
        node('html', 'p', undefined, ['goodbye world?'])
      ]);

      const domA = render(vDomA);
      const domAP = domA.firstChild;
      const domAPT = domA.firstChild?.firstChild;
      const domB = update(domA, vDomB);
      expect(domB).toEqual(undefined);
      expect(domA.firstChild).toEqual(domAP);
      expect(domA.firstChild?.firstChild).toEqual(domAPT);
      expect(domA.firstChild?.firstChild?.textContent).toEqual('goodbye world?');
    });

    it('update children, nested element child', () => {
      const vDomA = node('html', 'div', undefined, [
        node('html', 'p', undefined, [node('html', 'span')])
      ]);
      const vDomB = node('html', 'div', undefined, [
        node('html', 'p', undefined, [node('html', 'p')])
      ]);

      const domA = render(vDomA);
      const domAP = domA.firstChild;
      const domB = update(domA, vDomB);
      expect(domB).toEqual(undefined);
      expect(domA.children[0]).toEqual(domAP);
      expect(domA.children[0].children[0].tagName).toMatch(/p/i);
    });
  });
});
