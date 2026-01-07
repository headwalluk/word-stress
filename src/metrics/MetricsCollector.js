/**
 * Metrics Collector
 * Aggregates and calculates statistics from test requests
 */

/**
 * MetricsCollector class
 * Collects per-request metrics and calculates aggregates
 */
class MetricsCollector {
  constructor(testDuration) {
    this.testDuration = testDuration;
    this.requests = [];
    this.startTime = Date.now();
  }

  /**
   * Record a single request result
   * @param {Object} result - Request result object
   */
  recordRequest(result) {
    // TODO: Implement metrics recording
    throw new Error('MetricsCollector not yet implemented');
  }

  /**
   * Get aggregated metrics
   * @returns {Object} Aggregated metrics
   */
  getAggregateMetrics() {
    // TODO: Implement aggregation
    throw new Error('MetricsCollector not yet implemented');
  }
}

module.exports = MetricsCollector;
