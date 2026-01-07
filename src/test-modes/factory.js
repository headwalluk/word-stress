/**
 * Test Mode Factory
 * Instantiates the appropriate test mode based on configuration
 */

const SteadyStateTestMode = require('./SteadyStateTestMode');
const BurstTestMode = require('./BurstTestMode');

/**
 * Get test mode instance
 * @param {Object} config - Configuration object
 * @returns {Object} Test mode instance with run() method
 * @throws {Error} if mode is not recognized
 */
function getTestMode(config) {
  switch (config.mode.toLowerCase()) {
    case 'steady-state':
      return new SteadyStateTestMode(config);
    case 'burst':
      return new BurstTestMode(config);
    default:
      throw new Error(`Unknown test mode: ${config.mode}. Valid modes: steady-state, burst`);
  }
}

module.exports = {
  getTestMode,
};
