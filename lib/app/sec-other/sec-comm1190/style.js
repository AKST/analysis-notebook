export const SLIM_MEDIA_QUERY = '@media (max-width: 900px)';
export const MOBILE_MEDIA_QUERY = '@media (max-width: 1300px)';
export const DESKTOP_MEDIA_QUERY = '@media (min-width: 1300px)';

export function createStyle() {
  return {
    ...getStylesOfLayout(),
    ...getStylesOfTypography(),
  };
}

function getStylesOfLayout() {
  return {
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
  };
}

function getStylesOfTypography() {
  return {
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
  };
}
