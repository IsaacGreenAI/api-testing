import { describe, it, expect, beforeAll } from 'vitest';
import { AxiosHttpClient, TResponse } from '@commons';

const BASE_URL = process.env.UNIVERSE_API_URL || 'http://localhost:8080';

describe('Health Check Endpoint', () => {
  let httpClient: AxiosHttpClient;

  beforeAll(() => {
    httpClient = new AxiosHttpClient();
  });

  describe('GET /health', () => {
    it('should return healthy status', async () => {
      const response: TResponse<string> = await httpClient.get<string>(`${BASE_URL}/health`);

      expect(response.isSuccess).toBe(true);
      expect(response.status).toBe(200);
      expect(response.data).toBe('Healthy');
    });

    it('should respond quickly (performance check)', async () => {
      const startTime = Date.now();
      const response: TResponse<any> = await httpClient.get(`${BASE_URL}/health`);
      const endTime = Date.now();
      const responseTime = endTime - startTime;

      expect(response.isSuccess).toBe(true);
      expect(responseTime).toBeLessThan(1000); // Should respond in under 1 second
    });

    it('should have correct content-type header', async () => {
      const response: TResponse<any> = await httpClient.get(`${BASE_URL}/health`);

      expect(response.isSuccess).toBe(true);
      expect(response.headers).toBeDefined();
      expect(response.headers!['content-type']).toContain('text/plain');
    });
  });
});
