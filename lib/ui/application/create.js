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
import { render } from '@base/dom_ui/index.js';
import { Unreachable } from '@base/util/type.js';
import { isEmpty } from '@base/util/object.js';
import { SharedStyleSheet } from '@base/dom_ui/shared_style_sheet.js';
import { createSingleWidgetApplicationFactory } from '@base/runtime/engine/single.js';
import { createMultiWidgetApplicationFactory } from '@base/runtime/engine/multi.js';
import { evaluateConfig } from '../config/knobs/index.js';
import {
  StartAppEvent,
  UpdateAnchorEvent,
  UpdateConfigKnobsEvent,
} from './events.js';

/**
 * @param {{
 *   scrollSheet: SharedStyleSheet,
 *   replace: HTMLElement,
 *   initialApp: string,
 *   loadModule: (path: string) => Promise<any>,
 * }} cfg
 * @returns {ApplicationController}
 */
export function installApplication({
  scrollSheet,
  replace: initialMainContainer,
  loadModule,
  initialApp,
}) {
  customElements.define('user-application-container', UserApplicationContentElement);
  const singleWidgetApplicationFactory = createSingleWidgetApplicationFactory();
  const multiWidgetApplicationFactory = createMultiWidgetApplicationFactory();
  const events = new EventTarget();
  const userContent = UserApplicationContentElement.installInplaceOfMain({
    main: initialMainContainer,
    scrollSheet,
  });

  const presenter = new ApplicationPresenter(
    multiWidgetApplicationFactory,
    singleWidgetApplicationFactory,
    loadModule,
  );
  const store = new ApplicationStore(
    events,
    userContent,
  );

  presenter.loadUserApp(store, initialApp);

  return {
    events,
    loadApp: path => presenter.loadUserApp(store, path),
    onResize: () => presenter.requestResize(store),
    onConfigUpdate: event => presenter.forwardConfigUpdate(store, event),
    onFocusTocItem: id => presenter.requestFocusTocItem(store, id),
  };
}

/** @param {number} ms */
const wait = ms => {
  const { resolve, promise } = Promise.withResolvers();
  setTimeout(() => resolve(undefined), ms);
  return promise;
}

export class UserApplicationContentElement extends HTMLElement {
  /** @type {ShadowRoot} */ #root;
  /** @type {HTMLElement} */ #loader;
  /** @type {HTMLElement} */ container;

  /** @param {HTMLElement} loader @param {HTMLElement} container */
  constructor(loader, container) {
    super();
    this.#loader = loader;
    this.container = container;
    this.#root = this.attachShadow({ mode: 'open' });
    this.setAttribute('role', 'main');
  }

  wireUserContent() {
    this.#root.appendChild(this.container);
  }

  /**
   * @param {{
   *   main: HTMLElement,
   *   scrollSheet: SharedStyleSheet,
   * }} cfg
   */
  static installInplaceOfMain({ scrollSheet, main: oldMain }) {
    const reset = new SharedStyleSheet('./lib/ui/base/reset.css');
    const sheet = new SharedStyleSheet('./lib/ui/application/style.css');
    const loader = /** @type {HTMLElement} */ (oldMain.querySelector('#loader'));
    const container = render(['div', { class: 'user-content ms-scroll' }]);
    const element = new UserApplicationContentElement(loader, container);
    for (const attr of Array.from(oldMain.attributes)) {
      element.setAttribute(attr.name, attr.value);
    }
    while (oldMain.firstChild) {
      element.#root.appendChild(oldMain.firstChild);
    }
    oldMain.replaceWith(element);
    reset.install(element.#root);
    sheet.install(element.#root);
    scrollSheet.install(element.#root);
    element.wireUserContent();
    return element;
  }

  showLoader() {
    this.#root.appendChild(this.#loader);
  }

  hideLoader() {
    this.#root.removeChild(this.#loader);
  }

  /** @param {string} id */
  scrollIdIntoView(id) {
    const title = this.#root.getElementById(id);
    title?.scrollIntoView();
    return title != null;
  }
}

export class ApplicationStore {
  /** @type {ApplicationState} */ state = { kind: 'initial' };

  /**
   * @param {EventTarget} events
   * @param {UserApplicationContentElement} userContent
   */
  constructor(
      events,
      userContent,
  ) {
    this.events = events;
    this.userContent = userContent;
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
      const { canvasWidth, canvasHeight } = calculateContainerSize(store.userContent);
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
      store.userContent.showLoader();
      const module = await this.#loadModule(path);
      if (!this.#stillLoadingApp(store, path)) return;
      store.userContent.hideLoader();

      const { canvasWidth, canvasHeight } = calculateContainerSize(store.userContent);
      const factory = module.meta.kind === 'multi' ? this.#mFactory : this.#sFactory;
      const configSpec = module.getConfig?.() || {};
      const nextApp = factory.create(module, {
        viewportWidth: canvasWidth,
        viewportHeight: canvasHeight,
        mainContent: store.userContent.container,
        config: evaluateConfig(configSpec),
      });

      requestAnimationFrame(() => {
        nextApp.start()
        const details = { anchors: nextApp.getAnchors() };
        store.events.dispatchEvent(new UpdateAnchorEvent(details));
      });

      const showConfig = ApplicationPresenter.shouldShowCfgAtStart(nextApp);
      store.state = { kind: 'running', path, app: nextApp };
      store.events.dispatchEvent(new StartAppEvent({
        showConfig,
        specConfig: configSpec,
      }));
    } catch (error) {
      console.error(`Failed to load app ${path}:`, error);
    }
  }

  /**
   * @param {ApplicationStore} store
   * @param {string} id
   */
  async requestFocusTocItem(store, id) {
    const delay = 200, maxAttempt = 5;
    const initApp = this.#currentApp(store);
    if (initApp == null) return;
    if (store.userContent.scrollIdIntoView(id)) return;

    let attempt = 1;
    while (true) {
      await wait(attempt * delay);
      const currApp = this.#currentApp(store);
      if (currApp !== initApp) return; /* cancel focus */
      if (attempt > maxAttempt) return console.error('failed to focus on title');
      if (store.userContent.scrollIdIntoView(id)) return;
      attempt += 1;
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
