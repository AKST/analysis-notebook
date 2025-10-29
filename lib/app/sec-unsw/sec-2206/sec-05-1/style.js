import { styles } from '../prelude.js';

export function createStyle() {
  return {
    ...styles.getTypography(),
    ...styles.getLayout(),
    ...styles.getTableStyles(),
    ...styles.getInfoBoxStyles(),
    dd: {
      fontSize: '10px',
    },
  }
}
