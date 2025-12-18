/**
 * @import { WidgetAnchor, WidgetFactory } from '../../type.ts';
 * @import { StyleManager } from './style-manager.js';
 * @import { DocumentWidget } from './type.ts';
 *
 * @typedef {Object} InitDocWidget
 * @property {HTMLElement} container
 * @property {string} containerId
 */

import { EventManager } from '../../../dom_app/index.js';
import { EffectRegistry } from '../../../dsl_dom/effects.js';
import { render, update } from '../../../dsl_dom/render.js';
import { createStyleManager } from './style-manager.js';

/**
 * @returns {WidgetFactory}
 */
export function createDocumentWidgetFactory() {
  return /** @type {any} */ ({
    /**
     * @template A
     * @template B
     * @template C
     * @param {DocumentWidget<A, B, C>} widget
     * @param {InitDocWidget} cfg
     * @returns {DocumentWidgetEngine<A, B, C>}
     */
    create(widget, { container, containerId }) {
      const styleManager = createStyleManager(containerId);
      const eventManager = new EventManager(container);
      return new DocumentWidgetEngine(widget, { container, styleManager, eventManager, containerId });
    }
  });
}

/**
 * @template Ctx
 * @template St
 * @template Cfg
 */
export class DocumentWidgetEngine {
  static renderStrategy = 'event';
  scalingStrategy = 'fluid';

  /** @type {{ count: number, prefix: string }} */
  titleCount;

  /** @type {DocumentWidget<Ctx, St, Cfg>} */
  module;

  effects = new EffectRegistry();
  rootElement = null;

  /**
   * @param {DocumentWidget<Ctx, St, Cfg>} module
   * @param {{
   *   container: HTMLElement,
   *   containerId: string,
   *   styleManager: StyleManager,
   *   eventManager: EventManager
   * }} config
   */
  constructor(module, {
    container,
    containerId,
    styleManager,
    eventManager,
  }) {
    this.module = module;
    this.container = container;
    this.styleManager = styleManager;
    this.eventManager = eventManager;
    this.context = null;
    this.titleCount = { count: 0, prefix: containerId };
  }

  /**
   * @param {(event: any) => void} onEvent
   */
  initialize(onEvent) {
    // Create default empty context
    const defaultContext = {};

    // Let module extend or replace the context
    // TODO move into engine
    this.context = this.module.createContext?.(defaultContext) ?? defaultContext;

    // Setup event delegation and styles
    this.eventManager.setEventHandler(onEvent);
    if (this.module.createStyle) {
      this.styleManager.applyStyles(this.module.createStyle());
    }
    if (this.styleManager.styleElement) {
      this.container.appendChild(this.styleManager.styleElement);
    }
  }

  /**
   * @param {Cfg} config
   * @param {St} state
   */
  render(config, state) {
    const spec = this.module.render(this.context, state, config);

    try {
      if (!this.rootElement) {
        const element = render(spec, this.effects);
        // @ts-ignore - not worth it
        this.rootElement = element;
        this.container.appendChild(element);
      } else {
        // Update render
        const replacement = update(this.rootElement, spec, this.effects);
        if (replacement) {
          this.container.replaceChild(replacement, this.rootElement);
          // @ts-ignore - not worth it
          this.rootElement = replacement;
        }
      }

      // this.eventManager.setupListeners(this.eventRegistry);
    } catch (e) {
      console.error(spec);
      throw e
    }
  }

  /**
   * @param {number} newWidth
   * @param {number} [newHeight]
   */
  resize(newWidth, newHeight) {
    if (newHeight !== undefined) {
      resizeContainer(this.container, newWidth, newHeight);
    } else if (this.container) {
      this.container.style.width = newWidth + 'px';
    }
  }

  /**
   * @param {Record<string, string | null>} styles
   */
  setStyle(styles) {
    for (const [property, value] of Object.entries(styles)) {
      if (value == null) {
        this.container.style.removeProperty(property);
      } else {
        // @ts-ignore - lets not
        this.container.style[property] = value;
      }
    }
  }

  /**
   * @returns {readonly WidgetAnchor[]}
   */
  getAnchors() {
    return Array.from(getHeadingAnchors(this.container, this.titleCount));
  }

  getHUD() {
    return {};
  }
}

/**
 * @param {HTMLElement} element
 * @param {{ count: number, prefix: string }} idMeta
 * @returns {Generator<WidgetAnchor>}
 */
function * getHeadingAnchors(element, idMeta) {
  for (const child of element.childNodes) {
    if (!(child instanceof HTMLElement)) continue;
    /** @type {number | undefined} */
    let level;

    const match = child.tagName?.match(/^H(\d)$/i);
    if (match) {
      level = parseInt(match[1]);
    } else if (child.tagName === 'SUMMARY') {
      level = 7;
    }

    if (level != null) {
      const title = child.innerText;

      let titleId;
      if (child.id) {
        titleId = child.id;
      } else {
        titleId = `${idMeta.prefix}-title-${idMeta.count}`;
        idMeta.count += 1;
        child.id = titleId;
      }

      yield { title, titleId, titleLevel: level };
    } else {
      yield * getHeadingAnchors(child, idMeta);
    }
  }
}

/**
 * @param {HTMLElement | null} container
 * @param {number} width
 * @param {number} height
 */
function resizeContainer(container, width, height) {
  if (container) {
    container.style.width = width + 'px';
    container.style.height = height + 'px';
  }
}

