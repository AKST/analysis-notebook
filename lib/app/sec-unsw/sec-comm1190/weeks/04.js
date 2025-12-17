/**
 * @import { E } from '@app/prelude-type.ts';
 */
import { doc } from '@app/prelude.js';
import { twoColumns, container, ol, ul } from '../common.js';
import * as math from '../mathml.js';

/**
 * @returns {E.Item}
 */
export function render() {
  return doc.details({ name: 'week', className: 'dashbox' }).of(
    doc.summary({ className: 'h2' }).of(doc.h2`Week 4 — Predictive Analytics, Part 1`),
    container(
      doc.h3`An Introduction`,
      ul(
        'A vast set of tools for understanding data',
        'Other names used to refer to similar tools, machine learning, predictive analytics, statistical learning',
        'Techniques making significant impact on businesses organisations and daily life',
        'Historically started with classical linear regression techniques',
        'Contemporary extensions faciliated by powerful computation techniques and data/software availablity',
      ),
      doc.p`As a function`,
      ul(
        doc.p`${doc.b`Input`}: Independent Variable`,
        doc.p`${doc.b`Output`}: Dependant Variable`,
      ),
      twoColumns(
        container(
          doc.h4`Explanation Models`,
          ul('Understand how Y is affected by X',
             'Models tend to be simpler',
             'Which predictors do we add? How are they related?')),
        container(
          doc.h4`Prediction Models`,
          ul('Predict outcomes of Y given X',
             'Models tends to be more complex',
             'What it means isn\'t as important, it just needs acurate predictions')),
      ),
      doc.h3`Modelling framework`,
      math.generalModel,
      ul(
        doc.p`Outcome of interest y_i, relates to inputs x_i`,
        doc.p`Eplison is the unexplained part of the error term`,
      ),
      doc.h3`Ordinary Least Squares`,
      math.ordinaryLeastSquares,
      doc.h3`Examples of uses of Predictive models`,
      ul(
        doc.p`${doc.b`Quality Control`} - fraud detection of junk email`,
        doc.p`${doc.b`Inventoary management`} - sales forecasting`,
        doc.p`${doc.b`Risk analysis`} - churning/staff turnover/readmission`,
        doc.p`${doc.b`Market segmentation`} - who are my least/most satisfied customers`,
      ),
      doc.h4`Confidence interval`,
      math.confinenceInterval,
      doc.h4`Hypothesis Test`,
      math.hypothesisTests,
      doc.h4`P Values`,
      ul(
        doc.p`
          The P value is the probability of finding the observed,
          or more extereme results when the null hypothesis (H0)
        `,
        doc.p`
          The lower the value the greater the significance of the observed difference
        `,
        doc.p`
          P values of 0.05 of lower are generally considered statistically significant.
        `,
      ),
      doc.h4`Model Fit`,
      math.modelFit,
      math.rSquared,
      doc.h3`Professional reporting of results`,
      ul(
        'Use descriptive names',
        'Avoid scientific notation',
        'Avoid numerical clutter',
        'Report P-Values',
        'Report sample size & measure of fit',
        'Helpful to include mean of dependent variable',
      ),
      doc.h3`Model Building`,
      ul(
        doc.p`Simplified and "build & improve" step for regression${ul(
          'Specify Model',
          'Estimate Parameters',
          'Interpret results & draw conclusions',
        )}`,
        doc.p`First step${ul(
          'Use subject matter expert to select variables',
        )}`,
        doc.p`Ensure residuals are evenly dispersed and clustered around zero`,
        doc.p`Consider using log transformations`,
      ),
    ),
  );
}
