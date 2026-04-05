// ============================================================
// Pipedream Step 2 — Groq AI Candidate Scoring
// Step name : groq_ai_scoring
// Paste this in a "Run Node.js code" step
// ============================================================

import axios from "axios";

export default defineComponent({
  async run({ steps, $ }) {

    // Get validated data from Step 1
    const candidate = steps.validate_data.$return_value;

    // Build the prompt
    const userPrompt = `Evaluate this candidate:
Position: ${candidate.position}
Name: ${candidate.full_name}
Experience: ${candidate.years_experience} years
Cover Letter:
${candidate.cover_letter}`;

    // Call Groq API
    const response = await axios.post(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        model       : "llama-3.1-8b-instant",
        temperature : 0.2,
        max_tokens  : 300,
        messages    : [
          {
            role    : "system",
            content : `You are a professional AI recruiter. Evaluate candidates objectively.
Respond ONLY with a strict JSON object — no markdown, no extra text:
{"score": <number 0-100>, "rekomendasi": "PROCEED" or "REVIEW" or "REJECT", "notes": "<2-3 sentence analysis in English>"}

Scoring rules:
- 80-100: PROCEED (strong fit, advance to interview)
- 50-79:  REVIEW  (partial fit, needs further review)
- 0-49:   REJECT  (does not meet minimum qualifications)

Evaluation factors: experience relevance, cover letter quality, role alignment.
CRITICAL: Respond with JSON only — nothing else.`
          },
          {
            role    : "user",
            content : userPrompt
          }
        ]
      },
      {
        headers: {
          "Authorization" : `Bearer ${process.env.GROQ_API_KEY}`,
          "Content-Type"  : "application/json"
        }
      }
    );

    // Return raw AI response text
    return {
      raw_response : response.data.choices[0].message.content
    };
  }
});
