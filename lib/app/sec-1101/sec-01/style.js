import {
  getInfoBoxStyles,
  getTableStyles,
  getLayout,
  getTypography,
  MOBILE_MEDIA_QUERY,
} from '../common/styles.js';

export function createStyle() {
  return {
    ...getTypography(),
    ...getLayout(),
    ...getTableStyles({
      th: { width: 32, widthFirst: 80 },
    }),
    ':is(quote, p, h1, h2, h3)': {
      margin: 0,
    },
    ...getInfoBoxStyles(),
    math: {
      fontSize: 18,
      [MOBILE_MEDIA_QUERY]: {
        fontSize: 12,
      },
    },
    '.vector-list': {
      listStyle: 'none',
      padding: 0,
      margin: [0, 0, '1rem']
    },
    '.vector-item': {
      padding: '0.5rem',
      margin: [0, 0, '0.25rem'],
      borderLeft: '4px solid',
    }
  };
}
