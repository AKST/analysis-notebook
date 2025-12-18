/**
 * @import { E } from './type.ts';
 */
import { MetaContainer } from './render.js';

/**
 * @template O
 */
export class MetaBuilder {
  /**
   * @param {E.Meta<O>} m
   */
  constructor(m) { this.meta = m; }

  /**
   * @template {keyof O} K
   * @param {K} key
   * @param {O[K]} val
   * @returns {MetaBuilder<O>}
   */
  attr(key, val) {
    this.meta = attr(this.meta, key, val);
    return this;
  }

  /**
   * @param {Partial<O>} update
   * @returns {MetaBuilder<O>}
   */
  attrs(update) {
    this.meta = attrs(this.meta, update);
    return this;
  }

  /**
   * @template O2
   * @param {O2} update
   * @returns {MetaBuilder<O2>}
   */
  setAttr(update) {
    return new MetaBuilder(setAttr(this.meta, update));
  }

  /**
   * @param {string} key
   * @param {string} value
   * @returns {MetaBuilder<O>}
   */
  data(key, value) {
    this.meta = data(this.meta, key, value);
    return this;
  }

  /**
   * @param {E.Styles} styleUpdate
   * @returns {MetaBuilder<O>}
   */
  style(styleUpdate) {
    this.meta = style(this.meta, styleUpdate);
    return this;
  }
}

/**
 * @template O
 * @param {E.Meta<O>} meta
 * @returns {MetaBuilder<O>}
 */
export function build(meta) {
  return new MetaBuilder(meta);
}

/**
 * @template O
 * @template {keyof O} K
 * @param {E.Meta<O>} meta
 * @param {K} key
 * @param {O[K]} val
 */
export function attr(meta, key, val) {
  return new MetaContainer(
    meta.events,
    meta.dataset,
    meta.styles,
    { ...meta.attributes, [key]: val },
  );
}

/**
 * @template O
 * @template {keyof O} K
 * @param {E.Meta<O>} meta
 * @param {Partial<E.Meta<O>>} update
 */
export function attrs(meta, update) {
  return new MetaContainer(
    meta.events,
    meta.dataset,
    meta.styles,
    { ...meta.attributes, ...update },
  );
}

/**
 * @template O
 * @template O2
 * @param {E.Meta<O>} meta
 * @param {O2} update
 */
export function setAttr(meta, update) {
  return new MetaContainer(
    meta.events,
    meta.dataset,
    meta.styles,
    update,
  );
}

/**
 * @template O
 * @template {keyof O} K
 * @param {E.Meta<O>} meta
 * @param {string} key
 * @param {string} value
 */
export function data(meta, key, value) {
  return new MetaContainer(
    meta.events,
    { ...meta.dataset, [key]: value },
    meta.styles,
    meta.attributes,
  );
}

/**
 * @template O
 * @template {keyof O} K
 * @param {E.Meta<O>} meta
 * @param {E.Styles} styleUpdate
 */
export function style(meta, styleUpdate) {
  return new MetaContainer(
    meta.events,
    meta.dataset,
    { ...meta.styles, ...styleUpdate },
    meta.attributes,
  );
}
