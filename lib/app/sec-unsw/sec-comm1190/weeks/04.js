/**
 * @import { E } from '@app/prelude-type.ts';
 */
import { doc } from '@app/prelude.js';
import { text } from '@prelude-uni/components.js';
import { twoColumns, container } from '@prelude-uni/layout.js';
import * as math from '../mathml.js';

/**
 * @returns {E.Item}
 */
export function render() {
  return doc.details({ name: 'week', className: 'dashbox' }).c(
    doc.summary.c(doc.h2`Week 4 — Predictive Analytics, Part 1`),
    container(
      doc.h3`An Introduction`,
      text.ul(
        doc.li`A vast set of tools for understanding data`,
        doc.li`Other names used to refer to similar tools, machine learning, predictive analytics, statistical learning`,
        doc.li`Techniques making significant impact on businesses organisations and daily life`,
        doc.li`Historically started with classical linear regression techniques`,
        doc.li`Contemporary extensions faciliated by powerful computation techniques and data/software availablity`,
      ),
      doc.p`As a function`,
      text.ul(
        doc.li`${text.b`Input`}: Independent Variable`,
        doc.li`${text.b`Output`}: Dependant Variable`,
      ),
      twoColumns(
        container(
          doc.h4`Explanation Models`,
          text.ul(
            doc.li`Understand how Y is affected by X`,
            doc.li`Models tend to be simpler`,
            doc.li`Which predictors do we add? How are they related?`
          ),
        ),
        container(
          doc.h4`Prediction Models`,
          text.ul(
            doc.li`Predict outcomes of Y given X`,
            doc.li`Models tends to be more complex`,
            doc.li`What it means isn\'t as important, it just needs acurate predictions`
          ),
        ),
      ),
      doc.h3`Modelling framework`,
      math.generalModel,
      text.ul(
        doc.li`Outcome of interest y_i, relates to inputs x_i`,
        doc.li`Eplison is the unexplained part of the error term`,
      ),
      doc.h3`Ordinary Least Squares`,
      math.ordinaryLeastSquares,
      doc.h3`Examples of uses of Predictive models`,
      text.ul(
        doc.li`${text.b`Quality Control`} - fraud detection of junk email`,
        doc.li`${text.b`Inventoary management`} - sales forecasting`,
        doc.li`${text.b`Risk analysis`} - churning/staff turnover/readmission`,
        doc.li`${text.b`Market segmentation`} - who are my least/most satisfied customers`,
      ),
      doc.h4`Confidence interval`,
      math.confinenceInterval,
      doc.h4`Hypothesis Test`,
      math.hypothesisTests,
      doc.h4`P Values`,
      text.ul(
        doc.li`
          The P value is the probability of finding the observed,
          or more extereme results when the null hypothesis (H0)
        `,
        doc.li`
          The lower the value the greater the significance of the observed difference
        `,
        doc.li`
          P values of 0.05 of lower are generally considered statistically significant.
        `,
      ),
      doc.h4`Model Fit`,
      math.modelFit,
      math.rSquared,
      doc.h3`Professional reporting of results`,
      text.ul(
        doc.li`Use descriptive names`,
        doc.li`Avoid scientific notation`,
        doc.li`Avoid numerical clutter`,
        doc.li`Report P-Values`,
        doc.li`Report sample size & measure of fit`,
        doc.li`Helpful to include mean of dependent variable`,
      ),
      doc.h3`Model Building`,
      text.ul(
        doc.li`Simplified and "build & improve" step for regression${text.ul(
          doc.li`Specify Model`,
          doc.li`Estimate Parameters`,
          doc.li`Interpret results & draw conclusions`,
        )}`,
        doc.li`First step${text.ul(
          doc.li`Use subject matter expert to select variables`,
        )}`,
        doc.li`Ensure residuals are evenly dispersed and clustered around zero`,
        doc.li`Consider using log transformations`,
      ),
    ),
  );
}
