import { expect, describe, it } from 'vitest';
import { camelToKebab } from '../strings.js';

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
});