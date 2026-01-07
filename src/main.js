/**
 * Main application entry point
 * Orchestrates the stress testing workflow
 */

const logger = require('./logger');
const { buildConfig, validate } = require('./config');
const { getTestMode } = require('./test-modes/factory');
const { getFormatter } = require('./formatters/factory');
const { buildUrl } = require('./utils');
const { makeRequest } = require('./http/client');
const MetricsCollector = require('./metrics/MetricsCollector');
const { resolveUserAgent } = require('./user-agent');

/**
 * Main application function
 * @param {Object} args - Parsed CLI arguments
 */
async function main(args) {
  try {
    // Build and validate configuration
    const config = buildConfig(args);
    validate(config);

    // Log test configuration
    logger.log(`\nStarting stress test...`);
    const url = buildUrl(config);
    logger.log(`Target: ${url}`);

    if (config.mode === 'steady-state') {
      logger.log(`Mode: Steady-State`);
      logger.log(`Clients: ${config.clients}`);
      logger.log(`Interval: ${config.interval}ms`);
      logger.log(`Duration: ${config.duration}s`);
    } else if (config.mode === 'burst') {
      logger.log(`Mode: Burst`);
      logger.log(`Simultaneous Requests: ${config.burstClients}`);
    }

    logger.log(`Method: ${config.method}`);
    logger.log(`Output Format: ${config.output}`);
    logger.log('');

    // Resolve user agent
    const userAgent = resolveUserAgent(config);
    if (config.customUserAgent) {
      logger.log(`User-Agent: ${config.customUserAgent} (custom)`);
    } else {
      logger.log(`User-Agent: ${config.browser}`);
    }
    logger.log('');

    // Create instances for test execution
    const testMode = getTestMode(config);
    const metricsCollector = new MetricsCollector();
    const formatter = getFormatter(config.output);

    // Run the test with user agent
    const results = await testMode.run(
      { makeRequest: (url, options) => makeRequest(url, { ...options, userAgent }) },
      metricsCollector
    );

    // Format and output results
    const output = formatter.format(results);
    logger.log(output);
  } catch (error) {
    logger.error(error.message);
    process.exit(1);
  }
}

module.exports = {
  main,
};
