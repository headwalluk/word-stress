/**
 * CLI command definitions using commander.js
 */

const { Command } = require('commander');
const fs = require('fs');
const path = require('path');

/**
 * Set up CLI commands
 * @returns {Command} commander program
 */
function setupCli() {
  // Read package.json for version
  const packageJsonPath = path.join(__dirname, '../../package.json');
  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));

  const program = new Command();

  program
    .name('wordstress')
    .description('Stress-testing CLI tool for WordPress and WooCommerce sites')
    .version(packageJson.version);

  program
    .argument('<domain>', 'Domain to test (e.g., example.com)')
    .option(
      '--clients <n>',
      'Number of parallel clients for steady-state mode (default: 5)',
      '5'
    )
    .option(
      '--interval <ms>',
      'Milliseconds between each client request (default: 1000)',
      '1000'
    )
    .option(
      '--duration <s>',
      'Test duration in seconds (default: 60)',
      '60'
    )
    .option(
      '--mode <mode>',
      'Test mode: steady-state or burst (default: steady-state)',
      'steady-state'
    )
    .option(
      '--burst-clients <n>',
      'Number of simultaneous requests for burst mode (required for burst)'
    )
    .option(
      '--endpoint <path>',
      'URL path/endpoint to test (default: /)',
      '/'
    )
    .option(
      '--method <METHOD>',
      'HTTP method: GET, POST, PUT, DELETE, PATCH (default: GET)',
      'GET'
    )
    .option(
      '--https <on|off>',
      'Use HTTPS (default: on)',
      'on'
    )
    .option(
      '--timeout <ms>',
      'Request timeout in milliseconds (default: 30000)',
      '30000'
    )
    .option(
      '--follow-redirects <on|off>',
      'Follow HTTP redirects (default: on)',
      'on'
    )
    .option(
      '--output <format>',
      'Output format: table, json, csv (default: table)',
      'table'
    )
    .option(
      '--verbose',
      'Enable verbose logging',
      false
    );

  return program;
}

module.exports = {
  setupCli,
};
