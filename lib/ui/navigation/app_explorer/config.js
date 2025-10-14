/**
 * @import { MenuItem } from './type.ts';
 */
export const DEFAULT_APP_ID = 'd.1';

/** @type {MenuItem[]} */
export const menuStructure = [
  ["c", "Complex Analysis", [
    ["c.1", "Complex Numbers", [
      ["c.1.1", "Addition and multiplication"],
      ["c.1.2", "Binomial Equation"],
      ["c.1.3", "Analytic Geometry"],
      ["c.1.4", "Spherical Representation"]
    ]],
    ["c.2", "Complex Functions", [
      ["c.2.1", "Limits and Continuity"]
    ]],
    ["c.3", "Analytic Functions as Mappings", [
      ["c.3.1", "Sets and Elements"]
    ]],
    ["c.4", "Complex Integration", [
      ["c.4.1", "Line Integrals"]
    ]],
    ["c.5", "Series & Product Developments", [
      ["c.5.1", "Weierstrass's Theorem"]
    ]],
    ["c.6", "Conformal Mapping", [
      ["c.6.1", "Statement and Proof"]
    ]],
    ["c.7", "Elliptic Functions", [
      ["c.7.1", "Representation by Exponentials"]
    ]],
    ["c.8", "Global Analytic Functions", [
      ["c.8.1", "The Weierstrass Theory"]
    ]]
  ]],
  ["1101", "ECON1101", [
    ["1101.01", "PPCs"],
    ["1101.02", "Supply Curve"],
    ["1101.03", "Demand Curve"],
    ["1101.04", "Equilibrium"],
    ["1101.05", "Local Intervention"],
    ["1101.06", "Trade Intervention"],
    ["1101.07", "Monopolies"],
    ["1101.08", "Oligopolies"],
    ["1101.09", "Externalities"],
    ["1101.10", "Public Goods"],
    ["1101.calc", "Calculator"],
  ]],
  ['2102', 'ECON2102', [
    ['2102.01-1', 'Cobb-Douglas'],
    ['2102.01-2', 'Solow-Swan Model'],
    ['2102.02-1', 'Romer Model'],
    ['2102.03-1', 'Labour Markets'],
    ['2102.04-1', 'Inflation'],
    ['2102.05-1', 'Short run'],
  ]],
  ['2206', 'ECON2206', [
    ['2206.01-1', 'What is Econometrics'],
    ['2206.01-2', 'Simple Regression Model'],
    ['2206.02-1', 'MLR Model'],
    ['2206.03-1', 'MLR Analysis'],
    ['2206.04-1', 'MLR OLS Asymptotics'],
    ['2206.04-2', 'MLR Further issues'],
    ['2206.05-1', 'Qualitative MLR Analysis'],
  ]],
  ["d", "Debug", [
    ["d.1", "Std Library"],
    ["d.2", "Document App Demo"],
  ]]
];
