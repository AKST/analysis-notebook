/**
 * @import { WidgetAnchor } from '@base/runtime/type.ts';
 *
 * @typedef {{ anchors: readonly WidgetAnchor[] }} UpdateAnchorDetails
 *
 * @typedef {{
 *   showConfig: boolean,
 *   specConfig: any,
 * }} StartAppDetails
 */

/**
 * @extends {CustomEvent<UpdateAnchorDetails>}
 */
export class UpdateAnchorEvent extends CustomEvent {
  /**
   * @param {UpdateAnchorDetails} detail
   * @param {Omit<CustomEventInit<unknown>, 'detail'>} [init]
   */
  constructor(detail, init) {
    super('update-anchors', {
      bubbles: true,
      composed: true,
      ...init,
      detail,
    });
  }
}

/**
 * @extends {CustomEvent<StartAppDetails>}
 */
export class StartAppEvent extends CustomEvent {
  /**
   * @param {StartAppDetails} detail
   * @param {Omit<CustomEventInit<unknown>, 'detail'>} [init]
   */
  constructor(detail, init) {
    super('startApp', {
      bubbles: true,
      composed: true,
      ...init,
      detail,
    });
  }
}
