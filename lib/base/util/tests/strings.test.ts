import { expect, describe, it } from 'vitest';
import { camelToKebab, template } from '../strings.js';

describe('String utilities', () => {
  describe('camelToKebab', () => {
    it('converts simple camelCase', () => {
      expect(camelToKebab('gridTemplateColumns')).toBe('grid-template-columns');
    });

    it('handles single word', () => {
      expect(camelToKebab('padding')).toBe('padding');
    });

    it('handles multiple capitals', () => {
      expect(camelToKebab('borderTopLeftRadius')).toBe('border-top-left-radius');
    });

    it('handles empty string', () => {
      expect(camelToKebab('')).toBe('');
    });

    it('handles already kebab-case', () => {
      expect(camelToKebab('grid-template-columns')).toBe('grid-template-columns');
    });
  });

  describe('template', () => {
    describe('basic replacement', () => {
      it.each([
        ['Hello {name}', { name: 'World' }, 'Hello World'],
        ['{greeting} {name}!', { greeting: 'Hello', name: 'World' }, 'Hello World!'],
        ['{x} + {x} = {y}', { x: 5, y: 10 }, '5 + 5 = 10'],
        ['No placeholders', {}, 'No placeholders'],
        ['', {}, ''],
        ['{str} {num} {bool}', { str: 'text', num: 42, bool: true }, 'text 42 true'],
      ])('replaces "%s" with params correctly', (template_str, params, expected) => {
        const result = template(template_str, params, { onUnknown: { kind: 'throw' } });
        expect(result).toBe(expected);
      });
    });

    describe('onUnknown: throw', () => {
      it('works when all placeholders are provided', () => {
        const result = template('Hello {name}', { name: 'World' }, { onUnknown: { kind: 'throw' } });
        expect(result).toBe('Hello World');
      });

      it('throws when placeholder is missing', () => {
        expect(() => {
          template('Hello {name}', {}, { onUnknown: { kind: 'throw' } });
        }).toThrow('missing value for name');
      });
    });

    describe('onUnknown: use', () => {
      it.each([
        ['Unknown', 'Hello Unknown'],
        ['?', 'Hello ?'],
        ['', 'Hello '],
        [null, 'Hello null'],
      ])('uses default value %s for missing placeholder', (default_value, expected) => {
        const result = template('Hello {name}', {}, { onUnknown: { kind: 'use', value: default_value } });
        expect(result).toBe(expected);
      });
    });

    describe('onUnknown: lookup', () => {
      it('calls lookup function for missing placeholders', () => {
        const result = template('Hello {name}', {}, {
          onUnknown: { kind: 'lookup', lookup: (k) => k.toUpperCase() }
        });
        expect(result).toBe('Hello NAME');
      });

      it('calls lookup with correct keys', () => {
        const lookup = (key: string) => {
          if (key === 'x') return 10;
          if (key === 'y') return 20;
          return 0;
        };
        const result = template('{x} + {y} = {z}', {}, { onUnknown: { kind: 'lookup', lookup } });
        expect(result).toBe('10 + 20 = 0');
      });

      it('prefers params over lookup', () => {
        const result = template('Hello {name}', { name: 'World' }, {
          onUnknown: { kind: 'lookup', lookup: () => 'FromLookup' }
        });
        expect(result).toBe('Hello World');
      });
    });

    describe('edge cases', () => {
      it.each([
        ['{name} says hello', { name: 'Alice' }, 'Alice says hello', 'placeholder at start'],
        ['Hello {name}', { name: 'Bob' }, 'Hello Bob', 'placeholder at end'],
        ['{a}{b}{c}', { a: 1, b: 2, c: 3 }, '123', 'consecutive placeholders'],
      ])('handles %s', (template_str, params, expected, _description) => {
        const result = template(template_str, params, { onUnknown: { kind: 'throw' } });
        expect(result).toBe(expected);
      });
    });
  });
});
