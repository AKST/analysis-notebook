/**
 * @import { CssData, CssImportSite, CssUrlSite } from '../types.ts'
 */

/**
 * Parse CSS file for bundle-relevant data
 * @param {string} content
 * @returns {CssData}
 */
export function parseCss(content) {
  /** @type {CssImportSite[]} */
  const imports = [];
  /** @type {CssUrlSite[]} */
  const urls = [];

  // @import statements
  const importRegex = /@import\s+(['"])([^'"]+)\1/g;
  let match;
  while ((match = importRegex.exec(content)) !== null) {
    imports.push({
      path: match[2],
      span: {
        start: match.index,
        end: match.index + match[0].length,
      },
    });
  }

  // url() references (skip data: and http(s):)
  const urlRegex = /url\(\s*(['"]?)([^'")\s]+)\1\s*\)/g;
  while ((match = urlRegex.exec(content)) !== null) {
    const path = match[2];
    if (path.startsWith('data:') || path.startsWith('http://') || path.startsWith('https://')) {
      continue;
    }
    urls.push({
      path,
      span: {
        start: match.index,
        end: match.index + match[0].length,
      },
    });
  }

  return { imports, urls };
}
