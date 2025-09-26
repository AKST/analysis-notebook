/**
 * @import { WidgetFactory } from '../../type.ts';
 * @import { ParentToChildMessage, IframeWidget } from './type.ts';
 */
import { Unreachable } from '../../../../util/type.js';

/**
 * @returns {WidgetFactory}
 */
export function createIframeWidgetFactory() {
  return /** @type {any} */ ({
    /**
     * @template A
     * @template B
     * @template C
     * @param {IframeWidget<A, B, C>} widget
     * @param {{ container: HTMLElement }} cfg
     * @returns {IFrameWidgetEngine<A, B, C>}
     */
    create(widget, { container }) {
      const iframe = document.createElement('iframe');
      return new IFrameWidgetEngine(widget, iframe, container);
    },
  });
}

/**
 * @template Ctx
 * @template St
 * @template Cfg
 */
export class IFrameWidgetEngine {
  static renderStrategy = 'event';
  static scalingStrategy = 'fixed';

  /** @type {IframeWidget<Ctx, St, Cfg>} */
  module;

  /** @type {HTMLIFrameElement} */
  iframe;

  /** @type {(event: any) => void} */
  #onEvent = () => undefined;

  /**
   * @param {IframeWidget<Ctx, St, Cfg>} module
   * @param {HTMLIFrameElement} iframe
   * @param {HTMLElement} container
   */
  constructor(module, iframe, container) {
    this.module = module;
    this.iframe = iframe;
    this.container = container;
  }

  /**
   * @param {(event: any) => void} onEvent
   */
  async initialize(onEvent) {
    // @ts-ignore - i can't be bothered.
    window.addEventListener('message', this.#onMessage);
    this.#onEvent = onEvent;
    this.iframe.src = this.module.path;
    this.container.appendChild(this.iframe);

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
    this.iframe.width = width + '';
    this.iframe.height = height + '';
    this.#normalisedSend({ kind: 'push', state, config });
  }

  cleanup() {
    // @ts-ignore - i can't be bothered.
    window.removeEventListener('message', this.#onMessage);
    this.iframe.src = '';
  }

  /**
   * @param {number} newWidth
   * @param {number} [newHeight]
   */
  resize(newWidth, newHeight) {
    if (newHeight !== undefined) {
      this.container.style.width = newWidth + 'px';
      this.container.style.height = newHeight + 'px';
      this.iframe.height = newHeight + '';
      this.iframe.width = newWidth + '';
    } else if (this.container) {
      this.container.style.width = newWidth + 'px';
      this.iframe.width = newWidth + '';
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
      if (this.iframe.contentWindow != null) {
        this.iframe.contentWindow?.postMessage(message);
        return true;
      }
      return false;
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
    if (message.source !== this.iframe.contentWindow) return;
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
}
