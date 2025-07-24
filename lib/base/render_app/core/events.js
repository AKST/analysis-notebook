/**
 * @import { EventSpec } from '../type.ts';
 */

export class EventRegistry {
  /** @type {Record<string, EventSpec>} */
  #events = {};

  constructor() {
    this.nextId = 1;
  }

  /**
   * @param {EventSpec} eventSpec
   * @returns {string}
   */
  register(eventSpec) {
    const id = String(this.nextId++);
    this.#events[id] = eventSpec;
    return id;
  }

  /**
   * @param {string} id
   * @returns {EventSpec | undefined}
   */
  get(id) {
    return this.#events[id];
  }

  getEventTypes() {
    const eventTypes = new Set();
    for (const eventSpec of Object.values(this.#events)) {
      for (const eventType of Object.keys(eventSpec)) {
        eventTypes.add(eventType);
      }
    }
    return Array.from(eventTypes);
  }
}

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
   * @param {EventRegistry} eventRegistry
   */
  setupListeners(eventRegistry) {
    // Remove old listeners
    this.removeAllListeners();

    // Get all event types from registry
    const eventTypes = eventRegistry.getEventTypes();

    // Setup listeners for each event type
    for (const eventType of eventTypes) {
      /**
       * @param {any} event
       */
      const listener = (event) => {
        const eventSource = event.target?.closest('[data-eventsource]');
        if (!eventSource || !this.eventHandler) return;

        const eventId = eventSource.dataset.eventsource;
        const eventSpec = eventRegistry.get(eventId);
        if (!eventSpec || !eventSpec[eventType]) return;

        this.eventHandler(eventSpec[eventType]);
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
