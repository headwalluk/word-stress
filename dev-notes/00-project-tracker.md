# word-stress Project Tracker

## Overview

Building a stress-testing CLI tool for WordPress/WooCommerce. Two core test modes:
1. **Steady-State**: Multiple clients polling at fixed intervals
2. **Burst**: Simultaneous requests to measure peak capacity

See `.instructions.md` for architecture and design decisions.

---

## Milestones

### Phase 1: Project Setup ✅ COMPLETE
- [x] Initialize Git repository
- [x] Create package.json
- [x] Set up directory structure
- [x] Create AI instruction files (.github/copilot-instructions.md)
- [x] Define core architecture (.instructions.md)
- [x] Select dependencies (decision: commander, chalk, ora, cli-table3, dotenv, Fetch API, custom logger)

### Phase 2: CLI Framework & Infrastructure ✅ COMPLETE
- [x] Set up npm dependencies
- [x] Create src/ directory structure
- [x] Implement centralized config module (src/config.js)
- [x] Implement custom logger (src/logger.js)
- [x] Set up CLI with commander (src/cli/commands.js)
- [x] Implement --help and --version
- [x] Test parameter parsing and validation
- [x] Create bin/wordstress executable
- [x] Update package.json with bin entry and Node version requirement
- [x] Create placeholder modules for phases 3-7
- [x] Update README.md with correct usage examples

