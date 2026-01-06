# word-stress

A command-line tool for stress-testing WordPress and WooCommerce sites.

## Overview

`word-stress` is a performance testing tool designed to identify bottlenecks, saturation points, and failure thresholds in WordPress and WooCommerce installations. It sends configurable parallel requests to measure server capacity and response degradation under load.

## Project Status

🚧 **In Development** - Currently in the requirements and design phase.

## Features (Planned)

- Configurable concurrent request testing
- Time-based and count-based test modes
- WordPress and WooCommerce specific test scenarios
- Real-time progress monitoring
- Comprehensive metrics collection (response times, error rates, throughput)
- Beautiful terminal output with tables and spinners
- Export results to JSON/CSV formats

## Installation

```bash
npm install
```

## Usage

```bash
# Basic front-page test (coming soon)
word-stress example.com

# WooCommerce AJAX test with 100 requests
word-stress --count=100 --wc-ajax=get_refreshed_fragments example.com

# Test local development site
word-stress --count=50 --https=off example.dev
```

See [dev-notes/02-stress-test-requirements.md](dev-notes/02-stress-test-requirements.md) for detailed usage examples and requirements.

## Documentation

- [docs/](./docs) - Public-facing documentation
- [dev-notes/](./dev-notes) - Development notes and requirements
- [.github/copilot-instructions.md](.github/copilot-instructions.md) - AI coding standards

## Development

### Dependencies

- **commander** - Command-line interface
- **inquirer** - Interactive prompts
- **chalk** - Terminal colors
- **ora** - Progress spinners
- **cli-table3** - Result tables
- **dotenv** - Environment configuration

### Contributing

See [.github/copilot-instructions.md](.github/copilot-instructions.md) for coding standards and best practices.

## License

MIT
