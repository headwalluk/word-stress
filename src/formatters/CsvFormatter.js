/**
 * CSV Formatter
 * Outputs results as CSV for spreadsheet import
 */

/**
 * Escape CSV field value
 * @param {string|number} value - Value to escape
 * @returns {string} CSV-escaped value
 */
function escapeCsvField(value) {
  const stringValue = String(value);

  // If contains comma, newline, or quote, wrap in quotes and escape quotes
  if (stringValue.includes(',') || stringValue.includes('\n') || stringValue.includes('"')) {
    return `"${stringValue.replace(/"/g, '""')}"`;
  }

  return stringValue;
}

/**
 * Format results as CSV
 * @param {Object} results - Test results
 * @returns {string} CSV formatted output
 */
function format(results) {
  const rows = [];

  // Header row
  rows.push('Metric,Value');

  // Summary metrics
  rows.push(`Total Requests,${results.totalRequests}`);
  rows.push(`Duration (seconds),${results.duration.toFixed(2)}`);
  rows.push(`Success Rate (%),${results.successRate.toFixed(2)}`);
  rows.push(`Throughput (req/s),${results.throughput.toFixed(2)}`);
  rows.push(`Data Transferred (bytes),${results.dataTransferred}`);

  // Response times
  rows.push('');
  rows.push('Response Time Metrics');
  rows.push(`Min (ms),${results.responseTime.min}`);
  rows.push(`Max (ms),${results.responseTime.max}`);
  rows.push(`Average (ms),${results.responseTime.avg.toFixed(2)}`);
  rows.push(`Median P50 (ms),${results.responseTime.median}`);
  rows.push(`P95 (ms),${results.responseTime.p95.toFixed(2)}`);
  rows.push(`P99 (ms),${results.responseTime.p99.toFixed(2)}`);

  // Status codes
  rows.push('');
  rows.push('Status Code Distribution');
  rows.push(`2xx Success,${results.statusCodes['2xx']}`);
  rows.push(`3xx Redirect,${results.statusCodes['3xx']}`);
  rows.push(`4xx Client Error,${results.statusCodes['4xx']}`);
  rows.push(`5xx Server Error,${results.statusCodes['5xx']}`);

  // Errors
  if (results.errorTotal > 0) {
    rows.push('');
    rows.push('Error Details');
    Object.entries(results.errors).forEach(([error, count]) => {
      rows.push(`${escapeCsvField(error)},${count}`);
    });
  }

  return rows.join('\n');
}

module.exports = {
  format,
};
