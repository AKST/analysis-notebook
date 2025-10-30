/**
 * @import { E } from '@app/prelude-type.ts';
 */
import { doc } from '@app/prelude.js';
import { crossSectionTable, twoColumns, container, ol, ul } from '../common.js';
import * as math from '../mathml.js';

/**
 * @returns {E.Item}
 */
export function render() {
  return ['details', { name: 'week', className: 'dashbox' }, [
    ['summary', { className: 'h2' }, [doc.h2`Week 8 — Research Design & Experimentation, Part 1`]],
    container(
      container(
        doc.h3`Motivation`,
        doc.quote`Correlation does not imply causation`,
        ul(
          doc.p`Correlation measure strength of association between two variables`,
        ),
      ),
      container(
        doc.h3`Introduction`,
        doc.p`Experiments are one way to obtain causal effects`,
        ul(
          doc.p`Field Experiments`,
          doc.p`A/B Experiments`,
          doc.p`Quasi experiments`,
        ),
      ),
      ['hr'],
      container(
        doc.h3`Causality & notin of ceteris paribus`,
        doc.quote`
          Causation is somethign that makes a difference, and
          the difference it makes must be a difference from what
          would have happened without it. — David Lewis
        `,
        ul(
          doc.p`
            In evaluating an intervention (or policy change)
            think of couterfactual outcomes & what if questions
          `,
          doc.p`
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
      ['hr'],
      container(
        doc.h3`Conducting RCTs`,
        ol(
          'Decide on form of intervention and population of interest',
          'Determine output of interest',
          'Decide on randomisation unit',
          doc.p`
            Determine sample size & randomly assign units to
            treatment (new program/website) & control (no program/old
            website/different website version) groups.
          `,
          doc.p`Compare outcomes to determimne treatment effect.`,
          doc.p`Findings are input into decision to adapt (implemtn program/use new website) or not.`,
        ),
      ),
      ['hr'],
      container(
        doc.h3`Experimental Evidence`,
        doc.p`Experimental evidence on input into decision making`,
        doc.p`
          A significant treatement effect from RCT maybe not be
          enough to justify implementation of intervention.
        `,
        ul(
          doc.p`Interventions are costly so size of any benefite needs to be weighted against cost`,
          doc.p`Does intervention represent value for money?`,
          doc.p`Does it have harmful unintended consequences?`,
        ),
        doc.p`${doc.b`Null results are useful!`}`,
        ul(
          doc.p`Finding no treatement effect could avoid unecessary costs`,
        ),
        doc.p`Interventions may be intuitively appealing`,
        ul(
          doc.p`But typically many intuitively appealing interventions may not work.`,
          doc.p`Knowing which is better & wehther they are value for money, requires supporting evidence.`,
        ),
        doc.p`once implemented evidecne shoud continue to be collected & interventions refined`,
        ul(
          doc.p`Interventions may work in one population but not another`,
          doc.p`
            Replication of core findings across experiments is more compelling evidence
            than a very significant effect in a single study
          `,
        ),
      ),
    ),
  ]];
}
