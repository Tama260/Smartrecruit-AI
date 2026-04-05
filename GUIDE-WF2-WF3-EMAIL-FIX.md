# SmartRecruit AI — WF2, WF3 & Email Fix Guide (English)
## Bulk Import · Status Notification · Brevo Email Fix

---

## IMPORTANT: Email Fix (Read This First!)

### Why Emails Went to the Wrong Address
Pipedream's built-in `$.send.email()` **only sends to the Pipedream account owner's email** — it cannot send to arbitrary addresses on the free tier. That's why all emails landed in `daffanovendraa@gmail.com` instead of the actual applicant.

### The Fix — Use Brevo API Instead
We replace `$.send.email()` with **Brevo's HTTP API**, which can send to any email address. This works perfectly because Pipedream can make HTTP requests to any external API without port restrictions.

### Setup Brevo API (5 minutes)

**Step 1** — Get Brevo API Key:
1. Go to **https://app.brevo.com** → login
2. Click your account name (top right) → **"SMTP & API"**
3. Click tab **"API Keys"**
4. Click **"Generate a new API key"** → name: `pipedream-smartrecruit`
5. **Copy the API key** — save it somewhere safe

**Step 2** — Verify Sender Email in Brevo:
1. In Brevo → click **"Transactional"** in left menu
2. Click **"Senders & IP"** or **"Sender domains"**
3. Click **"Add a sender"**
4. Add your email (e.g. `foolburial@gmail.com`)
5. Verify via the confirmation email Brevo sends you

**Step 3** — Add Environment Variables in Pipedream:
- Key: `BREVO_API_KEY` → Value: your Brevo API key
- Key: `BREVO_SENDER_EMAIL` → Value: your verified sender email (e.g. `foolburial@gmail.com`)
- Key: `HR_EMAIL` → Value: your email (you are the HR for this portfolio)

**Step 4** — Replace Email Step Code in Pipedream WF1:
- Open WF1 → click step `email_applicant` → **replace all code** with contents of `step-5-email-applicant-fixed.js`
- Click step `email_hr` → **replace all code** with contents of `step-6-email-hr-fixed.js`
- Click **Deploy**

---

## Why Google Sheets Isn't Getting Data from the Form

Most likely cause: **Apps Script trigger not installed correctly**.

**Check this now:**
1. Open **SmartRecruit - Form Responses** Google Sheet
   (the sheet auto-created from the Form — NOT the database sheet)
2. Click **Extensions → Apps Script**
3. Click the **clock icon ⏰** (Triggers) in the left menu
4. You should see a trigger with:
   - Function: `onFormSubmit`
   - Event source: From spreadsheet
   - Event type: On form submit
5. If it's missing → click **"+ Add Trigger"** and set it up
6. After setting up → submit the Google Form again → check Pipedream Runs

**Also check:** The `WEBHOOK_URL` in Apps Script must match your **current** Pipedream webhook URL. If you recreated the workflow, the URL may have changed.

---

## Part 5 — WF2: Bulk Import

### Purpose
Import multiple candidate records into Google Sheets in one click — no need to fill the form one by one.

### Step 5.1 — Create New Workflow
1. In Pipedream → click **"New Workflow"** inside the SmartRecruit AI project
2. Name: `WF2 - Bulk Import`
3. Click **"Add a trigger"**
4. Search: **"Manual"** → select **"Run workflow manually"**
5. Click **"Save and continue"**

### Step 5.2 — Add Step: Bulk Import
1. Click **"+"** → **"Run Node.js code"**
2. Step name: `bulk_import_data`
3. Paste entire contents of `wf2-bulk-import.js`
4. Replace Spreadsheet ID in the code:
```javascript
const SPREADSHEET_ID = "1btf--CI9m3k0GzMVeE35tWV9EsTA_6YzGcPzaB4REFQ";
```

### Step 5.3 — Add Column L in Google Sheets
Before testing, add a header for column L in your database sheet:
- Open **SmartRecruit - Candidate Database**
- Click cell **L1** → type: `notified`

### Step 5.4 — Deploy & Test
1. Click **"Deploy"**
2. Click **"Run Now"** (the manual trigger button)
3. Check Google Sheets — 5 new rows should appear automatically ✅

---

## Part 6 — WF3: Status Update Notification

### Purpose
When HR changes a candidate's status in Google Sheets to "Interview", "Hired", or "Rejected", the system automatically sends a professional email to that candidate.

