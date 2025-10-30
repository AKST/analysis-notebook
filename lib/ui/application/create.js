/**
 * @import { ConfigMenu } from '../config/element.js';
 * @import { ApplicationController } from './type.ts';
 */
import { createSingleWidgetApplicationFactory } from '@base/runtime/engine/single.js';
import { createMultiWidgetApplicationFactory } from '@base/runtime/engine/multi.js';
import { evaluateConfig } from '../config/knobs/index.js';
import { isEmpty } from '@base/util/object.js';
import { StartAppEvent, UpdateAnchorEvent } from './events.js';

/**
 * @param {{
 *   config: ConfigMenu,
 *   container: HTMLElement,
 *   initialApp: string,
 *   loadModule: (path: string) => Promise<any>,
 * }} cfg
 * @returns {ApplicationController}
 */
export function installApplication({
  config,
  container: mainContent,
  loadModule,
  initialApp,
}) {
  const singleWidgetApplicationFactory = createSingleWidgetApplicationFactory();
  const multiWidgetApplicationFactory = createMultiWidgetApplicationFactory();
  const events = new EventTarget();
  const loader = /** @type {HTMLElement} */ (mainContent.querySelector('#loader'));

  /** @type {any | null} */
  let currentApp = null;
  let totalAttempts = 1;

  function shouldShowCfgAtStart() {
    const config = currentApp?.module.getConfig?.() ?? {};
    return !isEmpty(config);
  }

  /**
   * @param {string} appPath
   * @returns {Promise<void>}
   */
  async function loadApp(appPath) {
    if (currentApp) {
      currentApp.stop();
      currentApp = null;
    }

    try {
      mainContent.appendChild(loader);
      const module = await loadModule(appPath);
      mainContent.removeChild(loader);

      if (!module.meta) {
        throw new Error(`App ${appPath} missing meta export`);
      }

      const { canvasWidth, canvasHeight } = calculateContainerSize(mainContent);
      const factory = module.meta.kind === 'multi'
        ? multiWidgetApplicationFactory
        : singleWidgetApplicationFactory;

      const cfgSpec = module.getConfig?.() || {};
      // TODO move to skeleton
      config.setKnobs(cfgSpec);

      currentApp = factory.create(module, {
        viewportWidth: canvasWidth,
        viewportHeight: canvasHeight,
        mainContent,
        config: evaluateConfig(cfgSpec),
      });


      requestAnimationFrame(() => {
        currentApp.start()
        const details = { anchors: currentApp.getAnchors() };
        events.dispatchEvent(new UpdateAnchorEvent(details));
      });

      const showConfig = shouldShowCfgAtStart();
      events.dispatchEvent(new StartAppEvent({
        showConfig,
        specConfig: cfgSpec,
      }));
    } catch (error) {
      console.error(`Failed to load app ${appPath}:`, error);
    }
  }

  loadApp(initialApp);

  return {
    events,
    container: mainContent,
    loadApp: path => loadApp(path),
    onResize() {
      if (!currentApp) return;
      const { canvasWidth, canvasHeight } = calculateContainerSize(mainContent);
      currentApp.resize(canvasWidth, canvasHeight);
    },
    onConfigUpdate({ detail }) {
      currentApp.updateConfig(detail.values, detail.source);
    },
  };
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
