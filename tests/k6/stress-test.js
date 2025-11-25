import http from "k6/http";
import { check, sleep } from "k6";
import { Rate, Trend, Counter } from "k6/metrics";

// Custom metrics
const errorRate = new Rate("errors");
const responseTime = new Trend("custom_response_time");
const totalRequests = new Counter("total_requests");
const successfulRequests = new Counter("successful_requests");

export const options = {
  stages: [
    { duration: "1m", target: 30 }, // Ramp up to 30 users
    { duration: "2m", target: 60 }, // Increase to 60 users
    { duration: "2m", target: 90 }, // Push to 90 users (stress level)
    { duration: "2m", target: 120 }, // Beyond normal capacity - 120 users
    { duration: "3m", target: 120 }, // Maintain stress for 3 minutes
    { duration: "2m", target: 0 }, // Ramp down (recovery test)
  ],
  thresholds: {
    http_req_duration: ["p(90)<3000"], // More lenient - 90% under 3s
    http_req_failed: ["rate<0.2"], // Allow up to 20% failure under stress
    errors: ["rate<0.25"], // Higher error tolerance
    custom_response_time: ["p(95)<4000"], // 95% under 4s
  },
};

const BASE_URL = __ENV.BASE_URL || "http://localhost:3000";

export default function () {
  // Full user journey under stress

  // 1. Homepage access
  const startTime = new Date().getTime();
  let response = http.get(BASE_URL, {
    timeout: "10s", // Longer timeout for stress conditions
  });

  let duration = new Date().getTime() - startTime;
  responseTime.add(duration);

  check(response, {
    "homepage accessible": (r) => r.status === 200,
    "homepage not too slow": (r) => r.timings.duration < 5000,
  }) || errorRate.add(1);

  if (response.status === 200) {
    successfulRequests.add(1);
  }
  totalRequests.add(1);
  sleep(1);

  // 2. API endpoint - breeds
  response = http.get(`${BASE_URL}/api/dogs/breeds`, {
    timeout: "10s",
  });

  check(response, {
    "breeds API works": (r) => r.status === 200,
    "breeds data valid": (r) => {
      try {
        const data = JSON.parse(r.body);
        return data.message && typeof data.message === "object";
      } catch (e) {
        return false;
      }
    },
  }) || errorRate.add(1);

  if (response.status === 200) {
    successfulRequests.add(1);
  }
  totalRequests.add(1);
  sleep(1);

  // 3. Random dog image
  response = http.get(`${BASE_URL}/api/dogs`, {
    timeout: "10s",
  });

  check(response, {
    "random dog API works": (r) => r.status === 200,
    "has dog image URL": (r) => {
      try {
        const data = JSON.parse(r.body);
        return data.message && data.message.includes("http");
      } catch (e) {
        return false;
      }
    },
  }) || errorRate.add(1);

  if (response.status === 200) {
    successfulRequests.add(1);
  }
  totalRequests.add(1);
  sleep(2);

  // 4. Specific breed requests (varied load)
  const breeds = ["husky", "corgi", "retriever", "bulldog", "poodle"];
  const randomBreed = breeds[Math.floor(Math.random() * breeds.length)];

  response = http.get(`${BASE_URL}/api/dogs?breed=${randomBreed}`, {
    timeout: "10s",
  });

  check(response, {
    "breed-specific API works": (r) => r.status === 200,
  }) || errorRate.add(1);

  if (response.status === 200) {
    successfulRequests.add(1);
  }
  totalRequests.add(1);
  sleep(1);
}

export function handleSummary(data) {
  console.log("========================================");
  console.log("STRESS TEST SUMMARY");
  console.log("========================================");
  console.log(`Duration: 5 minutes`);
  console.log(`Peak VUs: 120`);
  console.log(`Total Requests: ${data.metrics.total_requests.values.count}`);
  console.log(
    `Successful Requests: ${data.metrics.successful_requests.values.count}`
  );
  console.log(
    `Error Rate: ${(data.metrics.errors.values.rate * 100).toFixed(2)}%`
  );
  console.log(
    `Avg Response Time: ${data.metrics.custom_response_time.values.avg.toFixed(
      2
    )}ms`
  );
  console.log("========================================");

  return {
    stdout: JSON.stringify(data, null, 2),
  };
}
