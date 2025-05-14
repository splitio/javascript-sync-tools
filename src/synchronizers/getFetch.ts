import type { IFetch } from '@splitsoftware/splitio-commons/src/services/types';

let nodeFetch: IFetch | undefined;

try {
  nodeFetch = require('node-fetch');

  // Handle node-fetch issue https://github.com/node-fetch/node-fetch/issues/1037
  if (typeof nodeFetch !== 'function') nodeFetch = (nodeFetch as any).default;

} catch (error) {
  // Try to access global fetch if `node-fetch` package couldn't be imported (e.g., not in a Node environment)
  nodeFetch = typeof fetch === 'function' ? fetch : undefined;
}

// This function is only exposed for testing purposes.
export function __setFetch(fetch: IFetch | undefined) {
  nodeFetch = fetch;
}

/**
 * Retrieves 'node-fetch', a Fetch API polyfill for Node.js, with fallback to global 'fetch' if available.
 *
 * @returns {IFetch | undefined} Fetch API function or undefined if not available.
 */
export function getFetch(): IFetch | undefined {
  return nodeFetch;
}
