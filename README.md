# word-stress

A command-line tool for stress-testing WordPress and WooCommerce sites.

## Overview

`word-stress` is a performance testing tool designed to identify bottlenecks, saturation points, and failure thresholds in WordPress and WooCommerce installations. It sends configurable parallel requests to measure server capacity and response degradation under load.

## Project Status

✅ **Version 1.0.0** - Feature complete and production ready!

## Features

- ✅ Steady-state load testing with multiple concurrent clients
- ✅ Burst capacity testing with simultaneous requests
- ✅ Configurable intervals, durations, and timeouts
- ✅ WordPress and WooCommerce endpoint testing (GET/POST/PUT/DELETE/PATCH)
- ✅ Comprehensive metrics: response times, percentiles (P95, P99), throughput, success rate
- ✅ Realistic user agent support (Chrome, Firefox, Safari, or custom)
- ✅ Beautiful ASCII table output
- ✅ JSON and CSV export formats
- ✅ HTTP/HTTPS with redirect handling
- ✅ Request timeout support
- ✅ Detailed error classification and tracking

## Installation

```bash
npm install
```

## Usage

### Steady-State Testing
Tests with multiple parallel clients making periodic requests.

```bash
# Default: 5 clients, 1000ms interval, 60 second duration
./bin/wordstress example.com

# 10 clients with 500ms interval
./bin/wordstress --clients=10 --interval=500 example.com

# WooCommerce AJAX endpoint
./bin/wordstress --clients=20 --interval=1000 \
  --endpoint='/?wc-ajax=get_refreshed_fragments' --method=POST example.com

# Test local development site without HTTPS
./bin/wordstress --clients=5 --https=off example.dev
```

### Burst Testing
Tests with many simultaneous requests to measure peak capacity.

```bash
# 50 simultaneous requests
./bin/wordstress --mode=burst --burst-clients=50 example.com

# 1000 simultaneous AJAX requests
./bin/wordstress --mode=burst --burst-clients=1000 \
  --endpoint='/?wc-ajax=get_refreshed_fragments' --method=POST example.com
```

### Output Formats

```bash
# Pretty table output (default)
./bin/wordstress example.com

# JSON export
./bin/wordstress --output=json example.com

# CSV export
./bin/wordstress --output=csv example.com
```

### Help

```bash
./bin/wordstress --help
./bin/wordstress --version
```

See [dev-notes/02-stress-test-requirements.md](dev-notes/02-stress-test-requirements.md) for detailed usage examples and requirements.

## Documentation

- [docs/](./docs) - Public-facing documentation
- [dev-notes/](./dev-notes) - Development notes and requirements
- [.github/copilot-instructions.md](.github/copilot-instructions.md) - AI coding standards

## Development

### Dependencies

- **commander** - Command-line interface
- **chalk** - Terminal colors
- **ora** - Progress spinners
- **cli-table3** - Result tables
- **dotenv** - Environment configuration

### Node Version

Requires Node.js 21 or greater for Fetch API support.

### Project Structure

- `src/` - Source code (config, CLI setup, HTTP client, metrics, test modes, formatters)
- `bin/` - Executable entry point
- `dev-notes/` - Development notes and requirements
- [.instructions.md](.instructions.md) - Project architecture and design decisions

### Contributing

See [.github/copilot-instructions.md](.github/copilot-instructions.md) for coding standards and best practices.

## License

MIT
