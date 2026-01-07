/**
 * User Agent resolver
 * Translates browser names to realistic user agent strings
 */

const UserAgent = require('user-agents');

/**
 * Get a user agent string based on browser preference
 *
 * @param {string} browser - Browser name: firefox, chrome, safari, or null for default
 * @returns {string} User agent string
 */
function getUserAgent(browser = 'chrome') {
  const ua = new UserAgent();

  switch (browser) {
    case 'firefox':
      return ua.toString({ ua: 'Firefox' });
    case 'chrome':
      return ua.toString({ ua: 'Chrome' });
    case 'safari':
      return ua.toString({ ua: 'Safari' });
    default:
      return ua.toString();
  }
}

/**
 * Get a custom user agent or default based on browser preference
 *
 * @param {Object} config - Configuration object
 * @param {string} config.customUserAgent - Custom UA string (takes precedence)
 * @param {string} config.browser - Browser name (firefox, chrome, safari)
 * @returns {string} User agent string
 */
function resolveUserAgent(config) {
  // Custom UA takes precedence
  if (config.customUserAgent) {
    return config.customUserAgent;
  }

  // Use browser preference, default to chrome
  const browser = config.browser || 'chrome';
  return getUserAgent(browser);
}

module.exports = {
  getUserAgent,
  resolveUserAgent,
};
