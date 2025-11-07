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
    book: page != null ? ({ chapter: 9, page }) : undefined,
    lec: slide != null ? ({ id: [7, 'Th'], slide }) : undefined,
  }, item)
);

const LINKS = {
  paper: {
    ramsey1969: text.a({ href: 'https://www.jstor.org/stable/2984219' }),
    mizon1986: text.a({ href: 'https://www.jstor.org/stable/1911313' }),
    davidson1981: text.a({ href: 'https://www.jstor.org/stable/1911522' }),
  },
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
      ['h1', [
        'More on Specification and Data Issues', ['br'],
        ['small', { style: 'color: #aaaaff' }, ['ECON2206, W7, Lecture 1']],
      ]],
    ),
    infobox({ title: 'Resources' })(
      doc.p`See here for resources relating to the lesson`,
      text.ul(
        doc.li.of(LINKS.paper.ramsey1969`Ramsey 1969, specification errors`),
      ),
    ),
  ),
));

export const functionalFormMisspecification = createDoc(() => container(
  ref({ page: 295 }, doc.h2`Functional Form Misspecification`),
  dashbox(
    twoThree(
      container(
        doc.p`Examples of functional form mispecification:`,
        text.ul(
          doc.li`Omitting independent Variables.`,
          doc.li`Log(y) as the dependent variable, when it should be y.`,
        ),
        doc.p`
          When the founctional form of a model has been mispecified we cannot
          obtain unbiased or consistent esimators for our coefficients.
        `,
        doc.h4`Testing for mispecification`,
        doc.p`
          An ${doc.b`F Test`} is already one such example we have to
          testing mispecified founctional form, in that it allows us
          to test for ${doc.b`join exclusion restrictions`}. However
          it is limited to making comparison with between a model and
          its superset. This Provides no help when the dependent
          variable has been incorrectly logged.
        `,
        ref({ page: 297 }, doc.h3`RESET as a General Test for Functional Form Misspecification`),
        doc.p`
          Narrowing the exact reason for a functional form mispecification
          can be difficult. The ${doc.b`RESET test`} is one such tool at our
          disposal in approaching this problem. ${doc.b`The general idea
          behind RESET is`}:
        `,
        text.ul(
          doc.li.of(doc.i`
            For any model that satifies MLR 4, no nonlinear functions
            of independent variables should be significant when added
            to the equation.
          `),
          doc.li`
            If the opposite is true, and they are significant, well
            then we've detected a mispecification.
          `,
        ),
        doc.p`
          You can test the above by adding squared and cubed versions
          of your all explanatory variables, and checking if they are
          significant. While the above works, it has the drawback of
          using many degrees of freedom. However we can do a similar
          trick to the one seen in the simplified ${doc.b`white test`}
          where we squared and cubed version of our fitted values (ŷ²
          and ŷ³)
        `,
        doc.h4`Notable Implementation Decision`,
        doc.p`
          Note, there isn't actually a right or wrong answer on
          how many fited values to include in the expanded
          regression, however squared and cubed is probably
          fine in most cases. But it's worth stressing the
          fact, that can add any number of nonlinear variants.
        `,
        doc.h4`Example`,
        doc.p`Take this model for example:`,
        mathml.reset.models.original,
        doc.p`Our variant for attempting the RESET test looks like this:`,
        mathml.reset.models.resetVariant,
        doc.p`And we test it like so:`,
        mathml.reset.hypothesis.null,
        doc.h4`Testing`,
        doc.p`Testing can be either performed with:`,
        text.ul(
          doc.li`
            An F Statistic (with a df of ${doc.b`n - k - 3`}),
            where a significant F statistic suggests some
            sort of functional problem.
          `,
          doc.li`
            You can alo test with an LM statistic using a 𝜒²
            distribution (with a df of 2).
          `,
        ),
        doc.h4`Some drawbacks`,
        text.ul(
          doc.li`
            One drawback of this kind of test is it doesn't
            really provide you any sense of direction on where
            next to proceed once a model is reject.
          `,
          doc.li`
            No real ability for detecting omitted variables.
          `,
          doc.li`
            No real ability for detecting heteroskedacity.
          `,
        ),
        doc.p`
          Ultimately this is fine as we have other ways to
          think about those problems. Just remember that
          RESET is just a functional form test and nothing
          more.
        `,
      ),
      container(
        doc.dl(
          doc.dt`Functional Form Misspecification`,
          doc.dd`
            A multiple regression model suffers from functional form
            misspecification when it does not properly account
            for the relationship between the dependent and the observed
            explanatory variables.
          `,
        ),
        infobox({ title: "Adding Quadratics" }).of(
          doc.p`
            Using logarithms/quadratics of various variables is quite
            useful for detecting many nonlinear relationships in
            economics. However excess can be sympotomatic of other
            functional forms problems.
          `,
        ),
        doc.dl(
          doc.dt`RESET`,
          doc.dd`
            RESET stands for ${doc.b`Regression Specification
            Error Test`}, and it was originally designed by
            ${LINKS.paper.ramsey1969`Ramsey`} published in his
            1969 paper.
          `,
        ),
        infobox({ title: "ŷ² and ŷ³ as nonlinear functions" }).of(
          mathml.nonlinearFittedValues.ySquared,
          mathml.nonlinearFittedValues.yCubed,
        ),
        doc.dl(
          doc.dt`df`,
          doc.dd`Degrees of Freedom`,
        ),
      )
    ),
    container(
      ref({ page: 298 }, doc.h3`Tests against Nonnested Alternatives`),
      doc.p`
        What about when there's no overlap between two models
        you're testing? As in a nonnested model?
      `,
      mathml.nonnested.example,
      doc.p`
        One method is the one divised by ${LINKS.paper.mizon1986`Mizon
        and Richardson (1986)`} where you assemble a comprehensive model,
        and use one models coefficients for the null hypothesis.
      `,
      mathml.nonnested.mizon,
      doc.p`
        The above approach has a familar problem with a familar
        solution, being the number of degrees of freedom. And the
        answer to that is the ${LINKS.paper.davidson1981`davidson
        mackinnon test`} (note ŷ ≠ y̌).
      `,
      twoColumns(
        mathml.nonnested.davidson.model,
        mathml.nonnested.davidson.assumption,
      ),
      doc.quote`
        Note there's no reason you can't do it the other way around
        and place the fitted values of the nonlog model in the log model.
      `,
      doc.p`
        To test we just check if 𝜃₁ has a singificant t statistic
        (two sided test) to reject the model in which the fitted
        value was added. ${doc.b`It's worthwhile doing both`}, as
        it's possible no clear winner emerges with both model
        rejected or neither models are rejected. ${doc.b`If neither
        are rejected`}, often the R² is used to decide between the
        two.
      `,
      doc.quote`
        Also note when there is a clear winner with the Davidson-Macinnon
        Test, it does not necessarily mean that model is correct.
      `,
    ),
  ),
));

export const usingProxyVariables = createDoc(() => container(
  ref({ page: 299 }, doc.h2`Using Proxy Variables for Unobserved Explanatory Variables`),
  dashbox(
    twoThree(
      container(
        note(),
        ref({ page: 303 }, doc.h4`Using Lagged Dependent Variables as Proxy Variables`),
        note(),
        ref({ page: 304 }, doc.h4`A Different Slant on Multiple Regression`),
        note(),
        ref({ page: 305 }, doc.h4`Potential Outcomes and Proxy Variables`),
        note(),
      ),
      doc.dl(
      ),
    ),
  ),
));

export const modelsWithRandomSlopes = createDoc(() => container(
  ref({ page: 306 }, doc.h2`Models with Random Slopes`),
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

export const olsUnderMeasurementError = createDoc(() => container(
  ref({ page: 308 }, doc.h2`Properties of OLS under Measurement Error`),
  dashbox(
    twoThree(
      container(
        note(),
        ref({ page: 308 }, doc.h4`Measurement Error in the Dependent Variable`),
        note(),
        ref({ page: 310 }, doc.h4`Measurement Error in an Explanatory Variable`),
        note(),
      ),
      doc.dl(
      ),
    ),
  ),
));

export const missingDataAndOutliers = createDoc(() => container(
  ref({ page: 313 }, doc.h2`Missing Data, Nonrandom Samples, and Outlying Observations`),
  dashbox(
    twoThree(
      container(
        note(),
        ref({ page: 313 }, doc.h4`Missing Data`),
        note(),
        ref({ page: 315 }, doc.h4`Nonrandom Samples`),
        note(),
        ref({ page: 317 }, doc.h4`Outliers and Influential Observations`),
        note(),
      ),
      doc.dl(
      ),
    ),
  ),
));

export const leastAbsoluteDeviations = createDoc(() => container(
  ref({ page: 321 }, doc.h2`Least Absolute Deviations Estimation`),
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
