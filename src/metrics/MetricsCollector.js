/**
 * Metrics Collector
 * Aggregates and calculates statistics from test requests
 */

const { calculatePercentile, calculateMedian } = require('../utils');

/**
 * MetricsCollector class
 * Collects per-request metrics and calculates aggregates
 */
class MetricsCollector {
  constructor() {
    this.requests = [];
    this.startTime = Date.now();
    this.endTime = null;
  }

  /**
   * Record a single request result
   * @param {Object} result - Request result object
   * @param {number} result.responseTime - Response time in milliseconds
   * @param {number} result.statusCode - HTTP status code
   * @param {number} result.size - Response size in bytes
   * @param {string|null} result.error - Error type (null if successful)
   */
  recordRequest(result) {
    this.requests.push({
      responseTime: result.responseTime || 0,
      statusCode: result.statusCode || 0,
      size: result.size || 0,
      error: result.error || null,
    });
  }

  /**
   * Mark test as complete and set end time
   */
  complete() {
    this.endTime = Date.now();
  }

  /**
   * Get test duration in seconds
   * @returns {number} Duration in seconds
   */
  getDuration() {
    const end = this.endTime || Date.now();
    return (end - this.startTime) / 1000;
  }

  /**
   * Get aggregated metrics
   * @returns {Object} Aggregated metrics
   */
  getAggregateMetrics() {
    if (this.requests.length === 0) {
      return this._getEmptyMetrics();
    }

    const responseTimes = this.requests
      .filter(r => !r.error)
      .map(r => r.responseTime)
      .sort((a, b) => a - b);

    const duration = this.getDuration();

    // Count status codes
    const statusCounts = {};
    const errorCounts = {};

    this.requests.forEach(r => {
      if (r.error) {
        errorCounts[r.error] = (errorCounts[r.error] || 0) + 1;
      } else {
        const statusCategory = `${Math.floor(r.statusCode / 100)}xx`;
        statusCounts[statusCategory] = (statusCounts[statusCategory] || 0) + 1;
      }
    });

    // Calculate response time percentiles
    const minResponseTime = responseTimes.length > 0 ? responseTimes[0] : 0;
    const maxResponseTime = responseTimes.length > 0 ? responseTimes[responseTimes.length - 1] : 0;
    const avgResponseTime =
      responseTimes.length > 0
        ? responseTimes.reduce((a, b) => a + b, 0) / responseTimes.length
        : 0;

    // Calculate total data transferred
    const totalDataTransferred = this.requests.reduce((sum, r) => sum + (r.size || 0), 0);

    // Calculate throughput
    const throughput = duration > 0 ? this.requests.length / duration : 0;

    return {
      // Test metadata
      totalRequests: this.requests.length,
      duration: parseFloat(duration.toFixed(2)),

      // Status code distribution
      statusCodes: {
        '2xx': statusCounts['2xx'] || 0,
        '3xx': statusCounts['3xx'] || 0,
        '4xx': statusCounts['4xx'] || 0,
        '5xx': statusCounts['5xx'] || 0,
      },

      // Error counts
      errors: errorCounts,
      errorTotal: Object.values(errorCounts).reduce((a, b) => a + b, 0),

      // Response time statistics
      responseTime: {
        min: parseFloat(minResponseTime.toFixed(2)),
        max: parseFloat(maxResponseTime.toFixed(2)),
        avg: parseFloat(avgResponseTime.toFixed(2)),
        median: parseFloat(calculateMedian(responseTimes).toFixed(2)),
        p95: parseFloat(calculatePercentile(responseTimes, 95).toFixed(2)),
        p99: parseFloat(calculatePercentile(responseTimes, 99).toFixed(2)),
      },

      // Throughput metrics
      throughput: parseFloat(throughput.toFixed(2)),
      dataTransferred: totalDataTransferred,

      // Success rate
      successRate: parseFloat(
        (
          ((this.requests.length - Object.values(errorCounts).reduce((a, b) => a + b, 0)) /
            this.requests.length) *
          100
        ).toFixed(2)
      ),
    };
  }

  /**
   * Get empty metrics object (for when no requests were made)
   * @private
   * @returns {Object}
   */
  _getEmptyMetrics() {
    return {
      totalRequests: 0,
      duration: 0,
      statusCodes: {
        '2xx': 0,
        '3xx': 0,
        '4xx': 0,
        '5xx': 0,
      },
      errors: {},
      errorTotal: 0,
      responseTime: {
        min: 0,
        max: 0,
        avg: 0,
        median: 0,
        p95: 0,
        p99: 0,
      },
      throughput: 0,
      dataTransferred: 0,
      successRate: 0,
    };
  }
}

module.exports = MetricsCollector;
