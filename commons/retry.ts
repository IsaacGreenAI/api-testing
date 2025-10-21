import { sleep } from './sleep.js';

/**
 * Congfigurable retry for function calls, designed with api calls in mind
 * - e.g retrying a service during a processing event
 * @param fn function that will be retried
 * @param maximumRetries number or retry attempts
 * @param initialWait initial wait before retries begin
 * @param maximumWait maximum wait between retries - this limits the exponential backoff
 * @returns function response on retry
 */
export async function retry(
  fn: () => Promise<any>, maximumRetries: number = 3, initialWait: number = 100, maximumWait: number = 5000): Promise<any> {

  for (let retryNumber = 0; retryNumber <= maximumRetries; retryNumber++) {
    try {
      return await fn();
    } catch (error) {
      if (retryNumber === maximumRetries) throw new Error('Max retries reached');
      const waitTime = (initialWait + retryNumber ** 2 * 10);
      await sleep(waitTime < maximumWait ? waitTime : maximumWait);
    }
  }
}
