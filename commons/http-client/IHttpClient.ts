import { TResponse } from './TResponse';

/**
 * HTTP Client interface following SOLID principles
 * Allows dependency inversion - tests can depend on abstraction rather than concrete implementation
 * Enables easy swapping between Axios, Fetch, or custom implementations
 */
export interface IHttpClient {
  /**
   * Make GET request
   * @param url - Full URL or path
   * @param headers - Optional request headers
   * @param params - Optional query parameters
   */
  get<T>(url: string, headers?: Record<string, any>, params?: Record<string, any>): Promise<TResponse<T>>;

  /**
   * Make POST request
   * @param url - Full URL or path
   * @param data - Request body data
   * @param headers - Optional request headers
   * @param params - Optional query parameters
   */
  post<T>(url: string, data?: any, headers?: Record<string, any>, params?: Record<string, any>): Promise<TResponse<T>>;

  /**
   * Make PUT request
   * @param url - Full URL or path
   * @param data - Request body data
   * @param headers - Optional request headers
   * @param params - Optional query parameters
   */
  put<T>(url: string, data?: any, headers?: Record<string, any>, params?: Record<string, any>): Promise<TResponse<T>>;

  /**
   * Make PATCH request
   * @param url - Full URL or path
   * @param data - Request body data
   * @param headers - Optional request headers
   * @param params - Optional query parameters
   */
  patch<T>(url: string, data?: any, headers?: Record<string, any>, params?: Record<string, any>): Promise<TResponse<T>>;

  /**
   * Make DELETE request
   * @param url - Full URL or path
   * @param headers - Optional request headers
   * @param params - Optional query parameters
   */
  delete<T>(url: string, headers?: Record<string, any>, params?: Record<string, any>): Promise<TResponse<T>>;

  /**
   * Make OPTIONS request for CORS preflight testing
   * @param url - Full URL or path
   * @param headers - Optional request headers
   * @param params - Optional query parameters
   */
  options<T>(url: string, headers?: Record<string, any>, params?: Record<string, any>): Promise<TResponse<T>>;

  /**
   * Make HEAD request for resource existence checking
   * @param url - Full URL or path
   * @param headers - Optional request headers
   * @param params - Optional query parameters
   */
  head<T>(url: string, headers?: Record<string, any>, params?: Record<string, any>): Promise<TResponse<T>>;
}
