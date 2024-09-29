import axios, { AxiosResponse } from 'axios';
import { TResponse } from './generic-response.model';

export async function responseMapper<T> (method: string, url: string, body: any = {}, headers: any = {}, queryParams: any = {}): Promise<TResponse<T>> {
  let genericResponse: TResponse<T>;
  let axiosResponse: AxiosResponse;

  try {
    axiosResponse = await axios.request({
      method: method,
      url: url,
      data: body,
      headers: headers,
      params: queryParams
    });

    genericResponse = new TResponse(axiosResponse);

  } catch (error) {
    if (!error.response) {
      throw error;
    }

    genericResponse = new TResponse(error.message);
  }

  return genericResponse;
}

// get, post, put, patch, del delete, options, head
export async function get<T> (url: string, headers: any = {}, queryParams: any = {}): Promise<TResponse<T>> {
  return responseMapper('get', url, {}, headers, queryParams);
}

export async function post<T> (url: string, body: any = {}, headers: any = {}, queryParams: any = {}): Promise<TResponse<T>> {
  return responseMapper('post', url, body, headers, queryParams);
}

export async function put<T> (url: string, body: any = {}, headers: any = {}, queryParams: any = {}): Promise<TResponse<T>> {
  return responseMapper('put', url, body, headers, queryParams);
}

export async function patch<T> (url: string, body: any = {}, headers: any = {}, queryParams: any = {}): Promise<TResponse<T>> {
  return responseMapper('patch', url, body, headers, queryParams);
}

export async function del<T> (url: string, headers: any = {}, queryParams: any = {}): Promise<TResponse<T>> {
  return responseMapper('delete', url, {}, headers, queryParams);
}

export async function options<T> (url: string, headers: any = {}, queryParams: any = {}): Promise<TResponse<T>> {
  return responseMapper('options', url, {}, headers, queryParams);
}

export async function head<T> (url: string, headers: any = {}, queryParams: any = {}): Promise<TResponse<T>> {
  return responseMapper('head', url, {}, headers, queryParams);
}
