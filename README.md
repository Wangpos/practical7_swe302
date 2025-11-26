# Practical 7: Performance Testing with k6

Dog CEO API Browser - A Next.js application with comprehensive performance testing.

## Project Overview

This project demonstrates performance testing using k6 on a Next.js application that integrates with the Dog CEO API. The application allows users to browse random dog images and filter by breed.

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- pnpm package manager
- k6 installed ([Installation Guide](https://grafana.com/docs/k6/latest/set-up/install-k6/))

### Installation

```bash
# Install dependencies
pnpm install

# Run development server
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

---

## Performance Testing

### Test Scenarios Implemented

This project includes 4 comprehensive load testing scenarios as per Practical 7 requirements:

1. **Average Load Test** - Simulates typical production traffic
![alt text](<screenshots/Average Load Test.png>)
![alt text](<screenshots/Average Load Test2.png>)

2. **Spike Load Test** - Tests system resilience under sudden traffic spikes
![alt text](<screenshots/Spike Load Test.png>)
![alt text](<screenshots/Spike Load Test2.png>)

3. **Stress Test** - Identifies breaking points by pushing beyond capacity
![alt text](<screenshots/Stress Test.png>)

4. **Soak Test** - Detects memory leaks over extended periods (30 minutes)
![alt text](<screenshots/Soak Test.png>)

### Test Criteria

#### 1. Average Load Test

- **Duration:** 9 minutes (2m ramp-up + 5m sustained + 2m ramp-down)
- **Virtual Users:** 20 concurrent users
- **Target Response Time:** p(95) < 500ms
- **Target Error Rate:** < 1%
- **Expected Throughput:** 80-100 requests/second
- **Purpose:** Establish baseline performance metrics

#### 2. Spike Load Test

- **Duration:** 2.5 minutes with sudden spike
- **Virtual Users:** 10 → 200 (spike) → 10
- **Target Response Time:** p(95) < 2000ms during spike
- **Target Error Rate:** < 10%
- **Purpose:** Test system behavior under sudden traffic increases
- **Note:** VU count adjusted based on system capacity

#### 3. Stress Test

- **Duration:** 12 minutes with progressive load increase
- **Virtual Users:** Progressive: 30 → 60 → 90 → 120
- **Target Response Time:** p(90) < 3000ms
- **Target Error Rate:** < 20%
- **Purpose:** Find the breaking point and system limits
- **Expected Outcome:** Identify maximum sustainable capacity

#### 4. Soak Test

- **Duration:** 40 minutes (5m ramp-up + 30m sustained + 5m ramp-down)
- **Virtual Users:** 25 concurrent users (constant)
- **Target Response Time:** p(95) < 800ms (must remain stable)
- **Target Error Rate:** < 2%
- **Purpose:** Detect memory leaks and long-term stability issues
- **Key Metric:** Response time consistency over 30 minutes

---

## Running Tests

### Local Execution

```bash
# Individual tests
pnpm test:k6:average    # Average load test (~9 minutes)
pnpm test:k6:spike      # Spike load test (~2.5 minutes)
pnpm test:k6:stress     # Stress test (~12 minutes)
pnpm test:k6:soak       # Soak test (~40 minutes)

# Other available tests
pnpm test:k6:smoke      # Quick smoke test
pnpm test:k6:api        # API endpoint test
pnpm test:k6:page       # Page load test
pnpm test:k6:concurrent # Concurrent users test
```

### Grafana Cloud Execution

**Prerequisites:**

1. Create a Grafana Cloud account
2. Authenticate k6: `k6 cloud login --token $TOKEN`
3. Set BASE_URL environment variable (use ngrok for local testing)

```bash
# Cloud tests
pnpm test:k6:cloud:average    # Average load test on cloud
pnpm test:k6:cloud:spike      # Spike load test on cloud
pnpm test:k6:cloud:stress     # Stress test on cloud
pnpm test:k6:cloud:soak       # Soak test on cloud
```
![alt text](<screenshots/pnpm test:k6:cloud:average.png>)
![alt text](<screenshots/pnpm test:k6:cloud:spike.png>)
![alt text](<screenshots/pnpm test:k6:cloud:stress.png>)
![alt text](<screenshots/pnpm test:k6:cloud:soak.png>)

**Using ngrok for cloud tests:**

```bash
# In one terminal - start your app
pnpm dev

# In another terminal - expose via ngrok
ngrok http 3000

# Update BASE_URL in test files with ngrok URL
# Then run cloud tests
```

---

## Performance Metrics

### Key Metrics Tracked

| Metric                | Description             | Target            |
| --------------------- | ----------------------- | ----------------- |
| **http_req_duration** | Total request time      | p(95) < 500-800ms |
| **http_req_failed**   | Failed request rate     | < 1-2%            |
| **http_req_waiting**  | Server processing time  | < 200ms           |
| **iterations**        | Completed user journeys | Maximize          |
| **throughput**        | Requests per second     | 80-100 rps        |

### Custom Metrics

Each test implements custom metrics for detailed analysis:

- `errors` - Custom error rate tracking
- `dog_fetch_duration` - Specific API endpoint performance
- `response_time_trend` - Degradation detection (soak test)
- `total_requests` - Overall request count
- `success_rate` - Percentage of successful operations

---

## Expected Performance Benchmarks

Based on typical Next.js application performance with external API integration:

### Under Normal Load (20 VUs)

- **Homepage:** < 300ms average response time
- **API Endpoints:** < 200ms average response time
- **Error Rate:** < 0.5%
- **Throughput:** 80-100 req/s

### Under Spike Load (200 VUs)

- **Response Time:** May increase to 1000-1500ms
- **Error Rate:** Should stay below 10%
- **Recovery:** System should stabilize within 30s after spike

### Breaking Point (Stress Test)

- **Expected Limit:** 90-120 concurrent users
- **Degradation:** Gradual increase in response times
- **Failure Mode:** Increased timeouts, 503 errors

### Long-term Stability (Soak Test)

- **Response Time Drift:** < 10% over 30 minutes
- **Memory Leaks:** None expected (response times should be stable)
- **Error Rate:** Should remain consistently low (< 2%)

---

## Project Structure

```
practical7_performance-testing/
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   └── dogs/          # Dog API endpoints
│   │   ├── page.tsx           # Main application page
│   │   └── layout.tsx
├── tests/
│   └── k6/
│       ├── average-load-test.js    # Average load scenario
│       ├── spike-load-test.js      # Spike load scenario
│       ├── stress-test.js          # Stress test scenario
│       ├── soak-test.js            # Soak test scenario (30 min)
│       ├── smoke-test.js           # Basic smoke test
│       ├── api-endpoint-test.js    # API testing
│       ├── page-load-test.js       # Page load testing
│       └── concurrent-users-test.js # Concurrent user simulation
├── screenshots/                # Test result screenshots
│   └── README.md              # Screenshot guide
├── REPORT.md                  # Performance testing report
├── package.json
└── README.md
```

---

## Submission Requirements

### Part 1: Test Execution (Both Local & Cloud)

- ✅ Average Load Test (local + cloud screenshots)
- ✅ Spike Load Test (local + cloud screenshots)
- ✅ Stress Test (local + cloud screenshots)
- ✅ Soak Test (local + cloud screenshots)

### Part 2: Documentation

- ✅ Complete `REPORT.md` with all test results
- ✅ Screenshots in `screenshots/` directory
- ✅ Test criteria defined (this README)
- ✅ Analysis and recommendations in report

### Part 3: Application

- ✅ Working Next.js application
- ✅ All test scripts functional
- ✅ Clean code and proper structure

---

## Important Notes

### Before Running Tests

1. **Start your application:**

   ```bash
   pnpm dev
   ```

2. **Verify k6 installation:**

   ```bash
   k6 version
   ```

3. **For spike test:** Adjust VU count in `spike-load-test.js` based on your system's capacity

4. **For soak test:** Allocate 40 minutes for completion

### Taking Screenshots

- **Local tests:** Capture full terminal output including summary
- **Cloud tests:** Capture Grafana dashboard with graphs and metrics
- **Save in:** `screenshots/` directory with descriptive names
- See `screenshots/README.md` for detailed instructions

### Tips for Success

- Run smoke test first to verify everything works
- Start with lower VU counts and increase gradually
- Monitor your system resources during tests
- Document any issues or unexpected behavior
- Compare local vs cloud results in your report

---

## Resources

- [k6 Documentation](https://k6.io/docs/)
- [Load Testing Types](https://grafana.com/load-testing/types-of-load-testing/)
- [Dog CEO API](https://dog.ceo/dog-api/)
- [Grafana Cloud k6](https://grafana.com/docs/k6/latest/k6-cloud/)
- [Next.js Documentation](https://nextjs.org/docs)

---

## License

This project is for educational purposes as part of SWE302 Practical 7.
