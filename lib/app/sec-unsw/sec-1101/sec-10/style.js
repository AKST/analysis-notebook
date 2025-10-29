import * as prelude from '../prelude.js';

const styles = prelude.styles;

export function createStyle() {
  return {
    ...styles.getTypography(),
    ...styles.getLayout(),
    ...styles.getTableStyles(),
    ...styles.getInfoBoxStyles(),
  }
}
