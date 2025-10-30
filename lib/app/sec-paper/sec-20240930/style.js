import * as styles from '@prelude-uni/styles.js';

export function createStyle() {
  return {
    ...styles.getTypography(),
    ...styles.getLayout(),
    ...styles.getTableStyles(),
    ...styles.getInfoBoxStyles(),
    'dl > dt': {
      background: 'var(--bg-pink)',
    },
    dd: {
      fontSize: 'smaller',
    },
    'figure': {
      overflow: 'scroll',
      maxWidth: '100%',
      marginInline: 'auto',
      figcaption: {
        textAlign: 'center',
        marginTop: '1em',
      },
    },
    'table :is(td,th):nth-child(1)': {
      textAlign: 'start',
      paddingLeft: 16,
    },
    'table th': {
      padding: 4,
    },
    'table td': {
      paddingBlock: 4,
    },
    'figure:has(> .wideMath)': {
      [styles.SLIM_MEDIA_QUERY]: {
        border: 'color(from var(--bg-blue) srgb r g b / 0.5) dashed 1px',
      }
    },
    'figure math': {
      '&.wideMath': {
        [styles.DESKTOP_MEDIA_QUERY]: {
           fontSize: 14,
        },
        [styles.MOBILE_MEDIA_QUERY]: {
          fontSize: 12,
        },
        [styles.SLIM_MEDIA_QUERY]: {
          fontSize: 12,
        },
      },
      [styles.SLIM_MEDIA_QUERY]: {
        fontSize: 14,
      },
    }
  }
}
