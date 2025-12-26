/**
 * @import { MenuItem } from './type.ts';
 * @import { E } from '@base/dsl-dom/type.ts';
 */
import * as doc from '@base/dsl-dom/helper/html.js';

/**
 * @param {string} id
 * @returns {string}
 */
export function generateAppPath(id) {
  if (id == null) throw new Error('unknown id');

  const parts = id.split('.');
  if (parts.length < 2) throw new Error('malformed id');
  let path = './lib/app/';
  for (let i = 0; i < parts.length; i++) {
    path += `sec-${parts[i]}/`;
  }
  return `${path}index.js`;
}

/**
 * @param {string | null} appId
 * @returns {string | undefined}
 */
export function redirectAppId(appId) {
  if (appId?.startsWith('1101')) return `unsw.${appId}`;
  if (appId?.startsWith('2102')) return `unsw.${appId}`;
  if (appId?.startsWith('2206')) return `unsw.${appId}`;
  switch (appId) {
    case null: return undefined;
    case '1101.1': return redirectAppId('1101.01');
    case '1101.2': return redirectAppId('1101.02');
    case '1101.3': return redirectAppId('1101.03');
    default: return appId;
  }
}

/**
 * @returns {string | undefined}
 */
export function getAppFromURL() {
  const params = new URLSearchParams(globalThis.location.search);
  return redirectAppId(params.get('app')) ?? undefined;
}

/**
 * @param {MenuItem[]} items
 * @param {string} initialAppId
 * @returns {E.Item[]}
 */
export function createMenuLevel(items, initialAppId) {
  /** @ts-ignore - i cannot be bothered */
  return items.map(([id, name, children]) => {
    if (!children) {
      const appPath = generateAppPath(id);
      const titleId = id.split('.').at(-1);
      return doc.a({ className: 'menu-item', href: `?app=${id}` })
        .data({ app: appPath, id, name })
        .c(`[${titleId}] ${name}`);
    }

    const open = initialAppId.startsWith(id + '.') || id === 'd'
    return doc.details({ open }).c(
      doc.summary`[${id.split('.').at(-1)}] ${name}`,
      ...createMenuLevel(children, initialAppId)
    );
  });
}

