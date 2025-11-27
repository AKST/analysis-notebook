export function tableStyles() {
  return {
    'table.paddedTable': {
      'th, td': {
        paddingInline: 16,
        paddingBlock: 4,
      },
    },
    'table.setupTable': {
      'tr > th:first-child': {
        textAlign: 'left',
        width: 300,
      }
    },
    'table.really-wide': {
      fontSize: 9,
      'tr > th:first-child': {
        textAlign: 'left',
        width: 300,
      },
      'tr > th:not(:first-child)': {
        width: 60,
      },
      'th, td': {
        paddingInline: 4,
        paddingBlock: 4,
      },
    },
  };
}
