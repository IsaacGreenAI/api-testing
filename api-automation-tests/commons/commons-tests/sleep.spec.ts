import { sleep } from '../sleep';

describe('sleep', () => {
  jest.useFakeTimers();

  it('should resolve after the specified time', async () => {
    const sleepTime = 1000;
    const sleepPromise = sleep(sleepTime);
    jest.advanceTimersByTime(sleepTime);
    await expect(sleepPromise).resolves.toBeUndefined();
  });
});
