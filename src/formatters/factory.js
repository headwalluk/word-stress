/**
 * Formatter Factory
 * Selects and returns the appropriate formatter based on output format
 */

const TableFormatter = require('./TableFormatter');
const JsonFormatter = require('./JsonFormatter');
const CsvFormatter = require('./CsvFormatter');

/**
 * Get formatter by name
 * @param {string} format - Format name: 'table', 'json', or 'csv'
 * @returns {Object} Formatter with format() method
 * @throws {Error} if format is not recognized
 */
function getFormatter(format) {
  switch (format.toLowerCase()) {
    case 'table':
      return TableFormatter;
    case 'json':
      return JsonFormatter;
    case 'csv':
      return CsvFormatter;
    default:
      throw new Error(`Unknown format: ${format}. Valid formats: table, json, csv`);
  }
}

module.exports = {
  getFormatter,
};
