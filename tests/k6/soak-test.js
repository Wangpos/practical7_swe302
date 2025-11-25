import http from "k6/http";
import { check, sleep } from "k6";
import { Rate, Trend, Counter, Gauge } from "k6/metrics";

// Custom metrics for soak test
const errorRate = new Rate("errors");
const memoryDegradation = new Trend("response_time_trend");
const totalRequests = new Counter("total_requests");
const successRate = new Rate("success_rate");
const currentResponseTime = new Gauge("current_avg_response_time");

export const options = {
  stages: [
    { duration: "5m", target: 25 }, // Ramp up to 25 users over 5 minutes
    { duration: "30m", target: 25 }, // Maintain 25 users for 30 minutes (soak period)
    { duration: "5m", target: 0 }, // Graceful ramp down
  ],
  thresholds: {
    http_req_duration: ["p(95)<800"], // Should remain consistent - 95% under 800ms
    http_req_failed: ["rate<0.02"], // Very low failure rate - under 2%
    errors: ["rate<0.05"], // Error rate should stay low
    response_time_trend: ["p(99)<1500"], // Check for degradation over time
  },
};

const BASE_URL = __ENV.BASE_URL || "http://localhost:3000";

// Track response times over test duration to detect memory leaks
let responseTimes = [];

export default function () {
  // Realistic user journey - repeated over 30 minutes to find memory leaks

  // 1. Homepage visit
  const start1 = new Date().getTime();
  let response = http.get(BASE_URL);
  const duration1 = new Date().getTime() - start1;

  memoryDegradation.add(duration1);
  responseTimes.push(duration1);

  const success1 = check(response, {
    "homepage status 200": (r) => r.status === 200,
    "homepage loads consistently": (r) => r.timings.duration < 2000,
  });

  successRate.add(success1);
  if (!success1) errorRate.add(1);
  totalRequests.add(1);
  sleep(3); // Realistic user reading time

  // 2. Browse breeds
  const start2 = new Date().getTime();
  response = http.get(`${BASE_URL}/api/dogs/breeds`);
  const duration2 = new Date().getTime() - start2;

  memoryDegradation.add(duration2);

  const success2 = check(response, {
    "breeds API status 200": (r) => r.status === 200,
    "breeds response stable": (r) => r.timings.duration < 1000,
    "breeds data complete": (r) => {
      try {
        const data = JSON.parse(r.body);
        return Object.keys(data.message).length > 0;
      } catch (e) {
        return false;
      }
    },
  });

  successRate.add(success2);
  if (!success2) errorRate.add(1);
  totalRequests.add(1);
  sleep(2);

  // 3. Get random dog (most frequent action)
  const start3 = new Date().getTime();
  response = http.get(`${BASE_URL}/api/dogs`);
  const duration3 = new Date().getTime() - start3;

  memoryDegradation.add(duration3);

  const success3 = check(response, {
    "random dog status 200": (r) => r.status === 200,
    "random dog response stable": (r) => r.timings.duration < 1000,
    "has valid dog image": (r) => {
      try {
        const data = JSON.parse(r.body);
        return data.message && data.message.includes(".jpg");
      } catch (e) {
        return false;
      }
    },
  });

  successRate.add(success3);
  if (!success3) errorRate.add(1);
  totalRequests.add(1);
  sleep(4); // User enjoys the dog picture

  // 4. Get specific breed (periodically)
  if (Math.random() < 0.7) {
    // 70% of iterations include breed-specific request
    const breeds = [
      "husky",
      "corgi",
      "retriever",
      "bulldog",
      "poodle",
      "beagle",
      "shiba",
      "akita",
    ];
    const randomBreed = breeds[Math.floor(Math.random() * breeds.length)];

    const start4 = new Date().getTime();
    response = http.get(`${BASE_URL}/api/dogs?breed=${randomBreed}`);
    const duration4 = new Date().getTime() - start4;

    memoryDegradation.add(duration4);

    const success4 = check(response, {
      "breed-specific status 200": (r) => r.status === 200,
      "breed-specific stable": (r) => r.timings.duration < 1200,
    });

    successRate.add(success4);
    if (!success4) errorRate.add(1);
    totalRequests.add(1);
    sleep(3);
  }

  // Calculate and report average response time periodically
  if (responseTimes.length >= 10) {
    const avg = responseTimes.reduce((a, b) => a + b, 0) / responseTimes.length;
    currentResponseTime.add(avg);
    responseTimes = []; // Reset for next batch
  }
}

export function handleSummary(data) {
  console.log("========================================");
  console.log("SOAK TEST SUMMARY (30 MINUTES)");
  console.log("========================================");
  console.log(
    `Test Duration: 40 minutes (5m ramp-up + 30m soak + 5m ramp-down)`
  );
  console.log(`Constant Load: 25 VUs`);
  console.log(`Total Requests: ${data.metrics.total_requests.values.count}`);
  console.log(
    `Success Rate: ${(data.metrics.success_rate.values.rate * 100).toFixed(2)}%`
  );
  console.log(
    `Error Rate: ${(data.metrics.errors.values.rate * 100).toFixed(2)}%`
  );
  console.log(
    `Avg Response Time: ${data.metrics.response_time_trend.values.avg.toFixed(
      2
    )}ms`
  );
  console.log(
    `P95 Response Time: ${data.metrics.response_time_trend.values[
      "p(95)"
    ].toFixed(2)}ms`
  );
  console.log(
    `P99 Response Time: ${data.metrics.response_time_trend.values[
      "p(99)"
    ].toFixed(2)}ms`
  );
  console.log("");
  console.log("Check for memory leaks:");
  console.log("- Response times should remain stable throughout test");
  console.log("- Error rate should not increase over time");
  console.log("- Success rate should remain consistently high");
  console.log("========================================");

  return {
    stdout: JSON.stringify(data, null, 2),
  };
}
