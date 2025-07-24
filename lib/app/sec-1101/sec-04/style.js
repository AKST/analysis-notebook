import * as styles from '../common/styles.js';

export function createStyle() {
  return {
    ...styles.getTypography(),
    ...styles.getLayout(),
    ...styles.getTableStyles(),
    ...styles.getInfoBoxStyles(),
    ...styles.getTermDefinition(),
    '.horizontal-summary-math': {
      fontSize: 16,
    },
    '.dashbox': {
      padding: 16,
      border: 'white 1px dashed',
    },
    '.adamSmith': {
      float: 'left',
      marginRight: 16,
      animation: 'rotateY 12s linear infinite',
      transformStyle: 'preserve-3d',
      [styles.MOBILE_MEDIA_QUERY]: {
        display: 'none',
      },
    },
    '@keyframes rotateY': {
      from: { transform: 'rotateY(0deg)' },
      to: { transform: 'rotateY(360deg)' },
    }
  }
}
