import { expect, describe, it, beforeEach, vi } from 'vitest';
import userEvent from '@testing-library/user-event';
import { getByDisplayValue } from '@testing-library/dom';
import { NumberTickerInput } from '../ticker.js';

describe('NumberTickerInput', () => {
  let user: ReturnType<typeof userEvent.setup>;

  beforeEach(() => {
    document.body.innerHTML = '';
    user = userEvent.setup();
  });

  const create = (value = 0,
                  min: number | null = null,
                  max: number | null = null,
                  step: string | number = 'any') => {
    // @ts-ignore - tests
    const tickerInput = new NumberTickerInput(value, min, max, step);
    document.body.appendChild(tickerInput);
    return tickerInput;
  };

  it('renders number ticker input correctly', () => {
    const tickerInput = create(42, 0, 100, 1);
    expect(tickerInput.shadowRoot?.innerHTML).toMatchSnapshot();
  });

  it('responds to user typing in number input', async () => {
    const tickerInput = create(5);
    const changeHandler = vi.fn();
    tickerInput.addEventListener('change', changeHandler);

    // @ts-ignore - tests
    const numberInput = getByDisplayValue(tickerInput.shadowRoot!, '5');

    // Simulate user editing the input directly
    // @ts-ignore - tests
    numberInput.value = '42';
    numberInput.dispatchEvent(new Event('change', { bubbles: true }));

    expect(changeHandler).toHaveBeenCalled();
    expect(tickerInput.value).toBe(42);
  });

  it('updates input when value is programmatically set', () => {
    const tickerInput = create(10);

    tickerInput.setValue(25);

    // @ts-ignore - tests
    const numberInput = getByDisplayValue(tickerInput.shadowRoot!, '25');
    expect(numberInput).toBeTruthy();
    expect(tickerInput.value).toBe(25);
  });
});
