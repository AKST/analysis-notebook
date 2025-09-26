/**
 * @import { Widget } from '../../prelude-type.ts';
 * @import { Config, State, Event } from './type.ts';
 */


/**
 * Docs
 *
 * https://www.cs.toronto.edu/~delve/data/boston/bostonDetail.html
 */
const BOSTON_HOUSING_DATA = 'https://raw.githubusercontent.com/selva86/datasets/master/BostonHousing.csv';

/** @param {string} dataId */
const requestLoadBostonHousingData = (dataId) => ({
  kind: 'load-data',
  dataId,
  source: BOSTON_HOUSING_DATA,
  format: { kind: 'csv' },
  shape: {
    kind: 'cross-sectional',
    vars: [
      { type: 'float64', name: "crim" },
      { type: 'float64', name: "zn" },
      { type: 'float64', name: "indus" },
      {
        type: ['cat', ['0', '1']],
        name: "chas",
      },
      { type: 'float64', name: "nox" },
      { type: 'float64', name: "rm" },
      { type: 'float64', name: "age" },
      { type: 'float64', name: "dis" },
      { type: 'float64', name: "rad" },
      { type: 'float64', name: "tax" },
      { type: 'float64', name: "ptratio" },
      { type: 'float64', name: "b" },
      { type: 'float64', name: "lstat" },
      { type: 'float64', name: "medv" },
    ],
  },
});

/**
 * @type {Widget<any, State, Config, Event>}
 */
export const example = {
  meta: { kind: 'iframe' },
  title: 'Cobb Douglas Production Function',
  path: '../20250926-data/',
  size: { height: 100, gridColumn: { default: 2, s: 2 } },
  initialise: function * () {
    yield requestLoadBostonHousingData('boston');
  },

  normaliseRecv: function * (message) {
    switch (message.kind) {
      case 'load-data:succ':
        yield ['reply', {
          kind: 'run-calc',
          taskId: 'boston-crime-mean',
          dataId: 'boston',
          calc: { kind: 'var-stat', colId: 'crim', stat: { kind: 'mean' } },
        }];
        break;

      case 'run-calc:succ':
        yield ['dispatch', { kind: 'set-crime-mean', mean: message.value }];
        break;

      default:
        console.warn('unknown message', message);
    }
  },
};
