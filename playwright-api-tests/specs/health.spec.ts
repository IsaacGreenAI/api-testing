import { test, expect } from '../fixtures/httpClient.fixture.ts';
import { TResponse } from '@commons/http-client/TResponse.ts';

const BASE_URL = process.env.UNIVERSE_API_URL || 'http://localhost:8080';

test.describe('Health Check Endpoint', () => {
  test.describe('GET /health', () => {
    test('should return healthy status', async ({ httpClient }) => {
      const response: TResponse<string> = await httpClient.get<string>(`${BASE_URL}/health`);

      expect(response.isSuccess).toBe(true);
      expect(response.status).toBe(200);
      expect(response.data).toBe('Healthy');
    });

    test('should respond quickly (performance check)', async ({ httpClient }) => {
      const startTime = Date.now();
      const response: TResponse<object> = await httpClient.get(`${BASE_URL}/health`);
      const endTime = Date.now();
      const responseTime = endTime - startTime;

      expect(response.isSuccess).toBe(true);
      expect(responseTime).toBeLessThan(1000); // Should respond in under 1 second
    });

    test('should have correct content-type header', async ({ httpClient }) => {
      const response: TResponse<object> = await httpClient.get(`${BASE_URL}/health`);

      expect(response.isSuccess).toBe(true);
      expect(response.headers).toBeDefined();
      expect(response.headers!['content-type']).toContain('text/plain');
    });
  });
});
