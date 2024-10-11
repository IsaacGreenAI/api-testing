/**
 * @param milliseconds milliseconds to sleep
 * @returns returns promise after waiting the milliseconds value
 */
export function sleep(milliseconds: number): Promise<any> {
  return new Promise((resolve) => setTimeout(resolve, milliseconds));
}
