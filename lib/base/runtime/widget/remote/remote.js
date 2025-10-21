/**
 * @import { RemoteVariant, RemoteConnection } from './type.ts'
 */
import { Unreachable } from '../../../util/type.js';

/**
 * @param {RemoteVariant} variant
 * @returns {RemoteConnection}
 */
export function create(variant) {
  switch (variant.kind) {
    case 'iframe': {
      const iframe = document.createElement('iframe');
      for (const [attr, value] of Object.entries(variant.attrs ?? {})) {
        iframe.setAttribute(attr, value);
      }
      iframe.src = variant.src;
      return { kind: 'iframe', iframe };
    }

    case 'worker': {
      const worker = new Worker(variant.src, { type: "module" });
      return { kind: 'worker', worker };
    }

    default:
      throw new Unreachable(variant);
  }
}

/**
 * @param {RemoteConnection} conn
 * @param {any} message
 * @returns {boolean}
 */
export function postMessage(conn, message) {
  switch (conn.kind) {
    case 'iframe': {
      if (conn.iframe.contentWindow == null) return false;
      conn.iframe.contentWindow.postMessage(message);
      return true;
    }

    case 'worker': {
      conn.worker.postMessage(message);
      return true;
    }

    default:
      throw new Unreachable(conn);
  }
}

/**
 * @param {RemoteConnection} conn
 * @param {(m: MessageEvent) => void} onMessage
 */
export function addEventListener(conn, onMessage) {
  switch (conn.kind) {
    case 'iframe':
      globalThis.addEventListener('message', onMessage);
      break;

    case 'worker':
      conn.worker.addEventListener('message', onMessage);
      break;

    default:
      throw new Unreachable(conn);
  }
}

/**
 * @param {RemoteConnection} conn
 * @param {{ source: MessageEventSource | null }} message
 * @returns {boolean}
 */
export function wasSender(conn, message) {
  switch (conn.kind) {
    case 'iframe':
      return conn.iframe.contentWindow === message.source;

    case 'worker':
      // this check is unecessary for workers
      return true;

    default:
      throw new Unreachable(conn);
  }
}

/**
 * @param {RemoteConnection} conn
 * @param {number} width
 * @param {number} [height]
 */
export function setWindowSize(conn, width, height) {
  if (conn.kind === 'iframe') {
    conn.iframe.width = width + '';
    if (height != null) {
      conn.iframe.height = height + '';
    }
  }
}

/**
 * @param {RemoteConnection} conn
 * @param {HTMLElement} container
 * @param {(event: MessageEvent) => void} onMessage
 */
export function mount(conn, container, onMessage) {
  switch (conn.kind) {
    case 'iframe':
      globalThis.addEventListener('message', onMessage);
      container.appendChild(conn.iframe);
      break;

    case 'worker':
      conn.worker.addEventListener('message', onMessage);
      container.style.display = 'none';
      break;

    default:
      throw new Unreachable(conn);
  }
}

/**
 * @param {RemoteConnection} conn
 * @param {(event: MessageEvent) => void} onMessage
 */
export function close(conn, onMessage) {
  switch (conn.kind) {
    case 'iframe':
      globalThis.removeEventListener('message', onMessage);
      conn.iframe.src = '';
      break;

    case 'worker':
      conn.worker.removeEventListener('message', onMessage);
      conn.worker.terminate();
      break;

    default:
      throw new Unreachable(conn);
  }
}
