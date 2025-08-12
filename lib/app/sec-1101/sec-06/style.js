import * as styles from '../common/styles.js';

export function createStyle() {
  return {
    ...styles.getTypography(),
    ...styles.getLayout(),
    ...styles.getTableStyles(),
    ...styles.getInfoBoxStyles(),
    ...styles.getTermDefinition(),
    '.tradeLosers': {
      display: 'grid',
      gridTemplateColumns: '1fr auto',
      gridGap: 8,
    },
  }
}
