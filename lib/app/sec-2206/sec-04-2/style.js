import { styles } from '../prelude.js';

export function createStyle() {
  return {
    ...styles.getTypography(),
    ...styles.getLayout(),
    ...styles.getTableStyles(),
    ...styles.getInfoBoxStyles(),
    'figure:has(.big-math)': {
      overflow: 'scroll',
      maxWidth: '100%',
    },
    '.big-math': {
      [styles.SLIM_MEDIA_QUERY]: {
        fontSize: 12,
      },
      [styles.MOBILE_MEDIA_QUERY]: {
        fontSize: 12,
      },
    },
  }
}
