import { get, post, put, patch, del, options, head } from './http-client-wrapper/http-client-mapper';
import { TResponse } from './http-client-wrapper/generic-response.model';
import { AuthorizationHeadersFactory, AuthHeader } from './authorization-headers-factory';
import { urlBuilder } from './url-builder';
import { retry } from './retry';

/**
 * Enhanced API client with built-in authentication, error handling, and retry mechanisms
 * Provides a production-ready interface for API testing with comprehensive logging and monitoring
 */
export class ApiClient {
  private baseUrl: string;
  private defaultHeaders: AuthHeader;
  private timeout: number;
  private retryConfig: RetryConfig;
  private logging: boolean;

  constructor(config: ApiClientConfig) {
    this.baseUrl = config.baseUrl.replace(/\/$/, ''); // Remove trailing slash
    this.defaultHeaders = config.defaultHeaders || { Authorization: '' };
    this.timeout = config.timeout || 30000;
    this.retryConfig = {
      maxRetries: config.retryConfig?.maxRetries || 3,
      initialWait: config.retryConfig?.initialWait || 1000,
      maxWait: config.retryConfig?.maxWait || 5000,
      retryOnStatus: config.retryConfig?.retryOnStatus || [500, 502, 503, 504, 429]
    };
    this.logging = config.logging !== false; // Default to true unless explicitly disabled
  }

  /**
   * Create API client with Bearer token authentication
   */
  static withBearerAuth(baseUrl: string, token: string, config?: Partial<ApiClientConfig>): ApiClient {
    const headers = new AuthorizationHeadersFactory()
      .withBearerAuth(token)
      .withContentType('application/json')
      .build();

    return new ApiClient({
      baseUrl,
      defaultHeaders: headers,
      ...config
    });
  }

  /**
   * Create API client with Basic authentication
   */
  static withBasicAuth(baseUrl: string, username: string, password: string, config?: Partial<ApiClientConfig>): ApiClient {
    const headers = new AuthorizationHeadersFactory()
      .withBasicAuth(username, password)
      .withContentType('application/json')
      .build();

    return new ApiClient({
      baseUrl,
      defaultHeaders: headers,
      ...config
    });
  }

  /**
   * Create API client with API Key authentication
   */
  static withApiKey(baseUrl: string, apiKey: string, headerName: string = 'X-API-Key', config?: Partial<ApiClientConfig>): ApiClient {
    const headers = new AuthorizationHeadersFactory()
      .withCustomProperty(headerName, apiKey)
      .withContentType('application/json')
      .build();

    return new ApiClient({
      baseUrl,
      defaultHeaders: headers,
      ...config
    });
  }

  /**
   * Make GET request with enhanced error handling and retry logic
   */
  async get<T>(endpoint: string, params?: Record<string, any>, headers?: AuthHeader, pathParams?: Record<string, string | number>): Promise<TResponse<T>> {
    const url = this.buildUrl(endpoint, pathParams);
    const requestHeaders = this.mergeHeaders(headers);

    return this.executeWithRetry(() =>
      get<T>(url, requestHeaders, params)
    );
  }

  /**
   * Make POST request with enhanced error handling and retry logic
   */
  async post<T>(endpoint: string, data?: any, headers?: AuthHeader, pathParams?: Record<string, string | number>): Promise<TResponse<T>> {
    const url = this.buildUrl(endpoint, pathParams);
    const requestHeaders = this.mergeHeaders(headers);

    return this.executeWithRetry(() =>
      post<T>(url, data, requestHeaders)
    );
  }

  /**
   * Make PUT request with enhanced error handling and retry logic
   */
  async put<T>(endpoint: string, data?: any, headers?: AuthHeader, pathParams?: Record<string, string | number>): Promise<TResponse<T>> {
    const url = this.buildUrl(endpoint, pathParams);
    const requestHeaders = this.mergeHeaders(headers);

    return this.executeWithRetry(() =>
      put<T>(url, data, requestHeaders)
    );
  }

  /**
   * Make PATCH request with enhanced error handling and retry logic
   */
  async patch<T>(endpoint: string, data?: any, headers?: AuthHeader, pathParams?: Record<string, string | number>): Promise<TResponse<T>> {
    const url = this.buildUrl(endpoint, pathParams);
    const requestHeaders = this.mergeHeaders(headers);

    return this.executeWithRetry(() =>
      patch<T>(url, data, requestHeaders)
    );
  }

  /**
   * Make DELETE request with enhanced error handling and retry logic
   */
  async delete<T>(endpoint: string, headers?: AuthHeader, pathParams?: Record<string, string | number>): Promise<TResponse<T>> {
    const url = this.buildUrl(endpoint, pathParams);
    const requestHeaders = this.mergeHeaders(headers);

    return this.executeWithRetry(() =>
      del<T>(url, requestHeaders)
    );
  }

  /**
   * Make OPTIONS request for CORS preflight testing
   */
  async options<T>(endpoint: string, headers?: AuthHeader, pathParams?: Record<string, string | number>): Promise<TResponse<T>> {
    const url = this.buildUrl(endpoint, pathParams);
    const requestHeaders = this.mergeHeaders(headers);

    return options<T>(url, requestHeaders);
  }

