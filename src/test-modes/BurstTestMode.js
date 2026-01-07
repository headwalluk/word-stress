/**
 * Burst Test Mode
 * Sends simultaneous requests to measure peak capacity
 */

const logger = require('../logger');
const { buildUrl } = require('../utils');

/**
 * BurstTestMode class
 * Launches N simultaneous requests and measures aggregate performance
 */
class BurstTestMode {
  constructor(config) {
    this.config = config;
  }

  /**
   * Run the burst test
   * Launches burstClients simultaneous requests
   *
   * @param {Object} client - HTTP client with makeRequest() function
   * @param {Object} metricsCollector - MetricsCollector instance
   * @returns {Promise<Object>} Test results (MetricsCollector summary)
   */
  async run(client, metricsCollector) {
    const { burstClients, method, timeout, followRedirects } = this.config;
    const url = buildUrl(this.config);

    logger.log(`Starting burst test: ${burstClients} simultaneous requests`);

    const startTime = Date.now();

    // Create array of N simultaneous requests
    const requests = [];
    for (let i = 0; i < burstClients; i++) {
      requests.push(
        client.makeRequest(url, {
          method,
          timeout,
          followRedirects,
        })
      );
    }

    // Execute all requests in parallel
    try {
      const results = await Promise.all(requests);

      // Record all results in metrics collector
      results.forEach((result, index) => {
        metricsCollector.recordRequest(result);
        logger.debug(`Burst request ${index + 1}: ${result.statusCode || 'ERROR'}`);
      });
    } catch (err) {
      logger.error(`Burst test error: ${err.message}`);
    }

    metricsCollector.complete();
    const elapsed = Date.now() - startTime;

    logger.log(`Burst test complete after ${(elapsed / 1000).toFixed(2)}s`);

    return metricsCollector.getAggregateMetrics();
  }
}

module.exports = BurstTestMode;
