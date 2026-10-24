import http from 'k6/http';
import { check, sleep, group } from 'k6';

// ========================================================
// Placera Load Test Scenario (k6)
// Defines SLO targets and measures Golden Signals:
// - Latency (p95 < 250ms, p99 < 500ms)
// - Traffic (up to 50 concurrent virtual users)
// - Errors (error rate < 1%)
// ========================================================

export const options = {
  stages: [
    { duration: '30s', target: 10 }, // Ramp-up
    { duration: '1m', target: 50 },  // Sustained load (SLO measurement window)
    { duration: '15s', target: 0 },  // Ramp-down
  ],
  thresholds: {
    // SLO: 95% of requests must complete below 250ms
    http_req_duration: ['p(95)<250', 'p(99)<500'],
    // SLO: Error rate must be strictly under 1%
    http_req_failed: ['rate<0.01'],
  },
};

const BASE_URL = __ENV.BASE_URL || 'http://localhost:8080';

export default function () {
  group('Health & Monitoring Checks', function () {
    const healthRes = http.get(`${BASE_URL}/actuator/health`);
    check(healthRes, {
      'Actuator health is UP': (r) => r.status === 200 && r.json('status') === 'UP',
    });
  });

  group('Public Company & Job Browsing', function () {
    const jobsRes = http.get(`${BASE_URL}/api/jobs?size=10`);
    check(jobsRes, {
      'Jobs list returned 200': (r) => r.status === 200,
      'Jobs list is successful': (r) => r.json('success') === true,
    });

    const companiesRes = http.get(`${BASE_URL}/api/companies`);
    check(companiesRes, {
      'Companies list returned 200': (r) => r.status === 200,
    });
  });

  group('Student Authentication Flow', function () {
    const loginPayload = JSON.stringify({
      email: 'rohan.sharma@placera.edu',
      password: 'StudentPass#2026!',
    });

    const loginRes = http.post(`${BASE_URL}/api/auth/login`, loginPayload, {
      headers: { 'Content-Type': 'application/json' },
    });

    const loginSuccess = check(loginRes, {
      'Login returned 200': (r) => r.status === 200,
      'Token is present': (r) => r.json('data.token') !== undefined,
    });

    if (loginSuccess) {
      const token = loginRes.json('data.token');
      const authHeaders = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      };

      // Authenticated student profile fetch
      const profileRes = http.get(`${BASE_URL}/api/students/me`, authHeaders);
      check(profileRes, {
        'Profile fetch returned 200': (r) => r.status === 200,
      });

      // Authenticated applications fetch
      const appsRes = http.get(`${BASE_URL}/api/students/me/applications`, authHeaders);
      check(appsRes, {
        'Applications fetch returned 200': (r) => r.status === 200,
      });
    }
  });

  sleep(1);
}
