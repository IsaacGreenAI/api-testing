import type { APIRequestContext, APIResponse } from '@playwright/test';
import { IHttpClient } from './IHttpClient.js';
import { TResponse } from './TResponse.js';

/**
 * Playwright APIRequestContext implementation of IHttpClient
 * Leverages Playwright's built-in API testing capabilities
 * Demonstrates Dependency Inversion - implements same interface as Axios and Fetch clients
 *
 * @see {@link https://playwright.dev/docs/api-testing|Playwright API Testing Guide}
 * @see {@link https://playwright.dev/docs/api/class-apirequestcontext|APIRequestContext Documentation}
 */
export class PlaywrightHttpClient implements IHttpClient {
  private request: APIRequestContext;

  /**
   * Creates a new PlaywrightHttpClient
   * @param request - Playwright's APIRequestContext instance
   */
  constructor(request: APIRequestContext) {
    this.request = request;
  }

  /**
   * Core request handler that all HTTP methods use
   * Converts Playwright APIResponse to generic TResponse format
   *
   * Note: Playwright does not throw on HTTP errors - all responses are returned successfully
   */
  private async executeRequest<T>(
    method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE' | 'OPTIONS' | 'HEAD',
    url: string,
    data?: any,
    headers?: Record<string, any>,
    params?: Record<string, any>
  ): Promise<TResponse<T>> {
    try {
      // Build URL with query parameters
      const urlWithParams = this.buildUrlWithParams(url, params);

      // Build request options
      const options: any = {
        headers: headers || {}
      };

      // Add data for methods that support it
      if (data && ['POST', 'PUT', 'PATCH'].includes(method)) {
        options.data = data;
      }

      // Execute Playwright request based on method
      let response: APIResponse;
      switch (method) {
        case 'GET':
          response = await this.request.get(urlWithParams, options);
          break;
        case 'POST':
          response = await this.request.post(urlWithParams, options);
          break;
        case 'PUT':
          response = await this.request.put(urlWithParams, options);
          break;
        case 'PATCH':
          response = await this.request.patch(urlWithParams, options);
          break;
        case 'DELETE':
          response = await this.request.delete(urlWithParams, options);
          break;
        case 'OPTIONS':
          response = await this.request.fetch(urlWithParams, { ...options, method: 'OPTIONS' });
          break;
        case 'HEAD':
          response = await this.request.head(urlWithParams, options);
          break;
      }

      // Parse response data
      let responseData: T | undefined;
      const contentType = response.headers()['content-type'];

      // HEAD and OPTIONS requests typically don't have response bodies
      if (method === 'HEAD' || (method === 'OPTIONS' && !contentType)) {
        responseData = undefined;
      } else if (contentType?.includes('application/json')) {
        try {
          responseData = await response.json();
        } catch {
          responseData = undefined;
        }
      } else {
        try {
          responseData = (await response.text()) as any;
        } catch {
          responseData = undefined;
        }
      }

      // Convert Playwright APIResponse to TResponse format
      return new TResponse<T>({
        data: responseData,
        status: response.status(),
        statusText: response.statusText(),
        headers: response.headers(),
        config: { method, url: urlWithParams, headers, params }
      });
    } catch (error: any) {
      // Network errors or other request failures
      throw new Error(`Playwright request failed: ${error.message}`);
    }
  }

  /**
   * Build URL with query parameters
   */
  private buildUrlWithParams(url: string, params?: Record<string, any>): string {
    if (!params || Object.keys(params).length === 0) {
      return url;
    }

    const urlObj = new URL(url);
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        urlObj.searchParams.append(key, String(value));
      }
    });

    return urlObj.toString();
  }

  async get<T>(url: string, headers?: Record<string, any>, params?: Record<string, any>): Promise<TResponse<T>> {
    return this.executeRequest<T>('GET', url, undefined, headers, params);
  }

  async post<T>(url: string, data?: any, headers?: Record<string, any>, params?: Record<string, any>): Promise<TResponse<T>> {
    return this.executeRequest<T>('POST', url, data, headers, params);
  }

  async put<T>(url: string, data?: any, headers?: Record<string, any>, params?: Record<string, any>): Promise<TResponse<T>> {
    return this.executeRequest<T>('PUT', url, data, headers, params);
  }

  async patch<T>(url: string, data?: any, headers?: Record<string, any>, params?: Record<string, any>): Promise<TResponse<T>> {
    return this.executeRequest<T>('PATCH', url, data, headers, params);
  }

  async delete<T>(url: string, headers?: Record<string, any>, params?: Record<string, any>): Promise<TResponse<T>> {
    return this.executeRequest<T>('DELETE', url, undefined, headers, params);
  }

  async options<T>(url: string, headers?: Record<string, any>, params?: Record<string, any>): Promise<TResponse<T>> {
    return this.executeRequest<T>('OPTIONS', url, undefined, headers, params);
  }

  async head<T>(url: string, headers?: Record<string, any>, params?: Record<string, any>): Promise<TResponse<T>> {
    return this.executeRequest<T>('HEAD', url, undefined, headers, params);
  }
}
