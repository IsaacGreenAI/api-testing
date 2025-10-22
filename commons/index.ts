/**
 * Commons Library - Barrel Export
 *
 * Shared utilities and HTTP clients for API testing
 * Usage: import { AxiosHttpClient, AuthorizationHeadersFactory } from '@commons';
 */

// HTTP Client exports
export { IHttpClient } from './http-client/IHttpClient.js';
export { TResponse } from './http-client/TResponse.js';
export { AxiosHttpClient } from './http-client/AxiosHttpClient.js';
export { FetchHttpClient } from './http-client/FetchHttpClient.js';
export { PlaywrightHttpClient } from './http-client/PlaywrightHttpClient.js';

// Authorization exports
export { AuthHeader, AuthorizationHeadersFactory } from './authorization-headers-factory.js';

// Date formatting exports
export { FormatDate } from './format-date.js';

// Utility exports
export { sleep } from './sleep.js';
export { retry } from './retry.js';
export { urlBuilder } from './url-builder.js';

// Regex exports
export {
  uuidv4Match,
  phoneNumberWithoutExtensionMatch,
  phoneNumberWithExtensionMatch,
  mmDDyyMatch,
  mmDDyyyyMatch,
  isoDateTimeMatch,
  utcDateTimeMatch
} from './regex-matches.js';
