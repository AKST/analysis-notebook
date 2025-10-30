import * as styles from '@prelude-uni/styles.js';

export function createStyle() {
  return {
    ...styles.getTypography(),
    ...styles.getLayout(),
    ...styles.getTableStyles(),
    ...styles.getInfoBoxStyles(),
    '.fDistributionTable': {
      overflow: 'auto',
      maxWidth: '100%',
      td: { padding: `4px 8px` },
    },
    'th.denominator-df': {
      position: 'relative',
      '> span': {
        transform: 'translateY(10em)',
        writingMode: 'sideways-lr',
        textOrientation: 'mixed',
        whiteSpace: 'nowrap',
        height: '100%',
        // textOrientation: 'upright',
        // transform: rotate(90deg)
      },
    },
  }
}
