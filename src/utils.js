/**
 * Utility functions for the application
 */

/**
 * Calculate percentile from sorted array
 * @param {number[]} sortedArray - Array of values, sorted in ascending order
 * @param {number} percentile - Percentile to calculate (0-100)
 * @returns {number} Percentile value
 */
function calculatePercentile(sortedArray, percentile) {
  if (sortedArray.length === 0) return 0;
  if (percentile === 50) return calculateMedian(sortedArray);

  const index = (percentile / 100) * (sortedArray.length - 1);
  const lower = Math.floor(index);
  const upper = Math.ceil(index);
  const weight = index % 1;

  if (lower === upper) {
    return sortedArray[lower];
  }

  return sortedArray[lower] * (1 - weight) + sortedArray[upper] * weight;
}

/**
 * Calculate median from sorted array
 * @param {number[]} sortedArray - Array of values, sorted in ascending order
 * @returns {number} Median value
 */
function calculateMedian(sortedArray) {
  if (sortedArray.length === 0) return 0;
  const mid = Math.floor(sortedArray.length / 2);
  if (sortedArray.length % 2 === 1) {
    return sortedArray[mid];
  }
  return (sortedArray[mid - 1] + sortedArray[mid]) / 2;
}

/**
 * Build full URL from configuration
 * @param {Object} config - Configuration object
 * @returns {string} Full URL
 */
function buildUrl(config) {
  const protocol = config.https ? 'https' : 'http';
  const domain = config.domain.replace(/^(https?:\/\/)/, ''); // Remove protocol if present
  const endpoint = config.endpoint.startsWith('/') ? config.endpoint : `/${config.endpoint}`;
  return `${protocol}://${domain}${endpoint}`;
}

/**
 * Format bytes to human-readable format
 * @param {number} bytes - Number of bytes
 * @returns {string} Formatted string
 */
function formatBytes(bytes) {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return (bytes / Math.pow(k, i)).toFixed(2) + ' ' + sizes[i];
}

/**
 * Format milliseconds to seconds
 * @param {number} ms - Milliseconds
 * @returns {string} Formatted string
 */
function formatDuration(ms) {
  return (ms / 1000).toFixed(2) + 's';
}

/**
 * Sleep for specified milliseconds
 * @param {number} ms - Milliseconds to sleep
 * @returns {Promise<void>}
 */
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

module.exports = {
  calculatePercentile,
  calculateMedian,
  buildUrl,
  formatBytes,
  formatDuration,
  sleep,
};
