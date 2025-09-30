import { generateCSS } from '../../base/render_ui/css.js';

export function getStyles() {
  return generateCSS({
    '.navigation': {
      boxSizing: 'border-box',
      width: '100%',
      height: '100%',
      background: 'var(--bg-black-0f)',
      borderRight: 'var(--border-solid-grey)',
      borderRightWidth: 1,
      padding: 15
    },
    'h3': {
      margin: [0, 0, 16, 0],
      color: 'var(--fb-white)',
      fontFamily: 'monospace'
    },
    'details': {
      marginBottom: 8
    },
    'summary': {
      cursor: 'pointer',
      padding: 6,
      background: 'var(--bg-black-2a)',
      userSelect: 'none',
      fontWeight: 'bold',
    },
    'summary:hover': {
      background: 'var(--bg-black-3a)'
    },
    'details > :is(.menu-item, details)': {
      margin: [8, 0, 8, 16]
    },
    '.menu-item': {
      padding: [4, 8],
      background: 'var(--bg-black)',
      cursor: 'pointer',
      fontSize: 12,
      color: 'var(--fg-white)',
      textDecoration: 'none',
      display: 'block',
      fontFamily: 'monospace'
    },
    '.menu-item:hover': {
      background: 'var(--bg-black-33)'
    },
    '.menu-item:target, .menu-item:active': {
      background: 'var(--bg-black-44)',
      color: 'var(--fg-white)',
    },
  });
}
