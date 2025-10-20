import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { FetchHttpClient } from '../http-client/FetchHttpClient.js';
import { TResponse } from '../http-client/TResponse.js';

describe('FetchHttpClient', () => {
  let client: FetchHttpClient;
  const baseUrl = 'http://api.example.com';

  beforeEach(() => {
    client = new FetchHttpClient();
    global.fetch = vi.fn();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('GET request', () => {
    it('should return TResponse with JSON data on successful request', async () => {
      const mockData = { id: 1, name: 'Test' };
      const mockResponse = new Response(JSON.stringify(mockData), {
        status: 200,
        statusText: 'OK',
        headers: { 'content-type': 'application/json' }
      });

      vi.mocked(global.fetch).mockResolvedValue(mockResponse);

      const response = await client.get<typeof mockData>(`${baseUrl}/test`);

      expect(response).toBeInstanceOf(TResponse);
      expect(response.data).toEqual(mockData);
      expect(response.status).toBe(200);
      expect(response.statusText).toBe('OK');
      expect(response.isSuccess).toBe(true);
    });

    it('should handle query parameters', async () => {
      const mockResponse = new Response(JSON.stringify({}), {
        status: 200,
        headers: { 'content-type': 'application/json' }
      });

      vi.mocked(global.fetch).mockResolvedValue(mockResponse);

      await client.get(`${baseUrl}/test`, undefined, { page: 1, limit: 10 });

      expect(global.fetch).toHaveBeenCalledWith(
        `${baseUrl}/test?page=1&limit=10`,
        expect.objectContaining({
          method: 'GET'
        })
      );
    });

    it('should include custom headers', async () => {
      const mockResponse = new Response(JSON.stringify({}), {
        status: 200,
        headers: { 'content-type': 'application/json' }
      });

      vi.mocked(global.fetch).mockResolvedValue(mockResponse);

      await client.get(
        `${baseUrl}/test`,
        { Authorization: 'Bearer token' }
      );

      expect(global.fetch).toHaveBeenCalledWith(
        `${baseUrl}/test`,
        expect.objectContaining({
          headers: expect.objectContaining({
            'Authorization': 'Bearer token'
          })
        })
      );
    });
  });

  describe('POST request', () => {
    it('should send JSON data in request body', async () => {
      const mockResponse = new Response(JSON.stringify({ id: 1 }), {
        status: 201,
        statusText: 'Created',
        headers: { 'content-type': 'application/json' }
      });

      vi.mocked(global.fetch).mockResolvedValue(mockResponse);

      const requestData = { name: 'New Item' };
      const response = await client.post(`${baseUrl}/items`, requestData);

      expect(response.status).toBe(201);
      expect(global.fetch).toHaveBeenCalledWith(
        `${baseUrl}/items`,
        expect.objectContaining({
          method: 'POST',
          body: JSON.stringify(requestData)
        })
      );
    });
  });

  describe('PUT request', () => {
    it('should update resource', async () => {
      const mockResponse = new Response(JSON.stringify({ updated: true }), {
        status: 200,
        headers: { 'content-type': 'application/json' }
      });

      vi.mocked(global.fetch).mockResolvedValue(mockResponse);

      const response = await client.put(`${baseUrl}/items/1`, { name: 'Updated' });

      expect(response.status).toBe(200);
      expect(response.isSuccess).toBe(true);
    });
  });

  describe('DELETE request', () => {
    it('should delete resource', async () => {
      const mockResponse = new Response(null, {
        status: 204,
        statusText: 'No Content'
      });

      vi.mocked(global.fetch).mockResolvedValue(mockResponse);

      const response = await client.delete(`${baseUrl}/items/1`);

      expect(response.status).toBe(204);
      expect(global.fetch).toHaveBeenCalledWith(
        `${baseUrl}/items/1`,
        expect.objectContaining({
          method: 'DELETE'
        })
      );
    });
  });

  describe('Error handling', () => {
    it('should handle 404 errors', async () => {
      const mockResponse = new Response(JSON.stringify({ error: 'Not Found' }), {
        status: 404,
        statusText: 'Not Found',
        headers: { 'content-type': 'application/json' }
      });

      vi.mocked(global.fetch).mockResolvedValue(mockResponse);

      const response = await client.get(`${baseUrl}/missing`);

      expect(response.status).toBe(404);
      expect(response.isClientError).toBe(true);
    });

    it('should handle server errors', async () => {
      const mockResponse = new Response(JSON.stringify({ error: 'Server Error' }), {
        status: 500,
        statusText: 'Internal Server Error',
        headers: { 'content-type': 'application/json' }
      });

      vi.mocked(global.fetch).mockResolvedValue(mockResponse);

      const response = await client.get(`${baseUrl}/error`);

      expect(response.status).toBe(500);
      expect(response.isServerError).toBe(true);
    });

    it('should throw on network errors', async () => {
      vi.mocked(global.fetch).mockRejectedValue(new Error('Network Error'));

      await expect(client.get(`${baseUrl}/test`)).rejects.toThrow('Fetch request failed: Network Error');
    });
  });

  describe('Non-JSON responses', () => {
    it('should handle plain text responses', async () => {
      const mockResponse = new Response('Plain text response', {
        status: 200,
        headers: { 'content-type': 'text/plain' }
      });

      vi.mocked(global.fetch).mockResolvedValue(mockResponse);

      const response = await client.get(`${baseUrl}/text`);

      expect(response.data).toBe('Plain text response');
    });
  });
});
