import { EffectRegistry } from '../../../dsl_dom/effects.js';

export class EventManager {
  /** @type {EventTarget} */
  #container;

  /** @type {Map<string, EventListenerOrEventListenerObject>} */
  #activeListeners = new Map();

  /** @type {null | ((event: any) => void)} */
  eventHandler = null;

  /**
   * @param {EventTarget} container
   */
  constructor(container) {
    this.#container = container;
  }

  /**
   * @param {((event: any) => void)} eventHandler
   */
  setEventHandler(eventHandler) {
    this.eventHandler = eventHandler;
  }

  /**
   * @param {EffectRegistry} eventRegistry
   */
  setupListeners(eventRegistry) {
    // Remove old listeners
    this.removeAllListeners();

    // Get all event types from registry
    // const eventTypes = eventRegistry.getEventTypes();
    //
    /** @type {string[]} */
    const eventTypes = [];

    // Setup listeners for each event type
    for (const eventType of eventTypes) {
      /**
       * @param {any} event
       */
      const listener = (event) => {
        const eventSource = event.target?.closest('[data-eventsource]');
        if (!eventSource || !this.eventHandler) return;

        const eventId = eventSource.dataset.eventsource;
        // const eventSpec = eventRegistry.get(eventId);
        // if (!eventSpec || !eventSpec[eventType]) return;
        // this.eventHandler(eventSpec[eventType]);
      };

      this.#container.addEventListener(eventType, listener);
      this.#activeListeners.set(eventType, listener);
    }
  }

  removeAllListeners() {
    for (const [eventType, listener] of this.#activeListeners) {
      this.#container.removeEventListener(eventType, listener);
    }
    this.#activeListeners.clear();
  }
}
