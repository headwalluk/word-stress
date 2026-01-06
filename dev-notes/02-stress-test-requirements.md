# Stress Test Requirements

## Project Goal

Build a command-line tool for stress testing WordPress & WooCommerce sites by sending multiple parallel requests to identify performance bottlenecks, saturation points, and failure thresholds.

## Core Objectives

1. **Load Testing**: Hit a website with configurable parallel requests
2. **Saturation Detection**: Identify when a server becomes saturated (slow responses, errors)
3. **Time-based Testing**: Run tests over extended periods (e.g., 60 seconds) to observe degradation
4. **Metrics Collection**: Track response times, status codes, errors, throughput
5. **WordPress/WooCommerce Focus**: Support common WordPress/WooCommerce endpoints and scenarios

## Use Cases

### Typical Failure Patterns

- First 20 seconds: All requests return HTTP 200 with normal response times
- Next 10 seconds: Exponential increase in response time
- After 30 seconds: Timeout errors and 502 Bad Gateway responses

**Goal**: Identify these breaking points and visualize the degradation.

## Command Syntax (Draft)

### Basic Usage

```bash
# Test the front page HTML-fetch with standard parameters
./bin/wordstress example.com

# Test WooCommerce, with 100 empty POST requests
# This sets up 100 POST requests to
# 'https://example.com/?wc-ajax=get_refreshed_fragments'
./bin/wordstress --count=100 example.com

# Test a local dev site (non-https)
./bin/wordstress --count=50 --https=off example.com
```

## Parameters to Explore

### Essential Parameters

- **Domain/URL**: Target site to test
- **--count**: Total number of requests to send (default: 10?)
- **--concurrent**: Number of parallel/concurrent requests (default: 1?)
- **--duration**: Run test for X seconds (alternative to --count)
- **--rate**: Requests per second (e.g., 10 req/s for 60 seconds)
- **--https**: Enable/disable HTTPS (default: on)

### Test Type Parameters

- **--type**: Test type (homepage, woocommerce, custom, etc.)
- **--endpoint**: Custom endpoint/path to test
- **--method**: HTTP method (GET, POST, etc.)
- **--body**: Request body for POST requests
- **--headers**: Custom headers

### WooCommerce Specific

- **--wc-ajax**: Target WooCommerce AJAX endpoint
- **--wc-cart**: Simulate cart operations
- **--wc-checkout**: Simulate checkout flow

### Advanced Options

- **--ramp-up**: Gradually increase load over time
- **--timeout**: Request timeout in ms (default: 30000)
- **--follow-redirects**: Follow redirects (default: true)
- **--auth**: Basic auth credentials

## Test Scenarios

### 1. Homepage Load Test
```bash
wordstress --concurrent=10 --duration=60 example.com
```
- 10 parallel requests continuously for 60 seconds
- Tests front-page caching and server capacity

### 2. WooCommerce Fragment Request
```bash
wordstress --concurrent=20 --count=500 --wc-ajax=get_refreshed_fragments example.com
```
- 500 total requests, 20 at a time
- Tests WooCommerce AJAX performance (common bottleneck)

### 3. Ramp-up Test
```bash
wordstress --ramp-up=1-100 --duration=60 example.com
```
- Start with 1 concurrent request, ramp up to 100 over 60 seconds
- Identifies saturation point

### 4. Sustained Load
```bash
wordstress --rate=10 --duration=120 example.com
```
- 10 requests per second for 2 minutes
- Tests sustained load handling

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

### Real-time Progress Display

```
Testing: https://example.com
Duration: 60s | Concurrent: 10 | Rate: 10 req/s

Progress: ████████████░░░░░░░░ 60% (360/600)
Elapsed: 36s | Remaining: 24s

Current:
  Response Time: 245ms (avg)
  Requests/sec: 9.8
  Success Rate: 100%
  Errors: 0

[spinner] Running...
```

### Final Summary Report

```
═══════════════════════════════════════════════════════
  Stress Test Results
═══════════════════════════════════════════════════════

Target: https://example.com
Test Duration: 60.2s
Total Requests: 600
Concurrency: 10

┌─────────────────────┬──────────────┐
│ Metric              │ Value        │
├─────────────────────┼──────────────┤
│ Successful (2xx)    │ 580 (96.7%)  │
│ Client Error (4xx)  │ 0 (0%)       │
│ Server Error (5xx)  │ 15 (2.5%)    │
│ Timeouts            │ 5 (0.8%)     │
│ Network Errors      │ 0 (0%)       │
└─────────────────────┴──────────────┘

Response Times (ms):
┌─────────┬─────────┐
│ Min     │ 89      │
│ Max     │ 3421    │
│ Avg     │ 245     │
│ Median  │ 198     │
│ P95     │ 567     │
│ P99     │ 1234    │
└─────────┴─────────┘

Throughput: 9.95 req/s
Data Transferred: 12.4 MB

Status: ⚠️  WARNING - Error rate above threshold
```

### Optional Export Formats

- JSON: `--output=json` - Machine-readable results
- CSV: `--output=csv` - For spreadsheet analysis
- Detailed log: `--verbose` - All request/response details

## Implementation Considerations

### Request Management

1. **Concurrency Control**: Limit parallel requests to avoid overwhelming client
2. **Rate Limiting**: Implement precise rate control (requests/second)
3. **Queue Management**: Queue requests and dispatch based on concurrency limits

### Timing Strategies

**Option A: Count-based**
- Send exactly N requests
- May complete quickly or slowly depending on response times

**Option B: Duration-based**
- Run for exactly X seconds
- Number of requests varies based on server performance

**Option C: Rate-based**
- Send X requests per second for Y seconds
- Total requests = X * Y

**Recommendation**: Support all three modes, with rate-based as the most useful for real-world testing.

### Load Ramping

- Start with low concurrency
- Gradually increase to target concurrency
- Helps identify the breaking point
- Example: 1→10→20→50→100 concurrent over 60 seconds

### Error Handling

- Distinguish between network errors, timeouts, and HTTP errors
- Continue testing on errors (don't abort)
- Track error patterns over time

### Memory Management

- For long tests with many requests, avoid storing all response data
- Stream metrics to output
- Keep only essential data in memory

## Questions to Resolve

1. **Default behavior**: What happens when you just run `wordstress example.com`?
   - Suggestion: 10 requests, 1 concurrent, measure and report
   
2. **Concurrency vs Rate**: Should these be mutually exclusive or work together?
   - Suggestion: --rate implies duration-based, --concurrent implies count-based
   
3. **Progress display**: Live updating terminal UI vs simple progress bar?
   - Suggestion: Use ora spinner + periodic updates
   
4. **Results storage**: Should we save results to a file by default?
   - Suggestion: Display to terminal, optionally save with --output flag
   
5. **Authentication**: How to handle WordPress login/authentication?
   - Suggestion: Start with basic auth, add cookie support later

## Next Steps

1. Define the exact CLI interface with commander
2. Design the core test engine architecture
3. Implement request queue and concurrency control
4. Build metrics collection system
5. Create output formatters (terminal, JSON, CSV)
6. Add WordPress/WooCommerce specific features