### Phase 3: HTTP Client & Request Handling ✅ COMPLETE
- [x] Implement HTTP client with Fetch API (src/http/client.js)
- [x] Handle GET and POST requests
- [x] Implement timeout handling with AbortController
- [x] Implement error classification (network, timeout, HTTP errors)
- [x] Handle redirects (configurable follow-redirects parameter)
- [x] Response size tracking from Content-Length
- [x] Response time measurement
- [x] Tested against local WordPress site (http://leyland.local/)

### Phase 4: Metrics Collection Engine ✅ COMPLETE
- [x] Implement MetricsCollector class (src/metrics/MetricsCollector.js)
- [x] Per-request metrics: response time, status code, size, errors
- [x] Aggregate metrics: min/max/avg/median/percentiles
- [x] Calculate throughput (req/s)
- [x] Track data transferred
- [x] Tested metrics calculations with sample data

### Phase 5: Steady-State Test Mode ✅ COMPLETE
- [x] Implement SteadyStateTestMode class
  - [x] run(config, client) async method
  - [x] Client spawning and scheduling
  - [x] Interval-based request timing (config.interval)
  - [x] Duration tracking (config.duration)
  - [x] Integration with MetricsCollector
  - [x] Signal handling (graceful shutdown)
- [x] Integration tests (tested against http://leyland.local/)

### Phase 6: Burst Test Mode ✅ COMPLETE
- [x] Implement BurstTestMode class
  - [x] run(config, client) async method
  - [x] Simultaneous request launching (config.burstClients)
  - [x] Promise.all() for concurrent handling
  - [x] Error tracking during burst
  - [x] Integration with MetricsCollector
- [x] Integration tests (tested against http://leyland.local/)

### Phase 7: Output Formatters ✅ COMPLETE
- [x] Implement TableFormatter (src/formatters/TableFormatter.js) - Default output
  - [x] Uses cli-table3 for formatted ASCII tables
  - [x] Summary table with key metrics
  - [x] Response times table with percentiles
  - [x] Status codes table with distribution
  - [x] Errors table (if any errors occurred)
- [x] Implement JsonFormatter (src/formatters/JsonFormatter.js)
  - [x] Pretty-printed JSON with 2-space indentation
  - [x] All metrics included for programmatic parsing
- [x] Implement CsvFormatter (src/formatters/CsvFormatter.js)
  - [x] CSV format for spreadsheet import
  - [x] Proper field escaping for special characters
  - [x] Metric,Value structure for easy parsing
- [x] Formatter factory (src/formatters/factory.js) - Working
- [x] Test all formatters with sample data

### Phase 8: End-to-End Integration
- [x] Wire all components together (src/main.js)
- [x] Test default behavior: `wordstress example.com`
- [x] Test steady-state with parameters
- [x] Test burst mode
- [x] Test all output formats (table, json, csv)
- [x] Test error handling
- [x] User agent support integrated

### Phase 9: Testing & Polish
- [ ] Unit test suite for all modules
- [ ] Integration test suite
- [ ] Manual testing against real WordPress site
- [ ] Documentation updates
- [ ] Error message refinement

### Phase 10: Future Enhancements (Deferred)
- [ ] Live progress display with ora spinners
- [ ] Spike-and-decay test mode
- [ ] Authentication support
- [ ] Results database and comparison

---

## Current Sprint

### Active Tasks (Phase 9)
- [ ] Write unit tests for core modules (utils, metrics, user-agent)
- [ ] Write integration tests for test modes
- [ ] Manual testing with different parameter combinations
- [ ] Performance and edge case testing
- [ ] Documentation refinement

### Quick Wins Available
- [ ] Create formatter factory (selects between formatters)
- [ ] Create test mode factory (selects between test modes)
- [ ] Wire main.js to instantiate and call test modes
- [ ] Add utility module for common functions (percentile calculation, etc.)
- [ ] Scaffold MetricsCollector with core data structures

---

## Detailed Todo Checklist

### Phase 2: CLI Framework & Infrastructure

#### Setup Tasks
- [ ] Install npm dependencies:
  - commander, chalk, ora, cli-table3, dotenv
- [ ] Create src/ directory structure per .instructions.md
- [ ] Create bin/wordstress executable file
- [ ] Update package.json with bin entry and scripts

#### Core Modules
- [ ] src/config.js - Centralized configuration
  - Load and validate command-line parameters
  - Apply defaults
  - Export config object
- [ ] src/logger.js - Custom logger
  - Implement log() method (respects LOG_LEVEL)
  - Implement error() method
  - Support LOG_LEVEL env var
- [ ] src/cli/commands.js - Commander setup
  - Define main command and parameters
  - Validate required arguments (domain)
  - Parse mode (steady-state vs burst)
  - Validate parameter combinations
  - Route to main.js
- [ ] src/cli/help.js - Help text (optional, commander auto-generates)

#### Validation & Testing
- [ ] Test config loading with various parameter combinations
- [ ] Test logger with different LOG_LEVELs
- [ ] Test CLI parameter parsing
- [ ] Test --help output
- [ ] Test --version output
- [ ] Test invalid parameter combinations (e.g., burst without --burst-clients)

### Phase 3: HTTP Client & Request Handling

#### HTTP Client Implementation
- [ ] src/http/client.js - Fetch API wrapper
  - makeRequest(url, options) - GET/POST
  - Handle response.ok (2xx-3xx)
  - Parse response headers for content-length
  - Handle timeouts (use AbortController)
  - Classify errors: network, timeout, HTTP error
  - Return structured response object
- [ ] Handle redirects (follow-redirects parameter)
- [ ] Request start/end time tracking (for metrics)

#### Error Classification
- [ ] Network errors → "Network Error" type
- [ ] Fetch abort → "Timeout" type
- [ ] HTTP errors (4xx, 5xx) → Include status code

#### Testing
- [ ] Mock fetch for unit tests
- [ ] Test successful requests
- [ ] Test timeout behavior
- [ ] Test redirect following
- [ ] Test error classification

### Phase 4: Metrics Collection Engine

#### MetricsCollector Implementation
- [ ] src/metrics/MetricsCollector.js class
  - recordRequest(responseTime, statusCode, size, error)
  - getAggregateMetrics() - Returns summary
  - Per-request tracking (array of results)
  - Percentile calculation (P50/median, P95, P99)
  - Status code counting (2xx, 4xx, 5xx, timeouts)
  - Throughput calculation (requests/sec)
  - Data transferred (bytes)

#### Metrics Calculations
- [ ] Min response time
- [ ] Max response time
- [ ] Average response time
- [ ] Median response time
- [ ] P95 percentile
- [ ] P99 percentile
- [ ] Success rate (2xx count / total)
- [ ] Error rate
- [ ] Timeout rate
- [ ] Requests per second (total / duration)
- [ ] Total data transferred

#### Testing
- [ ] Unit tests for percentile calculations
- [ ] Unit tests for aggregate calculations
- [ ] Edge cases (single request, all timeouts, etc.)
- [ ] Large dataset performance

### Phase 5: Steady-State Test Mode

#### SteadyStateTestMode Implementation
- [ ] src/test-modes/SteadyStateTestMode.js class
  - run() method - Returns Promise<results>
  - Spawn N clients
  - Each client: request → wait for interval → repeat
  - Track elapsed time
  - Stop after duration expires
  - Collect metrics using MetricsCollector

#### Client Scheduling
- [ ] Implement interval timing (account for response time)
- [ ] Each client independent loop
- [ ] Parallel execution of clients
- [ ] Graceful shutdown after duration

#### Integration
- [ ] Connect to HTTP client for requests
- [ ] Connect to MetricsCollector for tracking
- [ ] Pass parameters (clients, interval, duration, endpoint, method)
- [ ] Return aggregated results

#### Testing
- [ ] Unit test with mocked HTTP
- [ ] Verify correct number of requests
- [ ] Verify interval timing
- [ ] Verify duration tracking
- [ ] Integration test with real HTTP

### Phase 6: Burst Test Mode

#### BurstTestMode Implementation
- [ ] src/test-modes/BurstTestMode.js class
  - run() method - Returns Promise<results>
  - Launch N simultaneous requests
  - Wait for all to complete
  - Collect metrics
  - Return results

#### Concurrent Request Handling
- [ ] Use Promise.all() to wait for all requests
- [ ] Measure time-to-first-response
- [ ] Track individual response times
- [ ] Handle partial failures gracefully

#### Integration
- [ ] Connect to HTTP client
- [ ] Connect to MetricsCollector
- [ ] Pass parameters (burst-clients, endpoint, method)
- [ ] Return aggregated results

#### Testing
- [ ] Unit test with mocked HTTP
- [ ] Verify all requests sent simultaneously
- [ ] Verify correct number of requests
- [ ] Integration test with real HTTP

### Phase 7: Output Formatters

#### TableFormatter
- [ ] src/formatters/TableFormatter.js
  - Format test configuration header
  - Status code distribution table (2xx, 4xx, 5xx, timeouts)
  - Response time statistics table
  - Throughput metrics display
  - Use cli-table3 for tables
  - Use chalk for colors

#### JsonFormatter
- [ ] src/formatters/JsonFormatter.js
  - Export all metrics as JSON
  - Include test configuration
  - Pretty-print for readability

#### CsvFormatter
- [ ] src/formatters/CsvFormatter.js
  - CSV format for spreadsheet import
  - Headers: metric_name, value
  - One metric per row

#### Formatter Factory
- [ ] src/formatters/factory.js
  - getFormatter(format) - returns appropriate formatter
  - Default: TableFormatter

#### Testing
- [ ] Test each formatter with sample metrics
- [ ] Verify output format correctness
- [ ] Test with edge cases (zero requests, all errors, etc.)

### Phase 8: End-to-End Integration

#### Main Application
- [ ] src/main.js
  - Parse CLI arguments
  - Load configuration
  - Validate parameters
  - Select test mode (steady-state vs burst)
  - Run test mode
  - Collect metrics
  - Select formatter
  - Output results

#### Default Behavior
- [ ] `wordstress example.com` → Steady-state with defaults
  - 5 clients, 1000ms interval, 60 second duration

#### Integration Testing
- [ ] End-to-end test: default behavior
- [ ] End-to-end test: steady-state with parameters
- [ ] End-to-end test: burst mode
- [ ] End-to-end test: different output formats
- [ ] Error handling: invalid domain
- [ ] Error handling: invalid parameters

### Phase 9: Testing & Polish

#### Comprehensive Testing
- [ ] Unit test suite (all modules)
- [ ] Integration test suite
- [ ] Manual testing against real site
- [ ] Error message review
- [ ] Output formatting review

#### Documentation
- [ ] Update README.md with usage examples
- [ ] Add examples for each test mode
- [ ] Document all parameters
- [ ] Document output formats

### Phase 10: Future Enhancements

- [ ] Live progress display (deferred)
- [ ] Spike-and-decay test mode (deferred)
- [ ] Authentication support (deferred)
- [ ] Custom request headers/body (deferred)

---

## Implementation Notes

### Configuration Approach
- Centralize all config in src/config.js
- Load from CLI args and .env
- Apply defaults
- Validate required values
- Export single config object

### Metrics Strategy
- Don't store full response bodies
- Calculate percentiles incrementally where possible
- Keep only summary statistics in memory
- Stream results to output

### Error Handling
- Continue on individual request failures
- Track error types and counts
- Report error patterns
- Never abort test due to errors

### Testing Strategy
1. Unit tests with mocked dependencies
2. Integration tests with real components
3. Manual testing with real WordPress/WooCommerce

---

## Key Files & Modules

| File | Purpose |
|------|---------|
| bin/wordstress | CLI executable entry point |
| src/main.js | Application orchestration |
| src/config.js | Centralized configuration |
| src/logger.js | Custom logger |
| src/cli/commands.js | Commander.js CLI setup |
| src/http/client.js | HTTP request handling |
| src/metrics/MetricsCollector.js | Metrics aggregation |
| src/test-modes/SteadyStateTestMode.js | Steady-state test implementation |
| src/test-modes/BurstTestMode.js | Burst test implementation |
| src/formatters/TableFormatter.js | Console table output |
| src/formatters/JsonFormatter.js | JSON export |
| src/formatters/CsvFormatter.js | CSV export |

---

## Success Criteria

✅ Phase 1: Architecture and dependencies defined and documented  
⏳ Phase 2-8: All modules implemented and integrated  
⏳ Phase 9: Comprehensive testing completed  

Software ready for use when all phases complete and manual testing validates behavior.
