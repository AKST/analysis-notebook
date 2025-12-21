/**
 * @import { E } from '@app/prelude-type.ts';
 */
import { doc } from '@app/prelude.js';
import { text } from '@prelude-uni/components.js';
import { container } from '@prelude-uni/layout.js';
import * as math from '../mathml.js';

/**
 * @returns {E.Item}
 */
export function render() {
  return doc.details({ name: 'week', className: 'dashbox' }).c(
    doc.summary({ className: 'h2' }).c(doc.h2`Week 8 — Research Design & Experimentation, Part 1`),
    container(
      container(
        doc.h3`Motivation`,
        doc.blockquote`Correlation does not imply causation`,
        text.ul(
          doc.li`Correlation measure strength of association between two variables`,
        ),
      ),
      container(
        doc.h3`Introduction`,
        doc.p`Experiments are one way to obtain causal effects`,
        text.ul(
          doc.li`Field Experiments`,
          doc.li`A/B Experiments`,
          doc.li`Quasi experiments`,
        ),
      ),
      doc.hr(),
      container(
        doc.h3`Causality & notin of ceteris paribus`,
        doc.blockquote`
          Causation is somethign that makes a difference, and
          the difference it makes must be a difference from what
          would have happened without it. — David Lewis
        `,
        text.ul(
          doc.li`
            In evaluating an intervention (or policy change)
            think of couterfactual outcomes & what if questions
          `,
          doc.li`
            In regression if you want to define a causal effect of x on y.
            How does y change if x is chagned but all other relevant factors
            are held constants?
          `,
        ),
        doc.p`
          While multi regressions are one way to control for a other
          variables an even better way is run a randomised control trial (RCT).
          RCTs are suggested as the gold standard.
        `,
      ),
      doc.hr(),
      container(
        doc.h3`Conducting RCTs`,
        text.ol(
          doc.li`Decide on form of intervention and population of interest`,
          doc.li`Determine output of interest`,
          doc.li`Decide on randomisation unit`,
          doc.li`
            Determine sample size & randomly assign units to
            treatment (new program/website) & control (no program/old
            website/different website version) groups.
          `,
          doc.li`Compare outcomes to determimne treatment effect.`,
          doc.li`Findings are input into decision to adapt (implemtn program/use new website) or not.`,
        ),
      ),
      doc.hr(),
      container(
        doc.h3`Experimental Evidence`,
        doc.p`Experimental evidence on input into decision making`,
        doc.p`
          A significant treatement effect from RCT maybe not be
          enough to justify implementation of intervention.
        `,
        text.ul(
          doc.li`Interventions are costly so size of any benefite needs to be weighted against cost`,
          doc.li`Does intervention represent value for money?`,
          doc.li`Does it have harmful unintended consequences?`,
        ),
        doc.p`${text.b`Null results are useful!`}`,
        text.ul(
          doc.li`Finding no treatement effect could avoid unecessary costs`,
        ),
        doc.p`Interventions may be intuitively appealing`,
        text.ul(
          doc.li`But typically many intuitively appealing interventions may not work.`,
          doc.li`Knowing which is better & wehther they are value for money, requires supporting evidence.`,
        ),
        doc.p`once implemented evidecne shoud continue to be collected & interventions refined`,
        text.ul(
          doc.li`Interventions may work in one population but not another`,
          doc.li`
            Replication of core findings across experiments is more compelling evidence
            than a very significant effect in a single study
          `,
        ),
      ),
    ),
  );
}
