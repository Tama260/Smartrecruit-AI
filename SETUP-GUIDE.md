# SmartRecruit AI — Pipedream Setup Guide
### Automated Recruitment Pipeline with AI-Powered Candidate Scoring

> **Tools:** Pipedream · Google Forms/Sheets · Groq AI · Google Apps Script  
> **Cost: $0** — 100% free

---

## Why Pipedream?

| Feature | Pipedream | n8n on Railway |
|---|---|---|
| Email sending | ✅ Built-in, no SMTP | ❌ SMTP blocked |
| Webhook URL | ✅ Stable, never changes | ⚠️ Changes on redeploy |
| Google Sheets | ✅ OAuth works natively | ⚠️ OAuth issues |
| Free tier | ✅ 10,000 events/month | ✅ Limited |

---

## Architecture

```
Google Form
     │
     ▼ (on submit)
Google Apps Script  ──────► Pipedream Webhook Trigger
                                    │
                             Step 1: Validate Data
                                    │
                             Step 2: Groq AI Scoring
                             (LLaMA 3.1 — 0 to 100)
                                    │
                             Step 3: Parse AI Response
                                    │
                    ┌───────────────┼───────────────┐
                    ▼               ▼               ▼
             Step 4: Sheets   Step 5: Email   Step 6: Email
             (Append row)     (Applicant)     (HR Team)
```

---

## File Structure

```
smartrecruit-pipedream/
├── apps-script.gs           # Google Apps Script — Form to Pipedream bridge
├── step-1-validate.js       # Validate & clean incoming data
├── step-2-groq-ai.js        # Call Groq AI for candidate scoring
├── step-3-parse-ai.js       # Parse & merge AI response
├── step-4-sheets.js         # Append candidate to Google Sheets
├── step-5-email-applicant.js # Send confirmation email to applicant
├── step-6-email-hr.js       # Send AI score notification to HR
└── SETUP-GUIDE.md           # This file
```

---

## Part 0 — Register Tools (All Free)

### Pipedream
- Go to: **https://pipedream.com** → Sign up (free)
- Free tier: 10,000 workflow invocations/month — more than enough

### Groq API
- Go to: **https://console.groq.com** → Sign up
- Click "API Keys" → "Create API Key" → name it `smartrecruit` → copy key

### Google Account
- Already have Gmail, Forms, Sheets — no signup needed

---

## Part 1 — Google Sheets Database

1. Open **https://sheets.google.com** → New spreadsheet
2. Name: **SmartRecruit - Candidate Database**
3. Row 1 headers — type exactly (case-sensitive):

```
A: timestamp
B: full_name
C: email
D: position
E: years_experience
F: cover_letter
G: cv_link
H: ai_score
I: ai_rekomendasi
J: ai_notes
K: status
```

4. Copy the **Spreadsheet ID** from the URL:
```
https://docs.google.com/spreadsheets/d/COPY_THIS_PART/edit
```
Save this — you'll need it in Step 4.

5. Share the sheet with your Service Account email:
   - Click **Share** → paste `smartrecruit-n8n@smartrecruit-ai-492003.iam.gserviceaccount.com`
   - Role: **Editor** → Send

---

## Part 2 — Google Form

1. Open **https://forms.google.com** → New form
2. Title: **Job Application Form — SmartRecruit AI**
3. Add exactly **6 questions in this order:**

```
Q1. Full Name               → Short answer (required)
Q2. Email Address           → Short answer (required)
Q3. Position Applied For    → Multiple choice:
                              - Backend Developer
                              - Frontend Developer
                              - UI/UX Designer
                              - Data Analyst
                              - Project Manager
                              - DevOps Engineer
Q4. Years of Experience     → Short answer (required)
Q5. Cover Letter            → Paragraph (required)
Q6. CV / Portfolio Link     → Short answer (required)
```

4. Click "Responses" tab → Google Sheets icon → "Create new spreadsheet"
   Name: `SmartRecruit - Form Responses`

---

## Part 3 — Create Pipedream Workflow

### Step 3.1 — Create New Project
1. Login to **https://pipedream.com**
2. Click **"New Project"** → name: `SmartRecruit AI`
3. Click **"New Workflow"** inside the project
4. Name: `WF1 - Application Intake`

### Step 3.2 — Add Webhook Trigger
1. Click **"Add a trigger"**
2. Search: **"HTTP / Webhook"** → select
3. Choose **"HTTP API"**
4. **Copy the webhook URL** — looks like:
```
https://eoXXXXXXXXXXXXXX.m.pipedream.net
```
Save this URL — you need it for Apps Script

### Step 3.3 — Add Step 1: Validate Data
1. Click **"+"** → **"Run Node.js code"**
2. Name the step: `validate_data`
3. **Delete all existing code** → paste entire contents of `step-1-validate.js`
4. Click **"Test"** to verify

### Step 3.4 — Add Step 2: Groq AI Scoring
1. Click **"+"** → **"Run Node.js code"**
2. Name: `groq_ai_scoring`
3. Paste entire contents of `step-2-groq-ai.js`
4. **IMPORTANT** — Set Environment Variable:
   - Click your account icon → **"Settings"** → **"Environment Variables"**
   - Click **"Add Variable"**:
     - Key: `GROQ_API_KEY`
     - Value: your Groq API key
   - Click **Save**

