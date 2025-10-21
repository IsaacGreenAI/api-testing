import { describe, it, expect, vi } from 'vitest';
import { sleep } from '../index.js';

describe('GIVEN the sleep function', () => {
  vi.useFakeTimers();

  describe('WHEN the sleep function is called', () => {
    it('THEN it resolves after the specified time', async () => {
      const sleepTime = 1000;
      const sleepPromise = sleep(sleepTime);
      vi.advanceTimersByTime(sleepTime);
      await expect(sleepPromise).resolves.toBeUndefined();
    });
  });
});
