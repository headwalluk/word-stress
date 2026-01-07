# Stress Test Requirements

## Project Goal

Build a command-line tool for stress testing WordPress & WooCommerce sites by sending multiple parallel requests to identify performance bottlenecks, saturation points, and failure thresholds.

## Core Objectives

The tool measures two critical performance metrics:

1. **Steady-State Throughput**: Maximum sustained request rate with multiple parallel clients polling periodically
   - Identifies how many concurrent users a site can handle sustainably
   - Measures response times, errors, and throughput under constant load
   
2. **Burst Capacity**: Maximum instantaneous load the server can handle
   - Measures how many simultaneous requests can be processed
   - Identifies timeout rates and response degradation under spike loads

Both tests focus on WordPress/WooCommerce endpoints (homepage, AJAX endpoints, etc.)

## Use Cases

### Typical Failure Patterns

- First 20 seconds: All requests return HTTP 200 with normal response times
- Next 10 seconds: Exponential increase in response time
- After 30 seconds: Timeout errors and 502 Bad Gateway responses

**Goal**: Identify these breaking points and visualize the degradation.

## Command Syntax (Draft)

### Steady-State Testing
Tests with multiple parallel clients making periodic requests at a fixed interval.

```bash
# Default: 5 parallel clients, 1000ms interval, 60 second duration
./bin/wordstress example.com

# 10 parallel clients, 500ms interval (20 req/sec per client), 60 seconds
./bin/wordstress --clients=10 --interval=500 example.com

# 20 parallel clients polling a WooCommerce AJAX endpoint
./bin/wordstress --clients=20 --interval=1000 \
  --endpoint='/?wc-ajax=get_refreshed_fragments' \
  --method=POST example.com

# Test with HTTPS disabled (local dev site)
./bin/wordstress --clients=5 --interval=1000 --https=off example.dev
```

### Burst Testing
Tests with many simultaneous requests to measure peak instantaneous capacity.

```bash
# Burst: 50 simultaneous requests to homepage
./bin/wordstress --mode=burst --burst-clients=50 example.com

# Burst: 1000 simultaneous POST requests to WooCommerce AJAX
./bin/wordstress --mode=burst --burst-clients=1000 \
  --endpoint='/?wc-ajax=get_refreshed_fragments' \
  --method=POST example.com
```

## Parameters

### Steady-State Mode (Default)

- **Domain/URL**: Target site to test (required)
- **--clients**: Number of parallel clients (default: 5)
- **--interval**: Milliseconds between each client's requests (default: 1000)
- **--duration**: Test duration in seconds (default: 60)
- **--endpoint**: URL path/endpoint to test (default: `/`)
- **--method**: HTTP method (default: GET)
- **--https**: Enable/disable HTTPS (default: on)

### Burst Mode

- **--mode=burst**: Enable burst testing (sends simultaneous requests once)
- **--burst-clients**: Number of simultaneous requests (required for burst mode)
- **--endpoint**: URL path/endpoint to test (default: `/`)
- **--method**: HTTP method (default: GET)
- **--https**: Enable/disable HTTPS (default: on)

### Optional Parameters

- **--timeout**: Request timeout in ms (default: 30000)
- **--follow-redirects**: Follow redirects (default: true)
- **--output**: Output format (default: table | options: json, csv)

## Test Scenarios

### Steady-State Examples

**Example 1: Default baseline test**
```bash
wordstress example.com
# 5 clients × 60 requests (1000ms interval × 60s) = 300 total requests
```

**Example 2: WooCommerce steady-state performance**
```bash
wordstress --clients=5 --interval=500 \
  --endpoint='/?wc-ajax=get_refreshed_fragments' --method=POST example.com
# 5 clients × 120 requests (500ms interval × 60s) = 600 total requests
```

**Example 3: Increasing load scenarios (run multiple tests)**
```bash
# Light load
wordstress --clients=5 --interval=1000 example.com

# Medium load
wordstress --clients=10 --interval=1000 example.com

# Heavy load
wordstress --clients=20 --interval=1000 example.com

# Extreme load
wordstress --clients=100 --interval=1000 example.com
```

### Burst Examples

**Example 1: Homepage burst capacity**
```bash
wordstress --mode=burst --burst-clients=50 example.com
# 50 simultaneous GET requests, measure response times and failures
```

**Example 2: Increasing burst tests**
```bash
wordstress --mode=burst --burst-clients=50 example.com
wordstress --mode=burst --burst-clients=100 example.com
wordstress --mode=burst --burst-clients=1000 example.com
# Identify breaking point where timeouts/errors increase
```

**Example 3: WooCommerce AJAX burst**
```bash
wordstress --mode=burst --burst-clients=500 \
  --endpoint='/?wc-ajax=get_refreshed_fragments' --method=POST example.com
```

## Metrics to Collect

