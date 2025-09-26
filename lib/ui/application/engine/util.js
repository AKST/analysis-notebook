/**
 * @import { SingleModule, ModuleCommon, WidgetFactory } from '../type.ts';
 */
import { Unreachable } from '../../../util/type.js';
import { createCanvasWidgetFactory } from '../widget/canvas/create.js';
import { createDocumentWidgetFactory } from '../widget/document/create.js';
import { createRemoteWidgetFactory } from '../widget/remote/create.js';

/**
 * @template B
 * @template C
 *
 * @param {ModuleCommon<B, C, unknown>} module
 * @param {C} config
 * @param {B} fallback
 * @returns {B}
 */
export function initialiseState(module, config, fallback) {
  return module.createState?.(config) || fallback;
}

/**
 * @param {SingleModule<any, any, any, any>} module
 * @returns {WidgetFactory}
 */
export function getFactory(module) {
  switch (module.meta.kind) {
    case 'Canvas2d':
      return createCanvasWidgetFactory();

    case 'document':
      return createDocumentWidgetFactory();

    case 'remote':
      return createRemoteWidgetFactory();

    default:
      console.error(module);
      throw new Unreachable(module.meta);
  }
}
