import { TResponse } from '../http-client-wrapper/generic-response.model';

describe('TResponse model', () => {
  it('should create an instance with custom parameters', () => {
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

  it('should create an instance with undefined properties if no parameters are provided', () => {
    const response = new TResponse({});

    expect(response.config).toBeUndefined();
    expect(response.data).toBeUndefined();
    expect(response.headers).toBeUndefined();
    expect(response.status).toBeUndefined();
    expect(response.statusText).toBeUndefined();
  });
});