### Request-Level Metrics
- Response time (ms)
- Status code
- Response size (bytes)
- Time to first byte (TTFB)
- DNS lookup time
- Connection time
- TLS handshake time

### Aggregate Metrics
- Total requests sent
- Successful requests (2xx)
- Failed requests (4xx, 5xx)
- Timeout errors
- Network errors
- Min/Max/Average/Median/P95/P99 response times
- Requests per second (actual throughput)
- Total data transferred
- Test duration

### Time-Series Data
- Response times over time (identify degradation patterns)
- Error rate over time
- Throughput over time

## Output Format

### Console Output (Default: Pretty Tables)

Results displayed as formatted tables showing:
- Status code distribution (2xx, 4xx, 5xx, timeouts)
- Response time statistics (min, max, avg, median, P95, P99)
- Throughput metrics (requests per second, total data transferred)
- Test configuration summary

**Example:**
```
═══════════════════════════════════════════════════════
  Stress Test Results
═══════════════════════════════════════════════════════

Target: https://example.com
Test Mode: Steady-State
Duration: 60.2s
Clients: 5
Interval: 1000ms
Total Requests: 300

┌─────────────────────┬──────────────┐
│ Metric              │ Value        │
├─────────────────────┼──────────────┤
│ Successful (2xx)    │ 298 (99.3%)  │
│ Client Error (4xx)  │ 0 (0%)       │
│ Server Error (5xx)  │ 2 (0.7%)     │
│ Timeouts            │ 0 (0%)       │
└─────────────────────┴──────────────┘

Response Times (ms):
┌─────────┬──────────┐
│ Min     │ 89       │
│ Max     │ 2156     │
│ Avg     │ 245      │
│ Median  │ 198      │
│ P95     │ 567      │
│ P99     │ 1234     │
└─────────┴──────────┘

Throughput: 4.98 req/s
Data Transferred: 2.1 MB
```

### JSON Export

```bash
wordstress --output=json example.com
```

Machine-readable format for importing into analysis tools or spreadsheets.

### CSV Export

```bash
wordstress --output=csv example.com
```

For spreadsheet analysis and comparing multiple test runs.

## Implementation Considerations

### Steady-State Request Scheduling

Each client independently:
1. Makes a request
2. Waits for response (or timeout)
3. Waits until the interval has elapsed since the start of step 1
4. Repeats until duration expires

For example, with `--clients=5 --interval=1000 --duration=60`:
- 5 clients run in parallel
- Each client makes a request every ~1000ms
- The test runs for approximately 60 seconds
- Approximate total requests: 300 (5 clients × 60 requests)

### Burst Request Management

1. Launch all `--burst-clients` requests simultaneously
2. Measure response times and status codes
3. Record any timeouts or errors
4. Report aggregate metrics

### Metrics Collection

**Per-Request:**
- Response time (ms)
- HTTP status code
- Response size (bytes)
- Error type (timeout, network error, etc.)

**Aggregate:**
- Total requests sent
- Successful responses by status code (2xx, 4xx, 5xx)
- Timeout count
- Response time percentiles (min, max, avg, median, P95, P99)
- Requests per second (actual throughput)
- Total data transferred

### Memory Management

- Stream results to output as data arrives
- Keep only summary statistics in memory
- Don't store full response bodies (unless debugging)

### Error Handling

- Continue testing even if individual requests fail
- Track and report error types: network errors, timeouts, HTTP errors
- Distinguish between client-side issues (timeouts) and server errors (5xx)

## Questions Resolved

| # | Question | Decision |
|---|----------|----------|
| 1 | Default behavior? | Run steady-state with 5 clients, 1000ms interval, 60 second duration |
| 2 | Concurrency vs Rate? | Adjust via `--clients` and `--interval` parameters in steady-state mode |
| 3 | Live progress display? | Start simple: output final results as pretty tables. Enhance UI in future version. |
| 4 | Results storage? | Display to terminal by default. Optional JSON/CSV export with `--output`. Future: save results with annotations for comparison. |
| 5 | Authentication? | Defer for now. Test AJAX endpoints that don't require login. Add auth support later. |

## Future Enhancements

### High Priority
- Live updating progress display during test execution
- Real-time metrics dashboard with graphs
- Results database with comparison/annotation capabilities
- **Spike-and-decay test mode** (Phase 3): Simulate traffic spikes that gradually tail off
  - Example: Start with burst of requests, then decay over time while settling into higher steady-state load
  - Useful for simulating real-world traffic patterns (e.g., flash sales, viral content spikes)
  - Parameters: `--mode=spike-decay --peak-clients=1000 --decay-duration=300 --steady-clients=50`

### Medium Priority
- Authentication support (basic auth, cookies, session tokens)
- Custom request headers and bodies
- Ramp-up load testing (gradually increase concurrent clients)
- Load ramping tests (identify saturation point)

### Low Priority
- Plugin/scenario support for complex test workflows
- Request body templating and parameterization
