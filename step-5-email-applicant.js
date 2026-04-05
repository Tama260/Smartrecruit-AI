// ============================================================
// Pipedream Step 5 — Send Confirmation Email to Applicant
// Step name : email_applicant
// Paste this in a "Run Node.js code" step
// Uses Pipedream's built-in $.send.email() — NO SMTP needed!
// ============================================================

export default defineComponent({
  async run({ steps, $ }) {

    const data = steps.parse_ai_response.$return_value;

    // Format date nicely
    const appliedDate = new Date().toLocaleDateString("en-US", {
      year: "numeric", month: "long", day: "numeric",
      hour: "2-digit", minute: "2-digit"
    });

    // Build HTML email
    const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<style>
* { margin: 0; padding: 0; box-sizing: border-box; }
body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background: #f0f4f8; }
.wrap { max-width: 600px; margin: 32px auto; background: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 8px 30px rgba(0,0,0,0.08); }
.header { background: linear-gradient(135deg, #1D9E75 0%, #0F6E56 100%); padding: 44px 36px; text-align: center; }
.logo { font-size: 13px; letter-spacing: 3px; text-transform: uppercase; color: rgba(255,255,255,0.65); margin-bottom: 14px; }
.header h1 { color: #ffffff; font-size: 26px; font-weight: 700; margin-bottom: 8px; }
.header p { color: rgba(255,255,255,0.8); font-size: 14px; line-height: 1.6; }
.badge { display: inline-block; background: rgba(255,255,255,0.18); color: #ffffff; border: 1px solid rgba(255,255,255,0.3); padding: 6px 20px; border-radius: 24px; font-size: 12px; font-weight: 600; margin-top: 16px; }
.body { padding: 40px 36px; }
.greeting { font-size: 17px; color: #1a202c; font-weight: 700; margin-bottom: 12px; }
.body p { color: #4a5568; font-size: 14px; line-height: 1.75; margin-bottom: 20px; }
.card { background: #f7fdfb; border: 1px solid #9FE1CB; border-radius: 12px; padding: 24px; margin: 28px 0; }
.card-row { display: flex; align-items: flex-start; margin-bottom: 14px; gap: 14px; }
.card-row:last-child { margin-bottom: 0; }
.card-label { font-size: 11px; color: #1D9E75; font-weight: 700; text-transform: uppercase; letter-spacing: 0.8px; min-width: 120px; padding-top: 2px; }
.card-value { font-size: 14px; color: #2d3748; font-weight: 500; }
.status-pill { display: inline-flex; align-items: center; gap: 6px; background: #E1F5EE; color: #0F6E56; padding: 4px 14px; border-radius: 20px; font-size: 12px; font-weight: 700; }
.divider { height: 1px; background: #e2e8f0; margin: 28px 0; }
.steps-title { font-size: 13px; font-weight: 700; color: #1a202c; text-transform: uppercase; letter-spacing: 0.8px; margin-bottom: 20px; }
.step { display: flex; align-items: flex-start; gap: 16px; margin-bottom: 18px; }
.step-dot { width: 32px; height: 32px; min-width: 32px; background: #1D9E75; border-radius: 50%; color: #fff; font-size: 13px; font-weight: 700; display: flex; align-items: center; justify-content: center; }
.step-content h4 { font-size: 14px; font-weight: 700; color: #2d3748; margin-bottom: 3px; }
.step-content p { font-size: 13px; color: #718096; margin: 0; line-height: 1.6; }
.footer { background: #1a202c; padding: 28px 36px; }
.footer p { color: #718096; font-size: 12px; text-align: center; line-height: 1.8; }
</style>
</head>
<body>
<div class="wrap">
  <div class="header">
    <div class="logo">SmartRecruit AI</div>
    <h1>Application Received!</h1>
    <p>Our team will review your profile shortly.<br>We appreciate every candidate who takes the time to apply.</p>
    <span class="badge">&#10003; Under Review</span>
  </div>
  <div class="body">
    <p class="greeting">Hi, ${data.full_name}!</p>
    <p>Thank you for applying for the <strong>${data.position}</strong> role at SmartRecruit AI. We have successfully received your application, which is now undergoing initial AI screening.</p>
    <div class="card">
      <div class="card-row">
        <span class="card-label">Full Name</span>
        <span class="card-value">${data.full_name}</span>
      </div>
      <div class="card-row">
        <span class="card-label">Position</span>
        <span class="card-value">${data.position}</span>
      </div>
      <div class="card-row">
        <span class="card-label">Experience</span>
        <span class="card-value">${data.years_experience} year(s)</span>
      </div>
      <div class="card-row">
        <span class="card-label">Applied On</span>
        <span class="card-value">${appliedDate} UTC</span>
      </div>
      <div class="card-row">
        <span class="card-label">Status</span>
        <span class="card-value"><span class="status-pill">&#9679; Under Review</span></span>
      </div>
    </div>
    <div class="divider"></div>
    <p class="steps-title">What Happens Next</p>
    <div class="step">
      <div class="step-dot">1</div>
      <div class="step-content">
        <h4>AI Screening (1–2 days)</h4>
        <p>Our AI system objectively evaluates your profile's fit against the role requirements.</p>
      </div>
    </div>
    <div class="step">
      <div class="step-dot">2</div>
      <div class="step-content">
        <h4>HR Review (2–3 business days)</h4>
        <p>Our HR team reviews the AI screening results and decides which candidates advance.</p>
      </div>
    </div>
    <div class="step">
      <div class="step-dot">3</div>
      <div class="step-content">
        <h4>Result Notification</h4>
        <p>You'll receive an email with your result and, if successful, an interview schedule.</p>
      </div>
    </div>
  </div>
  <div class="footer">
    <p>This email was sent automatically by <strong style="color:#9FE1CB">SmartRecruit AI</strong><br>
    Developed by Daffa Novendra Aditama &nbsp;·&nbsp; SmartRecruit AI System<br>
    Automated Recruitment Pipeline · Groq AI (LLaMA 3.1)<br>
    Please do not reply to this email.</p>
  </div>
</div>
</body>
</html>`;

    // Send email using Pipedream's built-in email — NO SMTP needed!
    await $.send.email({
      subject : `Application Received: ${data.position} — SmartRecruit AI`,
      html    : htmlContent,
      to      : data.email
    });

    return { success: true, sent_to: data.email };
  }
});
