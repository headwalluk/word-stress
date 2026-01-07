/**
 * Steady-State Test Mode
 * Runs multiple clients making periodic requests at fixed intervals
 */

const logger = require('../logger');
const { sleep, buildUrl } = require('../utils');

/**
 * SteadyStateTestMode class
 * Creates multiple concurrent clients, each making requests at a fixed interval
 */
class SteadyStateTestMode {
  constructor(config) {
    this.config = config;
  }

  /**
   * Run the steady-state test
   * Spawns N clients that each make requests at the specified interval
   * for the specified duration
   *
   * @param {Object} client - HTTP client with makeRequest() function
   * @param {Object} metricsCollector - MetricsCollector instance
   * @returns {Promise<Object>} Test results (MetricsCollector summary)
   */
  async run(client, metricsCollector) {
    const { clients: numClients, interval, duration } = this.config;

    const testDurationMs = duration * 1000;
    const url = buildUrl(this.config);

    logger.log(
      `Starting steady-state test: ${numClients} clients, ${interval}ms interval, ${duration}s duration`
    );

    const startTime = Date.now();
    const clientPromises = [];

    // Spawn N client tasks
    for (let i = 0; i < numClients; i++) {
      const clientId = i + 1;
      clientPromises.push(this._runClient(clientId, client, metricsCollector, url, testDurationMs));
    }

    // Wait for all clients to finish
    try {
      await Promise.all(clientPromises);
    } catch (err) {
      logger.error(`Test error: ${err.message}`);
    }

    metricsCollector.complete();
    const elapsed = Date.now() - startTime;

    logger.log(`Steady-state test complete after ${(elapsed / 1000).toFixed(2)}s`);

    return metricsCollector.getAggregateMetrics();
  }

  /**
   * Run a single client: make requests at the specified interval until duration is reached
   * @private
   */
  async _runClient(clientId, client, metricsCollector, url, testDurationMs) {
    const { interval, method, timeout, followRedirects } = this.config;
    const startTime = Date.now();
    let requestCount = 0;

    while (Date.now() - startTime < testDurationMs) {
      try {
        const result = await client.makeRequest(url, {
          method,
          timeout,
          followRedirects,
        });

        metricsCollector.recordRequest(result);
        requestCount++;

        logger.debug(
          `Client ${clientId}: Request ${requestCount} - ${result.statusCode || 'ERROR'}`
        );

        // Wait for the interval before next request
        const elapsedSinceStart = Date.now() - startTime;
        const nextRequestTime = (requestCount + 1) * interval;

        if (nextRequestTime > elapsedSinceStart && nextRequestTime <= testDurationMs) {
          const waitTime = nextRequestTime - elapsedSinceStart;
          await sleep(waitTime);
        }
      } catch (err) {
        logger.debug(`Client ${clientId}: Request error - ${err.message}`);
      }
    }

    logger.debug(`Client ${clientId} completed ${requestCount} requests`);
  }
}

module.exports = SteadyStateTestMode;
