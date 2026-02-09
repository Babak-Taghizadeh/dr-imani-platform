# Background Jobs Configuration

This project uses background jobs for payment reconciliation and appointment expiration. Jobs run **only via VPS system cron** (crontab)—there is no in-app scheduler.

## VPS Setup Guide

### Prerequisites

- App deployed and running on your VPS (e.g. via `next start` or PM2)
- `curl` available on the server
- App URL reachable from the VPS (e.g. `https://your-domain.com` or `http://localhost:3000`)

### 1. Environment Variables

Add to your app environment (e.g. `.env`, systemd, Docker):

```env
CRON_SECRET=your-secure-random-secret  # For API endpoint authentication
PAYMENT_TTL_MINUTES=40                 # Optional: how long before PENDING appointments expire (default: 40)
```

Generate a secure secret:
```bash
openssl rand -base64 32
```

### 2. Create Cron Script (Recommended)

Create `/usr/local/bin/run-dr-imani-jobs.sh`:

```bash
#!/bin/bash
set -e

DOMAIN="${APP_URL:-https://your-domain.com}"
SECRET="${CRON_SECRET}"

if [ -z "$SECRET" ]; then
  echo "$(date -Iseconds): CRON_SECRET not set" >> /var/log/dr-imani-jobs.log
  exit 1
fi

run_job() {
  local name=$1
  local endpoint=$2
  local response
  response=$(curl -s -w "\n%{http_code}" -X POST "$DOMAIN/api/jobs/$endpoint" \
    -H "Authorization: Bearer $SECRET" \
    -H "Content-Type: application/json")
  local code=$(echo "$response" | tail -n1)
  local body=$(echo "$response" | sed '$d')

  if [ "$code" -ge 200 ] && [ "$code" -lt 300 ]; then
    echo "$(date -Iseconds): $name OK - $body" >> /var/log/dr-imani-jobs.log
  else
    echo "$(date -Iseconds): $name FAILED (HTTP $code) - $body" >> /var/log/dr-imani-jobs.log
    return 1
  fi
}

case "${1:-all}" in
  expire)
    run_job "Expire appointments" "expire-payments"
    ;;
  reconcile)
    run_job "Reconcile payments" "reconcile-payments"
    ;;
  all)
    run_job "Expire appointments" "expire-payments"
    run_job "Reconcile payments" "reconcile-payments"
    ;;
  *)
    echo "Usage: $0 {expire|reconcile|all}"
    exit 1
    ;;
esac
```

Make it executable and export env vars:

```bash
sudo chmod +x /usr/local/bin/run-dr-imani-jobs.sh
```

Set `CRON_SECRET` and `APP_URL` either in crontab or via a wrapper. Example using env file:

```bash
# /etc/dr-imani/env (restrict permissions: chmod 600)
export CRON_SECRET="your-secret-from-step-1"
export APP_URL="https://your-domain.com"
```

### 3. Add Crontab Entries

Edit crontab: `crontab -e`

**Option A: Direct curl (simpler)**

```bash
# Load env if needed; adjust path to your .env or source script
SHELL=/bin/bash
CRON_SECRET=your-secret-here
APP_URL=https://your-domain.com

# Expire appointments every 5 minutes
*/5 * * * * curl -s -X POST "$APP_URL/api/jobs/expire-payments" -H "Authorization: Bearer $CRON_SECRET" -H "Content-Type: application/json" >> /var/log/dr-imani-jobs.log 2>&1

# Reconcile payments every 10 minutes
*/10 * * * * curl -s -X POST "$APP_URL/api/jobs/reconcile-payments" -H "Authorization: Bearer $CRON_SECRET" -H "Content-Type: application/json" >> /var/log/dr-imani-jobs.log 2>&1
```

**Option B: Script (recommended)**

