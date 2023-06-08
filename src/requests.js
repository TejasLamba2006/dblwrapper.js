const { URL } = require('url');

class Request {
    /**
     * Perform an HTTP request.
     * @param {string} method Request method.
     * @param {string | URL} init Request URL.
     * @param {RequestOptions} options Request options.
     */
    static async perform(method, init, options) {
      const url = new URL(String(init));
      for (const [key, value] of Object.entries(options.query || {})) {
        url.searchParams.append(key, String(value));
      }
      const headers = new Headers();
      for (const [key, value] of Object.entries(options.headers || {})) {
        if (value) headers.set(key, String(value || ''));
      }

      headers.append('Content-Type', 'application/json');
  
      const body = options.body ? JSON.stringify(options.body) : undefined;
      const response = await fetch(url, { method, headers, body });
      if (response.ok) return await response.json();
  
      const text = await response.text();
      throw new Error(response.statusText + ":" + text);
    }
  }
  
  /**
   * Request options.
   * @typedef {Object} RequestOptions
   * @property {Record<string, unknown>} [headers] Request headers.
   * @property {Record<string, string | number | boolean>} [query] Request URL query.
   * @property {Record<string, unknown>} [body] Request body.
   */
  
  /**
   * Additional request options.
   * @typedef {Object} AdditionalOptions
   * @property {boolean} [requiresApiToken] Whether the request requires an API token.
   */
  
  module.exports = {
    Request
  };