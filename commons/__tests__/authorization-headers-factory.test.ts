import { describe, it, expect, beforeEach } from 'vitest';
import { AuthHeader, AuthorizationHeadersFactory } from '../authorization-headers-factory.js';

// we could definitely not use GHERKIN syntax here and save describe blocks, but the clarity is valuable

describe('GIVEN the AuthorizationHeaderFactory class', () => {
  let authorizationHeader: AuthorizationHeadersFactory;

  beforeEach(() => {
    authorizationHeader = new AuthorizationHeadersFactory();
  });

  describe('WHEN the withBasicAuth method is called', () => {
    it('THEN it sets the basic auth header correctly', () => {
      const key = 'testKey';
      const secret = 'testSecret';
      const expectedAuthorization = `Basic ${Buffer.from(`${key}:${secret}`).toString('base64')}`;

      const header: AuthHeader = authorizationHeader.withBasicAuth(key, secret).build();

      expect(header.Authorization).toBe(expectedAuthorization);
    });
  });

  describe('WHEN the withBearerAuth method is called', () => {
    it('THEN it sets the bearer auth header correctly', () => {
      const token = 'testToken';
      const expectedAuthorization = `Bearer ${token}`;

      const header: AuthHeader = authorizationHeader.withBearerAuth(token).build();

      expect(header.Authorization).toBe(expectedAuthorization);
    });
  });

  describe('WHEN the withCustomAuth method is called', () => {
    it('THEN it sets the custom auth header correctly', () => {
      const customAuthorization = 'CustomAuth';
      const token = 'testToken';
      const expectedAuthorization = `${customAuthorization} ${token}`;

      const header: AuthHeader = authorizationHeader.withCustomAuth(customAuthorization, token).build();

      expect(header.Authorization).toBe(expectedAuthorization);
    });
  });

  describe('WHEN the withContentType method is called', () => {
    it('THEN it sets the Content-Type property correctly', () => {
      const contentType = 'testContentType';

      const header: AuthHeader = authorizationHeader.withContentType(contentType).build();

      expect(header['Content-Type']).toBe(contentType);
    });

    it('THEN it defaults to application/json when no parameter is passed', () => {
      const header: AuthHeader = authorizationHeader.withContentType().build();

      expect(header['Content-Type']).toBe('application/json');
    });
  });

  describe('WHEN the "withCustomProperty" method is called', () => {
    it('THEN it sets the custom property correctly', () => {
      const customPropertyName = 'testCustomProperty';
      const customPropertyValue = 'testValue';

      const header: AuthHeader = authorizationHeader.withCustomProperty(customPropertyName, customPropertyValue).build();

      expect(header[customPropertyName]).toBe(customPropertyValue);
    });
  });

  describe('WHEN the "build" method is called', () => {
    it('THEN it returns the correctly built headers object', () => {
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
});
