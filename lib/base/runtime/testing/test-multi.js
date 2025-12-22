import { createStyleManager } from '../widget/document/style-manager.js';
import { MockStyleService } from '../service/style/mock.js';
import { MultiWidgetApplicationEngine } from '../engine/multi.js';
import { wait } from '../../util/promise.js';

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
