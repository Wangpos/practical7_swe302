# Screenshots Directory

This directory contains all performance test result screenshots for Practical 7.

## Required Screenshots

### Local Execution (Terminal Screenshots)

- [ ] `average-load-local.png` - Average load test terminal output
- [ ] `spike-load-local.png` - Spike load test terminal output
- [ ] `stress-test-local.png` - Stress test terminal output
- [ ] `soak-test-local.png` - Soak test terminal output (30 min test)

### Cloud Execution (Grafana UI Screenshots)

- [ ] `average-load-cloud.png` - Average load test Grafana dashboard
- [ ] `spike-load-cloud.png` - Spike load test Grafana dashboard
- [ ] `stress-test-cloud.png` - Stress test Grafana dashboard
- [ ] `soak-test-cloud.png` - Soak test Grafana dashboard

## How to Capture Screenshots

### For Local Terminal Tests:

1. Run the test command (e.g., `pnpm test:k6:average`)
2. Wait for the test to complete
3. Take a full terminal screenshot showing:
   - The command you ran
   - The full test output
   - The final summary statistics
4. Save with the appropriate filename

### For Grafana Cloud Tests:

1. Run the cloud test command (e.g., `pnpm test:k6:cloud:average`)
2. Open the Grafana Cloud link provided in the terminal
3. Wait for the test to complete
4. Take screenshots of:
   - The main performance dashboard
   - Key metrics graphs (response time, throughput, error rate)
   - The summary statistics
5. Save with the appropriate filename

## Tips for Good Screenshots:

- Ensure text is readable (zoom if necessary)
- Capture the entire relevant output
- Include timestamps where visible
- For Grafana, capture multiple views if needed
- Name files exactly as listed above for easy reference in REPORT.md
