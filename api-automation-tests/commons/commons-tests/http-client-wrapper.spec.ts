import axios from 'axios';
import { responseMapper } from '../http-client-wrapper/http-client-wrapper';
import { TResponse } from '../http-client-wrapper/generic-response.model';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('responseMapper function', () => {
  const url = 'http://example.com';
  const method = 'get';
  const body = { key: 'value' };
  const headers = { 'Content-Type': 'application/json' };
  const queryParams = { param: 'value' };

  it('should return a TResponse object on successful request', async () => {
    const axiosResponse = {
      data: { success: true },
      status: 200,
      statusText: 'OK',
      headers: {},
      config: {},
    };
    mockedAxios.request.mockResolvedValue(axiosResponse);

    const response = await responseMapper(method, url, body, headers, queryParams);

    expect(response).toBeInstanceOf(TResponse);
    expect(response.data).toEqual(axiosResponse.data);
  });
});
