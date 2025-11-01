/**
 * @typedef {{
 *   id: string,
 *   name: string,
 *   path: string,
 * }} LoadAppDetails
 *
 * @typedef {{ id: string }} TableOfContentsSelectDetails
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

/**
 * @extends {CustomEvent<TableOfContentsSelectDetails>}
 */
export class TableOfContentsSelectEvent extends CustomEvent {
  /**
   * @param {TableOfContentsSelectDetails} detail
   * @param {Omit<CustomEventInit<unknown>, 'detail'>} [init]
   */
  constructor(detail, init) {
    super('table-of-content-select', {
      ...init,
      detail,
    });
  }
}
