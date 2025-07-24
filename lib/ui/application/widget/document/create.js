/**
 * @import { WidgetFactory } from '../../type.ts';
 * @import { StyleManager } from './style-manager.js';
 * @import { DocumentWidget } from './type.ts';
 *
 * @typedef {Object} InitDocWidget
 * @property {HTMLElement} container
 * @property {string} containerId
 */

import {
  EventRegistry,
  EventManager,
  renderDocument,
  updateElement,
} from '../../../../base/render_app/index.js';
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
      return new DocumentWidgetEngine(widget, { container, styleManager, eventManager });
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
  static scalingStrategy = 'fluid';

  /** @type {DocumentWidget<Ctx, St, Cfg>} */
  module;

  eventRegistry = new EventRegistry();
  rootElement = null;

  /**
   * @param {DocumentWidget<Ctx, St, Cfg>} module
   * @param {{
   *   container: HTMLElement,
   *   styleManager: StyleManager,
   *   eventManager: EventManager
   * }} config
   */
  constructor(module, { container, styleManager, eventManager }) {
    this.module = module;
    this.container = container;
    this.styleManager = styleManager;
    this.eventManager = eventManager;
    this.context = null;
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
  }

  /**
   * @param {Cfg} config
   * @param {St} state
   */
  render(config, state) {
    const spec = this.module.render(this.context, state, config);

    try {
      if (!this.rootElement) {
        const element = renderDocument(spec, this.eventRegistry);
        // @ts-ignore - not worth it
        this.rootElement = element;
        this.container.appendChild(element);
      } else {
        // Update render
        const replacement = updateElement(this.rootElement, spec, this.eventRegistry);
        if (replacement) {
          this.container.replaceChild(replacement, this.rootElement);
          // @ts-ignore - not worth it
          this.rootElement = replacement;
        }
      }

      this.eventManager.setupListeners(this.eventRegistry);
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

  getHUD() {
    return {};
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

