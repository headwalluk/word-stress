/**
 * Table Formatter
 * Outputs results as pretty ASCII tables
 */

const Table = require('cli-table3');
const { formatBytes } = require('../utils');

/**
 * Format results as pretty tables
 * @param {Object} results - Test results
 * @returns {string} Formatted output
 */
function format(results) {
  const output = [];

  // Summary Table
  const summaryTable = new Table({
    head: ['Metric', 'Value'],
    style: { head: [], border: ['cyan'] },
    colWidths: [25, 40],
  });

  summaryTable.push(
    ['Total Requests', results.totalRequests.toString()],
    ['Duration', `${results.duration.toFixed(2)}s`],
    ['Success Rate', `${results.successRate.toFixed(2)}%`],
    ['Throughput', `${results.throughput.toFixed(2)} req/s`],
    ['Data Transferred', formatBytes(results.dataTransferred)]
  );

  output.push('Summary');
  output.push(summaryTable.toString());
  output.push('');

  // Response Times Table
  const responseTable = new Table({
    head: ['Metric', 'Value'],
    style: { head: [], border: ['cyan'] },
    colWidths: [25, 40],
  });

  responseTable.push(
    ['Min', `${results.responseTime.min}ms`],
    ['Max', `${results.responseTime.max}ms`],
    ['Average', `${results.responseTime.avg.toFixed(2)}ms`],
    ['Median (P50)', `${results.responseTime.median}ms`],
    ['P95', `${results.responseTime.p95.toFixed(2)}ms`],
    ['P99', `${results.responseTime.p99.toFixed(2)}ms`]
  );

  output.push('Response Times');
  output.push(responseTable.toString());
  output.push('');

  // Status Codes Table
  const statusTable = new Table({
    head: ['Status Code', 'Count'],
    style: { head: [], border: ['cyan'] },
    colWidths: [25, 40],
  });

  statusTable.push(
    ['2xx Success', results.statusCodes['2xx'].toString()],
    ['3xx Redirect', results.statusCodes['3xx'].toString()],
    ['4xx Client Error', results.statusCodes['4xx'].toString()],
    ['5xx Server Error', results.statusCodes['5xx'].toString()]
  );

  output.push('Status Codes');
  output.push(statusTable.toString());
  output.push('');

  // Errors Table (if any)
  if (results.errorTotal > 0) {
    const errorTable = new Table({
      head: ['Error Type', 'Count'],
      style: { head: [], border: ['cyan'] },
      colWidths: [40, 20],
    });

    Object.entries(results.errors).forEach(([error, count]) => {
      errorTable.push([error, count.toString()]);
    });

    output.push('Errors');
    output.push(errorTable.toString());
  }

  return output.join('\n');
}

module.exports = {
  format,
};
