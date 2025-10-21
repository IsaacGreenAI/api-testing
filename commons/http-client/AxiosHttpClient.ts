import axios, { AxiosResponse } from 'axios';
import { IHttpClient } from './IHttpClient.js';
import { TResponse } from './TResponse.js';

/**
 * Axios-based implementation of IHttpClient
 * Wraps Axios library to provide consistent response interface
 * Demonstrates Dependency Inversion Principle - depends on IHttpClient abstraction
 */
export class AxiosHttpClient implements IHttpClient {
  /**
   * Core request handler that all HTTP methods use
   * Converts Axios responses to generic TResponse format
   */
  private async executeRequest<T>(
    method: string,
    url: string,
    data?: any,
    headers?: Record<string, any>,
    params?: Record<string, any>
  ): Promise<TResponse<T>> {
    try {
      const axiosResponse: AxiosResponse = await axios.request({
        method,
        url,
        data,
        headers,
        params
      });

      return new TResponse<T>(axiosResponse);
    } catch (error: any) {
      // Axios wraps HTTP errors in error.response
      if (error.response) {
        return new TResponse<T>(error.response);
      }

      // Network errors or other issues
      throw error;
    }
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
