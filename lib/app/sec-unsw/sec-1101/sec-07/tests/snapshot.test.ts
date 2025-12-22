import { beforeEach, expect, describe, it } from 'vitest';
import { renderModule } from '@base/runtime/testing/test-multi.js';
import * as module from '../index.js';

describe('app(unsw::1101::07).snapshot', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
  });

  it('should match snapshots', async () => {
    const element = await renderModule(module, { width: 900 });
    document.body.appendChild(element);
    expect(element.innerHTML).toMatchSnapshot();
  });
});
