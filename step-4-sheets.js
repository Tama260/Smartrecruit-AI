// ============================================================
// Pipedream Step 4 — Append Candidate to Google Sheets
// Step name : append_to_sheets
// Paste this in a "Run Node.js code" step
// Uses Google Sheets API with Service Account
// ============================================================

import { JWT } from "google-auth-library";
import { google } from "googleapis";

export default defineComponent({
  async run({ steps, $ }) {

    const data = steps.parse_ai_response.$return_value;

    // --------------------------------------------------------
    // CONFIGURATION — Replace these values
    // --------------------------------------------------------
    const SPREADSHEET_ID = "REPLACE_WITH_YOUR_GOOGLE_SHEET_ID";
    // Get Sheet ID from URL:
    // https://docs.google.com/spreadsheets/d/SHEET_ID_IS_HERE/edit

    // Service account credentials from your JSON file
    const SERVICE_ACCOUNT_EMAIL = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
    const PRIVATE_KEY            = process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, "\n");
    // --------------------------------------------------------

    // Authenticate with Google
    const auth = new JWT({
      email  : SERVICE_ACCOUNT_EMAIL,
      key    : PRIVATE_KEY,
      scopes : ["https://www.googleapis.com/auth/spreadsheets"]
    });

    const sheets = google.sheets({ version: "v4", auth });

    // Row data — order must match your Sheet column headers
    const rowData = [
      data.timestamp,
      data.full_name,
      data.email,
      data.position,
      data.years_experience,
      data.cover_letter,
      data.cv_link,
      data.ai_score,
      data.ai_rekomendasi,
      data.ai_notes,
      data.status
    ];

    // Append to Sheet
    await sheets.spreadsheets.values.append({
      spreadsheetId  : SPREADSHEET_ID,
      range          : "Sheet1!A:K",
      valueInputOption: "RAW",
      requestBody    : {
        values: [rowData]
      }
    });

    return { success: true, candidate: data.full_name };
  }
});
