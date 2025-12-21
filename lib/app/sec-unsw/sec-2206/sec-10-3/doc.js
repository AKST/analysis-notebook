/**
 * @import { E, DocumentWidget, Widget } from '@app/prelude-type.ts';
 * @import { Config, State } from './type.ts';
 */
import { doc } from '@app/prelude.js';
import { twoColumns, twoThree, container } from '@prelude-uni/layout.js';
import { text, clsRef, infobox, dashbox, note, todo } from '@prelude-uni/components.js';
import { createDoc } from '@prelude-uni/util.js';
import * as mathml from './mathml.js';
import * as tables from './tables.js';

/**
 * @param {{
 *   page?: number,
 *   slide?: number,
 * }} cfg
 * @param {E.Item} item
 */
const ref = ({ page, slide }, item) => (
  clsRef({
    book: page != null ? ({ chapter: 17, page }) : undefined,
    lec: slide != null ? ({ id: [10, 'Th'], slide }) : undefined,
  }, item)
);

const LINKS = {
};

/**
 * @param {string} label
 * @returns {Widget<any, State, Config>}
 */
export const createPlaceholder = (label) => (
  createDoc(() => container(
    todo({}, `for "${label.trim()}"`),
  ))
);

export const intro = createDoc(() => container(
  twoThree(
    container(
      doc.h1`
        Limited Dependent Variable Models and Sample Selection Corrections${doc.br()}
        ${doc.small({ style: 'color: #aaaaff' }).t`ECON2206, W10, Lecture 3`}
      `,
    ),
    infobox({ title: 'Resources' }).c(
      doc.p`See here for resources relating to the lesson`,
    ),
  ),
));

export const logitProbitBinaryResponse = createDoc(() => container(
  ref({ page: 560 }, doc.h2`Logit and Probit Models for Binary Response`),
  dashbox(
    twoThree(
      container(
        note(),
        ref({ page: 560 }, doc.h4`Specifying Logit and Probit Models`),
        note(),
        ref({ page: 563 }, doc.h4`Maximum Likelihood Estimation of Logit and Probit Models`),
        note(),
        ref({ page: 564 }, doc.h4`Testing Multiple Hypotheses`),
        note(),
        ref({ page: 565 }, doc.h4`Interpreting the Logit and Probit Estimates`),
        note(),
      ),
      doc.dl(
      ),
    ),
  ),
));

export const tobitCornerSolution = createDoc(() => container(
  ref({ page: 571 }, doc.h2`The Tobit Model for Corner Solution Responses`),
  dashbox(
    twoThree(
      container(
        note(),
        ref({ page: 572 }, doc.h4`Interpreting the Tobit Estimates`),
        note(),
        ref({ page: 578 }, doc.h4`Specification Issues in Tobit Models`),
        note(),
      ),
      doc.dl(
      ),
    ),
  ),
));

export const poissonRegression = createDoc(() => container(
  ref({ page: 578 }, doc.h2`The Poisson Regression Model`),
  dashbox(
    twoThree(
      container(
        note(),
      ),
      doc.dl(
      ),
    ),
  ),
));

export const censoredTruncatedRegression = createDoc(() => container(
  ref({ page: 582 }, doc.h2`Censored and Truncated Regression Models`),
  dashbox(
    twoThree(
      container(
        note(),
        ref({ page: 583 }, doc.h4`Censored Regression Models`),
        note(),
        ref({ page: 586 }, doc.h4`Truncated Regression Models`),
        note(),
      ),
      doc.dl(
      ),
    ),
  ),
));

export const sampleSelectionCorrections = createDoc(() => container(
  ref({ page: 588 }, doc.h2`Sample Selection Corrections`),
  dashbox(
    twoThree(
      container(
        note(),
        ref({ page: 588 }, doc.h4`When Is OLS on the Selected Sample Consistent?`),
        note(),
        ref({ page: 589 }, doc.h4`Incidental Truncation`),
        note(),
      ),
      doc.dl(
      ),
    ),
  ),
));
