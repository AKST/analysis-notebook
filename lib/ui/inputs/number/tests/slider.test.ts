import { expect, describe, it, beforeEach, vi } from 'vitest';
import userEvent from '@testing-library/user-event';
import { getByRole, getByDisplayValue } from '@testing-library/dom';
import { NumberSliderInput } from '../slider.js';

describe('NumberSliderInput', () => {
  let user: ReturnType<typeof userEvent.setup>;

  beforeEach(() => {
    document.body.innerHTML = '';
    user = userEvent.setup();
  });

  const create = (value = 0.5, min = 0, max = 1,
                  step: string | number = 'any') => {
    const sliderInput = new NumberSliderInput(value, min, max, step);
    document.body.appendChild(sliderInput);
    return sliderInput;
  };

  it('responds to user dragging the slider', async () => {
    const sliderInput = create();
    const changeHandler = vi.fn();
    sliderInput.addEventListener('change', changeHandler);

    // @ts-ignore - tests
    const slider = getByRole(sliderInput.shadowRoot!, 'slider');

    // Simulate user dragging slider to new value
    // @ts-ignore - tests
    slider.value = '0.8';
    slider.dispatchEvent(new Event('input', { bubbles: true }));

    expect(changeHandler).toHaveBeenCalledOnce();
    expect(changeHandler.mock.calls[0][0].detail.value).toBe(0.8);
  });

  it('responds to user typing in number input', async () => {
    const sliderInput = create(0.5);
    const changeHandler = vi.fn();
    sliderInput.addEventListener('change', changeHandler);

    // @ts-ignore - tests
    const numberInput = getByDisplayValue(sliderInput.shadowRoot!, '0.5');

    // Simulate user editing the input directly
    // @ts-ignore - tests
    numberInput.value = '0.3';
    numberInput.dispatchEvent(new Event('input', { bubbles: true }));

    expect(changeHandler).toHaveBeenCalled();
    expect(changeHandler.mock.calls[0][0].detail.value).toBe(0.3);
  });
});
