/**
 * HTTP Client module demonstrating SOLID principles
 *
 * SOLID Principles Demonstrated:
 * - Single Responsibility: Each class has one job (HTTP requests via specific library)
 * - Open/Closed: Easy to add new implementations without modifying existing code
 * - Liskov Substitution: AxiosHttpClient and FetchHttpClient are interchangeable
 * - Interface Segregation: IHttpClient defines only necessary HTTP methods
 * - Dependency Inversion: Depend on IHttpClient abstraction, not concrete implementations
 */

export { IHttpClient } from './IHttpClient.js';
export { TResponse } from './TResponse.js';
export { AxiosHttpClient } from './AxiosHttpClient.js';
export { FetchHttpClient } from './FetchHttpClient.js';
export { PlaywrightHttpClient } from './PlaywrightHttpClient.js';
