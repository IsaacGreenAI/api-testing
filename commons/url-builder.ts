/**
 * Consumes a url with ":pathComponentName" and an object mapping the path component to a value
 * @param url url with ":pathComponent" which will be replaced with pathComponents parameters
 * @param pathComponents values of the path components
 * @returns url with of path component values
 */
export function urlBuilder(url: string, pathComponents: Record<string, string | number>): string {
  if (!url) {
    throw new Error('URL is not included');
  }

  if (!pathComponents) {
    throw new Error('Path components are not included');
  }

  return Object.entries(pathComponents!).reduce((urlWithPathComponents, [key, value]) => {
    return urlWithPathComponents.replace(`:${key}`, `${value}`);
  }, url);
}
