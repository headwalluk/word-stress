/**
 * Centralized configuration module
 * Loads and normalizes all configuration from CLI arguments and environment variables
 */

require('dotenv').config();

/**
 * Default configuration values
 */
const defaults = {
  // Test parameters - Steady-State mode
  clients: 5,
  interval: 1000, // milliseconds
  duration: 60, // seconds

  // Test parameters - Burst mode
  burstClients: null,

  // Common parameters
  domain: null,
  endpoint: '/',
  method: 'GET',
  https: true,
  timeout: 30000,
  followRedirects: true,
  output: 'table', // table, json, csv

  // Test mode
  mode: 'steady-state', // steady-state or burst

  // Logging
  logLevel: process.env.LOG_LEVEL || 'INFO',
};

/**
 * Build configuration from CLI arguments
 * @param {Object} args - Parsed command line arguments
 * @returns {Object} Configuration object
 */
function buildConfig(args) {
  const config = { ...defaults };

  // Domain is required positional argument
  if (args.domain) {
    config.domain = args.domain;
  }

  // Steady-state parameters
  if (args.clients !== undefined) {
    config.clients = parseInt(args.clients, 10);
  }
  if (args.interval !== undefined) {
    config.interval = parseInt(args.interval, 10);
  }
  if (args.duration !== undefined) {
    config.duration = parseInt(args.duration, 10);
  }

  // Burst parameters
  if (args.mode === 'burst') {
    config.mode = 'burst';
    if (args.burstClients !== undefined) {
      config.burstClients = parseInt(args.burstClients, 10);
    }
  }

  // Common parameters
  if (args.endpoint !== undefined) {
    config.endpoint = args.endpoint;
  }
  if (args.method !== undefined) {
    config.method = args.method.toUpperCase();
  }
  if (args.https !== undefined) {
    config.https = args.https === 'on' || args.https === true;
  }
  if (args.timeout !== undefined) {
    config.timeout = parseInt(args.timeout, 10);
  }
  if (args.followRedirects !== undefined) {
    config.followRedirects = args.followRedirects === 'on' || args.followRedirects === true;
  }
  if (args.output !== undefined) {
    config.output = args.output.toLowerCase();
  }

  return config;
}

/**
 * Validate configuration
 * @param {Object} config
 * @throws {Error} if configuration is invalid
 */
function validate(config) {
  if (!config.domain) {
    throw new Error('Domain is required');
  }

  if (config.mode === 'burst') {
    if (!config.burstClients) {
      throw new Error('--burst-clients is required for burst mode');
    }
    if (config.burstClients < 1) {
      throw new Error('--burst-clients must be greater than 0');
    }
  } else {
    if (config.clients < 1) {
      throw new Error('--clients must be greater than 0');
    }
    if (config.interval < 1) {
      throw new Error('--interval must be greater than 0');
    }
    if (config.duration < 1) {
      throw new Error('--duration must be greater than 0');
    }
  }

  const validMethods = ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'];
  if (!validMethods.includes(config.method)) {
    throw new Error(`--method must be one of: ${validMethods.join(', ')}`);
  }

  const validOutputs = ['table', 'json', 'csv'];
  if (!validOutputs.includes(config.output)) {
    throw new Error(`--output must be one of: ${validOutputs.join(', ')}`);
  }

  if (config.timeout < 1) {
    throw new Error('--timeout must be greater than 0');
  }
}

module.exports = {
  buildConfig,
  validate,
  defaults,
};
