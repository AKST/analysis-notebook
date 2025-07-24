/**
 * @import { E } from '../../prelude-type.ts';
 */

/**
 * @typedef {(
 *   | 'latin'
 *   | 'middle english'
 *   | 'middle french'
 * )} Origin
 * @param {{
 *   word: string,
 *   source: string,
 *   meaning: (E.Atom | E.Item[])[],
 *   etymology: { origin: Origin[] },
 *   pronunciation: {
 *     accent: 'rp',
 *     syntax: string,
 *   },
 * }} cfg
 * @returns {E.Item}
 */
export function defineTerm(cfg) {
  /** @param {string} origin @returns {E.Item[]} */
  const prependSeperator = (origin) => [
    ['strong', ' < '],
    ['span', {}, origin],
  ];
  return ['quote', { className: 'word-def' }, [
    ['div', { className: 'word-def-word' }, [
      ['dfn', [['strong', cfg.word]]],
      ['span', { className: 'word-de-ipa' }, [
        ['span', { className: 'word-def-ipa-syn' }, [cfg.pronunciation.syntax]],
        ['sup', { className: 'word-def-ipa-act' }, ['(', cfg.pronunciation.accent, ')']],
      ]],
    ]],
    ['ul', { className: 'word-def-meanings' }, (
      cfg.meaning.map(meaning => ['li', {}, meaning])
    )],
    ['hr'],
    ['div', { className: 'word-def-etymology' }, [
      ['strong', 'FROM:'], ' ',
      ['span', {}, cfg.etymology.origin[0]],
      /** @returns {E.Item[]} */
      ...cfg.etymology.origin.slice(1).flatMap(prependSeperator),
    ]],
    ['span', { className: 'word-def-source' }, [
      ['a', { href: cfg.source }, 'READ MORE'],
    ]],
  ]];
}

/**
 * @param {E.Item} title
 * @param {E.Item[]} body
 * @return {E.Item}
 */
export function infobox(title, body) {
  return ['aside', { className: 'infobox' }, [
    ['h3', { className: 'infobox-name' }, ['💡 ', title]],
    ['div', { className: 'infobox-body', }, body],
  ]];
}

/**
 * @param {{
 *   height?: number,
 *   leadingText?: string,
 * }} options
 * @param {...E.Item} content
 * @returns {E.Item}
 */
export const todo = ({
  height,
  leadingText = 'PLACEHOLDER',
}, ...content) => (
  ['p', {
    style: 'color: white; background: red; padding: 8px' +
      (height == null ? '' : `; height: ${height}px`)
  }, [
    ['strong', [leadingText]], ': ', ...content,
  ]]
);
