import { urlBuilder } from '../url-builder';

describe('urlBuilder', () => {
  it('should replace a single path component', () => {
    const url = 'http://example.com/api/resource/:id';
    const pathComponents = { id: 123 };
    const expectedUrl = 'http://example.com/api/resource/123';
    expect(urlBuilder(url, pathComponents)).toBe(expectedUrl);
  });

  it('should replace multiple path components', () => {
    const url = 'http://example.com/api/resource/:id/:action';
    const pathComponents = { id: 123, action: 'edit' };
    const expectedUrl = 'http://example.com/api/resource/123/edit';
    expect(urlBuilder(url, pathComponents)).toBe(expectedUrl);
  });

  it('should handle path components with string values', () => {
    const url = 'http://example.com/api/resource/:id';
    const pathComponents = { id: 'abc' };
    const expectedUrl = 'http://example.com/api/resource/abc';
    expect(urlBuilder(url, pathComponents)).toBe(expectedUrl);
  });

  it('should handle path components with number values', () => {
    const url = 'http://example.com/api/resource/:id';
    const pathComponents = { id: 456 };
    const expectedUrl = 'http://example.com/api/resource/456';
    expect(urlBuilder(url, pathComponents)).toBe(expectedUrl);
  });

  it('should throw an error if URL includes path components but no values are provided', () => {
    const url = '/api/:version/users/:userId';
    expect(() => urlBuilder(url)).toThrow('URL includes path components, but no path component values are provided');
  });

  it('should throw an error if URL does not include path components but values are provided', () => {
    const url = '/api/v1/users/123';
    const pathComponents = { version: 'v1', userId: 123 };
    expect(() => urlBuilder(url, pathComponents)).toThrow('URL does not include path components, but path component values are provided');
  });

  it('should throw an error if URL does not include path components or values are provided', () => {
    const url = '/api/v1/users/123';
    expect(() => urlBuilder(url)).toThrow('URL does not include path components or path component values');
  });

  it('should handle URLs with no path components and no values gracefully', () => {
    const url = '/api/v1/users/123';
    expect(() => urlBuilder(url, {})).toThrow('URL does not include path components or path component values');
  });
});
