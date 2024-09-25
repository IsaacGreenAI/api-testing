/**
 * Generic response object that can be used with strongly type response objects from any service
 */
export class GenericResponse<T> {

  /**
   * Configuration settings used to make the request
   */
  config?: any;

  /**
   * The response data from the server is gereric type so we can strongly type response objects from any service
   */
  data?: T;

  /**
   * The response headers
   */
  headers?: any;

  /**
   * Http status code of the response
   */
  status?: number;

  /**
   * Http status text describing the http status code
   */
  statusText?: string;

  constructor(params: object) {
    this.config = params['config'];
    this.data = params['data'];
    this.headers = params['headers'];
    this.status = params['status'];
    this.statusText = params['statusText'];
  }
}
