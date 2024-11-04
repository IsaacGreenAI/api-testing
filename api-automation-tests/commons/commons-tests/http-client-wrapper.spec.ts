import axios from 'axios';
import { responseMapper } from '../http-client-wrapper/http-client-mapper';
import { TResponse } from '../http-client-wrapper/generic-response.model';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('GIVEN the responseMapper function', () => {
  const url = 'http://example.com';
  const method = 'get';
  const body = { key: 'value' };
  const headers = { 'Content-Type': 'application/json' };
  const queryParams = { param: 'value' };

  describe('WHEN the responseMapper function is called', () => {
    it('THEN it returns a TResponse object on successful request', async () => {
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

    it('THEN it returns a TResponse object on failed request', async () => {
      const axiosResponse = {
        data: { success: false },
        status: 400,
        statusText: 'Bad Request',
        headers: {},
        config: {},
      };
      mockedAxios.request.mockResolvedValue(axiosResponse); // the mapper passes in the error.messages, not the error body.  We use mockResolved for this.

      const response = await responseMapper(method, url, body, headers, queryParams);

      expect(response).toBeInstanceOf(TResponse);
      expect(response.data).toEqual(axiosResponse.data);
    });
  });
});
