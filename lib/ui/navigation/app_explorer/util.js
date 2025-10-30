/**
 * @import { MenuItem } from './type.ts';
 * @import { El } from '@base/dom_ui/type.ts';
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
 * @param {string} appId
 */
export function setAppInURL(appId) {
  const url = new URL(globalThis.location+'');
  url.searchParams.set('app', appId);
  url.hash = '';
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
    const titleId = id.split('.').at(-1);
    return ['a', {
      class: 'menu-item',
      href: `?app=${id}`,
      style: 'font-size: inherit',
      'data-app': appPath,
      'data-id': id,
      'data-name': name
    }, [`[${titleId}] ${name}`]];
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

    const titleId = id.split('.').at(-1);

    const detailsProps = shouldBeOpen(id) ? { open: '' } : {};
    return ['details', { ...detailsProps, style: 'font-size: smaller' }, [
      ['summary', {}, [`[${titleId}] ${name}`]],
      ...createMenuLevel(children, initialAppId)
    ]];
  });
}

