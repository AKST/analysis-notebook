import { CurveParams } from '../type.ts';

export type DiscreteRateOfChange =
  | { kind: 'const', const: number }
  | { kind: 'curve', curve: Omit<CurveParams, 'kind'> }
  | { kind: 'scalar', scalar: number }
  | { kind: 'marginal', rate: readonly number[] }
  | { kind: 'cumulative', total: readonly number[] };

export type MarginalFirmBehaviour = {
  readonly costVar: number,
  readonly costTotal: number,
  readonly units: number,
  readonly price: number,
  readonly workers: number,
  readonly revenue: number,
  readonly profit: number,
  readonly avgCostVar: number,
  readonly avgCostTotal: number,
  readonly marginalCost: number,
  readonly marginalBenefit: number,
  readonly marginalRevenue: number,
}

export type FirmBehaviourTable = {
  readonly costVar: readonly number[],
  readonly costTotal: readonly number[],
  readonly units: readonly number[],
  readonly price: readonly number[],
  readonly workers: readonly number[],
  readonly revenue: readonly number[],
  readonly profit: readonly number[],
  readonly avgCostVar: readonly number[],
  readonly avgCostTotal: readonly number[],
  readonly marginalCost: readonly number[],
  readonly marginalBenefit: readonly number[],
  readonly marginalRevenue: readonly number[],
};
