/**
 * @typedef {{
 *   value: any
 *   child: string[],
 * }} ChangeKnobEventDetails
 *
 * @extends {CustomEvent<ChangeKnobEventDetails>}
 */
export class ChangeKnobEvent extends CustomEvent {
  /**
   * @param {ChangeKnobEventDetails} detail
   * @param {Omit<CustomEventInit<unknown>, 'detail'>} [init]
   */
  constructor(detail, init) {
    super('changeKnob', {
      bubbles: true,
      composed: true,
      ...init,
      detail,
    });
  }
}

/**
 * @typedef {{
 *   values: Record<string, unknown>,
 *   source: string[],
 * }} ConfigChangeEventDetails
 *
 * @extends {CustomEvent<ConfigChangeEventDetails>}
 */
export class ConfigChangeEvent extends CustomEvent {
  /**
   * @param {ConfigChangeEventDetails} detail
   * @param {Omit<CustomEventInit<unknown>, 'detail'>} [init]
   */
  constructor(detail, init) {
    super('configChange', {
      bubbles: true,
      composed: true,
      ...init,
      detail,
    });
  }
}
