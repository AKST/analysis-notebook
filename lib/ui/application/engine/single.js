/**
 * @import { WidgetRunner, SingleModule } from '../type.ts';
 * @import { StyleManager } from '../widget/document/style-manager.js';
 *
 * @typedef {Object} ConfigSingleModule
 * @property {number} viewportWidth
 * @property {number} viewportHeight
 * @property {HTMLElement} mainContent
 * @property {any} config
 */
import { initialiseState, getFactory } from './util.js';

export function createSingleWidgetApplicationFactory() {
  return {
    /**
     * @template St
     * @template Cfg
     * @template Event
     * @param {SingleModule<unknown, St, Cfg, Event>} module
     * @param {ConfigSingleModule} config
     */
    create(module, { viewportWidth, viewportHeight, mainContent, config }) {
      const containerId = `app-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      const container = createContainer(containerId);
      mainContent.appendChild(container);

      if (module.onUpdate && !module.createState) {
        throw new Error('Missing create state but expects updates');
      }
      if (!module.onUpdate && module.createState) {
        throw new Error('Missing onUpdate but expects creates state');
      }

      const factory = getFactory(module);
      const widget = factory.create(module, {
        container,
        containerId,
        viewportWidth,
        viewportHeight
      });

      return new SingleWidgetApplicationEngine(
        module,
        widget,
        container,
        config,
        /** @ts-ignore - because */
        initialiseState(module, config, {}),
      );
    }
  };
}

/**
 * @template St
 * @template Cfg
 * @template Event
 */
class SingleWidgetApplicationEngine {
  /** @type {number | null} */
  animationFrame = null;

  /** @type {SingleModule<unknown, St, Cfg, Event>} */
  module;

  /** @type {WidgetRunner<St, Cfg>} */
  #widget;


  /**
   * @param {SingleModule<any, St, Cfg, Event>} module
   * @param {WidgetRunner<St, Cfg>} widget
   * @param {HTMLElement} container
   * @param {Cfg} configValues
   * @param {St} state
   */
  constructor(module, widget, container, configValues, state) {
    this.#widget = widget;
    this.module = module;
    this.container = container;
    this.configValues = configValues;
    this.state = state
  }

  start() {
    this.#widget.initialize((event) => {
      this.handleEvent(/** @type {Event} */ (event));
    });

    if (this.#widget.constructor.renderStrategy === 'event') {
      this.renderOn('any');
    }

    if (this.#widget.constructor.renderStrategy === 'frame') {
      this.startRenderLoop();
    }
  }

  startRenderLoop() {
    /**
     * @param {number} time
     */
    const loop = (time) => {
      // Update shared state
      if (this.module.onUpdate) {
        const event = /** @type {Event} */ ({ kind: 'frame', time });
        this.state = this.module.onUpdate(this.state, event);
      }

      this.renderOn('frame');
      this.animationFrame = requestAnimationFrame(loop);
    };

    this.animationFrame = requestAnimationFrame(loop);
  }

  /**
   * @param {Event} event
   */
  handleEvent(event) {
    if (this.module.onUpdate) {
      this.state = this.module.onUpdate(this.state, event);
    }
    this.renderOn('event');
  }

  stop() {
    // Stop animation frame
    if (this.animationFrame) {
      cancelAnimationFrame(this.animationFrame);
      this.animationFrame = null;
    }

    // Widget cleanup
    this.#widget.cleanup?.();

    // Engine removes its container
    if (this.container && this.container.parentNode) {
      this.container.parentNode.removeChild(this.container);
    }
  }

  /**
   * @param {number} newWidth
   * @param {number} newHeight
   */
  resize(newWidth, newHeight) {
    this.#widget.resize(newWidth, newHeight);
  }

  /**
   * @param {Cfg} config
   */
  updateConfig(config) {
    this.configValues = config;
    const event = /** @type {Event} */ ({ kind: 'config', config });
    this.handleEvent(event);
  }

  /**
   * @param {'any' | 'frame' | 'event'} kind
   */
  renderOn(kind) {
    if (kind === 'any') {
      this.#widget.render(this.configValues, this.state);
    } else if (this.#widget.constructor.renderStrategy === kind) {
      this.#widget.render(this.configValues, this.state);
    }
  }
}

/**
 * @param {string} containerId
 */
function createContainer(containerId) {
  const container = document.createElement('div');
  container.id = containerId;
  container.style.position = 'relative';
  return container;
}
