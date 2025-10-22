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
      marginInline: 'auto',
      figcaption: {
        textAlign: 'center',
        marginTop: '1em',
      },
    },
    'table.calibration :is(td,th):nth-child(1)': {
      textAlign: 'start',
      paddingLeft: 16,
    },
    'table th': {
      padding: 4,
    },
  }
}
