import { expect, describe, it, beforeEach, vi } from 'vitest';
import userEvent from '@testing-library/user-event';
import { getByDisplayValue } from '@testing-library/dom';
import { ColorInput } from '../color.js';

describe('ColorInput', () => {
  let user: ReturnType<typeof userEvent.setup>;

  beforeEach(() => {
    document.body.innerHTML = '';
    user = userEvent.setup();
  });

  const create = (color: number) => {
    const colorInput = new ColorInput(color);
    document.body.appendChild(colorInput);
    return colorInput;
  };

  it('renders color input correctly', () => {
    const colorInput = create(0xff0000);
    expect(colorInput.shadowRoot?.innerHTML).toMatchSnapshot();
  });

  it('responds to user color changes', async () => {
    const colorInput = create(0xff0000);
    const changeHandler = vi.fn();
    colorInput.addEventListener('change', changeHandler);

    const colorPicker = getByDisplayValue(colorInput.shadowRoot as any, '#ff0000');

    // Simulate user selecting a new color - for color inputs we need to manually set value and fire change
    // @ts-ignore - tests
    colorPicker.value = '#00ff00';
    colorPicker.dispatchEvent(new Event('change', { bubbles: true }));

    expect(changeHandler).toHaveBeenCalledOnce();
    expect(changeHandler.mock.calls[0][0].detail.value).toBe(0x00ff00);
  });

  it('updates when color is programmatically set', () => {
    const colorInput = create(0xff0000);
    colorInput.setValue(0x0000ff);

    expect(colorInput.getValue()).toBe(0x0000ff);

    const colorPicker = getByDisplayValue(colorInput.shadowRoot as any, '#0000ff');
    expect(colorPicker).toBeTruthy();
  });
});
