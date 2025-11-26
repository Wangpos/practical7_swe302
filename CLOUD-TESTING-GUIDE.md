# Cloud Testing with Grafana k6 - Setup Guide

## Problem

Grafana Cloud k6 **cannot access `localhost`** URLs because the tests run from Grafana's cloud infrastructure, not your local machine. You'll see errors like:

```
IP (127.0.0.1) is in a blacklisted range (127.0.0.0/8)
```

## Solution: Use ngrok to Expose Your Local Server

### Step 1: Install ngrok

**macOS:**

```bash
brew install ngrok
```

**Or download from:** https://ngrok.com/download

### Step 2: Authenticate ngrok (One-time setup)

1. Sign up at https://ngrok.com (free account)
2. Get your auth token from the dashboard
3. Run:
   ```bash
   ngrok config add-authtoken YOUR_AUTH_TOKEN
   ```

### Step 3: Start Your Next.js App

```bash
pnpm dev
```

Your app should be running on `http://localhost:3000`

### Step 4: Expose Your App with ngrok

In a **new terminal window**, run:

```bash
ngrok http 3000
```

You'll see output like:

```
Session Status                online
Account                       Your Name (Plan: Free)
Forwarding                    https://abc123def456.ngrok.io -> http://localhost:3000
```

**Copy the HTTPS URL** (e.g., `https://abc123def456.ngrok.io`)

### Step 5: Update Your Test Files

You have two options:

#### Option A: Update BASE_URL in Each Test File (Temporary)

Open each test file and change:

```javascript
const BASE_URL = __ENV.BASE_URL || "http://localhost:3000";
```

To:

```javascript
const BASE_URL = __ENV.BASE_URL || "https://your-ngrok-url.ngrok.io";
```

#### Option B: Use Environment Variable (Recommended)

Run tests with the BASE_URL environment variable:

```bash
BASE_URL=https://your-ngrok-url.ngrok.io pnpm test:k6:cloud:average
BASE_URL=https://your-ngrok-url.ngrok.io pnpm test:k6:cloud:spike
BASE_URL=https://your-ngrok-url.ngrok.io pnpm test:k6:cloud:stress
BASE_URL=https://your-ngrok-url.ngrok.io pnpm test:k6:cloud:soak
```

### Step 6: Run Cloud Tests

With ngrok running, execute your cloud tests:

```bash
# Using environment variable
BASE_URL=https://your-ngrok-url.ngrok.io pnpm test:k6:cloud:average
```

Or if you updated the test files:

```bash
pnpm test:k6:cloud:average
```

## Important Notes

### Free ngrok Limitations

- **Session timeout:** Free accounts have 2-hour session limits
- **URL changes:** Each ngrok restart gives you a new URL
- **Rate limits:** Free tier has connection limits

### For Long Tests (Soak Test - 40 minutes)

Since the free ngrok session might timeout, you can:

1. **Use ngrok paid plan** ($8/month) for stable URLs
2. **Test in shorter sessions** and restart ngrok if needed
3. **Deploy to a public server** (Vercel, Netlify, etc.) and use that URL

## Complete Cloud Testing Workflow

### Terminal 1: Next.js App

```bash
cd /Users/tsheringwangpodorji/Desktop/practical7_performance-testing
pnpm dev
```

### Terminal 2: ngrok

```bash
ngrok http 3000
# Copy the HTTPS URL from output
```

### Terminal 3: Run Tests

```bash
cd /Users/tsheringwangpodorji/Desktop/practical7_performance-testing

# Replace YOUR_NGROK_URL with actual URL
export NGROK_URL="https://abc123.ngrok.io"

# Run all cloud tests
BASE_URL=$NGROK_URL pnpm test:k6:cloud:average
BASE_URL=$NGROK_URL pnpm test:k6:cloud:spike
BASE_URL=$NGROK_URL pnpm test:k6:cloud:stress
BASE_URL=$NGROK_URL pnpm test:k6:cloud:soak
```

## Viewing Results on Grafana Cloud

After running cloud tests, k6 will output a link like:

```
     output: Grafana Cloud (https://your-org.grafana.net/a/k6-app/runs/123456)
```

Click this link to view:

- Real-time test progress
- Performance graphs
- Response time trends
- Error rates
- VU distribution
- And more!

## Screenshot Checklist for Report

For each cloud test, capture screenshots showing:

- ✅ Overall test summary dashboard
- ✅ Response time graph
- ✅ Throughput/requests per second
- ✅ Error rate
- ✅ VU (Virtual Users) distribution over time
- ✅ Any notable spikes or patterns

## Alternative: Deploy to Vercel (For Easier Cloud Testing)

If ngrok is problematic, you can deploy your app:

```bash
# Install Vercel CLI
pnpm install -g vercel

# Deploy
vercel

# Use the provided URL for cloud tests
BASE_URL=https://your-app.vercel.app pnpm test:k6:cloud:average
```

## Troubleshooting

### ngrok URL keeps changing

- Upgrade to ngrok paid plan for stable URLs
- Or use deployment platforms (Vercel, Netlify)

### ngrok connection timeout during long tests

- For soak test (40 min), consider using deployment platform
- Or upgrade ngrok plan

### Can't access ngrok URL

- Make sure Next.js dev server is running first
- Check firewall settings
- Verify ngrok is properly authenticated

### Tests still fail with ngrok

- Ensure you're using HTTPS URL (not HTTP)
- Verify app is accessible by visiting ngrok URL in browser
- Check ngrok session hasn't expired

## Summary

1. ✅ Start Next.js app: `pnpm dev`
2. ✅ Start ngrok: `ngrok http 3000`
3. ✅ Copy ngrok HTTPS URL
4. ✅ Run cloud tests with: `BASE_URL=<ngrok-url> pnpm test:k6:cloud:<test-name>`
5. ✅ View results in Grafana Cloud dashboard
6. ✅ Take screenshots for report

Good luck with your cloud testing! 🚀
