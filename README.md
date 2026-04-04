# SmartRecruit AI
### Automated Recruitment Pipeline with AI-Powered Candidate Scoring

![Status](https://img.shields.io/badge/Status-Active-brightgreen)
![Tools](https://img.shields.io/badge/Tools-Pipedream%20·%20Groq%20AI%20·%20Google%20Workspace-blue)
![Cost](https://img.shields.io/badge/Infrastructure%20Cost-$0-success)

An end-to-end recruitment automation system that handles the full hiring pipeline —
from Google Form submission to AI evaluation to inbox delivery —
with **zero manual intervention**.

---

## How It Works

```
Applicant fills Google Form
         ↓
Apps Script sends data via webhook
         ↓
Pipedream WF1 → validates → Groq AI scores (0–100) → stores in Google Sheets
         ↓
Email to applicant (confirmation) + Email to HR (AI score + analysis)
         ↓
HR updates candidate status in Google Sheets
         ↓
Pipedream WF3 detects change → sends tailored email automatically
```

---

## Three Workflows

| Workflow | Trigger | Function |
|---|---|---|
| **WF1** — Application Intake | Google Form submission (webhook) | Validate → Score with AI → Save to Sheets → Send emails |
| **WF2** — Bulk Import | Manual trigger | Batch-load multiple candidate records into Sheets |
| **WF3** — Status Notification | Schedule (every 5 min) | Detect status change → send interview / offer / rejection email |

---

## Tech Stack

| Tool | Role |
|---|---|
| **Pipedream** | Workflow automation engine |
| **Groq AI (LLaMA 3.1 8B)** | Candidate scoring — 0 to 100 |
| **Google Apps Script** | Webhook bridge from Form to pipeline |
| **Google Forms** | Application intake |
| **Google Sheets** | Structured candidate database |
| **Brevo API** | Transactional email delivery |
| **Google Cloud** | Service account authentication |
| **GitHub** | Version control |

**Infrastructure cost: $0** — built entirely on free tiers

---

## Key Features

- LLM-powered scoring engine — **PROCEED / REVIEW / REJECT**
- Real-time webhook pipeline — form to inbox in under 60 seconds
- Dual-channel HTML email (applicant confirmation + HR AI report)
- Live candidate database with status tracking in Google Sheets
- Status-triggered email automation (interview, offer, rejection)
- Duplicate prevention via `notified` column tracking
- Modular 6-step pipeline — each step independently testable

---

## Project Structure

```
smartrecruit-ai/
├── apps-script.gs                  # Google Apps Script — Form to Pipedream bridge
├── step-1-validate.js              # Pipedream WF1 Step 1 — Validate input data
├── step-2-groq-ai.js               # Pipedream WF1 Step 2 — Groq AI scoring
├── step-3-parse-ai.js              # Pipedream WF1 Step 3 — Parse AI response
├── step-4-sheets.js                # Pipedream WF1 Step 4 — Append to Google Sheets
├── step-5-email-applicant-fixed.js # Pipedream WF1 Step 5 — Email to applicant
├── step-6-email-hr-fixed.js        # Pipedream WF1 Step 6 — Email to HR team
├── wf2-bulk-import-realistic.js    # Pipedream WF2 — Bulk candidate import
├── wf3-step1-check-status.js       # Pipedream WF3 Step 1 — Check status changes
├── wf3-step2-send-email.js         # Pipedream WF3 Step 2 — Send status emails
└── README.md
```

---

## Google Sheets Database Schema

| Column | Field | Filled By |
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
| K | status | HR updates manually |
| L | notified | WF3 automatic |

---

## Environment Variables

Set these in Pipedream → Settings → Environment Variables:

| Key | Description |
|---|---|
| `GROQ_API_KEY` | Groq API key from console.groq.com |
| `GOOGLE_SERVICE_ACCOUNT_EMAIL` | Google Cloud service account email |
| `GOOGLE_PRIVATE_KEY` | Private key from service account JSON |
| `BREVO_API_KEY` | Brevo API key for email delivery |
| `BREVO_SENDER_EMAIL` | Verified sender email in Brevo |
| `HR_EMAIL` | HR team email for notifications |

---

## Setup Guide

See `PANDUAN-SETUP.md` for the complete step-by-step setup guide in Bahasa Indonesia,
or `SETUP-GUIDE.md` for the English version.

---

## Author

**Daffa Novendra Aditama**
AI Automation Engineer | Workflow Integration Specialist

- Email: daffanovendraa@gmail.com
- LinkedIn: [linkedin.com/in/daffanovendraaditama](https://linkedin.com/in/daffanovendraaditama)
- Portfolio: *(add your portfolio link here)*

---

*Built with Pipedream · Groq AI · Google Workspace · Brevo · 100% free infrastructure*
