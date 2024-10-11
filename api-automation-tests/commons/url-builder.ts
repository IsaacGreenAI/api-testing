/**
 * Consumes a url with ":pathComponentName" and an object mapping the path component to a value
 * @param url url with ":pathComponent" which will be replaced with pathComponents parameters
 * @param pathComponents values of the path components
 * @returns url with of path component values
 */
export function urlBuilder(url: string, pathComponents?: Record<string, string | number>): string {
  const hasPathComponents = url.includes(':');
  const hasPathComponentValues = pathComponents && Object.keys(pathComponents).length > 0;

  if (hasPathComponents && !hasPathComponentValues) {
    throw new Error('URL includes path components, but no path component values are provided');
  }

  if (!hasPathComponents && hasPathComponentValues) {
    throw new Error('URL does not include path components, but path component values are provided');
  }

  if (!hasPathComponents && !hasPathComponentValues) {
    throw new Error('URL does not include path components or path component values');
  }

  return Object.entries(pathComponents!).reduce((urlWithPathComponents, [key, value]) => {
    return urlWithPathComponents.replace(`:${key}`, `${value}`);
  }, url);
}
