import { AuthHeader, AuthorizationHeadersFactory } from '../authorization-headers-factory';

describe('AuthorizationHeaderFactory class', () => {
  let authorizationHeader: AuthorizationHeadersFactory;

  beforeEach(() => {
    authorizationHeader = new AuthorizationHeadersFactory();
  });

  it('should set Basic auth header correctly', () => {
    const key = 'testKey';
    const secret = 'testSecret';
    const expectedAuthorization = `Basic ${Buffer.from(`${key}:${secret}`).toString('base64')}`;

    const header: AuthHeader = authorizationHeader.withBasicAuth(key, secret).build();

    expect(header.Authorization).toBe(expectedAuthorization);
  });

  it('should set Bearer auth header correctly', () => {
    const token = 'testToken';
    const expectedAuthorization = `Bearer ${token}`;

    const header: AuthHeader = authorizationHeader.withBearerAuth(token).build();

    expect(header.Authorization).toBe(expectedAuthorization);
  });

  it('should set custom auth header correctly', () => {
    const customAuthorization = 'CustomAuth';
    const token = 'testToken';
    const expectedAuthorization = `${customAuthorization} ${token}`;

    const header: AuthHeader = authorizationHeader.withCustomAuth(customAuthorization, token).build();

    expect(header.Authorization).toBe(expectedAuthorization);
  });

  it('should set Content-Type header when parameter is passed', () => {
    const contentType = 'testContentType';
    const header: AuthHeader = authorizationHeader.withContentType(contentType).build();

    expect(header['Content-Type']).toBe(contentType);
  });

  it('should defualt Content-Type to application/json when no parameter is passed', () => {
    const header: AuthHeader = authorizationHeader.withContentType().build();

    expect(header['Content-Type']).toBe('application/json');
  });

  it('should set custom property correctly', () => {
    const customPropertyName = 'testCustomProperty';
    const customPropertyValue = 'testValue';

    const header: AuthHeader = authorizationHeader.withCustomProperty(customPropertyName, customPropertyValue).build();

    expect(header[customPropertyName]).toBe(customPropertyValue);
  });

  it('should return the headers object correctly', () => {
    const token: string = 'testToken';
    const customerPropertyName: string = 'testCustomProperty';
    const customerPropertyValue: string = 'testValue';

    const headers = authorizationHeader
      .withBearerAuth(token)
      .withContentType()
      .withCustomProperty(customerPropertyName, customerPropertyValue)
      .build();

    expect(headers).toEqual({
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
      [`${customerPropertyName}`]: customerPropertyValue,
    });
  });
});
