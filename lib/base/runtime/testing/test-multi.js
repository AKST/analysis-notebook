/**
 * @import { WidgetRunner, WidgetChild, DocumentWidget } from '../type.ts';
 */
import { createStyleManager } from '../widget/document/style-manager.js';
import { MockStyleService } from '../service/style/mock.js';
import { MultiWidgetApplicationEngine } from '../engine/multi.js';
import { getFactory } from '../engine/util.js';
import { wait } from '../../util/promise.js';
import { render } from '../../dsl-dom/render.js';

/**
 * @param {WidgetChild<any, any, any>} widget
 * @returns {widget is DocumentWidget<any, any, any>}
 */
function isDocumentWidget(widget) {
  return widget.meta?.kind === 'document';
}

/**
 * Renders a single document widget for snapshot testing.
 * @param {WidgetChild<any, any, any>} widget
 * @param {{ state?: any, config?: any }} [options]
 * @returns {HTMLElement}
 */
export function renderWidget(widget, { state = {}, config = {} } = {}) {
  if (!isDocumentWidget(widget)) {
    throw new TypeError(`Expected document widget, got ${widget.meta?.kind}`);
  }
  const node = widget.render({}, state, config);
  const el = render(node);
  if (!(el instanceof HTMLElement)) {
    throw new TypeError('Expected HTMLElement from render');
  }
  return el;
}

class MockWidgetRunner {
  /** @type {'event'} */
  static renderStrategy = 'event';

  /** @type {'fluid'} */
  scalingStrategy = 'fluid';

  /**
   * @param {any} module
   */
  constructor(module) {
    this.module = module;
  }

  initialize() {}
  getHUD() { return {} }
  render() {}
  getAnchors() { return [] }
  resize() {}
  cleanup() {}
  setStyle() {}
}

/**
 * @param {any} module
 * @param {{
 *   testId?: string,
 *   wait?: number,
 *   width: number,
 *   config?: any,
 *   state?: any,
 * }} cfg
 * @returns {Promise<HTMLElement>}
 */
export async function renderModule(module, {
  width,
  wait: waitBeforeStop,
  testId = 'test',
  config = {},
  state = {}
}) {
  const engineContainer = document.createElement('div');
  engineContainer.id = testId;

  const engine = new MultiWidgetApplicationEngine(
    module => {
      if (module.meta.kind === 'document') {
        return getFactory(module);
      } else {
        return {
          /**
           * @param {any} module
           * @returns {WidgetRunner<any, any>}
           */
          create(module) {
            // @ts-ignore - need to fix the interface for widget runner
            return new MockWidgetRunner(module);
          }
        };
      };
    },
    module,
    engineContainer,
    new MockStyleService(),
    createStyleManager(testId),
    config,
    state,
    module.meta.layout?.gridTemplateColumns?.length ?? 1,
  );

  try {
    engine.installWidgets(width);
    engine.start();
    if (waitBeforeStop) await wait(waitBeforeStop);
    const clonedContainer = engineContainer.cloneNode(true);
    if (clonedContainer instanceof HTMLElement) {
      return clonedContainer;
    } else {
      console.info(clonedContainer);
      throw new TypeError('unexpected element');
    }
  } finally {
    engine.stop();
  }
}
