// ============================================================
// Pipedream Step 1 — Validate & Clean Input Data
// Step name : validate_data
// Paste this in a "Run Node.js code" step after the Trigger
// ============================================================

export default defineComponent({
  async run({ steps, $ }) {

    // Get data from the webhook trigger
    const raw = steps.trigger.event.body;

    // Validate required fields
    const required = ["full_name", "email", "position", "years_experience", "cover_letter"];
    for (const field of required) {
      if (!raw[field] || String(raw[field]).trim() === "") {
        throw new Error(`Missing required field: ${field}`);
      }
    }

    // Clean and return validated data
    return {
      timestamp        : raw.timestamp || new Date().toISOString(),
      full_name        : String(raw.full_name).trim(),
      email            : String(raw.email).toLowerCase().trim(),
      position         : String(raw.position).trim(),
      years_experience : String(raw.years_experience).trim(),
      cover_letter     : String(raw.cover_letter).trim(),
      cv_link          : String(raw.cv_link || "").trim(),
      source           : raw.source || "form"
    };
  }
});