### How It Works
```
HR updates status in Google Sheets
           ↓
WF3 checks sheet every 5 minutes (Schedule Trigger)
           ↓
Finds rows where status changed & "notified" column is empty
           ↓
Sends email based on status → Interview / Hired / Rejected
           ↓
Marks column L = "yes" to prevent duplicate emails
```

### Step 6.1 — Create New Workflow
1. In Pipedream → click **"New Workflow"**
2. Name: `WF3 - Status Notification`
3. Click **"Add a trigger"**
4. Search: **"Schedule"** → select **"Schedule"**
5. Set: Every **5 minutes**
6. Click **"Save and continue"**

### Step 6.2 — Add Step 1: Check Status
1. Click **"+"** → **"Run Node.js code"**
2. Step name: `check_status`
3. Paste entire contents of `wf3-step1-check-status.js`
4. Replace Spreadsheet ID:
```javascript
const SPREADSHEET_ID = "1btf--CI9m3k0GzMVeE35tWV9EsTA_6YzGcPzaB4REFQ";
```

### Step 6.3 — Add Step 2: Send Email
1. Click **"+"** → **"Run Node.js code"**
2. Step name: `send_status_email`
3. Paste entire contents of `wf3-step2-send-email.js`
4. Replace the same Spreadsheet ID in this file too

### Step 6.4 — Deploy
1. Click **"Deploy"**
2. Status becomes **"Active"** — workflow runs automatically every 5 minutes

### Step 6.5 — Test
1. Open **SmartRecruit - Candidate Database**
2. Pick any candidate row
3. Change column **K (status)** to `Interview`
4. Make sure column **L (notified)** is still **empty**
5. Wait up to 5 minutes
6. Check that candidate's email inbox — they should receive an interview invitation ✅
7. Check column L in Sheets — it should now say `yes` ✅

---

## All 3 Workflows Summary

| Workflow | Trigger | Function |
|---|---|---|
| **WF1** - Application Intake | Webhook (Google Form) | Receive application → AI score → Sheets → Email |
| **WF2** - Bulk Import | Manual (click button) | Import multiple candidates to Sheets at once |
| **WF3** - Status Notification | Schedule (every 5 min) | Auto-email candidates when HR updates their status |

---

## Google Sheets Column Reference (Complete — 12 columns)

| Column | Header | Filled By |
|---|---|---|
| A | timestamp | WF1 automatic |
| B | full_name | WF1 automatic |
| C | email | WF1 automatic |
| D | position | WF1 automatic |
| E | years_experience | WF1 automatic |
| F | cover_letter | WF1 automatic |
| G | cv_link | WF1 automatic |
| H | ai_score | WF1 automatic |
| I | ai_rekomendasi | WF1 automatic |
| J | ai_notes | WF1 automatic |
| K | status | **HR updates manually** |
| L | notified | WF3 automatic (yes / empty) |

> ⚠️ **Important:** Column L (`notified`) must exist and be **empty** for candidates who haven't been notified yet. WF3 fills this automatically after sending the email to prevent duplicates.

---

## Status Values That Trigger Automatic Emails

| Status (column K) | Email Sent |
|---|---|
| `Interview` | Interview invitation email (green, celebratory) |
| `Hired` | Job offer email (blue, celebratory) |
| `Rejected` | Polite rejection email (gray, encouraging) |
| `Under Review` | No email |
| `PROCEED` | No email |
| `REVIEW` | No email |

---

## All Environment Variables (Complete List)

Set all of these in Pipedream → Settings → Environment Variables:

| Key | Value | Used In |
|---|---|---|
| `GROQ_API_KEY` | Groq API key | WF1 Step 2 |
| `GOOGLE_SERVICE_ACCOUNT_EMAIL` | `smartrecruit-n8n@smartrecruit-ai-492003.iam.gserviceaccount.com` | WF1 Step 4, WF2, WF3 |
| `GOOGLE_PRIVATE_KEY` | Full private key from JSON file | WF1 Step 4, WF2, WF3 |
| `BREVO_API_KEY` | Brevo API key | WF1 Step 5 & 6 |
| `BREVO_SENDER_EMAIL` | Your verified Brevo sender email | WF1 Step 5 & 6 |
| `HR_EMAIL` | Your email address (HR notifications) | WF1 Step 6 |

---

*SmartRecruit AI — Built with Pipedream · Groq AI · Google Workspace · Brevo*
*100% free tools · Production-ready architecture*