```bash
# Source env before running
SHELL=/bin/bash
BASH_ENV=/etc/dr-imani/env

# Expire appointments every 5 minutes
*/5 * * * * /usr/local/bin/run-dr-imani-jobs.sh expire

# Reconcile payments every 10 minutes
*/10 * * * * /usr/local/bin/run-dr-imani-jobs.sh reconcile
```

### 4. Log File

Create and restrict the log file:

```bash
sudo touch /var/log/dr-imani-jobs.log
sudo chown your-user:your-user /var/log/dr-imani-jobs.log
```

For log rotation, add `/etc/logrotate.d/dr-imani-jobs`:

```
/var/log/dr-imani-jobs.log {
  weekly
  rotate 4
  compress
  missingok
}
```

### 5. Verify Setup

Manually trigger a job:

```bash
curl -X POST https://your-domain.com/api/jobs/expire-payments \
  -H "Authorization: Bearer YOUR_CRON_SECRET" \
  -H "Content-Type: application/json"
```

Expect a JSON response with `expiredCount` (and similar for reconcile). Check logs:

```bash
tail -f /var/log/dr-imani-jobs.log
```

---

## Jobs Overview

### 1. Expire Pending Appointments

| Property   | Value                                      |
|-----------|---------------------------------------------|
| Schedule  | Every 5 minutes                             |
| Endpoint  | `POST /api/jobs/expire-payments`            |
| Purpose   | Deletes PENDING appointments older than `PAYMENT_TTL_MINUTES` |
| Reason    | Frees appointment slots that weren't paid in time |

### 2. Reconcile Payments

| Property   | Value                                      |
|-----------|---------------------------------------------|
| Schedule  | Every 10 minutes                            |
| Endpoint  | `POST /api/jobs/reconcile-payments`         |
| Purpose   | Handles edge cases where `paymentReference` exists but status is still `PENDING` |
| Reason    | Prevents stuck appointments from race conditions or errors |

### 3. SEP Payment Flow Notes

- Normal flow:
  - Appointment created with status `PENDING`
  - `/api/payments/sep/initiate` sets status to `PAYMENT_INITIATED` and requests a SEP token
  - SEP redirects to `/api/payments/sep/callback` with `ResNum` and `RefNum`
  - Callback verifies via SEP `VerifyTransaction`, marks appointment as `PAID`, writes `payment_logs` entry
- Reconciliation job covers cases where:
  - `sepRefNum` is stored but status is not `PAID` (e.g. DB error after verify)
  - Job re-calls `VerifyTransaction` and updates status/logs if the payment is valid
- If SEP reports success but amount or terminal differs:
  - System calls SEP `ReverseTransaction` to request a refund
  - Marks payment as failed and does **not** confirm the appointment

---

## Environment Variables

```env
CRON_SECRET=your-secret     # Required for API endpoint authentication
PAYMENT_TTL_MINUTES=40      # Optional: TTL for PENDING appointments (default: 40)
```

---

## Monitoring & Troubleshooting

### Monitoring

- **Logs:** `/var/log/dr-imani-jobs.log`
- **Watch for:** `Expire appointments job error`, `Payment reconciliation job error`, `SEP verify failed`, `SEP reverse failed`
- **Metrics:** `expiredCount`, `reconciledCount` in job responses

### Alerting

- Alert if job endpoints return non-2xx repeatedly
- Alert if `reconciledCount` spikes (may indicate callback issues)
- Alert on repeated `SEP reverse failed` errors

### Jobs Not Running

1. Confirm `CRON_SECRET` is set in both app env and cron context
2. Check `Authorization: Bearer <CRON_SECRET>` matches exactly
3. Verify job endpoints are reachable: `curl -v ...`
4. Inspect cron logs: `journalctl -u cron` or `grep CRON /var/log/syslog`
5. Confirm app is running and listening on the target URL

### Manual Reconciliation

For disputes or cases not auto-fixed:

- Use SEP reporting portal (`https://report.sep.ir`) with `MID` and `RefNum`
- Compare with `payment_logs` and `appointments`
- Adjust appointment status via admin tooling or SQL if needed
