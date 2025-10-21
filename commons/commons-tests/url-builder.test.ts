import { describe, it, expect } from 'vitest';
import { urlBuilder } from '../index.js';

describe('GIVEN the urlBuilder function', () => {

  describe('WHEN it is called with a single path component', () => {
    it('THEN it creates the url with the single path component', () => {
      const url = 'http://example.com/api/resource/:id';
      const pathComponents = { id: 123 };
      const expectedUrl = 'http://example.com/api/resource/123';
      expect(urlBuilder(url, pathComponents)).toBe(expectedUrl);
    });
  });

  describe('WHEN it is called with multiple path components', () => {
    it('THEN it creates the url with multiple path components', () => {
      const url = 'http://example.com/api/resource/:id/:action';
      const pathComponents = { id: 123, action: 'edit' };
      const expectedUrl = 'http://example.com/api/resource/123/edit';
      expect(urlBuilder(url, pathComponents)).toBe(expectedUrl);
    });
  });

  describe('WHEN it is called with path components with string values', () => {
    it('THEN it creates the url with the string path components', () => {
      const url = 'http://example.com/api/resource/:id';
      const pathComponents = { id: 'abc' };
      const expectedUrl = 'http://example.com/api/resource/abc';
      expect(urlBuilder(url, pathComponents)).toBe(expectedUrl);
    });
  });

  describe('WHEN it is called with path components with number values', () => {
    it('THEN it creates the url with the number path components', () => {
      const url = 'http://example.com/api/resource/:id';
      const pathComponents = { id: 123 };
      const expectedUrl = 'http://example.com/api/resource/123';
      expect(urlBuilder(url, pathComponents)).toBe(expectedUrl);
    });
  });

  describe('WHEN it is called without a url', () => {
    it('THEN it throws an error', () => {
      const url = '';
      const pathComponents = { id: 'abc' };
      expect(() => urlBuilder(url, pathComponents)).toThrow('URL is not included');
    });
  });

  describe('WHEN it is called with path component values but no path components', () => {
    it('THEN it returns the url unchanged when pathComponents is empty', () => {
      const url = 'http://example.com/api/resource/:id';
      const pathComponents = {}; // Empty path components
      // When pathComponents is an empty object, the function doesn't replace anything
      expect(urlBuilder(url, pathComponents)).toBe(url);
    });
  });
});
