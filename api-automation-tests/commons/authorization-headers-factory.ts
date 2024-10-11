export class AuthorizationHeadersFactory {
  private headers: AuthHeader = { Authorization: '' };

  /**
   * @param key key which will be base64 encoded
   * @param secret secret which will be base64 encoded
   * @returns Basic auth header with base64 encoded key:secret
   */
  public withBasicAuth(key: string, secret: string): this {
    this.headers.Authorization = `Basic ${Buffer.from(`${key}:${secret}`).toString('base64')}`;
    return this;
  }

  /**
   * @param token JWT token which will be used for Bearer authentication
   * @returns Bearer auth header with the provided token
   */
  public withBearerAuth(token: string): this {
    this.headers.Authorization = `Bearer ${token}`;
    return this;
  }

  /**
   * @param customAuthorization custome authorizatoin type
   * @param token token which will be used for authenticaion
   * @returns customer auth header with provided token
   */
  public withCustomAuth(customAuthorization: string, token: string): this {
    this.headers.Authorization = `${customAuthorization} ${token}`;
    return this;
  }

  /**
   * @param contentType content type of the request | default: application/json
   * @returns request with content type, default is application/json
   */
  public withContentType(contentType?: string): this {
    this.headers['Content-Type'] = contentType ?? 'application/json';
    return this;
  }

  public withCustomProperty(customPropertyName: string, customPropertyValue: string): this {
    this.headers[customPropertyName] = customPropertyValue;
    return this;
  }

  public build(): AuthHeader {
    return this.headers;
  }
}

export type AuthHeader = {
  [key: string]: string | number | object;
  Authorization: string;
}
