/**
 * Builder pattern for constructing HTTP request headers with authentication
 * Demonstrates Builder Pattern and Fluent Interface design
 *
 * @example
 * const headers = new AuthorizationHeadersFactory()
 *   .withBearerAuth('my-jwt-token')
 *   .withContentType('application/json')
 *   .build();
 */
export class AuthorizationHeadersFactory {
  private headers: AuthHeader = { Authorization: '' };

  /**
   * Add Basic authentication header (base64 encoded username:password)
   * @param username Username for basic auth
   * @param password Password for basic auth
   * @returns This factory instance for method chaining
   */
  public withBasicAuth(username: string, password: string): this {
    this.headers.Authorization = `Basic ${Buffer.from(`${username}:${password}`).toString('base64')}`;
    return this;
  }

  /**
   * Add Bearer token authentication header (commonly used for JWT)
   * @param token JWT or bearer token
   * @returns This factory instance for method chaining
   */
  public withBearerAuth(token: string): this {
    this.headers.Authorization = `Bearer ${token}`;
    return this;
  }

  /**
   * Add custom authentication header with custom scheme
   * @param authScheme Custom authorization scheme (e.g., "ApiKey", "Token")
   * @param token Token value
   * @returns This factory instance for method chaining
   *
   * @example
   * factory.withCustomAuth('ApiKey', 'abc123')
   * // Results in: Authorization: ApiKey abc123
   */
  public withCustomAuth(authScheme: string, token: string): this {
    this.headers.Authorization = `${authScheme} ${token}`;
    return this;
  }

  /**
   * Add Content-Type header
   * @param contentType Content type (defaults to application/json)
   * @returns This factory instance for method chaining
   */
  public withContentType(contentType?: string): this {
    this.headers['Content-Type'] = contentType ?? 'application/json';
    return this;
  }

  /**
   * Add custom header property
   * @param propertyName Header name
   * @param propertyValue Header value
   * @returns This factory instance for method chaining
   *
   * @example
   * factory.withCustomProperty('X-API-Key', 'my-api-key')
   */
  public withCustomProperty(propertyName: string, propertyValue: string): this {
    this.headers[propertyName] = propertyValue;
    return this;
  }

  /**
   * Build and return the headers object
   * @returns Complete headers object ready for HTTP requests
   */
  public build(): AuthHeader {
    return this.headers;
  }
}

export type AuthHeader = {
  [key: string]: string | number | object;
  Authorization: string;
}
