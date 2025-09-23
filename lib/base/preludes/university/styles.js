// TODO rename to W_900, W_1300, W_DEFAULT
export const SLIM_MEDIA_QUERY = '@media (max-width: 900px)';
export const MOBILE_MEDIA_QUERY = '@media (max-width: 1300px)';
export const DESKTOP_MEDIA_QUERY = '@media (min-width: 1300px)';

export function getTableStyles({
  th: {
    width: thWidth = 32,
    widthFirst: firstThWidth = 40,
  } = {}
} = {}) {
  return {
    table: {
      background: 'white',
      fontSize: 10,
      color: 'black',
      td: { textAlign: 'center' },
      th: {
        background: '#00f',
        color: 'white',
        width: thWidth,
        '&:first-child': { width: firstThWidth },
      },
      '.footerCap': {
        color: 'white',
        fontSize: 10,
        marginTop: 4,
        captionSide: 'bottom',
      },
      '.headingCap': {
        color: 'white',
        background: 'blue',
        padding: [4, 8],
        fontSize: 10,
        fontWeight: '900',
        marginBottom: 4,
        captionSide: 'top',
      },
    }
  };
}

/**
 * @param {{box?: Record<string, any>, name?: Record<string, any>, body?: Record<string, any>}} [options]
 * @returns {Record<string, any>}
 */
export function getInfoBoxStyles({
  box: infoboxOverride = {},
  name = {},
  body = {}
} = {}) {
  return {
    '.infobox': {
      display: 'grid',
      justifyContent: 'start',
      alignSelf: 'start',
      gridTemplateColumns: '1fr',
      gridGap: 4,
      padding: 2,
      background: '#c0c0c0',
      border: '2px outset grey',
      ...infoboxOverride,

      '.infobox-name': {
        background: '#00f',
        padding: 4,
        fontSize: 12,
        margin: 0,
        ...name,
      },
      '.infobox-body': {
        color: 'black',
        background: 'white',
        padding: 8,
        border: '2px inset grey',
        fontSize: 10,
        ...body
      },
    },
  };
}

/**
 * @returns {{
 *   '.word-def': any,
 *   '.word-def-ipa': any,
 *   '.word-def-ipa-act': any,
 *   '.word-def-ipa-syn': any,
 *   '.word-def-meanings': any,
 *   '.word-def-source': any,
 *   '.word-def-word': any,
 * }}
 */
export function getTermDefinition() {
  return {
    '.word-def': {
      position: 'relative',
      fontSize: 10,
      border: 'white 1px dashed',
      padding: [8, 16],
    },
    '.word-def-word': {
      display: 'grid',
      gridGap: 8,
      gridTemplateColumns: 'auto auto',
      alignItems: 'center',
      alignContent: 'center',
      justifyContent: 'start',
      justifyItems: 'start',
      '& > dfn': {
        '& > strong': {
        },
      },
    },
    '.word-def-ipa': {
    },
    '.word-def-ipa-syn': {
    },
    '.word-def-ipa-act': {
    },
    '.word-def-source': {
      display: 'grid',
      gridGap: 8,
      gridAutoFlow: 'column',
      gridAutoColumns: 'auto',
      lineHeight: '1',
      padding: 4,
      position: 'absolute',
      border: 'white 1px dashed',
      background: 'var(--bg-black)',
      bottom: -10,
      right: 8,
      '> :is(a, a:visited)': {
        color: '#ffaaaa',
      },
    },
    '.word-def-meanings': {
      color: '#eeeeee',
      paddingLeft: 8,
      '& >  li': {

      },
    },
  };
}

/**
 * @returns {Record<string, any>}
 */
export function getLegend() {
  return {
    '.legendInfo': {
      display: 'grid',
      fontSize: 10,
      gridGap: 16,
      gridTemplateColumns: 'auto 1fr auto 1fr auto 1fr auto 1fr auto 1fr',
      [MOBILE_MEDIA_QUERY]: {
        gridTemplateColumns: 'auto 1fr auto 1fr auto 1fr',
      },
      [SLIM_MEDIA_QUERY]: {
        gridTemplateColumns: 'auto 1fr auto 1fr',
      },
      alignItems: 'center',
      dd: { margin: 0 },
      dt: {
        margin: 0,
        color: 'white',
        background: 'var(--bg-greygreen)',
        textAlign: 'center',
        padding: [4, 8],
      },
    },
  }
}

