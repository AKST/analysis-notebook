/**
 * @import { E } from '@app/prelude-type.ts';
 */
import { doc } from '@app/prelude.js';
import { crossSectionTable, text } from '@prelude-uni/components.js';
import { twoColumns, container } from '@prelude-uni/layout';
import * as math from '../mathml.js';

/**
 * @returns {E.Item}
 */
export function render() {
  return doc.details({ name: 'week', className: 'dashbox' }).c(
    doc.summary({ className: 'h2' }).c(doc.h2`Week 7 — Predictive Analytics, Part 3`),
    container(
      container(
        doc.h3`Classification`,
        doc.p`
          Models like Linear regression don't really make as
          much sense for classifications problems. For binary
          cases we can use ${text.b`Logisitic Regression`}.
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
      doc.hr(),
      container(
        doc.h3`Classification Trees`,
        text.ul(
          doc.li`Set of rules based on input variables to make predictions`,
          doc.li`The set of rules can be summarised in a tree`,
          doc.li`Simple intepretation`,
          doc.li`Closely resemble human decison making.`,
          doc.li`Useful for communciating predictions and other results ot non-techincal stakeholders`,
          doc.li`Trees are the based of many popular machine learning algorithms`,
        ),
        doc.p`Each Node conatains predicted classificatoin & probablilities`,
      ),
      doc.hr(),
      container(
        doc.h3`Evaluation classification models`,
        doc.p`In the continious case we want small prediction errors`,
        math.classificationAccuracy,
        text.ul(
          doc.li`In classificaiotn problems are either right or wrong`,
          doc.li`Assess model accuracy in terms of accuracy rate after classification`,
          doc.li`Observe y_i = 1 or 0, predict index_i = P(y_i = 1 | x_i)`,
          doc.li`Default threshold of 0.5 used P_i to assign prediciton`,
        ),
        math.exampleOfClassificationModel,
      ),
      doc.hr(),
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
      doc.hr(),
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
        text.ul(
          doc.li`Measure of Bias, difference in estimates when controlling for classification`,
        ),
        doc.h4`Risk adjusted algorithms`,
        text.ul(
          doc.li`Use objective measures${text.ul(
            doc.li`Input X includes past clasims, diagnosis, medications, socio-demographics (without race)`,
            doc.li`Predicted risk does well in predicting future cost`,
          )}`,
        ),
        doc.h4`Questions`,
        doc.dl(
          doc.dt`Do solutions lie with improved algorithms?`,
          doc.dd.c(container(
            text.ul(
              doc.li`not necessarily, sometimes its the training data`,
              doc.li`sometimes it can be, like the robodebt algo`,
              doc.li`Accountablity will typically require subject domain input`,
            ),
          )),
          doc.dt`Does bias in imply bias out?`,
          doc.dd.c(container(
            text.ul(
              doc.li`A common belief is yes`,
              doc.li`Given existing biases might sem obviosu that the algorithm would replicate these`,
              doc.li`Need to be careful to consider sample used as training data`,
              doc.li`But it depends`,
            ),
          )),
          doc.dt`Should algorithm be blinded?`,
          doc.dd.c(container(
            text.ul(
              doc.li`Seems fair, and sensible`,
              doc.li`But how do you define fair?`,
              doc.li`It depends`,
            ),
          )),
          doc.dt`Should algorithm be interpretable?`,
          doc.dd.c(container(
            text.ul(
              doc.li`Interpretation is a valuable trait`,
              doc.li`But if there is a more correct algorithm is the lower accuracy justifible?`,
              doc.li`Maybe it is if there needs to be a level of transparency`,
            ),
          )),
        ),
      ),
    ),
  );
}
