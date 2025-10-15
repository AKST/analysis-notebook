/**
 * @import { WidgetFactory } from '../../type.ts';
 * @import { RemoteConnection, ParentToChildMessage, RemoteWidget } from './type.ts';
 */
import { Unreachable } from '../../../../util/type.js';
import * as Remote from './remote.js';

/**
 * @returns {WidgetFactory}
 */
export function createRemoteWidgetFactory() {
  return /** @type {any} */ ({
    /**
     * @template A
     * @template B
     * @template C
     * @param {RemoteWidget<A, B, C, any>} widget
     * @param {{ container: HTMLElement }} cfg
     * @returns {RemoteWidgetWidgetEngine<A, B, C>}
     */
    create(widget, { container }) {
      const conn = Remote.create(widget.source);
      return new RemoteWidgetWidgetEngine(widget, conn, container);
    },
  });
}

/**
 * @template Ctx
 * @template St
 * @template Cfg
 */
export class RemoteWidgetWidgetEngine {
  static renderStrategy = 'event';

  /** @type {RemoteWidget<Ctx, St, Cfg, any>} */
  module;

  /** @type {RemoteConnection} */
  conn;

  /** @type {(event: any) => void} */
  #onEvent = () => undefined;

  /**
   * @param {RemoteWidget<Ctx, St, Cfg, any>} module
   * @param {RemoteConnection} conn
   * @param {HTMLElement} container
   */
  constructor(module, conn, container) {
    this.module = module;
    this.conn = conn;
    this.container = container;
  }

  get scalingStrategy () {
    return this.conn.kind === 'iframe' ? 'fixed' : 'fluid';
  }

  /**
   * @param {(event: any) => void} onEvent
   */
  async initialize(onEvent) {
    // @ts-ignore - i can't be bothered.
    this.#onEvent = onEvent;
    Remote.mount(this.conn, this.container, this.#onMessage);

    for (const message of (this.module.initialise?.()) || []) {
      await this.#send(message, { expbackoff: 8 });
    }
  }

  /**
   * @param {Cfg} config
   * @param {St} state
   */
  render(config, state) {
    const { width, height } = this.container.getBoundingClientRect();
    Remote.setWindowSize(this.conn, width, height);
    this.#normalisedSend({ kind: 'push', state, config });
  }

  cleanup() {
    Remote.close(this.conn, this.#onMessage);
  }

  /**
   * @param {number} newWidth
   * @param {number} [newHeight]
   */
  resize(newWidth, newHeight) {
    if (newHeight !== undefined) {
      this.container.style.width = newWidth + 'px';
      this.container.style.height = newHeight + 'px';
      Remote.setWindowSize(this.conn, newWidth, newHeight);
    } else if (this.container) {
      this.container.style.width = newWidth + 'px';
      Remote.setWindowSize(this.conn, newWidth);
    }
  }

  /**
   * @param {ParentToChildMessage<Cfg, St>} message
   */
  #normalisedSend(message) {
    if (this.module.normaliseSend) {
      for (const prepared of this.module.normaliseSend(message)) {
        this.#send(prepared);
      }
    }
  }

  /**
   * @param {any} message
   * @param {{ expbackoff?: number }} [config]
   * @returns {Promise<void>}
   */
  #send(message, { expbackoff = 0 } = {}) {
    const attemptSend = () => {
      return Remote.postMessage(this.conn, message);
    };

    if (attemptSend()) {
      return Promise.resolve();
    } else if (expbackoff === 0) {
      console.error('failed to send');
      return Promise.reject();
    }

    const { promise, resolve, reject } = Promise.withResolvers();

    let attempt = 0;
    setTimeout(function f() {
      if (attemptSend()) {
        resolve(undefined);
      } else if (attempt < expbackoff) {
        attempt += 1;
        setTimeout(f, 200 * (2 ** attempt));
      } else {
        reject();
      }
    }, 200);

    return promise;
  }

  /**
   * See here for information on the event.
   *
   * https://developer.mozilla.org/en-US/docs/Web/API/Window/message_event
   *
   * @param {MessageEvent} message
   */
  #onMessage = (message) => {
    if (!Remote.wasSender(this.conn, message)) return;
    if (!this.module.normaliseRecv) return;

    for (const prepared of this.module.normaliseRecv(message.data)) {
      switch (prepared[0]) {
        case 'reply':
          this.#send(prepared[1]);
          break;

        case 'dispatch':
          this.#onEvent(prepared[1]);
          break;

        default:
          throw new Unreachable(prepared[0]);
      }
    }
  };

  getHUD() {
    const { header } = this.module;
    return { header }
  }

  getAnchors() {
    return [];
  }
}
