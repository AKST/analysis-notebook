import { generateCSS } from '../../base/render_ui/css.js';

export function getStyles() {
  return generateCSS({
    '.navigation': {
      boxSizing: 'border-box',
      width: '100%',
      height: '100%',
      background: '#0f0f0f',
      borderRight: '1px solid #333',
      padding: 15
    },
    'h3': {
      margin: [0, 0, 16, 0],
      color: 'white',
      fontFamily: 'monospace'
    },
    'details': {
      marginBottom: 8
    },
    'summary': {
      cursor: 'pointer',
      padding: 6,
      background: '#2a2a2a',
      userSelect: 'none',
    },
    'summary:hover': {
      background: '#3a3a3a'
    },
    'details > :is(.menu-item, details)': {
      margin: [8, 0, 8, 16]
    },
    '.menu-item': {
      padding: [4, 8],
      background: '#1a1a1a',
      cursor: 'pointer',
      fontSize: 12,
      color: 'white',
      textDecoration: 'none',
      display: 'block',
      fontFamily: 'monospace'
    },
    '.menu-item:hover': {
      background: '#333'
    },
    '.menu-item:target, .menu-item:active': {
      background: '#444',
      color: '#fff'
    },
  });
}
