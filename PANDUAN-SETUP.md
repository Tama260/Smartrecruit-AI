# SmartRecruit AI — Panduan Setup Lengkap (Pipedream)
### Sistem Rekrutmen Otomatis Berbasis AI

> **Tools:** Pipedream · Google Forms/Sheets · Groq AI · Google Apps Script  
> **Biaya: Rp 0** — 100% gratis semua

---

## Kenapa Pindah ke Pipedream?

| Fitur | Pipedream | n8n di Railway |
|---|---|---|
| Kirim Email | ✅ Built-in, tanpa SMTP | ❌ Port SMTP diblokir |
| URL Webhook | ✅ Stabil, tidak berubah | ⚠️ Berubah saat redeploy |
| Google Sheets | ✅ Berfungsi normal | ⚠️ OAuth bermasalah |
| Gratis | ✅ 10.000 run/bulan | ✅ Terbatas |

---

## Alur Sistem

```
Google Form
     │
     ▼ (saat form disubmit)
Google Apps Script  ──────► Pipedream Webhook Trigger
                                    │
                             Step 1: Validasi Data
                                    │
                             Step 2: Groq AI Scoring
                             (LLaMA 3.1 — nilai 0–100)
                                    │
                             Step 3: Proses Hasil AI
                                    │
                    ┌───────────────┼───────────────┐
                    ▼               ▼               ▼
             Step 4: Sheets   Step 5: Email   Step 6: Email
             (Simpan data)    (ke Kandidat)   (ke HR/Kamu)
```

---

## Daftar File yang Digunakan

```
smartrecruit-pipedream/
├── apps-script.gs             → Dipasang di Google Sheet Form Responses
├── step-1-validate.js         → Paste di Step 1 Pipedream
├── step-2-groq-ai.js          → Paste di Step 2 Pipedream
├── step-3-parse-ai.js         → Paste di Step 3 Pipedream
├── step-4-sheets.js           → Paste di Step 4 Pipedream
├── step-5-email-applicant.js  → Paste di Step 5 Pipedream
├── step-6-email-hr.js         → Paste di Step 6 Pipedream
└── PANDUAN-SETUP.md           → File ini
```

---

## BAGIAN 0 — DAFTAR TOOLS (SEMUA GRATIS)

### Tool 1: Pipedream
1. Buka: **https://pipedream.com**
2. Klik **"Sign Up"** → daftar pakai email atau GitHub
3. Verifikasi email
4. Setelah masuk → kamu akan melihat dashboard Pipedream

### Tool 2: Groq API (AI Gratis)
1. Buka: **https://console.groq.com**
2. Klik **"Sign In"** → daftar dengan Google atau email
3. Setelah masuk → klik **"API Keys"** di menu kiri
4. Klik **"Create API Key"** → beri nama `smartrecruit`
5. **Copy dan simpan API key-nya** — tidak bisa dilihat lagi setelah ditutup

### Tool 3: Google Account
- Gmail, Google Forms, Google Sheets, Apps Script sudah include
- Tidak perlu daftar lagi

---

## BAGIAN 1 — BUAT GOOGLE SHEETS DATABASE

1. Buka **https://sheets.google.com** → Buat spreadsheet baru
2. Beri nama: **SmartRecruit - Candidate Database**
3. Ketik header kolom ini di **baris pertama** (persis, case-sensitive):

| A | B | C | D | E | F | G | H | I | J | K |
|---|---|---|---|---|---|---|---|---|---|---|
| timestamp | full_name | email | position | years_experience | cover_letter | cv_link | ai_score | ai_rekomendasi | ai_notes | status |

4. Copy **Spreadsheet ID** dari URL browser kamu:
```
https://docs.google.com/spreadsheets/d/INI_YANG_DICOPY/edit
```
Simpan ID ini — dibutuhkan nanti di Step 4 Pipedream.

5. Share sheet ke Service Account:
   - Klik tombol **Share** (pojok kanan atas)
   - Paste email ini:
   ```
   smartrecruit-n8n@smartrecruit-ai-492003.iam.gserviceaccount.com
   ```
   - Ubah role ke **Editor** → klik **Send**

---

## BAGIAN 2 — BUAT GOOGLE FORM

1. Buka **https://forms.google.com** → Buat formulir baru
2. Judul: **Formulir Lamaran Kerja — SmartRecruit AI**
3. Tambahkan **6 pertanyaan persis urutan ini** (urutan tidak boleh dibalik!):

```
Pertanyaan 1: Full Name
              → Jawaban singkat (wajib diisi)

Pertanyaan 2: Email Address
              → Jawaban singkat (wajib diisi)

Pertanyaan 3: Position Applied For
              → Pilihan ganda, isi opsi:
                - Backend Developer
                - Frontend Developer
                - UI/UX Designer
                - Data Analyst
                - Project Manager
                - DevOps Engineer

Pertanyaan 4: Years of Experience
              → Jawaban singkat (wajib diisi)

Pertanyaan 5: Cover Letter
              → Paragraf panjang (wajib diisi)

Pertanyaan 6: CV / Portfolio Link
              → Jawaban singkat (wajib diisi)
```

