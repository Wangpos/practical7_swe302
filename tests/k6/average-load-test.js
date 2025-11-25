import http from "k6/http";
import { check, sleep } from "k6";
import { Rate, Trend, Counter } from "k6/metrics";

// Custom metrics
const errorRate = new Rate("errors");
const dogFetchTime = new Trend("dog_fetch_duration");
const totalRequests = new Counter("total_requests");

export const options = {
  stages: [
    { duration: "2m", target: 20 }, // Ramp up to 20 users over 2 minutes
    { duration: "5m", target: 20 }, // Stay at 20 users for 5 minutes (average load)
    { duration: "2m", target: 0 }, // Ramp down to 0 users
  ],
  thresholds: {
    http_req_duration: ["p(95)<500"], // 95% of requests should be below 500ms
    http_req_failed: ["rate<0.01"], // Less than 1% of requests should fail
    errors: ["rate<0.05"], // Error rate should be below 5%
    dog_fetch_duration: ["p(99)<1000"], // 99% of dog fetches under 1s
  },
};

const BASE_URL = __ENV.BASE_URL || "http://localhost:3000";

export default function () {
  // Simulate typical user behavior

  // 1. Visit homepage
  let response = http.get(BASE_URL);
  check(response, {
    "homepage status is 200": (r) => r.status === 200,
    "homepage loads quickly": (r) => r.timings.duration < 2000,
  }) || errorRate.add(1);
  totalRequests.add(1);
  sleep(2); // User reads the page

  // 2. Fetch breeds list
  response = http.get(`${BASE_URL}/api/dogs/breeds`);
  check(response, {
    "breeds status is 200": (r) => r.status === 200,
    "breeds has data": (r) => {
      try {
        const data = JSON.parse(r.body);
        return Object.keys(data.message).length > 0;
      } catch (e) {
        return false;
      }
    },
  }) || errorRate.add(1);
  totalRequests.add(1);
  sleep(1);

  // 3. Get random dog image
  const start = new Date().getTime();
  response = http.get(`${BASE_URL}/api/dogs`);
  const duration = new Date().getTime() - start;
  dogFetchTime.add(duration);

  check(response, {
    "random dog status is 200": (r) => r.status === 200,
    "random dog has message": (r) => {
      try {
        const data = JSON.parse(r.body);
        return data.message !== undefined;
      } catch (e) {
        return false;
      }
    },
  }) || errorRate.add(1);
  totalRequests.add(1);
  sleep(3); // User views the dog image

  // 4. Get specific breed (simulating dropdown selection)
  const breeds = [
    "husky",
    "corgi",
    "retriever",
    "bulldog",
    "poodle",
    "beagle",
    "shiba",
  ];
  const randomBreed = breeds[Math.floor(Math.random() * breeds.length)];
  response = http.get(`${BASE_URL}/api/dogs?breed=${randomBreed}`);

  check(response, {
    "specific breed status is 200": (r) => r.status === 200,
    "specific breed has message": (r) => {
      try {
        const data = JSON.parse(r.body);
        return data.message !== undefined;
      } catch (e) {
        return false;
      }
    },
  }) || errorRate.add(1);
  totalRequests.add(1);
  sleep(2); // User views the breed-specific image
}

export function handleSummary(data) {
  return {
    stdout: JSON.stringify(data, null, 2),
  };
}
