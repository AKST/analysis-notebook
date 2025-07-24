import * as styles from '../common/styles.js';

export function createStyle() {
  return {
    ...styles.getTypography(),
    ...styles.getLayout(),
    ...styles.getTableStyles(),
    ...styles.getInfoBoxStyles(),
    '.math-mrs': {
      fontSize: 12,
    },
    'td:has(> .choiceInc)': {
      background: '#66ff66',
    },
    'td:has(> .choiceSame)': {
      background: '#666',
      color: 'white',
    },
  }
}
