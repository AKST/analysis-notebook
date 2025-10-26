/**
 * @import { MenuItem } from './type.ts';
 * @import { El } from '../../../base/dom_ui/index.js';
 */

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
  switch (appId) {
    case null: return undefined;
    case '1101.1': return '1101.01';
    case '1101.2': return '1101.02';
    case '1101.3': return '1101.03';
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
 * @param {string} appId
 */
export function setAppInURL(appId) {
  const url = new URL(globalThis.location+'');
  url.searchParams.set('app', appId);
  url.hash = '';
  console.log(url);
  globalThis.history.pushState({}, '', url);
}

/**
 * @param {MenuItem[]} items
 * @param {string} initialAppId
 * @returns {El[]}
 */
export function createMenuLevel(items, initialAppId) {
  /** @param {string} id @param {string} name @returns {El} */
  function createMenuItem(id, name) {
    const appPath = generateAppPath(id);
    return ['a', {
      class: 'menu-item',
      href: `?app=${id}`,
      style: 'font-size: inherit',
      'data-app': appPath,
      'data-id': id,
      'data-name': name
    }, [`[${id}] ${name}`]];
  }

  /** @param {string} sectionId */
  function shouldBeOpen(sectionId) {
    return initialAppId.startsWith(sectionId + '.') || sectionId === 'd';
  }

  /** @ts-ignore - i cannot be bothered */
  return items.map(([id, name, children]) => {
    if (!children) {
      return createMenuItem(id, name);
    }

    const detailsProps = shouldBeOpen(id) ? { open: '' } : {};
    return ['details', { ...detailsProps, style: 'font-size: smaller' }, [
      ['summary', {}, [`[${id}] ${name}`]],
      ...createMenuLevel(children, initialAppId)
    ]];
  });
}