/**
 * @returns {Record<string, any>}
 */
export const getTypography = () => ({
  details: {
    strong: { color: '#fff' },
    '& > summary': {
      cursor: 'pointer',
      fontWeight: 'bold',
    },
    '& > *:not(summary)': {
      color: '#ccc',
    },
    '& > .container': {
      padding: 8,
    },
  },
  ':is(a, a:visited)': {
    color: '#ffaaaa',
  },
  quote: {
    display: 'block',
    fontStyle: 'italic',
    fontSize: 12,
    paddingLeft: 16,
    borderLeft: '4px solid white',
    color: '#aaa',
    strong: { color: '#fff' },
  },
  ':is(summary, quote, p, dd, li, h1, h2, h3, h4, h5, h6) > strong': {
    textShadow: '2px 2px blue',
  },
  'quote, p': {
    marginBottom: '0.75rem',
  },
  figure: {
    figcaption: {
      padding: 0,
      margin: 0,
      paddingTop: 8,
      width: '100%',
      fontSize: 10,
      textAlign: 'center',
    },
  },
  'quote, p, dd, li': {
    lineHeight: '1.8'
  },
  '.chartLabel': {
    minWidth: 0,
    marginBottom: 16,
  },
  ul: {
    'li + li': { marginTop: 16 },
    '&:is(.c2,.no-item-padding) > li + li': { marginTop: 0 },

    /**
     * Nested list dynamics
     */
    paddingLeft: 32,
    ':is(li > span, li > p, li) > ul': {
      paddingLeft: 16,
    },
  },
  hr: {
    width: '100%',
  },
  'hr.divider': {
    background: 'teal',
    display: 'block',
    height: 16,
    border: '2px outset #c6c6c6',
  },
  h4: {
    background: 'blue',
    padding: [4, 8],
  },
  dl: {
    padding: [0, 8],
    [MOBILE_MEDIA_QUERY]: {
      padding: [0, 16],
    },
    [SLIM_MEDIA_QUERY]: {
      padding: [0, 0],
    },
    dt: {
      background: 'var(--bg-greygreen)',
      fontWeight: '700',
      margin: [8, 0],
      padding: [4, 8],
      '&:first-child': { marginTop: 0 },
    },
    dd: { marginLeft: 24 },
    'dd + dt': { marginTop: 16 },
  },
});

/**
 * @param {{ c2?: Record<string, any> }} [options={}]
 * @returns {Record<string, any>}
 */
export const getLayout = ({ c2 } = {}) => ({
  '.container': {
    display: 'grid',
    gridGap: 16,
    gridTemplateColumns: 'repeat(8, 1fr)',
    alignContent: 'start',
    maxWidth: 800,
    margin: [0, 'auto'],
    '& > *': {
      gridColumn: '1 / -1',
    },
    '& .container': {
      margin: 0,
      gridTemplateColumns: 'unset',
    },
    '& > dl': {
      padding: [0, 8],
      margin: 0,
    },
  },
  '.readmore': {
    border: 'white 1px dashed',
    padding: 8,
    '& > summary': { cursor: 'pointer' },
  },
  '.dashbox': {
    padding: 16,
    border: 'white 1px dashed',
  },
  ':is(quote, p, h1, h2, h3, h4, ul, dl)': {
    margin: 0,
  },
  '.diagram-table': {
    border: 'solid 4px blue',
    marginTop: 2,
    marginBottom: 2,
    padding: 4,
    '& th': {
      lineHeight: '1.5',
      border: 'dashed 1px blue',
      color: 'black',
      background: 'white',
    },
    '& > caption': {
      padding: 4,
      background: 'blue',
      color: 'white',
    },
    '&:has(> caption)': {
      marginBottom: 6,
    },
  },
  '.c2': {
    display: 'grid',
    gridGap: '16px',
    '&:is(ul,ol)': { gridGap: [0, 16], },
    '& > *': {
      alignSelf: 'start',
    },
    ...c2,
    [DESKTOP_MEDIA_QUERY]: {
      gridTemplateColumns: '1fr 1fr',
      '&.twoThree': {
        gridTemplateColumns: '1fr 300px',
      },
    },
    '&.center': {
      justifyItems: 'center',
      justifyContent: 'center',
    },
    [MOBILE_MEDIA_QUERY]: {
      gridTemplateColumns: '1fr',
      '&.twoThree': {
        gridTemplateColumns: '1fr',
      },
    },
  },
})
