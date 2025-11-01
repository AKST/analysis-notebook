/**
 * @import {
 *   EngineRunner,
 *   MultiEngineFactory,
 *   SingleEngineFactory,
 * } from '@base/runtime/type.ts';
 * @import { ConfigMenu } from '@ui/config/element.js';
 * @import { ConfigChangeEvent } from '@ui/config/events.js'
 * @import { ApplicationState, ApplicationController } from './type.ts';
 */
import { Unreachable } from '@base/util/type.js';
import { createSingleWidgetApplicationFactory } from '@base/runtime/engine/single.js';
import { createMultiWidgetApplicationFactory } from '@base/runtime/engine/multi.js';
import { evaluateConfig } from '../config/knobs/index.js';
import { isEmpty } from '@base/util/object.js';
import {
  StartAppEvent,
  UpdateAnchorEvent,
  UpdateConfigKnobsEvent,
} from './events.js';

/**
 * @param {{
 *   container: HTMLElement,
 *   initialApp: string,
 *   loadModule: (path: string) => Promise<any>,
 * }} cfg
 * @returns {ApplicationController}
 */
export function installApplication({
  container: mainContent,
  loadModule,
  initialApp,
}) {
  const singleWidgetApplicationFactory = createSingleWidgetApplicationFactory();
  const multiWidgetApplicationFactory = createMultiWidgetApplicationFactory();
  const events = new EventTarget();
  const loader = /** @type {HTMLElement} */ (mainContent.querySelector('#loader'));

  const presenter = new ApplicationPresenter(
    multiWidgetApplicationFactory,
    singleWidgetApplicationFactory,
    loadModule,
  );
  const store = new ApplicationStore(
    events,
    // TODO Replace main content with own element
    mainContent,
    loader,
  );

  presenter.loadUserApp(store, initialApp);

  return {
    events,
    container: mainContent,
    loadApp: path => presenter.loadUserApp(store, path),
    onResize: () => presenter.requestResize(store),
    onConfigUpdate: event => presenter.forwardConfigUpdate(store, event),
  };
}

export class ApplicationStore {
  /** @type {ApplicationState} */ state = { kind: 'initial' };

  /**
   * @param {EventTarget} events
   * @param {HTMLElement} container
   * @param {HTMLElement} loader
   */
  constructor(
      events,
      container,
      loader,
  ) {
    this.events = events;
    this.container = container;
    this.loader = loader;
  }
}

export class ApplicationPresenter {
  /** @type {MultiEngineFactory} */ #mFactory;
  /** @type {SingleEngineFactory} */ #sFactory;
  /** @type {(path: string) => Promise<any>} */ #loadModule;

  /**
   * @param {MultiEngineFactory} mFactory
   * @param {SingleEngineFactory} sFactory
   * @param {(path: string) => Promise<any>} loadModule
   */
  constructor(mFactory, sFactory, loadModule) {
    this.#mFactory = mFactory;
    this.#sFactory = sFactory;
    this.#loadModule = loadModule;
  }

  /**
   * @param {ApplicationStore} store
   */
  requestResize(store) {
    const currentApp = this.#currentApp(store);
    if (currentApp) {
      const { canvasWidth, canvasHeight } = calculateContainerSize(store.container);
      currentApp.resize(canvasWidth, canvasHeight);
    }
  }

  /**
   * @param {ApplicationStore} store
   * @param {ConfigChangeEvent} event
   */
  forwardConfigUpdate(store, { detail }) {
    const currentApp = this.#currentApp(store);
    currentApp?.updateConfig(detail.values, detail.source);
  }

  /**
   * @param {ApplicationStore} store
   * @param {string} path
   */
  async loadUserApp(store, path) {
    const lastApp = this.#currentApp(store);
    console.log(lastApp);
    if (lastApp != null) lastApp.stop();

    store.state = { kind: 'loading', path };
    try {
      store.container.appendChild(store.loader);
      const module = await this.#loadModule(path);
      if (!this.#stillLoadingApp(store, path)) return;
      store.container.removeChild(store.loader);

      const { canvasWidth, canvasHeight } = calculateContainerSize(store.container);
      const factory = module.meta.kind === 'multi' ? this.#mFactory : this.#sFactory;
      const configSpec = module.getConfig?.() || {};
      const nextApp = factory.create(module, {
        viewportWidth: canvasWidth,
        viewportHeight: canvasHeight,
        mainContent: store.container,
        config: evaluateConfig(configSpec),
      });

      requestAnimationFrame(() => {
        nextApp.start()
        const details = { anchors: nextApp.getAnchors() };
        store.events.dispatchEvent(new UpdateAnchorEvent(details));
      });

      const showConfig = ApplicationPresenter.shouldShowCfgAtStart(nextApp);
      store.state = { kind: 'running', app: nextApp };
      store.events.dispatchEvent(new StartAppEvent({
        showConfig,
        specConfig: configSpec,
      }));
    } catch (error) {
      console.error(`Failed to load app ${path}:`, error);
    }
  }


  /**
   * This exists to confirm another app hasn't began loading
   * while the other is still loading.
   *
   * @param {ApplicationStore} store
   * @param {string} path
   */
  #stillLoadingApp({ state }, path) {
    switch (state.kind) {
      case 'loading':
        return state.path === path;

      case 'initial':
      case 'running':
        return false;

      default:
        throw new Unreachable(state);
    }
  }

  /**
   * @param {ApplicationStore} store
   * @returns {EngineRunner<unknown> | undefined}
   */
  #currentApp({ state }) {
    switch (state.kind) {
      case 'initial':
      case 'loading':
        return undefined;

      case 'running':
        return state.app;

      default:
        throw new Unreachable(state);
    }
  }

  /**
   * @param {EngineRunner<unknown>} currentApp
   */
  static shouldShowCfgAtStart(currentApp) {
    return !isEmpty(currentApp.module.getConfig?.() ?? {});
  }
}

/**
 * @typedef {Object} Bounds
 * @property {number} canvasWidth
 * @property {number} canvasHeight
 *
 * @param {HTMLElement} element
 * @returns {Bounds}
 */
function calculateContainerSize(element) {
  const { width, height } = element.getBoundingClientRect();
  return { canvasWidth: width, canvasHeight: height };
}
