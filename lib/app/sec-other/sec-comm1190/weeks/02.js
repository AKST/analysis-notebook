/**
 * @import { E } from '../../../prelude-type.ts';
 */
import { doc } from '../../../prelude.js';
import { twoColumns, container, ol, ul } from '../common.js';
import * as math from '../mathml.js';

/**
 * @type {E.Item}
 */
const _image = ['svg', { viewBox: '0 0 144 74', ns: "http://www.w3.org/2000/svg" }, [
  ['rect', { x: 0.5, y: 0.5, height: 73, width: 34, stroke: 'white', fill: 'transparent', 'stroke-width': 0.5, }],
  ['rect', { x: 7, y: 2.5, height: 10, width: 24, stroke: 'white', fill: 'transparent', 'stroke-width': 0.5, }],
  ['text', { x: 8, y : 5.5, width: 22, 'font-size': 2, 'text-anchor': 'top', fill: 'white' }, 'Business problem'],
]];

/**
 * @returns {E.Item}
 */
export function render() {
  return ['details', { name: 'week', className: 'dashbox' }, [
    ['summary', { className: 'h2' }, [['h2', 'Week 2 — Descriptive Stats']]],
    ['div', { className: 'container' }, [
      ['h2', 'Business Analytics Framework'],
      container(
        ['h3', 'Types of data'],
        ul(
          ['span', ['Quantitative ', ul(
            doc.p(doc.b`Discrete`, ': limits to how small a change can be'),
            doc.p(doc.b`Continious`, ': no limit to how small a change can be'),
          )]],
          ['span', ['Qualitative ', ul(
            doc.p(doc.b`Nominal`, ': describes charteristics'),
            doc.p(doc.b`Ordinal`, ": ranked but descriptive data (neutral, happy, very happy)"),
          )]],
        ),
      ),
      container(
        ['h3', 'Types of Datasets'],
        ul(
          doc.p(doc.b`Cross-sectional`, ': for each subject we collect one or more variable'),
          doc.p(doc.b`Time series`, ': for one subject we collect the same variables over different points in time'),
          doc.p(doc.b`Panel Data`, ': for each subject we collect the same variables over different points in time'),
          doc.p(doc.b`Textual Data`),
          doc.p(doc.b`Image Data`),
          doc.p('etc'),
        ),
      ),
      container(
        ['h3', 'Dimentions of Data'],
        ul(
          doc.p(doc.b`Completeness`, `
            data is comprehensive and meets expectations
          `),
          doc.p(doc.b`Consistency`, `
            data across all systems/sourced from different
            places reflects the same information
          `),
          doc.p(doc.b`Conformity`, `
            data is following a set of standard data definitions
            like data type, size and format.
          `),
          doc.p(doc.b`Accuracy`, `
            data reflects the real world object OR an event being
            described.
          `),
          doc.p(doc.b`Integrity`, `
            all data in a database can be traced and
            connected to other data.
          `),
          doc.p(doc.b`Timeliness`, `
            informaiton is available when it is expected or needed.
          `),
        ),
      ),
      container(
        ['h2', 'Data issues'],
        ul(
          doc.p(doc.b`Formatting issues`),
          doc.p(doc.b`Data type issues`),
          doc.p(doc.b`Missing values`),
          doc.p(doc.b`Outliers`),
        ),
      ),
      container(
        ['h3', 'Techinical Correctness'],
        doc.p('data is techinically correct when'),
        ol(
          doc.p('It can be directly recognized as belonging to a certain variable'),
          doc.p('It is stored in a data type that represents the value domain of the real world variable'),
        ),
      ),
      container(
        ['h3', 'Missing Data'],
        ul(
          doc.p(doc.b`Listwise Deletion`, ul(
            doc.p('Remove records with missing values in any variable'),
            doc.p(`
              Straightforward but can lead to significant data loss and bias if
              the missing data are not completly random
            `),
          )),
          doc.p(doc.b`Meand/Median/Mode Imputation`, ul(
            doc.p(doc.b`Continious`, ': Replace missingg value with the mean'),
            doc.p(doc.b`Skewed Continious`, ': Replace with median'),
            doc.p(doc.b`Categorical Variables`, ': Replace with Mode'),
            doc.p('Simple but can underestimate variablility and lead to baised estimates'),
          )),
        ),
      ),
      ['h3', 'Summary statistics'],
      ['h4', 'Mean — location measure'],
      math.meanFormular,
      ['h4', 'Variance — dispersion measure'],
      math.varFormular,
      ['h4', 'Standard deviation'],
      math.stddevFormular,
      ['p', [
        'The standard deviation is the most common measure of risk',
      ]],
      ['h4', 'Skewness'],
      math.skewness,
      ul(
        'ɣ̂ < 0 means left skew',
        'ɣ̂ = 0 means no skew',
        'ɣ̂ > 0 means right skew',
      ),
      ['h4', 'NTiles'],
      doc.p('data is sorted and split into equally sized portions'),
      ul(
        'Quantilies — 4 portions',
        'Percentiles — 100 portions',
      ),
      doc.p(doc.b`Interquartile range (IQR)`, `
        is the difference between the 3rd and 1st quartile
      `),
      ['h3', 'Dealing with Outliers'],
      ul(
        doc.p(doc.b`Drop the record`, `
          Completely remove the record
        `),
        doc.p(doc.b`Winsorization`, `
          Cap your outliers data, by limiting the range (idk).
        `),
        doc.p(doc.b`Imputation`, `
          Assign a new value (as arbitrary as it sounds)
        `),
      ),
      ['h2', 'Data Privacy'],
      ul(
        doc.p(doc.b`Notice`, `:
          Inform users about privacy policy, privacy protection
          procedures e.g. who will be collecting dat, how data
          will be collected, who owns data.
        `),
        doc.p(doc.b`Choice and consent`, `:
          Consent from indivisuals about the collection,
          use, disclosure, and retention of their information.
        `),
        doc.p(doc.b`Use and retention`, `:
          data should be retained and projected according to
          law or business practices required e.g. the length
          or business practices required e.g. length of data
          retention; avoid secondary use of data for other
          purposes.
        `),
        doc.p(doc.b`Access`, `:
          provide acceess to indivisuals with the access to review,
          update, and modify the data about their personal information.
        `),
        doc.p(doc.b`Protection`, `:
          data is sued only for the purpose stated; de-identifiable
          of sensitive infomraiotn; users have the right to opt out
          for the user of their data.
        `),
        doc.p(doc.b`Enforcement and Redress`, `:
          provide channels for indivisuals to report provide
          feedback, or complain.
        `),
      ),
      ['h2', 'Data Security'],
      ['h3', 'Austrlian Security principals'],
      doc.p('Protect consumer against'),
      ol(
        'Misuse',
        'Interference',
        'Loss',
        'Unauthorised Access',
        'Unauthorised Modification',
        'Unauthorised disclosure',
      ),
    ]],
  ]];
}
