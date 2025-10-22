import { test as base } from '@playwright/test';
import { PlaywrightHttpClient } from '@commons/http-client/PlaywrightHttpClient.ts';

/**
 * Custom fixture that provides PlaywrightHttpClient to all tests
 * @see https://playwright.dev/docs/test-fixtures
 */
interface HttpClientFixture {
  httpClient: PlaywrightHttpClient;
}

interface RequestParams {
  request: import('@playwright/test').APIRequestContext;
}

type UseHttpClient = (client: PlaywrightHttpClient) => Promise<void>;

export const test = base.extend<HttpClientFixture>({
  httpClient: async ({ request }: RequestParams, use: UseHttpClient) => {
    const client = new PlaywrightHttpClient(request);
    await use(client);
  },
});

export { expect } from '@playwright/test';
