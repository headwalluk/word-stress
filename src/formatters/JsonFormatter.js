/**
 * JSON Formatter
 * Outputs results as JSON
 */

/**
 * Format results as JSON
 * @param {Object} results - Test results
 * @returns {string} JSON formatted output
 */
function format(results) {
  return JSON.stringify(results, null, 2);
}

module.exports = {
  format,
};
