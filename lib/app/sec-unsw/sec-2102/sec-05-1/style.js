import { styles } from '../prelude.js';

export function createStyle() {
  return {
    ...styles.getTypography(),
    ...styles.getLayout(),
    ...styles.getTableStyles(),
    ...styles.getInfoBoxStyles(),
    figure: {
      display: 'grid',
      gridGap: 16,
      gridAutoFlow: 'row',
      justifyItems: 'center',
      margin: '16px auto',
      figcaption: { fontSize: 12 },
    },
  }
}