### Step 3.5 — Add Step 3: Parse AI Response
1. Click **"+"** → **"Run Node.js code"**
2. Name: `parse_ai_response`
3. Paste entire contents of `step-3-parse-ai.js`

### Step 3.6 — Add Step 4: Google Sheets
1. Click **"+"** → **"Run Node.js code"**
2. Name: `append_to_sheets`
3. Paste entire contents of `step-4-sheets.js`
4. Set Environment Variables:
   - Key: `GOOGLE_SERVICE_ACCOUNT_EMAIL`
   - Value: `smartrecruit-n8n@smartrecruit-ai-492003.iam.gserviceaccount.com`
   
   - Key: `GOOGLE_PRIVATE_KEY`
   - Value: paste the entire private key from your JSON file (-----BEGIN PRIVATE KEY----- ... -----END PRIVATE KEY-----)

5. In the code, replace `REPLACE_WITH_YOUR_GOOGLE_SHEET_ID` with your actual Sheet ID

### Step 3.7 — Add Step 5: Email to Applicant
1. Click **"+"** → **"Run Node.js code"**
2. Name: `email_applicant`
3. Paste entire contents of `step-5-email-applicant.js`

> ✅ **No SMTP setup needed!** Pipedream's `$.send.email()` sends emails
> from Pipedream's own servers — completely free, no configuration.
> Note: emails will arrive from `@pipedream.net` sender address.

### Step 3.8 — Add Step 6: Email to HR
1. Click **"+"** → **"Run Node.js code"**
2. Name: `email_hr`
3. Paste entire contents of `step-6-email-hr.js`
4. Set Environment Variable:
   - Key: `HR_EMAIL`
   - Value: your own email address (you are the HR for this portfolio project)

### Step 3.9 — Deploy Workflow
1. Click **"Deploy"** button (top right)
2. Status should show **"Active"**

---

## Part 4 — Install Apps Script

1. Open **SmartRecruit - Form Responses** Google Sheet
2. Click **Extensions → Apps Script**
3. Delete all existing code
4. Paste entire contents of `apps-script.gs`
5. Replace `WEBHOOK_URL` with your Pipedream webhook URL from Step 3.2
6. Click **Save**
7. Click the clock icon ⏰ → **"Add Trigger"**:
   - Function: `onFormSubmit`
   - Event source: **From spreadsheet**
   - Event type: **On form submit**
8. Click **Save** → grant permissions

---

## Part 5 — Test the Full Flow

### Option A — PowerShell Test (Windows)
```powershell
Invoke-WebRequest -Uri "https://YOUR-PIPEDREAM-WEBHOOK-URL.m.pipedream.net" -Method POST -ContentType "application/json" -Body '{"full_name":"John Doe","email":"YOUR_EMAIL@gmail.com","position":"Backend Developer","years_experience":"3","cover_letter":"I have 3 years of experience in Node.js and Python. I am passionate about building scalable backend systems.","cv_link":"https://example.com/cv.pdf"}'
```

### Option B — Google Form Test
1. Open your Google Form → fill it with test data
2. Submit
3. Wait 30 seconds

### Verify Results
- ✅ Pipedream → Runs tab → should show green success
- ✅ Google Sheets → new row added with AI score
- ✅ Your email → two emails received (applicant + HR notification)

---

## Environment Variables Summary

Set all of these in Pipedream → Settings → Environment Variables:

| Key | Value |
|---|---|
| `GROQ_API_KEY` | Your Groq API key |
| `GOOGLE_SERVICE_ACCOUNT_EMAIL` | `smartrecruit-n8n@smartrecruit-ai-492003.iam.gserviceaccount.com` |
| `GOOGLE_PRIVATE_KEY` | Full private key from JSON file |
| `HR_EMAIL` | Your email address |

---

## Troubleshooting

| Issue | Fix |
|---|---|
| Webhook not receiving data | Check Apps Script trigger is installed + WEBHOOK_URL is correct |
| Groq AI error | Check `GROQ_API_KEY` environment variable is set correctly |
| Google Sheets error | Verify Sheet ID is correct + service account has Editor access |
| Email not received | Check spam folder — Pipedream emails sometimes go to spam |
| Step error in Pipedream | Click the failed step → read the error message in the Logs tab |

---

## Portfolio Write-up

### GitHub README
```
SmartRecruit AI — Automated Recruitment Pipeline with AI-Powered Candidate Scoring

An end-to-end recruitment automation system built with Pipedream, Groq AI (LLaMA 3.1),
Google Forms, Google Sheets, and Google Apps Script.

Key Features:
✅ Real-time application intake via Google Form + Apps Script webhook
✅ AI-powered candidate scoring (0–100) using Groq LLaMA 3.1 8B
✅ Automated professional HTML email notifications (applicant + HR team)
✅ Structured candidate database via Google Sheets
✅ Dynamic AI recommendation engine (PROCEED / REVIEW / REJECT)
✅ 100% free tools — zero infrastructure cost

Tech Stack: Pipedream · Groq AI · Google Apps Script · Google Forms · Google Sheets
```

### LinkedIn Tags
`#pipedream` `#workflowautomation` `#nocode` `#airecruiting` `#groqai` `#webhook` `#googleappsscript` `#automation` `#portfolioproject`

---

*Built with: Pipedream · Groq AI (LLaMA 3.1) · Google Workspace · Apps Script*
*Tools: 100% free · Architecture: production-ready*