4. Klik tab **"Responses"** → klik ikon Google Sheets (hijau)
5. Pilih **"Create a new spreadsheet"**
6. Beri nama: `SmartRecruit - Form Responses` → klik **Create**

---

## BAGIAN 3 — SETUP PIPEDREAM WORKFLOW

### Langkah 3.1 — Buat Project Baru
1. Login ke **https://pipedream.com**
2. Klik **"New Project"** di dashboard
3. Nama project: `SmartRecruit AI`
4. Klik **"New Workflow"** di dalam project
5. Nama workflow: `WF1 - Application Intake`

---

### Langkah 3.2 — Tambah Webhook Trigger
1. Klik **"Add a trigger"**
2. Search: `HTTP` → pilih **"HTTP / Webhook"**
3. Pilih **"HTTP API"**
4. Klik **"Generate URL"** atau langsung copy URL yang muncul
5. URL webhook kamu akan terlihat seperti ini:
```
https://eoXXXXXXXXXXXXXXXX.m.pipedream.net
```
**Simpan URL ini** — dibutuhkan untuk Apps Script nanti

---

### Langkah 3.3 — Setup Environment Variables (Lakukan Sebelum Step Lainnya!)

Sebelum tambah step apapun, isi dulu variabel rahasia:

1. Klik ikon akun kamu → **"Settings"**
2. Klik **"Environment Variables"**
3. Klik **"Add Variable"** → tambah satu per satu:

| Key (Nama Variabel) | Value (Isi) |
|---|---|
| `GROQ_API_KEY` | API key dari Groq tadi |
| `GOOGLE_SERVICE_ACCOUNT_EMAIL` | `smartrecruit-n8n@smartrecruit-ai-492003.iam.gserviceaccount.com` |
| `GOOGLE_PRIVATE_KEY` | Seluruh private key dari file JSON (dari -----BEGIN sampai -----END PRIVATE KEY-----) |
| `HR_EMAIL` | Email kamu sendiri (sebagai HR di proyek ini) |

4. Klik **Save** setelah setiap variabel

---

### Langkah 3.4 — Tambah Step 1: Validasi Data
1. Klik **"+"** di bawah trigger → pilih **"Run Node.js code"**
2. Di bagian nama step (kiri atas) → ketik: `validate_data`
3. **Hapus semua kode bawaan** → paste seluruh isi file `step-1-validate.js`
4. Klik **"Test"** untuk cek apakah step berjalan

---

### Langkah 3.5 — Tambah Step 2: Groq AI Scoring
1. Klik **"+"** → **"Run Node.js code"**
2. Nama step: `groq_ai_scoring`
3. Hapus semua kode bawaan → paste seluruh isi file `step-2-groq-ai.js`
4. Klik **"Test"**

> ⚠️ Step ini akan error saat test karena tidak ada data masuk — itu normal.
> Yang penting tidak ada error merah di bagian kode itu sendiri.

---

### Langkah 3.6 — Tambah Step 3: Proses Hasil AI
1. Klik **"+"** → **"Run Node.js code"**
2. Nama step: `parse_ai_response`
3. Paste seluruh isi file `step-3-parse-ai.js`

---

### Langkah 3.7 — Tambah Step 4: Google Sheets
1. Klik **"+"** → **"Run Node.js code"**
2. Nama step: `append_to_sheets`
3. Paste seluruh isi file `step-4-sheets.js`
4. Di dalam kode, cari baris ini:
```javascript
const SPREADSHEET_ID = "REPLACE_WITH_YOUR_GOOGLE_SHEET_ID";
```
5. Ganti `REPLACE_WITH_YOUR_GOOGLE_SHEET_ID` dengan ID sheet kamu dari Bagian 1

---

### Langkah 3.8 — Tambah Step 5: Email ke Kandidat
1. Klik **"+"** → **"Run Node.js code"**
2. Nama step: `email_applicant`
3. Paste seluruh isi file `step-5-email-applicant.js`

> ✅ **Tidak perlu SMTP, tidak perlu Gmail OAuth!**
> Pipedream punya `$.send.email()` bawaan yang kirim email
> dari server Pipedream sendiri — langsung jalan tanpa konfigurasi apapun.

---

### Langkah 3.9 — Tambah Step 6: Email ke HR
1. Klik **"+"** → **"Run Node.js code"**
2. Nama step: `email_hr`
3. Paste seluruh isi file `step-6-email-hr.js`

> Email HR akan dikirim ke alamat yang kamu isi di `HR_EMAIL`
> di Environment Variables tadi.

---

### Langkah 3.10 — Deploy Workflow
1. Klik tombol **"Deploy"** di pojok kanan atas
2. Status harus berubah menjadi **"Active"** (hijau)

---

## BAGIAN 4 — PASANG APPS SCRIPT

