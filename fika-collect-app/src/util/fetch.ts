import { VERSION } from '../version';
import { BASE_URL } from '../config';

export default function apiFetch(endpoint: string, options?: RequestInit): Promise<Response> {
  const url = `${BASE_URL}/${endpoint}`
  const headers = {
    'Content-Type': 'application/json',
    'X-App-Version': `fika-collect@${VERSION}`,
    ...options?.headers,
  };
  if (__DEV__) {
    const method = options?.method || 'GET';
    console.groupCollapsed(`${method} ${url}`)
    if (options?.body) {
      console.log(`with body: ${options.body}`);
    }
    console.log('with headers:', headers);
    console.groupEnd();
  }
  return fetch(url, {
    ...options,
    headers
  });
}