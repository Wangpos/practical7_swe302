import http from "k6/http";
import { check, sleep } from "k6";
import { Rate, Counter } from "k6/metrics";

// Custom metrics
const errorRate = new Rate("errors");
const totalRequests = new Counter("total_requests");
const failedRequests = new Counter("failed_requests");

export const options = {
  stages: [
    { duration: "30s", target: 10 }, // Start with 10 users (baseline)
    { duration: "10s", target: 200 }, // SPIKE! Jump to extremely high VUs (adjust based on your laptop capability)
    { duration: "1m", target: 200 }, // Maintain spike for 1 minute
    { duration: "30s", target: 10 }, // Drop back to baseline
    { duration: "30s", target: 0 }, // Ramp down to 0
  ],
  thresholds: {
    http_req_duration: ["p(95)<2000"], // More lenient during spike - 95% under 2s
    http_req_failed: ["rate<0.1"], // Allow up to 10% failure during spike
    errors: ["rate<0.15"], // Error rate can be higher during spike
  },
};

const BASE_URL = __ENV.BASE_URL || "http://localhost:3000";

export default function () {
  // Simplified user flow for spike test

  // 1. Homepage
  let response = http.get(BASE_URL);
  check(response, {
    "homepage responds": (r) => r.status === 200 || r.status === 503, // Accept 503 during spike
  }) || errorRate.add(1);

  if (response.status !== 200) {
    failedRequests.add(1);
  }
  totalRequests.add(1);
  sleep(1);

  // 2. Random dog API
  response = http.get(`${BASE_URL}/api/dogs`);
  check(response, {
    "dog API responds": (r) => r.status === 200 || r.status === 503,
    "response time reasonable": (r) => r.timings.duration < 5000, // 5s max during spike
  }) || errorRate.add(1);

  if (response.status !== 200) {
    failedRequests.add(1);
  }
  totalRequests.add(1);
  sleep(2);

  // 3. Breeds API (less frequent during spike)
  if (Math.random() < 0.5) {
    // Only 50% of users fetch breeds during spike
    response = http.get(`${BASE_URL}/api/dogs/breeds`);
    check(response, {
      "breeds API responds": (r) => r.status === 200 || r.status === 503,
    }) || errorRate.add(1);

    if (response.status !== 200) {
      failedRequests.add(1);
    }
    totalRequests.add(1);
  }

  sleep(1);
}

export function handleSummary(data) {
  console.log("========================================");
  console.log("SPIKE LOAD TEST SUMMARY");
  console.log("========================================");
  console.log(`Total Requests: ${data.metrics.total_requests.values.count}`);
  console.log(`Failed Requests: ${data.metrics.failed_requests.values.count}`);
  console.log(
    `Error Rate: ${(data.metrics.errors.values.rate * 100).toFixed(2)}%`
  );
  console.log("========================================");

  return {
    stdout: JSON.stringify(data, null, 2),
  };
}
