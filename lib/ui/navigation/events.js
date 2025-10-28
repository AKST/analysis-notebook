/**
 * @typedef {{
 *   id: string,
 *   name: string,
 *   path: string,
 * }} LoadAppDetails
 */

/**
 * @extends {CustomEvent<LoadAppDetails>}
 */
export class LoadAppEvent extends CustomEvent {
  /**
   * @param {LoadAppDetails} detail
   * @param {Omit<CustomEventInit<unknown>, 'detail'>} [init]
   */
  constructor(detail, init) {
    super('loadApp', {
      ...init,
      detail,
    });
  }
}
