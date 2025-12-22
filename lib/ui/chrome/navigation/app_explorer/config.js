/**
 * @import { MenuItem } from './type.ts';
 */
export const DEFAULT_APP_ID = 'debug.1';

/** @type {MenuItem[]} */
export const menuStructure = [
  ['unsw', 'UNSW', [
    ["unsw.1101", "ECON1101", [
      ["unsw.1101.01", "PPCs"],
      ["unsw.1101.02", "Supply Curve"],
      ["unsw.1101.03", "Demand Curve"],
      ["unsw.1101.04", "Equilibrium"],
      ["unsw.1101.05", "Local Intervention"],
      ["unsw.1101.06", "Trade Intervention"],
      ["unsw.1101.07", "Monopolies"],
      ["unsw.1101.08", "Oligopolies"],
      ["unsw.1101.09", "Externalities"],
      ["unsw.1101.10", "Public Goods"],
      ["unsw.1101.calc", "Calculator"],
    ]],
    ['unsw.2102', 'ECON2102', [
      ['unsw.2102.01-1', 'Cobb-Douglas'],
      ['unsw.2102.01-2', 'Solow-Swan Model'],
      ['unsw.2102.02-1', 'Romer Model'],
      ['unsw.2102.03-1', 'Labour Markets'],
      ['unsw.2102.04-1', 'Inflation'],
      ['unsw.2102.05-1', 'Short run'],
      ['unsw.2102.05-2', 'IS Curve'],
      ['unsw.2102.05-3', 'Philips Curve'],
      ['unsw.2102.07-1', 'Consumption'],
      ['unsw.2102.08-1', 'Govt Spending'],
      ['unsw.2102.09-1', 'Intl Trade'],
    ]],
    ['unsw.2206', 'ECON2206', [
      ['unsw.2206.01-1', 'What is Econometrics'],
      ['unsw.2206.01-2', 'Simple Regression Model'],
      ['unsw.2206.02-1', 'MLR Model'],
      ['unsw.2206.03-1', 'MLR Analysis'],
      ['unsw.2206.04-1', 'MLR OLS Asymptotics'],
      ['unsw.2206.04-2', 'MLR Further issues'],
      ['unsw.2206.05-1', 'Qualitative MLR Analysis'],
      ['unsw.2206.05-2', 'Hetroskedasticity'],
      ['unsw.2206.07-1', 'More Data Issues'],
      ['unsw.2206.08-1', 'Time Series Data'],
      ['unsw.2206.09-1', 'Panel Data'],
    ]],
  ]],
  ["debug", "Debug", [
    ["debug.1", "Std Library"],
    ["debug.2", "Document App Demo"],
  ]],
  ['paper', 'Papers', [
    ['paper.20240930', 'Homelessness']
  ]],
  ['research', 'Research', [
    ['research.stat', 'Stats', [
      ['research.stat.20251028', 'Models for computing distributions'],
    ]],
    ['research.math', 'Math', [
      ['research.math.20251111', 'Abstract Alegbra'],
    ]],
  ]],
  ["textbook", "Textbooks", [
    ["textbook.c", "Complex Analysis", [
      ["textbook.c.1", "Complex Numbers", [
        ["textbook.c.1.1", "Addition and multiplication"],
        ["textbook.c.1.2", "Binomial Equation"],
        ["textbook.c.1.3", "Analytic Geometry"],
        ["textbook.c.1.4", "Spherical Representation"]
      ]],
      ["textbook.c.2", "Complex Functions", [
        ["textbook.c.2.1", "Limits and Continuity"]
      ]],
      ["textbook.c.3", "Analytic Functions as Mappings", [
        ["textbook.c.3.1", "Sets and Elements"]
      ]],
      ["textbook.c.4", "Complex Integration", [
        ["textbook.c.4.1", "Line Integrals"]
      ]],
      ["textbook.c.5", "Series & Product Developments", [
        ["textbook.c.5.1", "Weierstrass's Theorem"]
      ]],
      ["textbook.c.6", "Conformal Mapping", [
        ["textbook.c.6.1", "Statement and Proof"]
      ]],
      ["textbook.c.7", "Elliptic Functions", [
        ["textbook.c.7.1", "Representation by Exponentials"]
      ]],
      ["textbook.c.8", "Global Analytic Functions", [
        ["textbook.c.8.1", "The Weierstrass Theory"]
      ]]
    ]],
  ]],
];
