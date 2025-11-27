import * as styles from '@prelude-uni/styles.js';
import { tableStyles } from '../common/style.js';

export function createStyle() {
  return {
    ...styles.getTypography(),
    ...styles.getLayout(),
    ...styles.getTableStyles(),
    ...styles.getInfoBoxStyles(),
    ...tableStyles(),
  }
}
