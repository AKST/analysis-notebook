import { expect, describe, it, beforeEach, vi } from 'vitest';
import userEvent from '@testing-library/user-event';
import { ToggleInput } from '../checkbox.js';

describe('ToggleInput', () => {
  let user: ReturnType<typeof userEvent.setup>;

  beforeEach(() => {
    document.body.innerHTML = '';
    user = userEvent.setup();
  });

  const create = (initiallyChecked: boolean = false) => {
    const toggle = new ToggleInput(initiallyChecked);
    document.body.appendChild(toggle);
    return toggle;
  };

  describe('API functionality', () => {
    it('returns initial value from getValue', () => {
      const toggleUnchecked = create(false);
      const toggleChecked = create(true);

      expect(toggleUnchecked.getValue()).toBe(false);
      expect(toggleChecked.getValue()).toBe(true);
    });

    it('returns checked state from getter', () => {
      const toggle = create(false);
      expect(toggle.checked).toBe(false);

      const toggleChecked = create(true);
      expect(toggleChecked.checked).toBe(true);
    });

    it('setValue updates the toggle state', () => {
      const toggle = create(false);

      toggle.setValue(true);
      expect(toggle.getValue()).toBe(true);
      expect(toggle.checked).toBe(true);

      toggle.setValue(false);
      expect(toggle.getValue()).toBe(false);
      expect(toggle.checked).toBe(false);
    });

    it('setValue works before DOM connection', () => {
      const toggle = new ToggleInput(false);
      toggle.setValue(true);
      expect(toggle.getValue()).toBe(true);

      document.body.appendChild(toggle);
      expect(toggle.checked).toBe(true);
    });
  });

  describe('event emission', () => {
    it('dispatches change event with correct detail when clicked', () => {
      const toggle = create(false);
      const changeHandler = vi.fn();
      toggle.addEventListener('change', changeHandler);

      const checkbox = toggle.shadowRoot?.querySelector('input.checkbox') as any;
      checkbox.checked = true;
      checkbox.dispatchEvent(new Event('change', { bubbles: true }));

      expect(changeHandler).toHaveBeenCalledOnce();
      expect(changeHandler).toHaveBeenCalledWith(
        expect.objectContaining({
          detail: { value: true },
          bubbles: true
        })
      );
    });

    it('dispatches change event when toggled from true to false', () => {
      const toggle = create(true);
      const changeHandler = vi.fn();
      toggle.addEventListener('change', changeHandler);

      const checkbox = toggle.shadowRoot?.querySelector('input.checkbox') as any;
      checkbox.checked = false;
      checkbox.dispatchEvent(new Event('change', { bubbles: true }));

      expect(changeHandler).toHaveBeenCalledWith(
        expect.objectContaining({
          detail: { value: false }
        })
      );
    });

    it('does not dispatch change event when setValue is called', () => {
      const toggle = create(false);
      const changeHandler = vi.fn();
      toggle.addEventListener('change', changeHandler);

      toggle.setValue(true);

      expect(changeHandler).not.toHaveBeenCalled();
    });
  });

  describe('state management', () => {
    it('preserves initial state through DOM operations', () => {
      const toggle = create(true);
      document.body.removeChild(toggle);
      document.body.appendChild(toggle);

      expect(toggle.getValue()).toBe(true);
      expect(toggle.checked).toBe(true);
    });

    it('maintains state consistency between API and user interaction', () => {
      const toggle = create(false);

      toggle.setValue(true);
      expect(toggle.getValue()).toBe(true);

      const checkbox = toggle.shadowRoot?.querySelector('input.checkbox') as any;
      checkbox.checked = false;
      checkbox.dispatchEvent(new Event('change', { bubbles: true }));
      expect(toggle.getValue()).toBe(false);

      toggle.setValue(true);
      expect(toggle.getValue()).toBe(true);
    });
  });
});
