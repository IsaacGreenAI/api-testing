import { describe, it, expect, beforeEach, vi } from 'vitest';
import { retry } from '../index.js';
import * as sleepModule from '../sleep.js';

describe('GIVEN the retry function', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  describe('WHEN the callback function succeeds', () => {
    it('THEN it resolves if the function succeeds', async () => {
      const mockFunction = vi.fn().mockResolvedValue('success');
      const result = await retry(mockFunction, 3, 100);
      expect(result).toBe('success');
      expect(mockFunction).toHaveBeenCalledTimes(1);
    });
  });

  describe('WHEN the callback function fails', () => {
    it('THEN it retries on failure', async () => {
      const mockFunction = vi.fn()
        .mockRejectedValueOnce(new Error('fail'))
        .mockResolvedValueOnce('success');
      vi.spyOn(sleepModule, 'sleep').mockResolvedValue(undefined);

      const result = await retry(mockFunction, 3, 100);

      expect(result).toBe('success');
      expect(mockFunction).toHaveBeenCalledTimes(2);
      expect(sleepModule.sleep).toHaveBeenCalledTimes(1);
    });

    it('THEN it throws an error after maximum retries', async () => {
      const mockFunction = vi.fn().mockRejectedValue(new Error('fail'));
      vi.spyOn(sleepModule, 'sleep').mockResolvedValue(undefined);

      await expect(retry(mockFunction, 2, 100)).rejects.toThrow('Max retries reached');
      expect(mockFunction).toHaveBeenCalledTimes(3);
      expect(sleepModule.sleep).toHaveBeenCalledTimes(2);
    });
  });
});
