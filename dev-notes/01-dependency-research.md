# Dependency Research for word-stress CLI

## Command-Line Argument Parsing

### Commander.js
- **Package**: `commander`
- **Latest**: v14.0.2
- **Description**: The complete solution for Node.js command-line programs
- **Use Case**: Industry standard, simple API, excellent for subcommands
- **GitHub**: https://github.com/tj/commander.js
- **Pros**: Mature, widely adopted, simple API
- **Cons**: Less interactive features out of the box

### Yargs
- **Package**: `yargs`
- **Latest**: v18.0.0
- **Description**: Pirate-themed successor to optimist
- **Use Case**: Advanced parsing, automatic help generation, interactive CLI
- **GitHub**: https://github.com/yargs/yargs
- **Pros**: Very feature-rich, great validation, builder pattern
- **Cons**: Larger API surface

**Recommendation**: Start with **Commander.js** for simplicity, or **Yargs** if we need complex validation and interactive features.

---

## Interactive Prompts

### Inquirer.js
- **Package**: `inquirer`
- **Latest**: v13.1.0
- **Description**: Collection of common interactive command line user interfaces
- **Use Case**: Asking users for input, confirmations, selections
- **GitHub**: https://github.com/SBoudrias/Inquirer.js
- **Features**: Text input, password, confirm, list, checkbox, etc.

**Recommendation**: Essential for interactive configuration setup.

---

## Terminal Output & Styling

### Chalk
- **Package**: `chalk`
- **Description**: Terminal string styling with colors
- **Use Case**: Colored output for errors, warnings, success messages
- **Note**: Check latest version (not in truncated results)

### Ora
- **Package**: `ora`
- **Latest**: v9.0.0
- **Description**: Elegant terminal spinner
- **Use Case**: Show progress during long-running operations
- **GitHub**: https://github.com/sindresorhus/ora
- **Features**: Multiple spinner styles, color support, text updates

### CLI Table 3
- **Package**: `cli-table3`
- **Latest**: v0.6.5
- **Description**: Pretty unicode tables for the command line
- **Use Case**: Display test results, metrics in tabular format
- **GitHub**: https://github.com/cli-table/cli-table3

**Recommendation**: Use all three - **chalk** for colors, **ora** for spinners, **cli-table3** for result tables.

---

## Configuration & Environment

### Dotenv
- **Package**: `dotenv`
- **Description**: Load environment variables from .env file
- **Use Case**: Development configuration management
- **Note**: Standard for environment variable loading

**Recommendation**: Essential for our centralized config approach.

---

## HTTP Client (for WordPress/WooCommerce testing)

### Axios
- **Package**: `axios`
- **Description**: Promise-based HTTP client
- **Use Case**: Making requests to WordPress/WooCommerce sites
- **Pros**: Interceptors, automatic JSON parsing, request/response transformation

### Got
- **Package**: `got`
- **Description**: Human-friendly and powerful HTTP request library
- **Pros**: Smaller, modern, better TypeScript support

### Undici
- **Package**: `undici`
- **Description**: HTTP/1.1 client from Node.js core team
- **Pros**: Very fast, becoming standard in Node.js

**Recommendation**: **Axios** for familiarity and feature set, or **Got** for modern approach.

---

## Logging

### Winston
- **Package**: `winston`
- **Description**: Multi-transport async logging library
- **Use Case**: Structured logging with different levels and outputs
- **Features**: Multiple transports, log levels, formatting

### Pino
- **Package**: `pino`
- **Description**: Very low overhead Node.js logger
- **Pros**: Extremely fast, JSON logging

**Recommendation**: **Winston** for features, **Pino** for performance.

---

## Final Decision Stack

```json
{
  "dependencies": {
    "commander": "^14.0.2",
    "inquirer": "^13.1.0",
    "chalk": "^5.x.x",
    "ora": "^9.0.0",
    "cli-table3": "^0.6.5",
    "dotenv": "^16.x.x"
  }
}
```

### Decisions Made:

✅ **commander** - Most popular, simple API  
✅ **inquirer** - Interactive prompts  
✅ **chalk** - Colored output  
✅ **ora** - Spinners/progress  
✅ **cli-table3** - Result tables  
✅ **dotenv** - Environment variables  
✅ **Node's Fetch API** - Built-in HTTP (no axios unless needed)  
✅ **Custom logger** - Simple wrapper around console.log/error (no winston/pino)

This gives us:
- Command parsing (commander)
- Interactive prompts (inquirer)
- Beautiful output (chalk, ora, cli-table3)
- Configuration (dotenv)
- HTTP requests (built-in Fetch API)
- Logging (custom implementation)
