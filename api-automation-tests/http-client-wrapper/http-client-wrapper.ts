import axios, { AxiosResponse } from 'axios';
import { GenericResponse } from './generic-response.model';

export async function httpClientWrapper<T> (method: string, url: string, body?: any, headers?: any, queryParams?: any): Promise<GenericResponse<T>> {
  let genericResponse: GenericResponse<T>;
  let axiosResponse: AxiosResponse;

  try {
    axiosResponse = await axios.request({
      method: method,
      url: url,
      data: body,
      headers: headers,
      params: queryParams
    });

    genericResponse = new GenericResponse(axiosResponse);

  } catch (error) {

    if (!error.response) {
      throw error;
    }

    genericResponse = new GenericResponse(error.message);
  }

  return genericResponse;
}

