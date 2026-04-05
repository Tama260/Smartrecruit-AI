/**
 * ============================================================
 * SmartRecruit AI — Google Apps Script
 * File    : apps-script.gs
 * Purpose : Bridge between Google Form and Pipedream via Webhook
 * Install : Attach to the Google Sheet linked to your Form
 * ============================================================
 *
 * HOW TO INSTALL:
 *  1. Open the Google Sheet connected to your Google Form
 *  2. Click Extensions → Apps Script
 *  3. Delete all existing code, paste this entire file
 *  4. Replace WEBHOOK_URL with your Pipedream webhook URL
 *  5. Click Save (disk icon)
 *  6. Go to Triggers (clock icon) → Add Trigger
 *     - Function to run : onFormSubmit
 *     - Event source    : From spreadsheet
 *     - Event type      : On form submit
 *  7. Click Save and grant permissions when prompted
 */

// ============================================================
// CONFIGURATION — Replace with your Pipedream Webhook URL
// Format: https://eo........pipedream.net
// ============================================================
var WEBHOOK_URL = "https://REPLACE-WITH-YOUR-PIPEDREAM-WEBHOOK-URL.m.pipedream.net";

// ============================================================
// MAIN FUNCTION — Auto-triggered on every form submission
// ============================================================
function onFormSubmit(e) {
  try {
    var responses = e.response.getItemResponses();

    var payload = {
      timestamp         : new Date().toISOString(),
      full_name         : getResponse(responses, 0),  // Q1: Full Name
      email             : getResponse(responses, 1),  // Q2: Email Address
      position          : getResponse(responses, 2),  // Q3: Position Applied
      years_experience  : getResponse(responses, 3),  // Q4: Years of Experience
      cover_letter      : getResponse(responses, 4),  // Q5: Cover Letter
      cv_link           : getResponse(responses, 5),  // Q6: CV / Portfolio Link
      source            : "google_form_webhook"
    };

    var options = {
      method            : "post",
      contentType       : "application/json",
      payload           : JSON.stringify(payload),
      muteHttpExceptions: true
    };

    var response = UrlFetchApp.fetch(WEBHOOK_URL, options);
    Logger.log("Status: " + response.getResponseCode());
    Logger.log("Payload sent: " + JSON.stringify(payload));

  } catch (err) {
    Logger.log("ERROR in onFormSubmit: " + err.toString());
  }
}

// ============================================================
// HELPER — Safe response getter
// ============================================================
function getResponse(responses, index) {
  if (responses[index]) {
    var val = responses[index].getResponse();
    return (val !== null && val !== undefined) ? String(val).trim() : "";
  }
  return "";
}

// ============================================================
// TEST FUNCTION — Run manually to verify webhook is working
// ============================================================
function testWebhook() {
  var testPayload = {
    timestamp        : new Date().toISOString(),
    full_name        : "John Doe (Test)",
    email            : "YOUR_EMAIL@gmail.com",
    position         : "Backend Developer",
    years_experience : "3",
    cover_letter     : "I am highly motivated and bring 3 years of hands-on experience in backend development using Node.js and Python. I am eager to contribute to a fast-growing tech team.",
    cv_link          : "https://example.com/cv-test.pdf",
    source           : "manual_test"
  };

  var options = {
    method            : "post",
    contentType       : "application/json",
    payload           : JSON.stringify(testPayload),
    muteHttpExceptions: true
  };

  var response = UrlFetchApp.fetch(WEBHOOK_URL, options);
  Logger.log("Response Code: " + response.getResponseCode());
  Logger.log("Response Body: " + response.getContentText());
  Logger.log("Test complete! Check your Pipedream workflow.");
}
