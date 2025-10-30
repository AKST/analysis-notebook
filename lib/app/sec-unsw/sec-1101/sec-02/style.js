import * as styles from '@prelude-uni/styles.js';

export function createStyle() {
  return {
    ...styles.getTypography(),
    ...styles.getLayout(),
    ...styles.getLegend(),
    ...styles.getTermDefinition(),
    ...styles.getTableStyles({
      th: {
        width: 72,
        widthFirst: 48,
      },
    }),
    ...styles.getInfoBoxStyles({
      box: {
      },
      body: {
        '& > *': { marginTop: 0 },
        '& > :last-child': { marginBottom: 0 }
      },
    }),
    '.info-container': {
      display: 'grid',
      justifyContent: 'center',
    },
    '.cbp, .elasticity': {
      fontSize: 16,
    },
    '.bigMath': {
      fontSize: 20,
      padding: [16, 0],
    },
    '.supplycurvetable': {
      td: {
        height: 15,
        lineHeight: 1,
      },
    },
    '.elasticity-table': {
      table: {
        width: '100%',
        fontSize: 10,
        marginTop:  16,
        th: { width: 'initial' },
      },
    },
    '.relevance-disclaimer': {
      padding: 15,
      position: 'relative',
      color: 'black',
      background: 'white',
    },
    '.relevance-disclaimer-2': {
      display: 'block',
      content: '.',
      zIndex: '-1',
      padding: 15,
      border: '2px dashed red',
      '& strong': {
        color: 'red',
        textDecoration: 'underline',
        textShadow: 'none',
      },
    },
  };
}
