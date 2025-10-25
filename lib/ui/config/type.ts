import { ConfigKnobLabel } from './common/label.js';

export interface KnobElement extends HTMLElement {
  gridColumn: number;
  label?: ConfigKnobLabel
  setup(): void;
  setEnable(value: boolean): void;
}

export type KnobConfig =
  Record<string, KnobConfigVariant>;

export type KnobConfigVariant =
  | NumberKnobConfig
  | BooleanKnobConfig
  | ComplexKnobConfig
  | CurveKnobConfig
  | ColorKnobConfig
  | SequenceKnobConfig
  | MakeGroupKnob<any>
  | MakeManyKnob<any>
  | MakeOptionalKnob<any>
  | MakeVariantKnob<{ kind: string, value: unknown }>;

export type SequenceKnobConfig =
  & { kind: 'sequence', marginal?: boolean }
  & KnobCommon<readonly number[]>;

export type NumberKnobConfig =
  & { kind: 'number', range?: [number, number] }
  & { input?: 'range' | 'text' }
  & KnobCommon<number>;

export type ColorKnobConfig =
  & { kind: 'color' }
  & KnobCommon<number>;

export type BooleanKnobConfig =
  & { kind: 'boolean' }
  & KnobCommon<boolean>;

export type ComplexKnobConfig =
  & { kind: 'complex', range?: [[number, number], [number, number]] }
  & KnobCommon<[number, number]>;

export type CurveKnobConfig =
  & { kind: 'curve',
      mode?: 'P' | 'Q',
      range?: [[number, number], [number, number]] }
  & KnobCommon<[number, number]>;

type KnobCommon<V> = {
  label?: string | null,
  of?: V,
}

export type MakeConfigKnobs<R extends Record<string, any>> = {
  [Property in keyof R]: MakeConfigKnob<R[Property]>
};

export type MakeConfigKnob<R> =
  undefined extends R ? MakeOptionalKnob<R> :
  R extends boolean ? BooleanKnobConfig :
  R extends number ? (NumberKnobConfig | ColorKnobConfig) :
  R extends [number, number] ? (ComplexKnobConfig | CurveKnobConfig) :
  R extends (readonly number[]) ? SequenceKnobConfig :
  R extends ({ kind: string, value: any }) ? MakeVariantKnob<R> :
  R extends Record<string, any> ? (MakeGroupKnob<R> | MakeManyKnob<R>) :
  never;

export type MakeOptionalKnob<R> = {
  kind: 'optional',
  of?: undefined;
  label?: string | null,
  enabled: boolean;
  some: MakeConfigKnob<NonNullable<R>> & {
    label: string;
  };
};

export type MakeVariantKnob<R extends { kind: string, value: any }> = {
  kind: 'variant',
  variants: {
    [K in R['kind']]: MakeConfigKnob<Extract<R, { kind: K }>['value']>
  },
} & KnobCommon<R>;

export type MakeGroupKnob<R extends Record<string, any>> = {
  kind: 'group',
  layout?: 'dense' | 'sparse';
  group: {
    [Property in keyof R]: MakeConfigKnob<R[Property]>
  },
} & KnobCommon<R>;

export type MakeManyKnob<R extends Record<string, any>> = {
  kind: 'many',
  create: (id: string) => (
    R extends Record<string, infer V>
      ? MakeConfigKnob<V>
      : never
  ),
} & KnobCommon<R>;
