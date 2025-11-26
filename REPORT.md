# Performance Testing Report - Practical 7

**Student ID:** [Your Student ID]  
**Name:** [Your Name]  
**Date:** November 26, 2025  
**Application:** Dog CEO API Browser (Next.js)

---

## Table of Contents

1. [Executive Summary](#executive-summary)
2. [Test Environment](#test-environment)
3. [Test Criteria](#test-criteria)
4. [Test Results](#test-results)
   - [Average Load Test](#average-load-test)
   - [Spike Load Test](#spike-load-test)
   - [Stress Test](#stress-test)
   - [Soak Test](#soak-test)
5. [Performance Analysis](#performance-analysis)
6. [Recommendations](#recommendations)
7. [Conclusion](#conclusion)

---

## Executive Summary

This report presents the results of comprehensive performance testing conducted on the Dog CEO API Browser application using k6 load testing tool. Four different test scenarios were executed both locally and on Grafana Cloud to evaluate the application's performance under various conditions.

**Key Findings:**

- [To be filled after running tests]
- [Example: Application handles average load of 20 concurrent users efficiently]
- [Example: System shows degradation under extreme spike conditions]

---

## Test Environment

### Application Details

- **Application:** Dog CEO API Browser
- **Framework:** Next.js 16.0.0
- **Runtime:** Node.js [Your Node version]
- **Package Manager:** pnpm

### Test Environment Specifications

- **Operating System:** macOS [Your version]
- **Processor:** [Your processor, e.g., Apple M1/M2, Intel i7]
- **RAM:** [Your RAM, e.g., 16GB]
- **Network:** [Your network type, e.g., WiFi, Ethernet]

### Testing Tools

- **k6 Version:** [Your k6 version - run `k6 version`]
- **Testing Platform:**
  - Local execution via terminal
  - Cloud execution via Grafana Cloud k6
- **External API:** Dog CEO API (https://dog.ceo/dog-api/)

---

## Test Criteria

### Average Load Test

**Purpose:** Simulate typical production load to establish baseline performance metrics.

**Test Parameters:**

- **Duration:** 9 minutes total (2m ramp-up + 5m sustained + 2m ramp-down)
- **Virtual Users:** 20 concurrent users
- **Expected Response Time:** p(95) < 500ms
- **Expected Throughput:** ~80-100 requests per second
- **Error Rate Threshold:** < 1%

**Success Criteria:**

- ✅ 95% of requests complete in under 500ms
- ✅ Error rate below 1%
- ✅ All API endpoints remain accessible
- ✅ Response times remain consistent throughout test

---

### Spike Load Test

**Purpose:** Test system behavior under sudden traffic increases.

**Test Parameters:**

- **Duration:** 2.5 minutes total (30s baseline + 10s spike ramp + 1m sustained spike + 30s recovery)
- **Virtual Users:**
  - Baseline: 10 users
  - Spike: 200 users (or maximum your system can handle)
- **Expected Response Time:** p(95) < 2000ms
- **Expected Throughput:** Variable during spike
- **Error Rate Threshold:** < 10%

**Success Criteria:**

- ✅ System remains responsive during spike
- ✅ Error rate stays below 10%
- ✅ System recovers after spike
- ✅ No complete service outages

---

### Stress Test

**Purpose:** Push system beyond normal operating capacity to find breaking points.

**Test Parameters:**

- **Duration:** 12 minutes total (progressive load increase)
- **Virtual Users:** Progressive increase: 30 → 60 → 90 → 120 users
- **Expected Response Time:** p(90) < 3000ms
- **Expected Throughput:** Decreases as load increases
- **Error Rate Threshold:** < 20%

**Success Criteria:**

- ✅ System handles at least 90 concurrent users
- ✅ 90% of requests complete within 3 seconds
- ✅ Graceful degradation (not catastrophic failure)
- ✅ Error rate remains below 20%

---

### Soak Test

**Purpose:** Identify memory leaks and performance degradation over extended periods.

**Test Parameters:**

- **Duration:** 40 minutes total (5m ramp-up + 30m sustained + 5m ramp-down)
- **Virtual Users:** 25 concurrent users (constant)
- **Expected Response Time:** p(95) < 800ms (should remain stable)
- **Expected Throughput:** Consistent throughout test
- **Error Rate Threshold:** < 2%

**Success Criteria:**

- ✅ Response times remain stable over 30 minutes
- ✅ No gradual performance degradation
- ✅ Memory usage remains stable
- ✅ Error rate stays consistently low (< 2%)

---

## Test Results

### Average Load Test

#### Local Execution Results

**Screenshot:**
![Average Load Test - Local Terminal](screenshots/average-load-local.png)

**Key Metrics:** [Fill in after running test]

```
Total Duration: ____
Virtual Users: ____
Total Requests: ____
Failed Requests: ____
Error Rate: ____%

Response Time Metrics:
- Average: ____ms
- Median: ____ms
- p(90): ____ms
- p(95): ____ms
- p(99): ____ms
- Max: ____ms

Throughput: ____ requests/second
```

**Analysis:**
[Describe the results - did it meet expectations? Any issues?]

---

#### Grafana Cloud Execution Results

**Screenshot:**
![Average Load Test - Grafana Cloud](screenshots/average-load-cloud.png)

**Key Observations:**
[Describe any differences from local execution, graphs, trends]

**Grafana Insights:**

- [Describe performance graphs]
- [Note any anomalies]
- [Compare with local results]

---

### Spike Load Test

#### Local Execution Results

**Screenshot:**
![Spike Load Test - Local Terminal](screenshots/spike-load-local.png)

**Key Metrics:** [Fill in after running test]

```
Total Duration: ____
Peak Virtual Users: ____
Total Requests: ____
Failed Requests: ____
Error Rate: ____%

Response Time During Spike:
- Average: ____ms
- p(95): ____ms
- p(99): ____ms
- Max: ____ms

System Behavior:
- Spike Impact: [Describe]
- Recovery Time: ____
```

**Analysis:**
[How did the system handle the spike? Did it recover? What failed?]

---

#### Grafana Cloud Execution Results

**Screenshot:**
![Spike Load Test - Grafana Cloud](screenshots/spike-load-cloud.png)

**Key Observations:**
[Describe spike behavior in Grafana graphs]

**Spike Analysis:**

- [Peak performance impact]
- [Recovery patterns]
- [Failure modes if any]

---

### Stress Test

#### Local Execution Results

**Screenshot:**
![Stress Test - Local Terminal](screenshots/stress-test-local.png)

**Key Metrics:** [Fill in after running test]

```
Total Duration: ____
Peak Virtual Users: ____
Total Requests: ____
Failed Requests: ____
Error Rate: ____%

Breaking Point Analysis:
- System stable up to ____ users
- Degradation starts at ____ users
- Breaking point at ____ users

Response Time Progression:
- 30 VUs: p(90) = ____ms
- 60 VUs: p(90) = ____ms
- 90 VUs: p(90) = ____ms
- 120 VUs: p(90) = ____ms
```

**Analysis:**
[At what point did the system start to fail? What were the symptoms?]

---

#### Grafana Cloud Execution Results

**Screenshot:**
![Stress Test - Grafana Cloud](screenshots/stress-test-cloud.png)

**Key Observations:**
[Describe the progressive degradation visible in graphs]

**Capacity Analysis:**

- [Maximum sustainable capacity]
- [Performance degradation patterns]
- [Resource bottlenecks identified]

---

### Soak Test

#### Local Execution Results

**Screenshot:**
![Soak Test - Local Terminal](screenshots/soak-test-local.png)

**Key Metrics:** [Fill in after running test]

```
Total Duration: 40 minutes
Virtual Users: 25 (constant)
Total Requests: ____
Failed Requests: ____
Error Rate: ____%

Response Time Stability:
- First 10 mins avg: ____ms
- Middle 10 mins avg: ____ms
- Last 10 mins avg: ____ms

Memory Leak Indicators:
- Response time trend: [Stable/Increasing/Decreasing]
- Error rate trend: [Stable/Increasing/Decreasing]
```

**Analysis:**
[Was performance stable? Any signs of memory leaks or degradation?]

---

#### Grafana Cloud Execution Results

**Screenshot:**
![Soak Test - Grafana Cloud](screenshots/soak-test-cloud.png)

**Key Observations:**
[Describe long-term performance trends from Grafana]

**Stability Analysis:**

- [Response time consistency]
- [Memory usage patterns]
- [Any degradation over time]

---

## Performance Analysis

### Overall System Performance

**Strengths:**

- [List what the application does well]
- [Example: Fast response times under normal load]
- [Example: Good error handling]

**Weaknesses:**

- [List areas of concern]
- [Example: Poor performance under spike conditions]
- [Example: Memory leak detected in soak test]

**Bottlenecks Identified:**

1. [Bottleneck 1 - e.g., External API latency]
2. [Bottleneck 2 - e.g., Database connection pool]
3. [Bottleneck 3 - e.g., Memory management]

---

### Comparison: Local vs Cloud Execution

| Test Type    | Local Performance | Cloud Performance | Variance   |
| ------------ | ----------------- | ----------------- | ---------- |
| Average Load | [p95: ___ms]      | [p95: ___ms]      | [+/- ___%] |
| Spike Load   | [p95: ___ms]      | [p95: ___ms]      | [+/- ___%] |
| Stress       | [p90: ___ms]      | [p90: ___ms]      | [+/- ___%] |
| Soak         | [p95: ___ms]      | [p95: ___ms]      | [+/- ___%] |

**Analysis:**
[Discuss why there might be differences between local and cloud execution]

---

### Performance Metrics Summary

| Metric              | Target  | Average Load | Spike Load | Stress Test | Soak Test |
| ------------------- | ------- | ------------ | ---------- | ----------- | --------- |
| p(95) Response Time | < 500ms | \_\_\_ms     | \_\_\_ms   | \_\_\_ms    | \_\_\_ms  |
| Error Rate          | < 1%    | \_\_%        | \_\_%      | \_\_%       | \_\_%     |
| Success Rate        | > 99%   | \_\_%        | \_\_%      | \_\_%       | \_\_%     |
| Max VUs Handled     | N/A     | 20           | \_\_\_     | \_\_\_      | 25        |

---

## Recommendations

### Immediate Actions

1. **[Recommendation 1]**

   - Issue: [Describe the problem]
   - Solution: [Proposed fix]
   - Priority: High/Medium/Low

2. **[Recommendation 2]**
   - Issue: [Describe the problem]
   - Solution: [Proposed fix]
   - Priority: High/Medium/Low

### Long-term Improvements

1. **[Improvement 1]**

   - Benefit: [Expected improvement]
   - Effort: [Implementation complexity]

2. **[Improvement 2]**
   - Benefit: [Expected improvement]
   - Effort: [Implementation complexity]

### Capacity Planning

- **Current Capacity:** System handles \_\_\_ concurrent users reliably
- **Recommended Capacity:** Should be scaled to handle \_\_\_ concurrent users
- **Scaling Strategy:** [Horizontal/Vertical scaling recommendations]

---

## Conclusion

### Summary of Findings

[Provide 2-3 paragraph summary of overall performance testing results]

### Test Objectives Achievement

- ✅/❌ Average load performance meets requirements
- ✅/❌ System handles spike loads adequately
- ✅/❌ Stress test identified breaking points
- ✅/❌ No memory leaks detected in soak test

### Final Remarks

[Your concluding thoughts on the application's performance and readiness]

---

## Appendix

### Test Execution Commands

**Local Tests:**

```bash
pnpm test:k6:average   # Average load test
pnpm test:k6:spike     # Spike load test
pnpm test:k6:stress    # Stress test
pnpm test:k6:soak      # Soak test (30 minutes)
```

**Cloud Tests:**

```bash
pnpm test:k6:cloud:average   # Average load test on Grafana Cloud
pnpm test:k6:cloud:spike     # Spike load test on Grafana Cloud
pnpm test:k6:cloud:stress    # Stress test on Grafana Cloud
pnpm test:k6:cloud:soak      # Soak test on Grafana Cloud
```

### References

- k6 Documentation: https://k6.io/docs/
- Load Testing Types: https://grafana.com/load-testing/types-of-load-testing/
- Dog CEO API: https://dog.ceo/dog-api/
- Grafana Cloud k6: https://grafana.com/docs/k6/latest/k6-cloud/
