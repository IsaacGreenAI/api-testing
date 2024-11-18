import { TResponse } from '../http-client-wrapper/generic-response.model';

describe('GIVEN the TResponse model', () => {

  describe('WHEN it is instantiated with parameters', () => {
    it('THEN it creates an instance with parameters', () => {
      const params = {
        config: { timeout: 1000 },
        data: { key: 'value' },
        headers: { 'content-type': 'application/json' },
        status: 200,
        statusText: 'OK'
      };

      const response = new TResponse(params);

      expect(response.config).toEqual(params.config);
      expect(response.data).toEqual(params.data);
      expect(response.headers).toEqual(params.headers);
      expect(response.status).toBe(params.status);
      expect(response.statusText).toBe(params.statusText);
    });
  });

  describe('WHEN it is instantiated without parameters', () => {
    it('THEN it creates an instance with undefined properties', () => {
      const response = new TResponse({});

      expect(response.config).toBeUndefined();
      expect(response.data).toBeUndefined();
      expect(response.headers).toBeUndefined();
      expect(response.status).toBeUndefined();
      expect(response.statusText).toBeUndefined();
    });
  });
});
