import { describe, it, expect, vi, beforeEach } from 'vitest';
import axios from 'axios';

// IMPORTANT: Mock axios BEFORE importing AxiosHttpClient
vi.mock('axios');

import { AxiosHttpClient, TResponse } from '../index.js';

describe('AxiosHttpClient', () => {
  let client: AxiosHttpClient;
  const baseUrl = 'http://api.example.com';

  beforeEach(() => {
    client = new AxiosHttpClient();
    vi.clearAllMocks();
  });

  describe('GET request', () => {
    it('should return TResponse with data on successful request', async () => {
      const mockResponse = {
        data: { id: 1, name: 'Test' },
        status: 200,
        statusText: 'OK',
        headers: { 'content-type': 'application/json' },
        config: {}
      };

      vi.mocked(axios.request).mockResolvedValue(mockResponse);

      const response = await client.get(`${baseUrl}/test`);

      expect(response).toBeInstanceOf(TResponse);
      expect(response.data).toEqual({ id: 1, name: 'Test' });
      expect(response.status).toBe(200);
      expect(response.statusText).toBe('OK');
      expect(response.isSuccess).toBe(true);
    });

    it('should handle failed request with error response', async () => {
      const errorResponse = {
        data: { error: 'Not Found' },
        status: 404,
        statusText: 'Not Found',
        headers: {},
        config: {}
      };

      vi.mocked(axios.request).mockRejectedValue({ response: errorResponse });

      const response = await client.get(`${baseUrl}/missing`);

      expect(response).toBeInstanceOf(TResponse);
      expect(response.status).toBe(404);
      expect(response.isClientError).toBe(true);
    });

    it('should pass headers and query params correctly', async () => {
      const mockResponse = {
        data: {},
        status: 200,
        statusText: 'OK',
        headers: {},
        config: {}
      };

      vi.mocked(axios.request).mockResolvedValue(mockResponse);

      await client.get(
        `${baseUrl}/test`,
        { Authorization: 'Bearer token' },
        { page: 1, limit: 10 }
      );

      expect(vi.mocked(axios.request)).toHaveBeenCalledWith({
        method: 'GET',
        url: `${baseUrl}/test`,
        data: undefined,
        headers: { Authorization: 'Bearer token' },
        params: { page: 1, limit: 10 }
      });
    });
  });

  describe('POST request', () => {
    it('should send data in request body', async () => {
      const mockResponse = {
        data: { id: 1, created: true },
        status: 201,
        statusText: 'Created',
        headers: {},
        config: {}
      };

      vi.mocked(axios.request).mockResolvedValue(mockResponse);

      const requestData = { name: 'New Item' };
      const response = await client.post(`${baseUrl}/items`, requestData);

      expect(response.status).toBe(201);
      expect(vi.mocked(axios.request)).toHaveBeenCalledWith({
        method: 'POST',
        url: `${baseUrl}/items`,
        data: requestData,
        headers: undefined,
        params: undefined
      });
    });
  });

  describe('PUT request', () => {
    it('should update resource', async () => {
      const mockResponse = {
        data: { id: 1, updated: true },
        status: 200,
        statusText: 'OK',
        headers: {},
        config: {}
      };

      vi.mocked(axios.request).mockResolvedValue(mockResponse);

      const response = await client.put(`${baseUrl}/items/1`, { name: 'Updated' });

      expect(response.status).toBe(200);
      expect(response.isSuccess).toBe(true);
    });
  });

  describe('DELETE request', () => {
    it('should delete resource', async () => {
      const mockResponse = {
        data: {},
        status: 204,
        statusText: 'No Content',
        headers: {},
        config: {}
      };

      vi.mocked(axios.request).mockResolvedValue(mockResponse);

      const response = await client.delete(`${baseUrl}/items/1`);

      expect(response.status).toBe(204);
      expect(vi.mocked(axios.request)).toHaveBeenCalledWith({
        method: 'DELETE',
        url: `${baseUrl}/items/1`,
        data: undefined,
        headers: undefined,
        params: undefined
      });
    });
  });

  describe('Error handling', () => {
    it('should throw on network errors', async () => {
      vi.mocked(axios.request).mockRejectedValue(new Error('Network Error'));

      await expect(client.get(`${baseUrl}/test`)).rejects.toThrow('Network Error');
    });

    it('should handle server errors', async () => {
      const errorResponse = {
        data: { error: 'Internal Server Error' },
        status: 500,
        statusText: 'Internal Server Error',
        headers: {},
        config: {}
      };

      vi.mocked(axios.request).mockRejectedValue({ response: errorResponse });

      const response = await client.get(`${baseUrl}/error`);

      expect(response.status).toBe(500);
      expect(response.isServerError).toBe(true);
    });
  });
});
