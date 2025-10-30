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
    ['summary', { className: 'h2' }, [doc.h2`Week 7 — Predictive Analytics, Part 3`]],
    container(
      container(
        doc.h3`Classification`,
        doc.p`
          Models like Linear regression don't really make as
          much sense for classifications problems. For binary
          cases we can use ${doc.b`Logisitic Regression`}.
        `,
        doc.p`
          The logisitic regression models the probability that Y
          belongs to a paritcular cateogry p(X).
        `,
        math.logisticRegressionSimple,
        doc.p`
          Since p(X) is a probabily, it takes values between zero
          and one. In logistic regression, we use the
          logistic function:
        `,
        math.logisticRegression,
        doc.p`Alternatively classification trees can be used`,
      ),
      ['hr'],
      container(
        doc.h3`Classification Trees`,
        ul(
          doc.p`Set of rules based on input variables to make predictions`,
          doc.p`The set of rules can be summarised in a tree`,
          doc.p`Simple intepretation`,
          doc.p`Closely resemble human decison making.`,
          doc.p`Useful for communciating predictions and other results ot non-techincal stakeholders`,
          doc.p`Trees are the based of many popular machine learning algorithms`,
        ),
        doc.p`Each Node conatains predicted classificatoin & probablilities`,
      ),
      ['hr'],
      container(
        doc.h3`Evaluation classification models`,
        doc.p`In the continious case we want small prediction errors`,
        math.classificationAccuracy,
        ul(
          doc.p`In classificaiotn problems are either right or wrong`,
          doc.p`Assess model accuracy in terms of accuracy rate after classification`,
          doc.p`Observe y_i = 1 or 0, predict index_i = P(y_i = 1 | x_i)`,
          doc.p`Default threshold of 0.5 used P_i to assign prediciton`,
        ),
        math.exampleOfClassificationModel,
      ),
      ['hr'],
      container(
        doc.h3`Confusion Matrix`,
        crossSectionTable({
          rowColor: {},
          rowHeader: { name: 'Actual', color: 'red' },
          colColor: {},
          colHeader: { name: 'Predicted', color: 'blue' },
          outcomes: {
            'A': {
              'A': ['True Positive'],
              'B': ['False Negative'],
            },
            'B': {
              'A': ['False Positive'],
              'B': ['True Negative'],
            },
          },
        }),
        doc.p`
          Accuracy rate can be obtained from a 2x2 table
          called a confusion matrix.
        `,
      ),
      ['hr'],
      container(
        doc.h3`Algorithm Ethics`,
        doc.p`
          Due to a combination of automatic decision making and
          the black box nature of an algorithm sometimes, questions
          of accountablity are raised. It is entirely possible an
          algorithm could produce an outcome that disadvantage or
          priviliege a certain group unfairly.
        `,
        doc.h4`Identifying Biases`,
        ul(
          'Measure of Bias, difference in estimates when controlling for classification',
        ),
        doc.h4`Risk adjusted algorithms`,
        ul(
          doc.p`Use objective measures${ul(
            'Input X includes past clasims, diagnosis, medications, socio-demographics (without race)',
            'Predicted risk does well in predicting future cost',
          )}`,
        ),
        doc.h4`Questions`,
        doc.dl(
          doc.dt`Do solutions lie with improved algorithms?`,
          doc.dd.of(container(
            ul(
              'not necessarily, sometimes its the training data',
              'sometimes it can be, like the robodebt algo',
              'Accountablity will typically require subject domain input',
            ),
          )),
          doc.dt`Does bias in imply bias out?`,
          doc.dd.of(container(
            ul(
              'A common belief is yes',
              'Given existing biases might sem obviosu that the algorithm would replicate these',
              'Need to be careful to consider sample used as training data',
              'But it depends',
            ),
          )),
          doc.dt`Should algorithm be blinded?`,
          doc.dd.of(container(
            ul(
              'Seems fair, and sensible',
              'But how do you define fair?',
              'It depends',
            ),
          )),
          doc.dt`Should algorithm be interpretable?`,
          doc.dd.of(container(
            ul(
              'Interpretation is a valuable trait',
              'But if there is a more correct algorithm is the lower accuracy justifible?',
              'Maybe it is if there needs to be a level of transparency',
            ),
          )),
        ),
      ),
    ),
  ]];
}
