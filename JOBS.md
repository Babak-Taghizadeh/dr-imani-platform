# Background Jobs Configuration

This project includes background jobs for payment reconciliation and appointment expiration. You can run them in two ways:

## Option 1: In-App Scheduler (Next.js)

**When it works:**
- ✅ Traditional VPS deployment with `next start` (long-running process)
- ✅ Docker containers that stay running
- ✅ Development with `ENABLE_JOBS=true`

**When it doesn't work:**
- ❌ Serverless environments (Vercel, AWS Lambda, etc.)
- ❌ Edge runtime
- ❌ Any environment where the process spins down

**Configuration:**
```env
# Enable in-app scheduler (default behavior)
# Don't set USE_VPS_CRON, or set it to false
ENABLE_JOBS=true  # Only needed in development
```

## Option 2: VPS System Cron (Recommended for Production)

**Best for:**
- ✅ Production VPS deployments
- ✅ More reliable and independent of Next.js process
- ✅ Better monitoring and logging
- ✅ Works even if Next.js restarts

**Setup:**

1. **Disable in-app scheduler:**
```env
USE_VPS_CRON=true
CRON_SECRET=your-secret-here  # For API endpoint security
```

2. **Add to VPS crontab (`crontab -e`):**
```bash
# Expire appointments every 5 minutes
*/5 * * * * curl -X POST https://your-domain.com/api/jobs/expire-payments \
  -H "Authorization: Bearer YOUR_CRON_SECRET" \
  -H "Content-Type: application/json" \
  >> /var/log/app-jobs.log 2>&1

# Reconcile payments every 10 minutes
*/10 * * * * curl -X POST https://your-domain.com/api/jobs/reconcile-payments \
  -H "Authorization: Bearer YOUR_CRON_SECRET" \
  -H "Content-Type: application/json" \
  >> /var/log/app-jobs.log 2>&1
```

3. **Or use a more robust script (`/usr/local/bin/run-app-jobs.sh`):**
```bash
#!/bin/bash
DOMAIN="https://your-domain.com"
SECRET="your-cron-secret"

# Expire appointments
curl -X POST "$DOMAIN/api/jobs/expire-payments" \
  -H "Authorization: Bearer $SECRET" \
  -H "Content-Type: application/json" \
  -f -s -o /dev/null || echo "$(date): Expire appointments job failed" >> /var/log/app-jobs.log

# Reconcile payments
curl -X POST "$DOMAIN/api/jobs/reconcile-payments" \
  -H "Authorization: Bearer $SECRET" \
  -H "Content-Type: application/json" \
  -f -s -o /dev/null || echo "$(date): Reconcile payments job failed" >> /var/log/app-jobs.log
```

Then in crontab:
```bash
*/5 * * * * /usr/local/bin/run-app-jobs.sh expire
*/10 * * * * /usr/local/bin/run-app-jobs.sh reconcile
```

## Jobs Overview

### 1. Expire Pending Appointments
- **Schedule:** Every 5 minutes
- **Endpoint:** `POST /api/jobs/expire-payments`
- **Purpose:** Deletes PENDING appointments older than 40 minutes (configurable via `PAYMENT_TTL_MINUTES`)
- **Why:** Frees up appointment slots that weren't paid in time

### 2. Reconcile Payments
- **Schedule:** Every 10 minutes
- **Endpoint:** `POST /api/jobs/reconcile-payments`
- **Purpose:** Handles edge cases where `paymentReference` exists but status is still `PENDING`
- **Why:** Prevents stuck appointments due to race conditions or errors

### 3. SEP Payment Flow Notes

- The normal flow is:
  - Appointment created with status `PENDING`
  - `/api/payments/sep/initiate` sets status to `PAYMENT_INITIATED` and requests a SEP token
  - SEP redirects back to `/api/payments/sep/callback` with `ResNum` (our `paymentReference`) and `RefNum` (SEP receipt)
  - Callback verifies via SEP `VerifyTransaction`, then marks the appointment as `PAID` and writes a `payment_logs` entry
- The reconciliation job is a safety net for rare cases where:
  - `sepRefNum` is stored but the appointment status is not `PAID` (e.g. DB error after verify)
  - In this case the job re-calls `VerifyTransaction` and fixes the status/logs if the payment is valid
- If SEP reports success but the amount or terminal doesn’t match what we expect, the system:
  - Calls SEP `ReverseTransaction` to request a refund
  - Marks the payment as failed and does **not** confirm the appointment

### Operational Guidance

- **Monitoring:**
  - Watch logs for:
    - `Expire appointments job error`
    - `Payment reconciliation job error`
    - `SEP verify failed` and `SEP reverse failed` messages
  - Track counts of:
    - `expiredCount` and `reconciledCount` in job responses
    - Payment failures vs. successes in `payment_logs`
- **Alerting:**
  - Alert if:
    - Jobs endpoints start returning non-2xx for more than a few runs
    - `reconciledCount` spikes unexpectedly (could signal callback issues)
    - Repeated `SEP reverse failed` errors appear
- **Manual Reconciliation:**
  - For disputes or inconsistencies not auto-fixed by the job:
    - Use SEP’s reporting portal (`https://report.sep.ir`) with `MID` and `RefNum`
    - Compare against application `payment_logs` and `appointments` tables
    - Manually adjust appointment status (e.g. set to `PAID` or `CANCELED`) via admin tooling or SQL as needed

## Environment Variables

```env
# Job Configuration
USE_VPS_CRON=false          # Set to true to disable in-app scheduler
ENABLE_JOBS=true            # Enable in-app scheduler in development
CRON_SECRET=your-secret     # Secret for API endpoint authentication
PAYMENT_TTL_MINUTES=40      # How long before PENDING appointments expire
```

## Monitoring

Check job execution:
- **In-app scheduler:** Check Next.js logs
- **VPS cron:** Check `/var/log/app-jobs.log` or cron mail
- **API endpoints:** Check response status codes

## Troubleshooting

**Jobs not running:**
1. Check if `USE_VPS_CRON` is set correctly
2. Verify `CRON_SECRET` matches in environment and cron script
3. Check Next.js logs for in-app scheduler
4. Check cron logs for VPS cron
5. Verify API endpoints are accessible

**Jobs running twice:**
- Make sure you're not using both in-app scheduler AND VPS cron
- Set `USE_VPS_CRON=true` to disable in-app scheduler

