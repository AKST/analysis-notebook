/**
 * @import { WidgetFactory } from '../../type.ts';
 * @import { ParentToChildMessage, IframeWidget } from './type.ts';
 */

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
  initialize(onEvent) {
    // @ts-ignore - i can't be bothered.
    this.iframe.addEventListener('message', this.#onMessage);
    this.iframe.src = this.module.path;
    this.container.appendChild(this.iframe);
  }

  /**
   * @param {Cfg} config
   * @param {St} state
   */
  render(config, state) {
    const { width, height } = this.container.getBoundingClientRect();
    this.iframe.width = width + '';
    this.iframe.height = height + '';
    this.#postMessage({ kind: 'push', state, config });
  }

  cleanup() {
    // @ts-ignore - i can't be bothered.
    this.iframe.removeEventListener('message', this.#onMessage);
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
  #postMessage(message) {
    if (this.iframe.contentWindow == null) {
      console.error('iframe is not receiving messages');
      return
    }

    if (this.module.normaliseMessage) {
      for (const prepared of this.module.normaliseMessage(message)) {
        this.iframe.contentWindow?.postMessage(prepared);
      }
    } else {
      this.iframe.contentWindow?.postMessage(message);
    }
  }

  /**
   * See here for information on the event.
   *
   * https://developer.mozilla.org/en-US/docs/Web/API/Window/message_event
   *
   * @param {MessageEvent} message
   */
  #onMessage = message => {
    console.debug(message);
  };

  getHUD() {
    const { header } = this.module;
    return { header }
  }
}
