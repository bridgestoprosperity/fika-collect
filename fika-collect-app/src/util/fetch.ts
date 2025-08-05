import { VERSION } from '../version';
import { BASE_URL } from '../config';

export default function apiFetch(endpoint: string, options?: RequestInit): Promise<Response> {
  const url = `${BASE_URL}/${endpoint}`;
  const headers = {
    'Content-Type': 'application/json',
    'X-App-Version': `fika-collect@${VERSION}`,
    ...options?.headers,
  };
  console.log('dev?', __DEV__);
  if (__DEV__) {
    const method = options?.method || 'GET';
    console.groupCollapsed(`${method} ${url}`);
    if (options?.body) {
      console.log(`with body: ${options.body}`);
    }
    console.log('with headers:', headers);
  }
  return fetch(url, {
    ...options,
    headers,
  })
    .then((response) => {
      if (response.ok) { return response; }
      console.error(`HTTP error: ${response.status} ${response.statusText}`);
      throw new Error(`HTTP error: ${response.status} ${response.statusText}`);
    })
    .catch((error) => {
      console.error('Fetch error:', error);
      throw error;
    })
    .finally(() => {
      if (__DEV__) {
        console.groupEnd();
      }
    });
}
