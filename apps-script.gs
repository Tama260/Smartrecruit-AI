var WEBHOOK_URL = "https://eosfq8vdie6mgq5.m.pipedream.net";

function onFormSubmit(e) {
  try {
    // Trigger "Dari Spreadsheet" menggunakan e.values, bukan e.response
    var values = e.values;

    var payload = {
      timestamp        : values[0] || new Date().toISOString(),
      full_name        : values[1] || "",
      email            : values[2] || "",
      position         : values[3] || "",
      years_experience : values[4] || "",
      cover_letter     : values[5] || "",
      cv_link          : values[6] || "",
      source           : "google_form_webhook"
    };

    var options = {
      method            : "post",
      contentType       : "application/json",
      payload           : JSON.stringify(payload),
      muteHttpExceptions: true
    };

    var response = UrlFetchApp.fetch(WEBHOOK_URL, options);
    Logger.log("Status: " + response.getResponseCode());
    Logger.log("Payload: " + JSON.stringify(payload));

  } catch (err) {
    Logger.log("ERROR: " + err.toString());
  }
}
