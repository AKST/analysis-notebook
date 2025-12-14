/**
 * @import { E, Widget } from '../../../prelude-type.ts';
 * @import { Config, State } from './type.ts';
 */

import { doc } from '../../../prelude.js';
import * as tables from './tables.js';
import * as mathml from './mathml.js';
import { readmore, dashbox, todo, infobox, defineTerm, text } from '@prelude-uni/components.js';
import { container, twoThree, twoColumns } from '@prelude-uni/layout.js';
import { createDoc } from '@prelude-uni/util.js';

export const about = createDoc(() => container(
  doc.h1`Models for producing a distribution`,
  dashbox(
    doc.p`These are my notes for the information I've found in asking these questions`,
    text.ol(
      doc.li`
        Are there models given an observation, instead of returning an estimated
        value, instead ${doc.b`return a PDF or distribution`} relating to the
        probablity of possible values?

        ${text.ul({ blockMargin: 1, itemSpace: 'sparse' }).of(
          doc.li`
            In additional to returning a normal distribution it could
            also return a skewed distribution or a bimodal distribution.
          `,
          doc.li`
            The return types could be coefficients for a function to
            create the the distribution or the function itself
            (likely expressed in terms of coefficents tho).
          `,
        )}
      `,
      doc.li`
        If they exist how can you interpret the effect of on parameter on the estimation?
        ${text.ul({ blockMargin: 1, itemSpace: 'sparse' }).of(
          doc.li`In OLS you can clearly see coefficient and their standard error.`,
        )}
      `,
      doc.li`
        Is there a number system for representing predicted values and their
        variance of possible values.
        ${text.ul(
          doc.li`Some kind of ${doc.b`distribution algebra`}`,
          doc.li`
            For example a normal distribution can be passed around as a
            ${doc.b`mean (𝜇)`} and a ${doc.b`variance (𝜎)`}, the variance
            is symetrical, what about other distributions?
          `,
        )}
      `,
      doc.li`
        Are there models that take a distribution in place of a value?
        ${text.ul(
          doc.li`
            As in distribution of possible outcomes for a predicted
            value and propagates that uncertainty into predictions
            from observations where certain variables are not known
            but instead predicted and have their prediction represented
            as a distribution.
          `,
        )}
      `,
    ),
  ),
));

export const distribuionAlgerbra = createDoc(() => container(
  doc.h2`Distribution Algebra / Number System`,
  dashbox(
    doc.p`Somethings that apparently fit this description`,
    text.ul(
      doc.li`Algebra of Random Variables (Probability Theory)`,
      doc.li`Convolution Algebra / Probability Measure Algebra${text.ul(
        doc.li`Something about a convolution operator`,
        doc.li`Something about a Banach algebra`,
      )}`,
      doc.li`Bayesian Probability Theory`,
      doc.li`Probabilistic Programming`,
      doc.li`Uncertainty Propagation Algebras${text.ul(
        doc.li`polynomial chaos expansion (PCE)`,
      )}`,
    ),
    doc.h3`What is we just use the functions`,
    doc.p`
      What if these numbers are expressed in terms of function
      calls, like how a normal distribution is just
      ${doc.b`𝒩(𝜇, 𝜎)`}, although if that's how it's
      represented, I do wonder how represent the expanded form.
    `,
    text.ul(
      doc.li`
        Is there a meaningful interpretation of
        ${doc.b`𝒩(𝒩(𝜇, 𝜎₂), 𝜎₁)`} or ${doc.b`𝒩(𝜇₁, 𝒩(𝜇₂, 𝜎))`}
      `,
    ),
    doc.h3`Passing Thought`,
    doc.p`Is this just more advance ways of modeling probabilty?`,
  ),
));

const PDF_MODELS = {
  rigby2005: text.a({
    href: 'https://academic.oup.com/jrsssc/article-abstract/54/3/507/7113027?redirectedFrom=fulltext',
    title: 'Generalized Additive Models for Location, Scale and Shape',
  }),
  fong2025: text.a({
    href: 'https://www.sciencedirect.com/science/article/pii/S0957417425012072',
    title: 'Temporal mixture density networks for enhanced investment modeling',
  }),
  will2025: text.a({
    href: 'https://papers.ssrn.com/sol3/papers.cfm?abstract_id=4801988',
    title: 'Exploring the Application of a Mixture Density Network to the Australian Housing Market',
  }),
};

export const someLeads = createDoc(() => container(
  doc.h2`Some other leads`,
  dashbox(
    doc.h3`On models that return PDFs`,
    doc.quote`
      Are there a general function that return a PDF,
      which you can pass random values to generate
      possible values given the expected distribution
      of values?
    `,
    doc.p`On the above question I got these leads`,
    text.ol({ itemSpace: 'sparse' }).of(
      doc.li`Mixture Density Networks`,
      doc.li.of(doc.s`Quantile Regression`, doc.span`:
        Can't say I find this one that interesting,
        strikes me as very limited, and possibly
        arbitrary with discrete poitns at which it
        esimates differently.
      `),
      doc.li`${doc.b`Distributional Regression (GAMLSS)`}: Generalized Additive Models for Location`,
      doc.li`Kernel Density Methods`,
    ),
    doc.h4`Examples`,
    text.ul(
      doc.li.of(PDF_MODELS.rigby2005`GAMLSS from 2005`),
      doc.li.of(PDF_MODELS.fong2025`Temporal mixture density networks for enhanced investment modeling`),
      doc.li.of(PDF_MODELS.will2025`Exploring the Application of a Mixture Density Network to the Australian Housing Market`),
    ),
  ),
));
