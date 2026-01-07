/**
 * HTTP Client using Fetch API
 * Handles GET and POST requests with timeout support
 */

/**
 * Make an HTTP request
 * @param {string} url - Full URL to request
 * @param {Object} _options - Request options
 * @returns {Promise<Object>} Response object with time, status, size, error
 */
async function makeRequest(url, _options = {}) {
  // TODO: Implement HTTP client
  throw new Error('HTTP client not yet implemented');
}

module.exports = {
  makeRequest,
};
