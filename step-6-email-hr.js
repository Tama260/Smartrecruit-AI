// ============================================================
// Pipedream Step 6 — Send AI Score Notification to HR
// Step name : email_hr
// Paste this in a "Run Node.js code" step
// Uses Pipedream's built-in $.send.email() — NO SMTP needed!
// ============================================================

export default defineComponent({
  async run({ steps, $ }) {

    const data = steps.parse_ai_response.$return_value;

    // Color coding based on score
    const scoreColor = data.ai_score >= 80 ? "#22c55e"
                     : data.ai_score >= 50 ? "#f59e0b"
                     : "#ef4444";

    const recColor = data.ai_rekomendasi === "PROCEED" ? { bg: "#052e16", text: "#86efac", border: "#166534" }
                   : data.ai_rekomendasi === "REVIEW"  ? { bg: "#1c1917", text: "#fcd34d", border: "#92400e" }
                   : { bg: "#1c0b0b", text: "#fca5a5", border: "#7f1d1d" };

    const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<style>
* { margin: 0; padding: 0; box-sizing: border-box; }
body { font-family: 'Segoe UI', Tahoma, sans-serif; background: #0f172a; }
.wrap { max-width: 600px; margin: 32px auto; background: #1e293b; border-radius: 16px; overflow: hidden; border: 1px solid #334155; }
.top-bar { background: #0f172a; padding: 14px 28px; display: flex; align-items: center; justify-content: space-between; }
.logo { color: #38bdf8; font-size: 12px; font-weight: 700; letter-spacing: 2px; text-transform: uppercase; }
.time { color: #64748b; font-size: 11px; }
.score-hero { background: #0f172a; padding: 36px; text-align: center; border-bottom: 1px solid #334155; }
.score-label { font-size: 11px; color: #64748b; text-transform: uppercase; letter-spacing: 2px; margin-bottom: 14px; }
.score-number { font-size: 80px; font-weight: 800; color: ${scoreColor}; line-height: 1; letter-spacing: -4px; }
.score-sub { font-size: 12px; color: #64748b; margin-top: 8px; text-transform: uppercase; letter-spacing: 1.5px; }
.score-bar-bg { background: #334155; border-radius: 8px; height: 6px; overflow: hidden; margin: 16px 0; }
.score-bar-fill { height: 100%; border-radius: 8px; background: ${scoreColor}; width: ${data.ai_score}%; }
.rec-badge { display: inline-block; background: ${recColor.bg}; color: ${recColor.text}; border: 1px solid ${recColor.border}; padding: 8px 24px; border-radius: 24px; font-size: 13px; font-weight: 700; letter-spacing: 1px; text-transform: uppercase; margin-top: 8px; }
.body { padding: 32px 28px; }
.section-head { font-size: 10px; color: #475569; font-weight: 700; text-transform: uppercase; letter-spacing: 2px; padding-bottom: 10px; border-bottom: 1px solid #334155; margin-bottom: 18px; }
.grid2 { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 24px; }
.data-box { background: #0f172a; border: 1px solid #334155; border-radius: 8px; padding: 14px 16px; }
.lbl { font-size: 10px; color: #475569; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 5px; font-weight: 600; }
.val { font-size: 14px; color: #e2e8f0; font-weight: 600; }
.val.small { font-size: 12px; word-break: break-all; }
.ai-box { background: #0c1a2e; border: 1px solid #1e3a5f; border-radius: 10px; padding: 20px; margin-bottom: 24px; }
.ai-head { font-size: 11px; color: #38bdf8; font-weight: 700; text-transform: uppercase; letter-spacing: 1.5px; margin-bottom: 10px; }
.ai-box p { font-size: 14px; color: #93c5fd; line-height: 1.7; }
.cv-btn { display: block; background: #1d4ed8; color: #ffffff; text-align: center; padding: 14px; border-radius: 8px; text-decoration: none; font-size: 14px; font-weight: 700; margin-bottom: 12px; }
.divider { height: 1px; background: #334155; margin: 24px 0; }
.info-small { font-size: 12px; color: #64748b; line-height: 1.7; text-align: center; }
.footer { background: #0f172a; padding: 20px 28px; border-top: 1px solid #1e293b; }
.footer p { font-size: 11px; color: #475569; text-align: center; line-height: 1.8; }
</style>
</head>
<body>
<div class="wrap">
  <div class="top-bar">
    <span class="logo">SmartRecruit AI — HR Dashboard</span>
    <span class="time">${new Date().toUTCString()}</span>
  </div>
  <div class="score-hero">
    <div class="score-label">AI Compatibility Score</div>
    <div class="score-number">${data.ai_score}</div>
    <div class="score-sub">out of 100 points</div>
    <div class="score-bar-bg"><div class="score-bar-fill"></div></div>
    <span class="rec-badge">&#10003; ${data.ai_rekomendasi}</span>
  </div>
  <div class="body">
    <div class="section-head">Applicant Profile</div>
    <div class="grid2">
      <div class="data-box"><div class="lbl">Full Name</div><div class="val">${data.full_name}</div></div>
      <div class="data-box"><div class="lbl">Position Applied</div><div class="val">${data.position}</div></div>
      <div class="data-box"><div class="lbl">Email</div><div class="val small">${data.email}</div></div>
      <div class="data-box"><div class="lbl">Experience</div><div class="val">${data.years_experience} year(s)</div></div>
    </div>
    <div class="section-head">AI Analysis — Groq LLaMA 3.1</div>
    <div class="ai-box">
      <div class="ai-head">AI Recruiter Notes</div>
      <p>${data.ai_notes}</p>
    </div>
    <a href="${data.cv_link || '#'}" class="cv-btn">View Applicant CV / Portfolio</a>
    <div class="divider"></div>
    <p class="info-small">
      Application received: ${new Date().toUTCString()}<br>
      Update the status in Google Sheets to trigger candidate notifications.
    </p>
  </div>
  <div class="footer">
    <p>SmartRecruit AI &nbsp;·&nbsp; Developed by Daffa Novendra Aditama<br>
    End-to-End Recruitment Automation · AI-Powered Candidate Scoring<br>
    github.com/Tama260.</p>
  </div>
</div>
</body>
</html>`;

    // Send email using Pipedream's built-in email — NO SMTP needed!
    await $.send.email({
      subject : `[SmartRecruit AI] New Applicant: ${data.full_name} — Score: ${data.ai_score}/100`,
      html    : htmlContent,
      to      : process.env.HR_EMAIL  // Set this in Pipedream Environment Variables
    });

    return { success: true, score: data.ai_score, recommendation: data.ai_rekomendasi };
  }
});
