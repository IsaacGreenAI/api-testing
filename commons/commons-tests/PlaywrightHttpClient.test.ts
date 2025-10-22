import { describe, it, expect, vi, beforeEach } from 'vitest';
import type { APIRequestContext, APIResponse } from '@playwright/test';
import { PlaywrightHttpClient, TResponse } from '../index.js';

describe('PlaywrightHttpClient', () => {
  let client: PlaywrightHttpClient;
  let mockRequest: APIRequestContext;
  const baseUrl = 'http://api.example.com';

  beforeEach(() => {
    // Create mock APIRequestContext
    mockRequest = {
      get: vi.fn(),
      post: vi.fn(),
      put: vi.fn(),
      patch: vi.fn(),
      delete: vi.fn(),
      head: vi.fn(),
      fetch: vi.fn(),
    } as unknown as APIRequestContext;

    client = new PlaywrightHttpClient(mockRequest);
  });

  // Helper function to create mock APIResponse
  const createMockResponse = (data: any, status: number, statusText: string, headers: Record<string, string> = {}): APIResponse => {
    return {
      status: () => status,
      statusText: () => statusText,
      headers: () => headers,
      json: vi.fn().mockResolvedValue(data),
      text: vi.fn().mockResolvedValue(JSON.stringify(data)),
      ok: () => status >= 200 && status < 300,
    } as unknown as APIResponse;
  };

  describe('GET request', () => {
    it('should return TResponse with data on successful request', async () => {
      const mockData = { id: 1, name: 'Test' };
      const mockResponse = createMockResponse(
        mockData,
        200,
        'OK',
        { 'content-type': 'application/json' }
      );

      vi.mocked(mockRequest.get).mockResolvedValue(mockResponse);

      const response = await client.get(`${baseUrl}/test`);

      expect(response).toBeInstanceOf(TResponse);
      expect(response.data).toEqual(mockData);
      expect(response.status).toBe(200);
      expect(response.statusText).toBe('OK');
      expect(response.isSuccess).toBe(true);
    });

    it('should handle failed request with error response', async () => {
      const mockResponse = createMockResponse(
        { error: 'Not Found' },
        404,
        'Not Found'
      );

      vi.mocked(mockRequest.get).mockResolvedValue(mockResponse);

      const response = await client.get(`${baseUrl}/missing`);

      expect(response).toBeInstanceOf(TResponse);
      expect(response.status).toBe(404);
      expect(response.isClientError).toBe(true);
    });

    it('should pass headers and query params correctly', async () => {
      const mockResponse = createMockResponse({}, 200, 'OK');
      vi.mocked(mockRequest.get).mockResolvedValue(mockResponse);

      await client.get(
        `${baseUrl}/test`,
        { Authorization: 'Bearer token' },
        { page: 1, limit: 10 }
      );

      expect(vi.mocked(mockRequest.get)).toHaveBeenCalledWith(
        `${baseUrl}/test?page=1&limit=10`,
        { headers: { Authorization: 'Bearer token' } }
      );
    });
  });

  describe('POST request', () => {
    it('should send data in request body', async () => {
      const mockResponse = createMockResponse(
        { id: 1, created: true },
        201,
        'Created'
      );

      vi.mocked(mockRequest.post).mockResolvedValue(mockResponse);

      const requestData = { name: 'New Item' };
      const response = await client.post(`${baseUrl}/items`, requestData);

      expect(response.status).toBe(201);
      expect(vi.mocked(mockRequest.post)).toHaveBeenCalledWith(
        `${baseUrl}/items`,
        { headers: {}, data: requestData }
      );
    });

    it('should handle 400 validation error', async () => {
      const mockResponse = createMockResponse(
        { errors: ['Name is required'] },
        400,
        'Bad Request'
      );

      vi.mocked(mockRequest.post).mockResolvedValue(mockResponse);

      const response = await client.post(`${baseUrl}/items`, {});

      expect(response.status).toBe(400);
      expect(response.isClientError).toBe(true);
    });
  });

  describe('PUT request', () => {
    it('should update resource with PUT', async () => {
      const mockResponse = createMockResponse(
        { id: 1, name: 'Updated' },
        200,
        'OK'
      );

      vi.mocked(mockRequest.put).mockResolvedValue(mockResponse);

      const updateData = { name: 'Updated' };
      const response = await client.put(`${baseUrl}/items/1`, updateData);

      expect(response.status).toBe(200);
      expect(response.isSuccess).toBe(true);
      expect(vi.mocked(mockRequest.put)).toHaveBeenCalledWith(
        `${baseUrl}/items/1`,
        { headers: {}, data: updateData }
      );
    });
  });

  describe('PATCH request', () => {
    it('should partially update resource with PATCH', async () => {
      const mockResponse = createMockResponse(
        { id: 1, name: 'Patched' },
        200,
        'OK'
      );

      vi.mocked(mockRequest.patch).mockResolvedValue(mockResponse);

      const patchData = { name: 'Patched' };
      const response = await client.patch(`${baseUrl}/items/1`, patchData);

      expect(response.status).toBe(200);
      expect(vi.mocked(mockRequest.patch)).toHaveBeenCalledWith(
        `${baseUrl}/items/1`,
        { headers: {}, data: patchData }
      );
    });
  });

  describe('DELETE request', () => {
    it('should delete resource', async () => {
      const mockResponse = createMockResponse(
        undefined,
        204,
        'No Content'
      );

      vi.mocked(mockRequest.delete).mockResolvedValue(mockResponse);

      const response = await client.delete(`${baseUrl}/items/1`);

      expect(response.status).toBe(204);
      expect(vi.mocked(mockRequest.delete)).toHaveBeenCalledWith(
        `${baseUrl}/items/1`,
        { headers: {} }
      );
    });

    it('should handle 404 on delete', async () => {
      const mockResponse = createMockResponse(
        { error: 'Not Found' },
        404,
        'Not Found'
      );

      vi.mocked(mockRequest.delete).mockResolvedValue(mockResponse);

      const response = await client.delete(`${baseUrl}/items/999`);

      expect(response.status).toBe(404);
      expect(response.isClientError).toBe(true);
    });
  });

  describe('OPTIONS request', () => {
    it('should make OPTIONS request', async () => {
      const mockResponse = createMockResponse(
        undefined,
        200,
        'OK',
        { 'allow': 'GET, POST, PUT, DELETE' }
      );

      vi.mocked(mockRequest.fetch).mockResolvedValue(mockResponse);

      const response = await client.options(`${baseUrl}/items`);

      expect(response.status).toBe(200);
      expect(vi.mocked(mockRequest.fetch)).toHaveBeenCalledWith(
        `${baseUrl}/items`,
        { headers: {}, method: 'OPTIONS' }
      );
    });
  });

  describe('HEAD request', () => {
    it('should make HEAD request', async () => {
      const mockResponse = createMockResponse(
        undefined,
        200,
        'OK',
        { 'content-length': '1234' }
      );

      vi.mocked(mockRequest.head).mockResolvedValue(mockResponse);

      const response = await client.head(`${baseUrl}/items/1`);

      expect(response.status).toBe(200);
      expect(response.headers).toHaveProperty('content-length', '1234');
      expect(vi.mocked(mockRequest.head)).toHaveBeenCalledWith(
        `${baseUrl}/items/1`,
        { headers: {} }
      );
    });
  });

  describe('Error handling', () => {
    it('should throw error on network failure', async () => {
      vi.mocked(mockRequest.get).mockRejectedValue(new Error('Network error'));

      await expect(client.get(`${baseUrl}/test`)).rejects.toThrow('Playwright request failed: Network error');
    });

    it('should handle server error (500)', async () => {
      const mockResponse = createMockResponse(
        { error: 'Internal Server Error' },
        500,
        'Internal Server Error'
      );

      vi.mocked(mockRequest.get).mockResolvedValue(mockResponse);

      const response = await client.get(`${baseUrl}/error`);

      expect(response.status).toBe(500);
      expect(response.isServerError).toBe(true);
    });
  });

  describe('Response content type handling', () => {
    it('should parse JSON response', async () => {
      const mockData = { message: 'success' };
      const mockResponse = createMockResponse(
        mockData,
        200,
        'OK',
        { 'content-type': 'application/json' }
      );

      vi.mocked(mockRequest.get).mockResolvedValue(mockResponse);

      const response = await client.get(`${baseUrl}/json`);

      expect(response.data).toEqual(mockData);
    });

    it('should handle text response', async () => {
      const mockText = 'Plain text response';
      const mockResponse = {
        status: () => 200,
        statusText: () => 'OK',
        headers: () => ({ 'content-type': 'text/plain' }),
        json: vi.fn().mockRejectedValue(new Error('Not JSON')),
        text: vi.fn().mockResolvedValue(mockText),
        ok: () => true,
      } as unknown as APIResponse;

      vi.mocked(mockRequest.get).mockResolvedValue(mockResponse);

      const response = await client.get(`${baseUrl}/text`);

      expect(response.data).toBe(mockText);
    });

    it('should handle empty response for HEAD request', async () => {
      const mockResponse = createMockResponse(
        undefined,
        200,
        'OK'
      );

      // Override to not have content-type
      mockResponse.headers = () => ({});

      vi.mocked(mockRequest.head).mockResolvedValue(mockResponse);

      const response = await client.head(`${baseUrl}/items`);

      expect(response.status).toBe(200);
      expect(response.data).toBeUndefined();
    });
  });
});
