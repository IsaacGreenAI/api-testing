import { sleep } from '../sleep';

describe('GIVEN the sleep function', () => {
  jest.useFakeTimers();

  describe('WHEN the sleep function is called', () => {
    it('THEN it resolves after the specified time', async () => {
      const sleepTime = 1000;
      const sleepPromise = sleep(sleepTime);
      jest.advanceTimersByTime(sleepTime);
      await expect(sleepPromise).resolves.toBeUndefined();
    });
  });
});