1. Buka **SmartRecruit - Form Responses** Google Sheet
   (yang dibuat otomatis dari Google Form di Bagian 2)
2. Klik menu: **Ekstensi → Apps Script**
3. Hapus semua kode bawaan
4. Paste seluruh isi file `apps-script.gs`
5. Ganti `WEBHOOK_URL` dengan URL Pipedream dari Langkah 3.2:
```javascript
var WEBHOOK_URL = "https://eoXXXXXXXXXXXX.m.pipedream.net";
```
6. Klik **Simpan** (ikon disket)
7. Klik ikon **jam alarm ⏰** di menu kiri → **"+ Add Trigger"**:
   - Function to run: `onFormSubmit`
   - Event source: **From spreadsheet**
   - Event type: **On form submit**
8. Klik **Save** → izinkan akses saat diminta

---

## BAGIAN 5 — TEST SISTEM

### Opsi A — Test via PowerShell (Windows)
Buka PowerShell → paste perintah ini (ganti URL dan email):

```powershell
Invoke-WebRequest -Uri "https://PIPEDREAM-WEBHOOK-URL-KAMU.m.pipedream.net" -Method POST -ContentType "application/json" -Body '{"full_name":"Test Kandidat","email":"EMAIL_KAMU@gmail.com","position":"Backend Developer","years_experience":"3","cover_letter":"I have 3 years of experience in Node.js and Python. I am passionate about building scalable backend systems and would love to contribute to your team.","cv_link":"https://example.com/cv.pdf"}'
```

### Opsi B — Test via Google Form
1. Buka Google Form kamu → isi dengan data dummy
2. Submit form
3. Tunggu 30–60 detik

### Verifikasi Hasil
Setelah test, cek 3 tempat ini:

**1. Pipedream → tab "Runs"**
- Harus ada run baru dengan status **hijau ✅**
- Kalau merah, klik run tersebut untuk lihat step mana yang error

**2. Google Sheets**
- Buka SmartRecruit - Candidate Database
- Harus ada baris baru dengan data kandidat + AI score

**3. Inbox Email Kamu**
- Email 1: Konfirmasi lamaran (template kandidat)
- Email 2: Notifikasi HR dengan AI score
- Cek folder **Spam** jika tidak muncul di inbox

---

## BAGIAN 6 — TROUBLESHOOTING

| Masalah | Solusi |
|---|---|
| Webhook tidak menerima data | Cek WEBHOOK_URL di Apps Script sudah benar + trigger sudah dipasang |
| Step Groq error | Cek environment variable `GROQ_API_KEY` sudah diisi dengan benar |
| Step Sheets error | Pastikan Spreadsheet ID benar + service account sudah di-share sebagai Editor |
| Email tidak masuk | Cek folder Spam + pastikan `HR_EMAIL` sudah diset di environment variables |
| Error di Pipedream | Klik step yang merah → baca pesan error di bagian bawah |
| Apps Script error | Buka Apps Script → menu Eksekusi → lihat log error |

---

## BAGIAN 7 — RINGKASAN NAMA STEP (WAJIB PERSIS!)

Nama step di Pipedream harus **persis** seperti ini karena kode saling mereferensikan:

| Nomor | Nama Step | File |
|---|---|---|
| Step 1 | `validate_data` | step-1-validate.js |
| Step 2 | `groq_ai_scoring` | step-2-groq-ai.js |
| Step 3 | `parse_ai_response` | step-3-parse-ai.js |
| Step 4 | `append_to_sheets` | step-4-sheets.js |
| Step 5 | `email_applicant` | step-5-email-applicant.js |
| Step 6 | `email_hr` | step-6-email-hr.js |

---

## BAGIAN 8 — DESKRIPSI UNTUK PORTFOLIO

### Judul Proyek
**SmartRecruit AI — Automated Recruitment Pipeline with AI-Powered Candidate Scoring**

### Deskripsi GitHub (README)
```
An end-to-end recruitment automation system built with Pipedream,
Groq AI (LLaMA 3.1), Google Forms, Google Sheets, and Google Apps Script.

Key Features:
✅ Real-time application intake via Google Form + Apps Script webhook
✅ AI-powered candidate scoring (0–100) using Groq LLaMA 3.1 8B
✅ Automated professional HTML email notifications (applicant + HR team)
✅ Structured candidate database via Google Sheets
✅ Dynamic AI recommendation engine (PROCEED / REVIEW / REJECT)
✅ 100% free tools — zero infrastructure cost

Tech Stack: Pipedream · Groq AI · Google Apps Script · Google Forms · Google Sheets
```

### Tag LinkedIn
`#pipedream` `#workflowautomation` `#nocode` `#airecruiting` `#groqai`
`#webhook` `#googleappsscript` `#automation` `#portfolioproject`

---

*Dibuat dengan: Pipedream · Groq AI (LLaMA 3.1) · Google Workspace · Apps Script*
*Semua tools gratis · Siap untuk portofolio*
