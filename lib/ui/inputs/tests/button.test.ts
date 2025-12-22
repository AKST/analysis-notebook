import { expect, describe, it, beforeEach, vi } from 'vitest';
import userEvent from '@testing-library/user-event';
import { BasicButton } from '../button.js';

describe('BasicButton', () => {
  let user: ReturnType<typeof userEvent.setup>;

  beforeEach(() => {
    document.body.innerHTML = '';
    user = userEvent.setup();
  });

  it('renders default button correctly', () => {
    const button = new BasicButton('Click me');
    document.body.appendChild(button);
    expect(button.shadowRoot?.innerHTML).toMatchSnapshot();
  });

  it('renders destructive button correctly', () => {
    const button = new BasicButton('Delete', { action: 'destructive' });
    document.body.appendChild(button);
    expect(button.shadowRoot?.innerHTML).toMatchSnapshot();
  });

  it('responds to user clicks', async () => {
    const clickHandler = vi.fn();
    const button = new BasicButton('Click me');
    button.addEventListener('click', clickHandler);
    document.body.appendChild(button);
    await user.click(button);
    expect(clickHandler).toHaveBeenCalledOnce();
  });
});
