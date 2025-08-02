import * as styles from '../common/styles.js';

export function createStyle() {
  return {
    ...styles.getTypography(),
    ...styles.getLayout(),
    ...styles.getTableStyles(),
    ...styles.getInfoBoxStyles(),
    '.equilibrium-equation': {
      fontSize: 14,
    },
  }
}
