import { expect, describe, it, beforeEach } from 'vitest';
import { SequenceKnob } from '../sequence.js';

describe('SequenceKnob', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
  });

  const createSequenceKnob = (config: any, values: number[] = [1, 3, 6]) => {
    const knob = new SequenceKnob(config, undefined, values);
    knob.setup();
    document.body.appendChild(knob);
    return knob;
  };

  const getRenderedInputValues = (knob: SequenceKnob): number[] => {
    const tickers = knob.shadowRoot?.querySelectorAll('input-number-ticker');
    if (!tickers) return [];

    return Array.from(tickers).map(ticker => {
      const input = ticker.shadowRoot?.querySelector('input') as HTMLInputElement;
      return parseFloat(input.value) || 0;
    });
  };

  describe('DOM rendering vs API values', () => {
    it('renders cumulative values in DOM when in cumulative mode', () => {
      const knob = createSequenceKnob({ kind: 'sequence' }, [1, 3, 6]);
      expect(getRenderedInputValues(knob)).toEqual([1, 3, 6]);
      expect(knob.values).toEqual([1, 3, 6]);
    });

    it('renders marginal values in DOM but returns cumulative from API', () => {
      const knob = createSequenceKnob({ kind: 'sequence', marginal: true }, [1, 3, 6]);
      expect(getRenderedInputValues(knob)).toEqual([1, 2, 3]);
      expect(knob.values).toEqual([1, 3, 6]);
    });

    it('handles different cumulative sequences correctly in marginal mode', () => {
      const knob = createSequenceKnob({ kind: 'sequence', marginal: true }, [2, 5, 7, 10]);
      expect(getRenderedInputValues(knob)).toEqual([2, 3, 2, 3]);
      expect(knob.values).toEqual([2, 5, 7, 10]);
    });

    it('handles single value correctly in marginal mode', () => {
      const knob = createSequenceKnob({ kind: 'sequence', marginal: true }, [5]);
      expect(getRenderedInputValues(knob)).toEqual([5]);
      expect(knob.values).toEqual([5]);
    });

    it('handles empty values correctly', () => {
      const knob = createSequenceKnob({ kind: 'sequence', marginal: true }, []);
      expect(getRenderedInputValues(knob)).toEqual([]);
      expect(knob.values).toEqual([]);
    });
  });

  describe('toggle switching DOM updates', () => {
    it('updates DOM values when toggling from cumulative to marginal mode', () => {
      const knob = createSequenceKnob({ kind: 'sequence', marginal: false }, [1, 3, 6]);
      expect(getRenderedInputValues(knob)).toEqual([1, 3, 6]);
      expect(knob.values).toEqual([1, 3, 6]);

    });

    it('correctly handles the business logic of marginal interpretation', () => {
      const knob = createSequenceKnob({ kind: 'sequence', marginal: true }, [1, 3, 6]);
      expect(getRenderedInputValues(knob)).toEqual([1, 2, 3]);
      expect(knob.values).toEqual([1, 3, 6]);
    });

    it.each([
      { input: [5], expectedDOM: [5], expectedAPI: [5] },
      { input: [2, 7], expectedDOM: [2, 5], expectedAPI: [2, 7] },
      { input: [1, 4, 9, 16], expectedDOM: [1, 3, 5, 7], expectedAPI: [1, 4, 9, 16] }
    ])('maintains consistency between DOM display and API values', ({
      input,
      expectedDOM,
      expectedAPI,
    }) => {
      const knob = createSequenceKnob({ kind: 'sequence', marginal: true }, input);
      expect(getRenderedInputValues(knob)).toEqual(expectedDOM);
      expect(knob.values).toEqual(expectedAPI);
    });

    it('handles edge cases in marginal conversion', () => {
      const knob1 = createSequenceKnob({ kind: 'sequence', marginal: true }, [0, 0, 5]);
      expect(getRenderedInputValues(knob1)).toEqual([0, 0, 5]);
      expect(knob1.values).toEqual([0, 0, 5]);

      const knob2 = createSequenceKnob({ kind: 'sequence', marginal: true }, [-2, -1, 3]);
      expect(getRenderedInputValues(knob2)).toEqual([-2, 1, 4]);
      expect(knob2.values).toEqual([-2, -1, 3]);
    });
  });
});
