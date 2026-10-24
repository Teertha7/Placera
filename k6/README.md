# Placera Load Testing & Observability Verification

This directory contains the [k6](https://k6.io/) load testing suite to validate application performance and verify the Service-Level Objectives (SLOs) under realistic simulated concurrent traffic.

---

## 1. Service Level Objectives (SLOs)

| Metric | Target | Measurement Window | Exclusions |
| :--- | :--- | :--- | :--- |
| **API Response Latency (p95)** | $\le 250\text{ ms}$ | 1-minute steady state under 50 VUs | Startup probe requests ($<30\text{s}$) |
| **API Response Latency (p99)** | $\le 500\text{ ms}$ | 1-minute steady state under 50 VUs | Cold-start replica initialization |
| **Request Success Rate** | $\ge 99.0\%$ | 1-minute steady state under 50 VUs | Intentional rate-limited requests |

---

## 2. Four Golden Signals Measured

1. **Latency**: Duration of request execution (`http_req_duration`).
2. **Traffic**: Requests per second executed across 50 virtual users.
3. **Errors**: Failed response rate (`http_req_failed`).
4. **Saturation**: Thread pool utilization and database connection pool saturation monitored via Spring Boot Actuator (`/actuator/metrics/hikaricp.connections.active`).

---

## 3. Running the Load Test Locally

Make sure the local application is running via Docker Compose or `./mvnw spring-boot:run`:

```bash
# Run against local backend
k6 run -e BASE_URL=http://localhost:8080 k6/load-test.js
```

> [!CAUTION]
> **Cost Control Rule**: Never execute aggressive load testing against cloud endpoints without explicit authorization. Load testing against cloud infrastructure consumes bandwidth, CPU, and database compute units, which can deplete student credits. Always run load testing locally.
