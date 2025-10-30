import * as styles from '@prelude-uni/styles.js';

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
