// ============================================================
// Pipedream Step 3 — Parse & Merge AI Response
// Step name : parse_ai_response
// Paste this in a "Run Node.js code" step
// ============================================================

export default defineComponent({
  async run({ steps, $ }) {

    // Get data from previous steps
    const candidate = steps.validate_data.$return_value;
    let rawText     = steps.groq_ai_scoring.$return_value.raw_response;

    // Strip markdown code fences if Groq wraps JSON in ```json ... ```
    rawText = rawText
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();

    // Parse JSON from Groq
    let aiResult;
    try {
      aiResult = JSON.parse(rawText);
    } catch (e) {
      // Fallback if Groq returns malformed JSON
      aiResult = {
        score         : 50,
        rekomendasi   : "REVIEW",
        notes         : "AI system could not generate an analysis. Please review manually."
      };
    }

    // Validate and sanitize score
    const score = Math.min(100, Math.max(0, parseInt(aiResult.score) || 50));

    // Validate recommendation
    const validRecs = ["PROCEED", "REVIEW", "REJECT"];
    let rekomendasi = (aiResult.rekomendasi || "REVIEW").toUpperCase();
    if (!validRecs.includes(rekomendasi)) {
      rekomendasi = score >= 80 ? "PROCEED" : score >= 50 ? "REVIEW" : "REJECT";
    }

    const notes = aiResult.notes || "No notes provided.";

    // Return merged candidate + AI data
    return {
      // Candidate info
      timestamp        : candidate.timestamp,
      full_name        : candidate.full_name,
      email            : candidate.email,
      position         : candidate.position,
      years_experience : candidate.years_experience,
      cover_letter     : candidate.cover_letter,
      cv_link          : candidate.cv_link,
      // AI results
      ai_score         : score,
      ai_rekomendasi   : rekomendasi,
      ai_notes         : notes,
      // Pipeline status
      status           : "Under Review",
      processed_at     : new Date().toISOString()
    };
  }
});
