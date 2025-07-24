import { expect, describe, it, beforeEach, vi } from 'vitest';
import userEvent from '@testing-library/user-event';
import { getByRole, getByDisplayValue, getByPlaceholderText } from '@testing-library/dom';
import { TextInput } from '../text.js';

describe('TextInput', () => {
  let user: ReturnType<typeof userEvent.setup>;

  beforeEach(() => {
    document.body.innerHTML = '';
    user = userEvent.setup();
  });

  const create = (value?: string, placeholder?: string, disabled?: boolean) => {
    const textInput = new TextInput(value, placeholder, disabled);
    document.body.appendChild(textInput);
    return textInput;
  };

  it('renders text input correctly', () => {
    const textInput = create('Hello world', 'Enter text...');
    expect(textInput.shadowRoot?.innerHTML).toMatchSnapshot();
  });

  it('responds to user typing', async () => {
    const textInput = create('', 'Type here...');
    const changeHandler = vi.fn();
    textInput.addEventListener('change', changeHandler);

    const input = getByPlaceholderText(textInput.shadowRoot as any, 'Type here...');
    await user.type(input, 'Hello world');

    expect(changeHandler).toHaveBeenCalled();
    expect(textInput.getValue()).toBe('Hello world');
  });

  it('responds to user pressing Enter', async () => {
    const textInput = create('Test value');
    const submitHandler = vi.fn();
    textInput.addEventListener('submit', submitHandler);

    const input = getByDisplayValue(textInput.shadowRoot as any, 'Test value');
    await user.type(input, '{Enter}');

    expect(submitHandler).toHaveBeenCalledOnce();
    expect(submitHandler.mock.calls[0][0].detail.value).toBe('Test value');
  });
});
