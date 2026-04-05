// ============================================================
// Pipedream WF2 — Bulk Import Kandidat ke Google Sheets
// Step name : bulk_import_data
// Data      : Realistic dummy data (fiktif, bukan orang asli)
// ============================================================

import { google } from "googleapis";
import { JWT } from "google-auth-library";

export default defineComponent({
  async run({ steps, $ }) {

    const kandidat = [
      {
        timestamp        : "2026-03-10T08:23:11.000Z",
        full_name        : "Alexander Hartley",
        email            : "alex.hartley@protonmail.com",
        position         : "Backend Developer",
        years_experience : "5",
        cover_letter     : "With 5 years of backend development experience using Node.js, Go, and PostgreSQL, I have led API architecture for two SaaS products serving over 50,000 users. I am drawn to SmartRecruit AI's mission of making hiring more objective and data-driven, and I believe my background in building high-throughput systems would be a strong contribution to your engineering team.",
        cv_link          : "https://alexhartley.dev/resume",
        ai_score         : 92,
        ai_rekomendasi   : "PROCEED",
        ai_notes         : "Exceptionally strong backend profile with proven scale experience. Leadership in API architecture and relevant stack make this candidate a top pick. Highly recommended for immediate interview.",
        status           : "Under Review",
        notified         : ""
      },
      {
        timestamp        : "2026-03-11T09:45:33.000Z",
        full_name        : "Priya Menon",
        email            : "priya.menon@outlook.com",
        position         : "UI/UX Designer",
        years_experience : "4",
        cover_letter     : "I am a product designer with 4 years of experience crafting user-centered interfaces for fintech and e-commerce platforms. My process combines user research, rapid prototyping in Figma, and usability testing. At my previous company, a redesigned onboarding flow I led resulted in a 34% improvement in activation rate. I am excited to bring this results-driven approach to SmartRecruit AI.",
        cv_link          : "https://priyamenon.design/portfolio",
        ai_score         : 89,
        ai_rekomendasi   : "PROCEED",
        ai_notes         : "Strong design portfolio with measurable business impact. Fintech and e-commerce experience is directly transferable. User research skills are a clear differentiator.",
        status           : "Interview",
        notified         : ""
      },
      {
        timestamp        : "2026-03-12T11:02:54.000Z",
        full_name        : "Marcus Webb",
        email            : "marcus.webb.dev@gmail.com",
        position         : "DevOps Engineer",
        years_experience : "3",
        cover_letter     : "I have spent the last 3 years building and maintaining CI/CD pipelines, Kubernetes clusters, and cloud infrastructure on AWS and GCP. I am comfortable with Terraform, Helm, and GitOps workflows. I value reliability engineering and have reduced deployment downtime by 60% at my current employer through automated rollback strategies.",
        cv_link          : "https://github.com/marcuswebb",
        ai_score         : 85,
        ai_rekomendasi   : "PROCEED",
        ai_notes         : "Solid DevOps profile with hands-on Kubernetes and cloud experience. Quantified impact on deployment reliability is impressive. Recommended to proceed.",
        status           : "Under Review",
        notified         : ""
      },
      {
        timestamp        : "2026-03-13T14:18:07.000Z",
        full_name        : "Sofia Andersen",
        email            : "sofia.andersen@yahoo.com",
        position         : "Data Analyst",
        years_experience : "2",
        cover_letter     : "I recently completed my second year as a data analyst at a retail company, where I built dashboards in Tableau and automated weekly reporting with Python. I am confident in SQL and have started exploring machine learning with scikit-learn. I am looking for an environment where I can grow into more advanced analytics work.",
        cv_link          : "https://linkedin.com/in/sofiaandersen",
        ai_score         : 68,
        ai_rekomendasi   : "REVIEW",
        ai_notes         : "Candidate shows good foundational skills and growth mindset. However, experience is still limited at 2 years. Recommend further review to assess potential and fit for the team's current needs.",
        status           : "REVIEW",
        notified         : ""
      },
      {
        timestamp        : "2026-03-14T10:30:22.000Z",
        full_name        : "James Okafor",
        email            : "james.okafor@gmail.com",
        position         : "Project Manager",
        years_experience : "7",
        cover_letter     : "I am a PMP-certified project manager with 7 years of experience delivering software projects in agile environments. I have managed cross-functional teams of up to 20 people and consistently delivered on time and within scope. My most recent project — a platform migration for a 300-person organization — was completed 2 weeks ahead of schedule.",
        cv_link          : "https://jamesokafor.com/cv",
        ai_score         : 96,
        ai_rekomendasi   : "PROCEED",
        ai_notes         : "Outstanding candidate. 7 years experience with PMP certification and a verifiable track record of on-time delivery. Ahead-of-schedule delivery record sets this candidate apart. Strongly recommended.",
        status           : "Interview",
        notified         : ""
      },
      {
        timestamp        : "2026-03-15T13:55:41.000Z",
        full_name        : "Nadia Kusuma",
        email            : "nadia.kusuma@gmail.com",
        position         : "Frontend Developer",
        years_experience : "3",
        cover_letter     : "I have 3 years of experience building responsive web applications using React, TypeScript, and Tailwind CSS. I take pride in writing clean, accessible code and have contributed to open-source component libraries. I am currently seeking a role where I can work closely with designers to bridge the gap between design and engineering.",
        cv_link          : "https://nadiakusuma.dev",
        ai_score         : 83,
        ai_rekomendasi   : "PROCEED",
        ai_notes         : "Strong frontend profile with relevant modern stack. Open-source contributions signal genuine passion for craft. Accessibility focus is a valuable differentiator for product-focused teams.",
        status           : "Under Review",
        notified         : ""
      },
      {
        timestamp        : "2026-03-16T09:12:18.000Z",
        full_name        : "Ethan Blackwood",
        email            : "ethan.blackwood@hotmail.com",
        position         : "Backend Developer",
        years_experience : "1",
        cover_letter     : "I recently graduated with a Computer Science degree and have been building personal projects in Django and FastAPI. I am a quick learner and highly motivated to grow in a professional environment. I am comfortable with Git and have basic knowledge of Docker.",
        cv_link          : "https://github.com/ethanblackwood",
        ai_score         : 41,
        ai_rekomendasi   : "REJECT",
        ai_notes         : "Candidate shows enthusiasm but lacks the professional experience required for this role. Personal projects are a positive signal but do not substitute for production-level experience. Not recommended at this stage.",
        status           : "Rejected",
        notified         : ""
      },
      {
        timestamp        : "2026-03-17T15:44:09.000Z",
        full_name        : "Yuki Tanaka",
        email            : "yuki.tanaka@protonmail.com",
        position         : "Data Analyst",
        years_experience : "4",
        cover_letter     : "With 4 years in data analytics at a logistics company, I have built end-to-end pipelines using Python, Spark, and BigQuery. I led a demand forecasting initiative that reduced overstock costs by 22%. I am passionate about translating complex data into clear business narratives and am looking for a high-impact analytics role.",
        cv_link          : "https://linkedin.com/in/yukitanaka-data",
        ai_score         : 91,
        ai_rekomendasi   : "PROCEED",
        ai_notes         : "Highly impressive profile. Big data experience with Spark and BigQuery is well above average for this role. Quantified cost reduction impact demonstrates clear business value. Strongly recommended.",
        status           : "Under Review",
        notified         : ""
      },
      {
        timestamp        : "2026-03-18T08:05:57.000Z",
        full_name        : "Camille Dubois",
        email            : "camille.dubois@outlook.com",
        position         : "UI/UX Designer",
        years_experience : "2",
        cover_letter     : "I am a junior designer with 2 years of experience working on mobile app design for a startup. I have good knowledge of Figma and enjoy conducting user interviews. I am looking for a supportive team where I can continue to grow my design skills and take on more ownership.",
        cv_link          : "https://behance.net/camilledubois",
        ai_score         : 58,
        ai_rekomendasi   : "REVIEW",
        ai_notes         : "Candidate has potential but limited professional experience. Startup background is relevant but the portfolio needs further evaluation to assess depth. Consider for junior-level opening if available.",
        status           : "REVIEW",
        notified         : ""
      },
      {
        timestamp        : "2026-03-19T11:27:43.000Z",
        full_name        : "Ravi Sharma",
        email            : "ravi.sharma.pm@gmail.com",
        position         : "Project Manager",
        years_experience : "5",
        cover_letter     : "I have 5 years of experience managing SaaS product development projects using Scrum and Kanban. I have worked closely with engineering, design, and business stakeholders to align priorities and drive delivery. I am skilled in Jira, Confluence, and stakeholder communication, and I have a strong track record of managing scope creep effectively.",
        cv_link          : "https://ravisharma.io/portfolio",
        ai_score         : 78,
        ai_rekomendasi   : "REVIEW",
        ai_notes         : "Solid project management background with relevant SaaS experience. Does not hold a PMP certification which is preferred for this role. Stakeholder management skills are a plus. Recommend HR review before advancing.",
        status           : "Under Review",
        notified         : ""
      }
    ];

    // --------------------------------------------------------
    // KONFIGURASI — Spreadsheet ID
    // --------------------------------------------------------
    const SPREADSHEET_ID = "1btf--CI9m3k0GzMVeE35tWV9EsTA_6YzGcPzaB4REFQ";

    // --------------------------------------------------------
    // AUTENTIKASI GOOGLE
    // --------------------------------------------------------
    const auth = new JWT({
      email  : process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
      key    : process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, "\n"),
      scopes : ["https://www.googleapis.com/auth/spreadsheets"]
    });

    const sheets = google.sheets({ version: "v4", auth });

    // --------------------------------------------------------
    // APPEND SEMUA DATA SEKALIGUS
    // --------------------------------------------------------
    const rows = kandidat.map(k => [
      k.timestamp,
      k.full_name,
      k.email,
      k.position,
      k.years_experience,
      k.cover_letter,
      k.cv_link,
      k.ai_score,
      k.ai_rekomendasi,
      k.ai_notes,
      k.status,
      k.notified
    ]);

    await sheets.spreadsheets.values.append({
      spreadsheetId    : SPREADSHEET_ID,
      range            : "Sheet1!A:L",
      valueInputOption : "RAW",
      requestBody      : { values: rows }
    });

    return {
      success        : true,
      total_imported : kandidat.length,
      message        : `${kandidat.length} candidates imported successfully`
    };
  }
});
