/**
 * HTTP Client using Node's native Fetch API
 *
 * Handles HTTP requests with timeout support, error classification,
 * and metrics collection (response time, size, status code).
 */

const logger = require('../logger');

/**
 * Make an HTTP request and return metrics
 *
 * @param {string} url - Full URL to request
 * @param {Object} options - Request options
 * @param {string} options.method - HTTP method (GET, POST, etc.) - default: GET
 * @param {number} options.timeout - Timeout in milliseconds - default: 30000
 * @param {boolean} options.followRedirects - Follow redirects - default: true
 * @param {string} options.userAgent - User agent string - default: Node.js default
 * @returns {Promise<Object>} Result object with metrics
 *   - statusCode: HTTP status code or null
 *   - responseTime: Response time in milliseconds
 *   - size: Response body size in bytes
 *   - error: Error string or null
 *   - errorType: 'network' | 'timeout' | 'http' | null
 */
async function makeRequest(url, options = {}) {
  const { method = 'GET', timeout = 30000, followRedirects = true, userAgent = null } = options;

  const startTime = Date.now();
  let statusCode = null;
  let size = 0;
  let error = null;
  let errorType = null;

  try {
    // Create abort controller for timeout handling
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);

    const fetchOptions = {
      method,
      signal: controller.signal,
      redirect: followRedirects ? 'follow' : 'manual',
      headers: {},
    };

    // Add User-Agent header if provided
    if (userAgent) {
      fetchOptions.headers['User-Agent'] = userAgent;
    }

    let response;
    try {
      response = await fetch(url, fetchOptions);
    } finally {
      clearTimeout(timeoutId);
    }

    statusCode = response.status;

    // Extract response size from Content-Length header or read body
    const contentLength = response.headers.get('content-length');
    if (contentLength) {
      size = parseInt(contentLength, 10);
    } else {
      // If no Content-Length, read the body to get actual size
      const body = await response.text();
      size = Buffer.byteLength(body, 'utf8');
    }

    // Log 4xx and 5xx responses as warnings, not errors
    if (response.status >= 400) {
      logger.debug(`HTTP ${response.status} from ${url}`);
    }
  } catch (err) {
    // Classify the error
    if (err.name === 'AbortError') {
      error = 'Request timeout';
      errorType = 'timeout';
    } else if (
      err.code === 'ECONNREFUSED' ||
      err.code === 'ENOTFOUND' ||
      err.code === 'EHOSTUNREACH'
    ) {
      error = `Network error: ${err.code}`;
      errorType = 'network';
    } else if (err.message.includes('fetch')) {
      error = `Network error: ${err.message}`;
      errorType = 'network';
    } else {
      error = err.message;
      errorType = 'unknown';
    }

    logger.debug(`Request failed to ${url}: ${error}`);
  }

  const responseTime = Date.now() - startTime;

  return {
    statusCode,
    responseTime,
    size,
    error,
    errorType,
  };
}

module.exports = {
  makeRequest,
};
