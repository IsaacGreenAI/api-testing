import { IHttpClient } from './IHttpClient.js';
import { TResponse } from './TResponse.js';

/**
 * Native Fetch API implementation of IHttpClient
 * Zero external dependencies - uses built-in fetch
 * Demonstrates Open/Closed Principle - new implementation without modifying existing code
 * Demonstrates Dependency Inversion - both Axios and Fetch implement same interface
 */
export class FetchHttpClient implements IHttpClient {
  /**
   * Core request handler using native fetch API
   * Converts fetch Response to generic TResponse format for consistency
   */
  private async executeRequest<T>(
    method: string,
    url: string,
    data?: any,
    headers?: Record<string, any>,
    params?: Record<string, any>
  ): Promise<TResponse<T>> {
    try {
      // Build URL with query parameters
      const urlWithParams = this.buildUrlWithParams(url, params);

      // Build fetch options
      const options: RequestInit = {
        method,
        headers: {
          'Content-Type': 'application/json',
          ...headers
        }
      };

      // Add body for methods that support it
      if (data && ['POST', 'PUT', 'PATCH'].includes(method)) {
        options.body = JSON.stringify(data);
      }

      // Execute fetch request
      const response: Response = await fetch(urlWithParams, options);

      // Parse response data
      let responseData: T | undefined;
      const contentType = response.headers.get('content-type');

      if (contentType?.includes('application/json')) {
        try {
          responseData = await response.json();
        } catch {
          responseData = undefined;
        }
      } else {
        responseData = (await response.text()) as any;
      }

      // Convert fetch Response to TResponse format
      return new TResponse<T>({
        data: responseData,
        status: response.status,
        statusText: response.statusText,
        headers: this.headersToObject(response.headers),
        config: { method, url: urlWithParams, headers, params }
      });
    } catch (error: any) {
      // Network errors or other fetch failures
      throw new Error(`Fetch request failed: ${error.message}`);
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

  /**
   * Convert Headers object to plain object for consistency with Axios
   */
  private headersToObject(headers: Headers): Record<string, string> {
    const headersObj: Record<string, string> = {};
    headers.forEach((value, key) => {
      headersObj[key] = value;
    });
    return headersObj;
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