  /**
   * Make HEAD request for resource existence checking
   */
  async head<T>(endpoint: string, headers?: AuthHeader, pathParams?: Record<string, string | number>): Promise<TResponse<T>> {
    const url = this.buildUrl(endpoint, pathParams);
    const requestHeaders = this.mergeHeaders(headers);

    return head<T>(url, requestHeaders);
  }

  /**
   * Batch multiple requests with controlled concurrency
   */
  async batch<T>(requests: BatchRequest[], concurrency: number = 5): Promise<BatchResponse<T>[]> {
    const results: BatchResponse<T>[] = [];

    // Process requests in batches to control concurrency
    for (let i = 0; i < requests.length; i += concurrency) {
      const batch = requests.slice(i, i + concurrency);
      const batchPromises: Promise<BatchResponse<T>>[] = batch.map(async (request, index): Promise<BatchResponse<T>> => {
        try {
          const response = await this.executeRequest<T>(request);
          return {
            success: true,
            response,
            index: i + index,
            request
          };
        } catch (error) {
          return {
            success: false,
            error: error.message,
            index: i + index,
            request
          };
        }
      });

      const batchResults = await Promise.allSettled(batchPromises);
      results.push(...batchResults.map(result =>
        result.status === 'fulfilled' ? result.value : {
          success: false,
          error: 'Batch request failed',
          index: -1,
          request: {} as BatchRequest
        } as BatchResponse<T>
      ));
    }

    return results;
  }

  /**
   * Health check endpoint testing
   */
  async healthCheck(): Promise<HealthCheckResult> {
    try {
      const startTime = Date.now();
      const response = await this.get('/health');
      const endTime = Date.now();

      return {
        healthy: response.status >= 200 && response.status < 300,
        status: response.status,
        responseTime: endTime - startTime,
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      return {
        healthy: false,
        status: 0,
        responseTime: -1,
        timestamp: new Date().toISOString(),
        error: error.message
      };
    }
  }

  /**
   * Execute request with custom retry configuration
   */
  private async executeWithRetry<T>(requestFn: () => Promise<TResponse<T>>): Promise<TResponse<T>> {
    return retry(
      async () => {
        const response = await requestFn();

        // Check if we should retry based on status code
        if (this.shouldRetryOnStatus(response.status)) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }

        return response;
      },
      this.retryConfig.maxRetries,
      this.retryConfig.initialWait,
      this.retryConfig.maxWait
    );
  }

  /**
   * Execute individual request for batch processing
   */
  private async executeRequest<T>(request: BatchRequest): Promise<TResponse<T>> {
    const { method, endpoint, data, headers, pathParams } = request;

    switch (method.toUpperCase()) {
    case 'GET':
      return this.get(endpoint, data, headers, pathParams);
    case 'POST':
      return this.post(endpoint, data, headers, pathParams);
    case 'PUT':
      return this.put(endpoint, data, headers, pathParams);
    case 'PATCH':
      return this.patch(endpoint, data, headers, pathParams);
    case 'DELETE':
      return this.delete(endpoint, headers, pathParams);
    case 'OPTIONS':
      return this.options(endpoint, headers, pathParams);
    case 'HEAD':
      return this.head(endpoint, headers, pathParams);
    default:
      throw new Error(`Unsupported HTTP method: ${method}`);
    }
  }

  /**
   * Build full URL with path parameters
   */
  private buildUrl(endpoint: string, pathParams?: Record<string, string | number>): string {
    const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
    const baseWithEndpoint = `${this.baseUrl}${cleanEndpoint}`;

    if (pathParams) {
      return urlBuilder(baseWithEndpoint, pathParams);
    }

    return baseWithEndpoint;
  }

  /**
   * Merge default headers with request-specific headers
   */
  private mergeHeaders(headers?: AuthHeader): AuthHeader {
    return {
      ...this.defaultHeaders,
      ...headers
    };
  }

  /**
   * Determine if request should be retried based on status code
   */
  private shouldRetryOnStatus(status?: number): boolean {
    if (!status) return true; // Retry on network errors
    return this.retryConfig.retryOnStatus.includes(status);
  }

  /**
   * Update authentication headers
   */
  updateAuth(newHeaders: AuthHeader): void {
    this.defaultHeaders = {
      ...this.defaultHeaders,
      ...newHeaders
    };
  }

  /**
   * Get current configuration
   */
  getConfig(): ApiClientConfig {
    return {
      baseUrl: this.baseUrl,
      defaultHeaders: this.defaultHeaders,
      timeout: this.timeout,
      retryConfig: this.retryConfig,
      logging: this.logging
    };
  }
}

// Configuration interfaces
export interface ApiClientConfig {
  baseUrl: string;
  defaultHeaders?: AuthHeader;
  timeout?: number;
  retryConfig?: RetryConfig;
  logging?: boolean;
}

export interface RetryConfig {
  maxRetries: number;
  initialWait: number;
  maxWait: number;
  retryOnStatus: number[];
}

export interface BatchRequest {
  method: string;
  endpoint: string;
  data?: any;
  headers?: AuthHeader;
  pathParams?: Record<string, string | number>;
}

export interface BatchResponse<T> {
  success: boolean;
  response?: TResponse<T>;
  error?: string;
  index: number;
  request: BatchRequest;
}

export interface HealthCheckResult {
  healthy: boolean;
  status: number;
  responseTime: number;
  timestamp: string;
  error?: string;
}
