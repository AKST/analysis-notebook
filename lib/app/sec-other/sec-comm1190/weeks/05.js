/**
 * @import { E } from '../../../prelude-type.ts';
 */
import { doc } from '../../../prelude.js';
import { twoColumns, container, ol, ul } from '../common.js';
import * as math from '../mathml.js';

/**
 * @returns {E.Item}
 */
export function render() {
  return ['details', { name: 'week', className: 'dashbox' }, [
    ['summary', { className: 'h2' }, [['h2', 'Week 5 — Predictive Analytics, Part 2']]],
    container(
      container(
        ['h3', 'Prediction Certainty'],
        math.ordinaryLeastSquares,
        twoColumns(
          container(
            ['h4', 'Confidence interval'],
            math.confinenceInterval2,
            doc.p`Where:`,
            ul(
              'SE^2 is the variance of the resideuals from the regression model.',
              'SE_mean is the standard error of the mean prediction.',
            ),
          ),
          container(
            ['h4', 'Prediction Intervals'],
            math.predictionInterval,
            doc.p`Where:`,
            ul(
              doc.p`y_new is the predicted value for the new observation.`,
              doc.p`${doc.b`t_alpha/2`} is the critical value from the t
                distribution with n - p - 1 degrees of freedom (where n is the
                number of data pointss, and p is the number of predictors),
                corresponding to the confidence level (e.g. 95% confidence level).
              `,
              doc.p`${doc.b`SE_pred`} is the standard error of the prediction`,
            ),
          ),
        ),
        ['h4', 'Prediction Accuracy'],
        doc.p`Quality of Fit: Mean Squared Error`,
        math.mse,
        doc.p`
          This should be small if predicted response are close
          to the true responses.
        `,
        doc.p`
          Note if the MSW is computed using the data used to fit the model
          (which is called the training data) then this is more accuratedly
          referred to as the training MSE or within sample MSE. Some
          potential problems with that:
        `,
        ul(
          doc.p`${doc.b`Bias in model selection`}:
            Relying solely on training MSW can lead to biased model selection,
            favoruing more complex models that fit the trainging data well but
            fail to preform adequately on validation or test datasets.
          `,
          doc.p`${doc.b`NOt reflective of real world perfmance or lack of generalizablity`}:
            The training MSW reflects perforance only on the training set and
            does not provide insight into how the model behaves in real-world
            applications where the data may vary. Training MSW does not account
            for how well the model will perform on a differnt dataset. It may
            provide a flase sense of security regarding the models predictive power.
          `,
        ),
      ),
      ['hr'],
      container(
        ['h3', 'Countering Overfitting'],
        doc.p`
          One approach to couter overfitting is to add a penalty
          for complexity when evaluating fit in original data.
          This is more or less how the Adjusted R Squared works.
        `,
        math.testMse,
        doc.p`
          Another approach is to split data into a training dataset
          and a testing dataset. This works by evaluating the prediction
          performance on unseen data.
        `,
      ),
      ['hr'],
      container(
        ['h3', 'Machine Learning'],
        doc.p`
          Machine learning is the study of algorithms applied to
          data focussing on prediction & classification. How they
          stand out as forms of predictions is they: ${['br']}${['br']}${ul(
            doc.p`
              Aren't just defined as formulars but also as algorithms.
            `,
            doc.p`
              For that reason they can be automated and produce results
              without intervention.
            `,
            doc.p`
              Due to the emphasis being placed on prediction much less
              is placed on explaination, which can make them difficult
              to interpret.
            `,
          )}
        `,
      ),
      ['hr'],
      container(
        ['h3', 'Regression trees'],
        doc.p`
          Tree-based methods involve segmenting inputs
          into mutually exlusive & exhaustive regions.
          ${['br']}${['br']}${ul(
            doc.p`Branches connect internal nodes to a terminal node (leaf)`,
            doc.p`Branches formed by binary splits at each node.`,
            doc.p`Each leaf assigned a prediction (e.g. mean outcome within branch)`,
          )}
        `,
      ),
      ['hr'],
      container(
        ['h3', 'Regression vs Classification'],
        twoColumns(
          container(
            ['h4', 'Regression'],
            ul(
              doc.p`${doc.b`Y`} is quatitative, continious`,
              doc.p`
                Exmaples: sales predictions, house prices predictions,
                stock price modelling, model employment satisification.
              `,
            ),
          ),
          container(
            ['h4', 'Classification'],
            ul(
              doc.p`${doc.b`Y`} is qualitative, nominal`,
              doc.p`
                Exmaples: Fraud detection, face recognition,
                whether someon will default of not on debt,
                employment attrition.
              `,
            ),
          ),
        ),
      ),
    ),
  ]];
}
