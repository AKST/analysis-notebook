import { expect, describe, it } from 'vitest';
import { KnobConfigVariant } from '../../type.ts';
import { evaluateKnob } from '../types.js';

describe('evaluateKnob', () => {
  type TestCase = { knob: KnobConfigVariant, result: any }
  type Suite = { label: string, cases: any[] }

  const variants = [
    {
      label: 'number', cases: [{
        result: 42,
        knob: { kind: 'number', of: 42, range: [0, 100] },
      }],
    },
    {
      label: 'complex',
      cases: [{
        result: [2, 4],
        knob: { kind: 'complex', of: [2, 4] },
      }]
    },
    {
      label: 'sequence',
      cases: [{
        result: [1, 2, 3, 4],
        knob: { kind: 'sequence', of: [1, 2, 3, 4] },
      }]
    },
    {
      label: 'color',
      cases: [{
        result: 0xff00ff,
        knob: { kind: 'color', of: 0xff00ff },
      }]
    },
    {
      label: 'group',
      cases: [{
        result: { a: 1, b: [2, 3], c: 0x00ff00, d: [1,2,3,4] },
        knob: {
          kind: 'group',
          of: { a: 1, b: [2, 3], c: 0x00ff00, d: [1,2,3,4] },
          group: {
            a: { kind: 'number' },
            b: { kind: 'complex' },
            c: { kind: 'color' },
            d: { kind: 'sequence' },
          },
        },
      }, {
        result: { a: 1, b: [2, 3], c: 0x00ff00, d: [1,2,3,4] },
        knob: {
          kind: 'group',
          group: {
            a: { kind: 'number', of: 1 },
            b: { kind: 'complex', of: [2, 3] },
            c: { kind: 'color', of: 0x00ff00 },
            d: { kind: 'sequence', of: [1,2,3,4] },
          },
        },
      }]
    },
    {
      label: 'many',
      cases: [{
        result: { alice: 1, bob: 2 },
        knob: {
          kind: 'many',
          of: { alice: 1, bob: 2 },
          create: (id: string) => ({ kind: 'number', of: 0, range: [0, 10] }),
        },
      }]
    },
  ] satisfies Suite[];


  describe.each(variants)('[kind=$label]', ({ cases }: Suite) => {
    it.each(cases)('knob evaluates to a $result', ({ knob, result }) => {
      expect(evaluateKnob(knob)).toEqual(result);
    });
  });
});
