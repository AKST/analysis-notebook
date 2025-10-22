import { styles } from '../prelude.js';

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
    'figure math': {
      '&.wideMath': {
        [styles.DESKTOP_MEDIA_QUERY]: {
           fontSize: 14,
        },
        [styles.MOBILE_MEDIA_QUERY]: {
          fontSize: 10,
        },
        [styles.SLIM_MEDIA_QUERY]: {
          fontSize: 8,
        },
      },
      [styles.MOBILE_MEDIA_QUERY]: {
        fontSize: 14,
      },
      [styles.SLIM_MEDIA_QUERY]: {
        fontSize: 10,
      },
    }
  }
}
