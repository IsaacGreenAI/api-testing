import { retry } from '../retry';
import * as sleepModule from '../sleep'; // Import the module to be able to mock it

jest.mock('../sleep', () => ({
  sleep: jest.fn().mockResolvedValue(undefined)
}));

describe('retry function', () => {
  let expectedResults: object;

  beforeEach(() => {
    jest.resetAllMocks();
    expectedResults = { status: 200, statusText: 'ok' };
  });

  it('should resolve if the function succeeds', async () => {
    const mockFunction = jest.fn().mockResolvedValueOnce(expectedResults);

    const response = await retry(mockFunction, 3, 100, 5000);

    expect(response).toBe(expectedResults);
    expect(mockFunction).toHaveBeenCalledTimes(1);
    expect(sleepModule.sleep).not.toHaveBeenCalled();
  });

  it('should should retry on failure', async () => {
    const mockFunction = jest.fn()
      .mockRejectedValueOnce(new Error('error'))
      .mockRejectedValueOnce(new Error('error'))
      .mockResolvedValue(expectedResults);

    const response = await retry(mockFunction, 3, 100, 5000);

    expect(response).toBe(expectedResults);
    expect(mockFunction).toHaveBeenCalledTimes(3);
    expect(sleepModule.sleep).toHaveBeenCalledTimes(2);
  });

  it('should throw an error after maximum retries', async () => {
    const mockFunction = jest.fn()
      .mockRejectedValueOnce(new Error('error'))
      .mockRejectedValueOnce(new Error('error'))
      .mockRejectedValueOnce(new Error('error'));

    await expect(retry(mockFunction, 2, 100, 5000)).rejects.toThrow('Max retries reached');
    expect(mockFunction).toHaveBeenCalledTimes(3);
    expect(sleepModule.sleep).toHaveBeenCalledTimes(2);
  });
});
