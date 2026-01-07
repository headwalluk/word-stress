/**
 * Main application entry point
 * Orchestrates the stress testing workflow
 */

const logger = require('./logger');
const { buildConfig, validate } = require('./config');
const { getTestMode } = require('./test-modes/factory');
const { getFormatter } = require('./formatters/factory');
const { buildUrl } = require('./utils');

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

    // Get test mode instance
    const testMode = getTestMode(config);

    // Run test (placeholder - actual implementation in Phase 3+)
    logger.log('Note: Test execution framework is in place. HTTP client implementation coming in Phase 3.');
    
    // Get formatter
    const formatter = getFormatter(config.output);

    // TODO: Execute test mode and collect results
    // const results = await testMode.run();
    
    // TODO: Format and output results
    // const output = formatter.format(results);
    // logger.log(output);

  } catch (error) {
    logger.error(error.message);
    process.exit(1);
  }
}

module.exports = {
  main,
};
