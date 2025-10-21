/**
 * Generic response object that can be used with strongly typed response objects from any service
 * Provides a consistent interface regardless of the underlying HTTP client implementation
 */
export class TResponse<T> {
  /**
   * Configuration settings used to make the request
   */
  config?: any;

  /**
   * The response data from the server - generic type allows strongly typed response objects
   */
  data?: T;

  /**
   * The response headers
   */
  headers?: Record<string, any>;

  /**
   * HTTP status code of the response
   */
  status?: number;

  /**
   * HTTP status text describing the status code
   */
  statusText?: string;

  constructor(params: any) {
    this.config = params['config'];
    this.data = params['data'];
    this.headers = params['headers'];
    this.status = params['status'];
    this.statusText = params['statusText'];
  }

  /**
   * Check if response was successful (2xx status code)
   */
  get isSuccess(): boolean {
    return this.status !== undefined && this.status >= 200 && this.status < 300;
  }

  /**
   * Check if response was a client error (4xx status code)
   */
  get isClientError(): boolean {
    return this.status !== undefined && this.status >= 400 && this.status < 500;
  }

  /**
   * Check if response was a server error (5xx status code)
   */
  get isServerError(): boolean {
    return this.status !== undefined && this.status >= 500 && this.status < 600;
  }
}
