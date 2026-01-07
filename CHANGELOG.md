# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.1.0] - 2026-01-07

### Added
- Progress indicator with elapsed time for long-running tests using ora spinner
- Better UX feedback during test execution
- Automatic progress updates every 500ms showing elapsed time vs total duration

### Changed
- All CLI help text now references `word-stress` instead of `wordstress` for consistency
- Updated ESLint configuration to match renamed binary

## [1.0.0] - 2026-01-07

### Added - Phase 1: Project Setup
- Initial project scaffolding with proper directory structure
- Git repository initialization with comprehensive .gitignore
- npm package configuration with Node.js 21+ requirement
- AI instruction files (.github/copilot-instructions.md, .instructions.md)

### Added - Phase 2: CLI Framework
- Commander.js CLI with full parameter parsing and validation
- Centralized configuration module with environment variable support
- Custom logger with LOG_LEVEL support
- Comprehensive help and version output
- All CLI parameters: clients, interval, duration, mode, burst-clients, endpoint, method, https, timeout, follow-redirects, output, verbose

### Added - Phase 3: HTTP Client
- Native Fetch API HTTP client with timeout handling (AbortController)
- Request methods: GET, POST, PUT, DELETE, PATCH
- Error classification: network errors, timeouts, HTTP errors
- Response size tracking and calculation
- Response time measurement in milliseconds
- Redirect handling support

### Added - Phase 4: Metrics Collection
- MetricsCollector class with per-request and aggregate metrics
- Response time statistics: min, max, average, median, P95, P99
- Status code distribution tracking (2xx, 3xx, 4xx, 5xx)
- Error tracking and classification
- Throughput calculation (requests/second)
- Data transferred measurement
- Success rate calculation

### Added - Phase 5: Steady-State Test Mode
- Multiple concurrent clients with independent request scheduling
- Fixed interval-based request timing (configurable milliseconds)
- Duration-based testing (configurable seconds)
- Graceful handling of timing and request synchronization
- Full integration with HTTP client and metrics collection

### Added - Phase 6: Burst Test Mode
- Simultaneous request launching with Promise.all()
- Peak capacity measurement
- Concurrent request handling without timing constraints
- Error tracking during burst loads

### Added - Phase 7: Output Formatters
- TableFormatter: Beautiful ASCII tables using cli-table3
  - Summary metrics table
  - Response time statistics table with percentiles
  - Status code distribution table
  - Error details table (when applicable)
- JsonFormatter: Pretty-printed JSON output for programmatic parsing
- CsvFormatter: CSV format with proper escaping for spreadsheet import

### Added - User Agent Support
- Browser presets: Firefox, Chrome, Safari with realistic user agent strings
- Custom user agent support via --user-agent parameter
- user-agents npm package for up-to-date browser user agents
- Proper User-Agent header in all HTTP requests

### Added - Code Quality
- ESLint with recommended rules for Node.js
- Prettier for automatic code formatting
- npm scripts: format, format:check, lint, lint:fix, test, audit
- All code passing linting and formatting standards
- Zero security vulnerabilities

### Added - Documentation
- Comprehensive README with usage examples
- Portable Node.js CLI development standards in .github/copilot-instructions.md
- Architecture and design documentation in .instructions.md
- Project tracker in dev-notes/00-project-tracker.md

### Testing
- Tested against local WordPress installation (http://leyland.local/)
- Burst testing: 90+ req/s throughput with 100% success rate
- Steady-state testing: Proper interval-based scheduling verified
- All three output formats tested and working
- User agent headers verified in server access logs

[1.0.0]: https://github.com/headwalluk/word-stress/releases/tag/v1.0.0
