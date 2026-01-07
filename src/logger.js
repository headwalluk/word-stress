/**
 * Custom logger with configurable log levels
 * Respects LOG_LEVEL environment variable
 */

const LOG_LEVELS = {
  DEBUG: 0,
  INFO: 1,
  WARN: 2,
  ERROR: 3,
};

class Logger {
  constructor(level = 'INFO') {
    this.currentLevel = LOG_LEVELS[level.toUpperCase()] || LOG_LEVELS.INFO;
  }

  /**
   * Log an info message
   * @param {string} message
   */
  log(message) {
    if (this.currentLevel <= LOG_LEVELS.INFO) {
      console.log(message);
    }
  }

  /**
   * Log a debug message
   * @param {string} message
   */
  debug(message) {
    if (this.currentLevel <= LOG_LEVELS.DEBUG) {
      console.log(`[DEBUG] ${message}`);
    }
  }

  /**
   * Log a warning message
   * @param {string} message
   */
  warn(message) {
    if (this.currentLevel <= LOG_LEVELS.WARN) {
      console.warn(`[WARN] ${message}`);
    }
  }

  /**
   * Log an error message
   * @param {string} message
   */
  error(message) {
    if (this.currentLevel <= LOG_LEVELS.ERROR) {
      console.error(`[ERROR] ${message}`);
    }
  }
}

module.exports = new Logger(process.env.LOG_LEVEL || 'INFO');
