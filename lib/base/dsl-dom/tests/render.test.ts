import { expect, describe, it, beforeEach, vi } from 'vitest';
import * as Meta from '../node-meta.js';
import { render, update, meta, node, frag, insert } from '../render.js';
import { E } from '../type.ts';

const SVG_NS = 'http://www.w3.org/2000/svg';
const HTML_NS = 'http://www.w3.org/1999/xhtml';
const MATH_NS = 'http://www.w3.org/1998/Math/MathML';

describe('dsl-dom::render', () => {
  describe('render', () => {
    it.each([
      [HTML_NS, node('html', 'div', meta(), [])],
      [HTML_NS, node('html', 'p', meta())],
      [HTML_NS, node('html', 'b', undefined, [])],
      [HTML_NS, node('html', 'i', meta(), undefined)],
      [HTML_NS, node('html', 's')],
      [SVG_NS, node('svg', 'rect', Meta.build(meta('svg', 'rect')).attr('width', 2).meta, [])],
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
      const vDom = node('svg', 'rect', Meta.build(meta('html', 'div')).attr('id', 'a').meta, []);
      const aDom = render(vDom);
      expect(aDom.getAttribute('id')).toEqual('a');
      expect(aDom.id).toEqual('a');
    });

    it('set attribute which requires normalisation', () => {
      const aMeta = Meta.build(meta('svg', 'rect')).attr('width', 2).meta;
      const vDom = node('svg', 'rect', aMeta, []);
      const aDom = render(vDom);
      expect(aDom.getAttribute('width')).toEqual('2');
      // JSDOM won't correctly update `width.baseVal.valueInSpecifiedUnits`
    });

    it.each([
      ['string format', '0 0 100 100'],
      ['tuple format', [0, 0, 100, 100] as any],
    ])('set viewBox on svg element (%s)', (_label, viewBox) => {
      const aMeta = Meta.build(meta('svg', 'svg')).attr('viewBox', viewBox).meta;
      const vDom = node('svg', 'svg', aMeta, []);
      const aDom = render(vDom) as SVGSVGElement;
      expect(aDom.getAttribute('viewBox')).toEqual('0 0 100 100');
    });

    it('with classList attribute', () => {
      const vAttrs = Meta.build(meta('html', 'div')).attr('classList', ['a', 'b']).meta;
      const vDom = node('html', 'div', vAttrs, []);
      const aDom = render(vDom);
      expect(Array.from(aDom.classList)).toEqual(['a', 'b']);
    });

    it('with className attribute', () => {
      const vAttrs = Meta.build(meta('html', 'div')).attr('className', 'helloworld').meta;
      const vDom = node('html', 'div', vAttrs, []);
      const aDom = render(vDom);
      expect(aDom.className).toEqual('helloworld');
      expect(Array.from(aDom.classList)).toEqual(['helloworld']);
    });

    it('with className set to undefined', () => {
      const vAttrs = Meta.build(meta('html', 'div')).attr('className', undefined).meta;
      const vDom = node('html', 'div', vAttrs, []);
      const aDom = render(vDom);
      expect(aDom.className).toEqual('');
      expect(aDom.getAttribute('class')).toEqual(null);
      expect(Array.from(aDom.classList)).toEqual([]);
    });

    it('with className set to string "undefined"', () => {
      const vAttrs = Meta.build(meta('html', 'div')).attr('className', 'undefined').meta;
      const vDom = node('html', 'div', vAttrs, []);
      const aDom = render(vDom);
      expect(aDom.className).toEqual('undefined');
      expect(aDom.getAttribute('class')).toEqual('undefined');
      expect(Array.from(aDom.classList)).toEqual(['undefined']);
    });

    it.each([
      ['disabled' as const, true],
      [true, true],
      [null, false],
      [undefined, false],
      [false, false],
      ['' as const, false],
    ])('with disabled attribute %s=%s', (a, b) => {
      const vAttrs = Meta.build(meta('html', 'input')).attr('disabled', a).meta;
      const vDom = node('html', 'input', vAttrs, []);
      const aDom = render(vDom);
      expect(aDom.disabled).toEqual(b);
    });

    describe('style', () => {
      it('with style single property', () => {
        const vAttrs = Meta.build(meta('html', 'div')).style({ color: 'red' }).meta;
        const vDom = node('html', 'div', vAttrs, []);
        const aDom = render(vDom);
        expect(aDom.style.color).toEqual('red');
      });

      it('with style multiple properties', () => {
        const vAttrs = Meta.build(meta('html', 'div')).style({
          backgroundColor: 'blue',
          fontSize: '16px',
          display: 'block'
        }).meta;
        const vDom = node('html', 'div', vAttrs, []);
        const aDom = render(vDom);
        expect(aDom.style.backgroundColor).toEqual('blue');
        expect(aDom.style.fontSize).toEqual('16px');
        expect(aDom.style.display).toEqual('block');
      });

      it('with style and elem combined', () => {
        const vAttrs = Meta.build(meta('html', 'div'))
          .style({ color: 'red' })
          .attr('id', 'test')
          .meta;
        const vDom = node('html', 'div', vAttrs, []);
        const aDom = render(vDom);
        expect(aDom.style.color).toEqual('red');
        expect(aDom.id).toEqual('test');
      });
    });

    describe('style vars', () => {
      it('with style single property', () => {
        const vAttrs = Meta.build(meta('html', 'div')).styleProp({
          '--c-text': 'red'
        }).meta;

        const vDom = node('html', 'div', vAttrs, []);
        const aDom = render(vDom);
        expect(aDom.style.getPropertyValue('--c-text')).toEqual('red');
      });
    });

    describe('dataset', () => {
      it('with data single attribute', () => {
        const vAttrs = Meta.build(meta('html', 'div')).data('testKey', 'testValue').meta;
        const vDom = node('html', 'div', vAttrs, []);
        const aDom = render(vDom);
        expect(aDom.dataset.testKey).toEqual('testValue');
      });

      it('with data multiple attributes', () => {
        const vAttrs = Meta.build(meta('html', 'div'))
          .data('foo', 'bar')
          .data('baz', 'qux')
          .meta;
        const vDom = node('html', 'div', vAttrs, []);
        const aDom = render(vDom);
        expect(aDom.dataset.foo).toEqual('bar');
        expect(aDom.dataset.baz).toEqual('qux');
      });
    });

    describe('children variants', () => {
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

      it('insert with attributes and nested children', () => {
        const existingDiv = document.createElement('div');
        existingDiv.id = 'existing';
        const insertMeta = Meta.build(meta()).data('test', 'value').meta;
        const vDom = node('html', 'div', undefined, [
          insert(existingDiv, insertMeta, [
            node('html', 'span', undefined, ['inner content']),
          ]),
        ]);
        const aDom = render(vDom);
        expect(aDom.children[0]).toBe(existingDiv);
        expect(existingDiv.id).toEqual('existing');
        expect(existingDiv.dataset.test).toEqual('value');
        expect(existingDiv.childNodes.length).toEqual(1);
        expect(existingDiv.children[0].tagName).toMatch(/span/i);
        expect(existingDiv.children[0].textContent).toEqual('inner content');
      });
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
      const vAttrA = Meta.build(meta('html', 'div')).attr('id', 'a').meta;
      const vDomA = node('html', 'div', vAttrA, []);
      const domA = render(vDomA);
      expect(Array.from(domA.id)).toEqual(['a']);

      const vAttrB = Meta.build(meta('html', 'div')).attr('id', 'b').meta;
      const vDomB = node('html', 'div', vAttrB, []);
      update(domA, vDomB);
      expect(Array.from(domA.id)).toEqual(['b']);
    });

    it('update classList attribute', () => {
      const vAttrA = Meta.build(meta('html', 'div')).attr('classList', ['a', 'b']).meta;
      const vDomA = node('html', 'div', vAttrA, []);
      const domA = render(vDomA);
      expect(Array.from(domA.classList)).toEqual(['a', 'b']);

      const vAttrB = Meta.build(meta('html', 'div')).attr('classList', ['b', 'c']).meta;
      const vDomB = node('html', 'div', vAttrB, []);
      const domB = update(domA, vDomB);
      expect(domB).toEqual(undefined);
      expect(Array.from(domA.classList)).toEqual(['b', 'c']);
      expect(domA.className).toEqual('b c');
    });

    it('update input value attribute - no unnecessary setAttribute when value unchanged', () => {
      const vAttrA = Meta.build(meta('html', 'input')).attr('value', 100).meta;
      const vDomA = node('html', 'input', vAttrA, []);
      const domA = render(vDomA);

      const setAttributeSpy = vi.spyOn(domA, 'setAttribute');

      const vAttrB = Meta.build(meta('html', 'input')).attr('value', 100).meta;
      const vDomB = node('html', 'input', vAttrB, []);
      const domB = update(domA, vDomB);
      expect(domB).toEqual(undefined);
      expect(domA.value).toEqual('100');
      expect(setAttributeSpy).not.toHaveBeenCalled();
    });

    describe('style', () => {
      it('update style single property', () => {
        const vAttrA = Meta.build(meta('html', 'div')).style({ color: 'red' }).meta;
        const vDomA = node('html', 'div', vAttrA, []);
        const domA = render(vDomA);

        const vAttrB = Meta.build(meta('html', 'div')).style({ color: 'blue' }).meta;
        const vDomB = node('html', 'div', vAttrB, []);
        update(domA, vDomB);
        expect(domA.style.color).toEqual('blue');
      });

      it('update style multiple properties', () => {
        const vAttrA = Meta.build(meta('html', 'div'))
          .style({ color: 'red', fontSize: '12px' }).meta;
        const vDomA = node('html', 'div', vAttrA, []);
        const domA = render(vDomA);

        const vAttrB = Meta.build(meta('html', 'div'))
          .style({ color: 'blue', fontSize: '16px', display: 'block' }).meta;
        const vDomB = node('html', 'div', vAttrB, []);
        update(domA, vDomB);
        expect(domA.style.color).toEqual('blue');
        expect(domA.style.fontSize).toEqual('16px');
        expect(domA.style.display).toEqual('block');
      });

      it.skip('update style remove property', () => {
        const vAttrA = Meta.build(meta('html', 'div')).style({ color: 'red', fontSize: '12px' }).meta;
        const vDomA = node('html', 'div', vAttrA, []);
        const domA = render(vDomA);

        const vAttrB = Meta.build(meta('html', 'div')).style({ color: 'red' }).meta;
        const vDomB = node('html', 'div', vAttrB, []);
        update(domA, vDomB);
        expect(domA.style.color).toEqual('red');
        expect(domA.style.fontSize).toEqual(undefined);
      });

      it('update style - no changes when style unchanged', () => {
        const vAttrA = Meta.build(meta('html', 'div')).style({ color: 'red' }).meta;
        const vDomA = node('html', 'div', vAttrA, []);
        const domA = render(vDomA);

        const vAttrB = Meta.build(meta('html', 'div')).style({ color: 'red' }).meta;
        const vDomB = node('html', 'div', vAttrB, []);
        update(domA, vDomB);
        expect(domA.style.color).toEqual('red');
      });
    });

    describe('style vars', () => {
      it('with style single property', () => {
        const vAttrs = Meta.build(meta('html', 'div')).styleProp({
          '--c-text': 'red'
        }).meta;

        const vDomA = node('html', 'div', vAttrs, []);
        const domA = render(vDomA);

        const vAttrB = Meta.build(meta('html', 'div')).styleProp({
          '--c-text': 'blue'
        }).meta;
        const vDomB = node('html', 'div', vAttrB, []);
        update(domA, vDomB);
        expect(domA.style.getPropertyValue('--c-text')).toEqual('blue');
      });

      it('with style single property', () => {
        const vAttrs = Meta.build(meta('html', 'div')).styleProp({
          '--c-text': 'red'
        }).meta;

        const vDomA = node('html', 'div', vAttrs, []);
        const domA = render(vDomA);

        const vAttrB = Meta.build(meta('html', 'div')).styleProp({
          '--c-text': undefined
        }).meta;
        const vDomB = node('html', 'div', vAttrB, []);
        update(domA, vDomB);
        expect(domA.style.getPropertyValue('--c-text')).toEqual('');
      });
    });

    it('update data single attribute', () => {
      const vAttrA = Meta.build(meta('html', 'div')).data('userId', '123').meta;
      const vDomA = node('html', 'div', vAttrA, []);
      const domA = render(vDomA);

      const vAttrB = Meta.build(meta('html', 'div')).data('userId', '456').meta;
      const vDomB = node('html', 'div', vAttrB, []);
      update(domA, vDomB);
      expect(domA.dataset.userId).toEqual('456');
    });

    it('update data multiple attributes', () => {
      const vAttrA = Meta.build(meta('html', 'div'))
        .data('foo', 'bar')
        .data('baz', 'qux').meta;
      const vDomA = node('html', 'div', vAttrA, []);
      const domA = render(vDomA);

      const vAttrB = Meta.build(meta('html', 'div'))
        .data('foo', 'updated')
        .data('baz', 'changed')
        .data('new', 'value').meta;
      const vDomB = node('html', 'div', vAttrB, []);
      update(domA, vDomB);
      expect(domA.dataset.foo).toEqual('updated');
      expect(domA.dataset.baz).toEqual('changed');
      expect(domA.dataset.new).toEqual('value');
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
