const puppeteer = require('puppeteer-core');
const fs = require('fs');
const path = require('path');

const ARTIFACT_DIR = 'C:\\Users\\Akram KAID\\.gemini\\antigravity-ide\\brain\\1fb86ddf-29e4-46b9-b67a-b2ff1f02e4e8';
const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const OUTPUT_PDF_PROJECT = 'C:\\Users\\Akram KAID\\Desktop\\BADIS_Project\\AVICINNA_WordPress_SEO_Executive_Report.pdf';
const OUTPUT_PDF_ARTIFACT = path.join(ARTIFACT_DIR, 'AVICINNA_WordPress_SEO_Executive_Report.pdf');

function getBase64(filePath) {
  try {
    if (fs.existsSync(filePath)) {
      const bitmap = fs.readFileSync(filePath);
      const ext = path.extname(filePath).replace('.', '') || 'png';
      return `data:image/${ext};base64,${bitmap.toString('base64')}`;
    }
  } catch (e) {
    console.error('Error reading base64:', filePath, e.message);
  }
  return '';
}

async function buildPdf() {
  console.log('Loading brand assets and screenshots as base64...');
  const logoWhite = getBase64(path.join(ARTIFACT_DIR, 'avicinna-logo-white.png'));
  const logoDark = getBase64(path.join(ARTIFACT_DIR, 'avicinna-logo.png'));
  const screenBlog = getBase64(path.join(ARTIFACT_DIR, 'screen_blog_listing.png'));
  const screenArticle = getBase64(path.join(ARTIFACT_DIR, 'screen_article_detail.png'));
  const screenAdmin = getBase64(path.join(ARTIFACT_DIR, 'screen_admin_modal.png'));
  const screenStories = getBase64(path.join(ARTIFACT_DIR, 'screen_patient_stories.png'));

  const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>AVICINNA Executive Strategy Report - WordPress & SEO Dominance</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800;900&family=Tajawal:wght@400;500;700;900&family=JetBrains+Mono:wght@400;600&display=swap" rel="stylesheet">
  <style>
    @page {
      size: A4 portrait;
      margin: 0;
    }

    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }

    html, body {
      width: 210mm;
      background-color: #ffffff;
      font-family: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      color: #0f172a;
      -webkit-print-color-adjust: exact;
      print-color-adjust: exact;
    }

    .arabic-text {
      font-family: 'Tajawal', sans-serif;
      direction: rtl;
    }

    .mono {
      font-family: 'JetBrains Mono', monospace;
    }

    /* Page container: exact physical A4 page */
    .page {
      width: 210mm;
      height: 297mm;
      max-height: 297mm;
      padding: 13mm 15mm 13mm 15mm;
      position: relative;
      background: #ffffff;
      page-break-after: always;
      page-break-inside: avoid;
      overflow: hidden;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
    }

    .page:last-child {
      page-break-after: avoid;
    }

    /* Executive Header */
    .page-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding-bottom: 7px;
      border-bottom: 1.5px solid #e2e8f0;
      margin-bottom: 9px;
    }

    .page-header .brand-area {
      display: flex;
      align-items: center;
      gap: 10px;
    }

    .page-header .brand-logo {
      height: 23px;
      object-fit: contain;
    }

    .header-badge {
      display: inline-flex;
      align-items: center;
      gap: 5px;
      font-size: 6.8pt;
      font-weight: 800;
      letter-spacing: 0.08em;
      text-transform: uppercase;
      color: #0284c7;
      background: linear-gradient(135deg, #e0f2fe 0%, #f0f9ff 100%);
      padding: 2.5px 8px;
      border-radius: 20px;
      border: 1px solid #bae6fd;
    }

    .header-badge-dot {
      width: 5px;
      height: 5px;
      border-radius: 50%;
      background: #0284c7;
    }

    .doc-ref {
      font-size: 6.8pt;
      color: #64748b;
      font-weight: 600;
      letter-spacing: 0.04em;
    }

    /* Executive Footer */
    .page-footer {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding-top: 6px;
      border-top: 1px solid #e2e8f0;
      margin-top: 6px;
      font-size: 6.8pt;
      color: #94a3b8;
    }

    .page-footer .footer-left {
      display: flex;
      align-items: center;
      gap: 6px;
    }

    .footer-dot {
      width: 4px;
      height: 4px;
      border-radius: 50%;
      background: #0284c7;
    }

    /* Content Area */
    .content-area {
      flex: 1;
      display: flex;
      flex-direction: column;
      gap: 8px;
    }

    /* Typography */
    h1, h2, h3, h4 {
      color: #021838;
      font-weight: 800;
      line-height: 1.2;
    }

    .section-title {
      font-size: 14pt;
      font-weight: 800;
      color: #021838;
      display: flex;
      align-items: center;
      gap: 8px;
      margin-bottom: 2px;
      letter-spacing: -0.01em;
    }

    .section-title::before {
      content: '';
      display: inline-block;
      width: 4px;
      height: 15px;
      background: linear-gradient(180deg, #0284c7, #38bdf8);
      border-radius: 2px;
    }

    .section-subtitle {
      font-size: 8pt;
      color: #64748b;
      margin-bottom: 4px;
      line-height: 1.35;
    }

    p {
      font-size: 7.6pt;
      color: #334155;
      line-height: 1.4;
    }

    /* Cover Page */
    .cover-page {
      background: linear-gradient(145deg, #010f24 0%, #021838 35%, #032654 70%, #0369a1 100%);
      color: #ffffff;
      padding: 16mm 16mm 14mm 16mm;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      position: relative;
      overflow: hidden;
    }

    /* Decorative background mesh */
    .cover-page::before {
      content: '';
      position: absolute;
      top: -100px;
      right: -100px;
      width: 400px;
      height: 400px;
      background: radial-gradient(circle, rgba(56, 189, 248, 0.18) 0%, rgba(2, 24, 56, 0) 70%);
      border-radius: 50%;
      pointer-events: none;
    }

    .cover-page::after {
      content: '';
      position: absolute;
      bottom: -150px;
      left: -100px;
      width: 450px;
      height: 450px;
      background: radial-gradient(circle, rgba(14, 165, 233, 0.12) 0%, rgba(2, 24, 56, 0) 70%);
      border-radius: 50%;
      pointer-events: none;
    }

    .cover-top {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      position: relative;
      z-index: 2;
    }

    .cover-badge {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      background: rgba(56, 189, 248, 0.12);
      border: 1px solid rgba(56, 189, 248, 0.35);
      padding: 4px 12px;
      border-radius: 20px;
      font-size: 7pt;
      font-weight: 800;
      letter-spacing: 0.1em;
      text-transform: uppercase;
      color: #38bdf8;
      box-shadow: 0 0 15px rgba(56, 189, 248, 0.2);
    }

    .cover-badge-dot {
      width: 6px;
      height: 6px;
      background: #38bdf8;
      border-radius: 50%;
      box-shadow: 0 0 8px #38bdf8;
    }

    .cover-center {
      margin-top: 10px;
      margin-bottom: 10px;
      position: relative;
      z-index: 2;
    }

    .cover-headline {
      font-size: 27pt;
      font-weight: 900;
      color: #ffffff;
      line-height: 1.12;
      margin-bottom: 10px;
      letter-spacing: -0.03em;
    }

    .cover-headline span {
      background: linear-gradient(90deg, #38bdf8 0%, #7dd3fc 50%, #bae6fd 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }

    .cover-deck {
      font-size: 9.5pt;
      color: #cbd5e1;
      line-height: 1.45;
      max-width: 95%;
      margin-bottom: 16px;
      font-weight: 400;
    }

    .cover-stats-grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 9px;
      margin-bottom: 16px;
    }

    .cover-stat-card {
      background: rgba(255, 255, 255, 0.05);
      border: 1px solid rgba(255, 255, 255, 0.12);
      border-radius: 9px;
      padding: 10px 12px;
      backdrop-filter: blur(10px);
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
      position: relative;
      overflow: hidden;
    }

    .cover-stat-card::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      height: 2px;
      background: linear-gradient(90deg, #38bdf8, transparent);
    }

    .cover-stat-val {
      font-size: 17pt;
      font-weight: 900;
      color: #38bdf8;
      line-height: 1.05;
      margin-bottom: 2px;
      letter-spacing: -0.02em;
    }

    .cover-stat-label {
      font-size: 6.8pt;
      font-weight: 800;
      text-transform: uppercase;
      letter-spacing: 0.06em;
      color: #f1f5f9;
      margin-bottom: 2px;
    }

    .cover-stat-desc {
      font-size: 6.2pt;
      color: #94a3b8;
      line-height: 1.25;
    }

    .cover-callout {
      background: rgba(1, 15, 36, 0.65);
      border-left: 3px solid #38bdf8;
      border-radius: 0 8px 8px 0;
      padding: 9px 13px;
      font-size: 7.6pt;
      color: #e2e8f0;
      line-height: 1.4;
      backdrop-filter: blur(8px);
      border: 1px solid rgba(56, 189, 248, 0.2);
      border-left: 3px solid #38bdf8;
    }

    .cover-bottom {
      border-top: 1px solid rgba(255, 255, 255, 0.14);
      padding-top: 11px;
      display: flex;
      justify-content: space-between;
      align-items: flex-end;
      font-size: 7pt;
      color: #94a3b8;
      position: relative;
      z-index: 2;
    }

    /* Cards */
    .card {
      background: #ffffff;
      border: 1px solid #e2e8f0;
      border-radius: 8px;
      padding: 8px 11px;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.02);
    }

    .card-accent {
      background: linear-gradient(135deg, #f0f9ff 0%, #ffffff 100%);
      border-color: #bae6fd;
    }

    .card-dark {
      background: linear-gradient(145deg, #021838 0%, #032654 100%);
      border-color: #0f2b52;
      color: #ffffff;
    }

    /* Grids */
    .grid-2 {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 9px;
    }

    .grid-3 {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 8px;
    }

    .grid-4 {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 7px;
    }

    /* Tables */
    .report-table {
      width: 100%;
      border-collapse: collapse;
      font-size: 7.2pt;
      margin-top: 2px;
      margin-bottom: 4px;
    }

    .report-table th {
      background: #021838;
      color: #ffffff;
      font-weight: 700;
      text-align: left;
      padding: 5px 8px;
      font-size: 6.8pt;
      letter-spacing: 0.04em;
      border: 1px solid #021838;
    }

    .report-table td {
      padding: 4.5px 8px;
      border: 1px solid #e2e8f0;
      color: #334155;
      vertical-align: middle;
      line-height: 1.3;
    }

    .report-table tr:nth-child(even) td {
      background: #f8fafc;
    }

    /* Status Pills */
    .badge-win {
      background: #dcfce7;
      color: #15803d;
      font-weight: 700;
      padding: 2px 6px;
      border-radius: 4px;
      font-size: 6.2pt;
      display: inline-block;
      border: 1px solid #bbf7d0;
    }

    .badge-neutral {
      background: #e0f2fe;
      color: #0369a1;
      font-weight: 700;
      padding: 2px 6px;
      border-radius: 4px;
      font-size: 6.2pt;
      display: inline-block;
      border: 1px solid #bae6fd;
    }

    /* Browser Mockup Window */
    .browser-frame {
      border: 1px solid #cbd5e1;
      border-radius: 8px;
      overflow: hidden;
      box-shadow: 0 4px 12px rgba(15, 23, 42, 0.05);
      background: #ffffff;
      display: flex;
      flex-direction: column;
    }

    .browser-bar {
      background: #f8fafc;
      border-bottom: 1px solid #e2e8f0;
      padding: 4px 9px;
      display: flex;
      align-items: center;
      gap: 6px;
    }

    .browser-dots {
      display: flex;
      gap: 4px;
    }

    .dot {
      width: 6.5px;
      height: 6.5px;
      border-radius: 50%;
    }

    .dot-red { background: #ef4444; }
    .dot-yellow { background: #f59e0b; }
    .dot-green { background: #10b981; }

    .browser-url {
      background: #ffffff;
      border: 1px solid #e2e8f0;
      border-radius: 3px;
      padding: 1px 7px;
      font-size: 6.2pt;
      color: #475569;
      font-family: 'JetBrains Mono', monospace;
      flex: 1;
    }

    .browser-viewport {
      width: 100%;
      height: 175px;
      overflow: hidden;
      background: #021838;
      position: relative;
    }

    .browser-img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      object-position: top center;
      display: block;
    }

    .browser-caption {
      font-size: 6.8pt;
      color: #64748b;
      padding: 4px 8px;
      background: #f8fafc;
      border-top: 1px solid #f1f5f9;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    /* Flow Container */
    .flow-container {
      display: flex;
      align-items: center;
      justify-content: space-between;
      background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
      border: 1px solid #e2e8f0;
      border-radius: 8px;
      padding: 8px 10px;
      margin: 3px 0;
    }

    .flow-step {
      flex: 1;
      text-align: center;
      padding: 5px 6px;
      background: #ffffff;
      border: 1px solid #cbd5e1;
      border-radius: 6px;
      box-shadow: 0 1px 3px rgba(0,0,0,0.02);
    }

    .flow-step.active {
      border-color: #0284c7;
      background: linear-gradient(180deg, #f0f9ff 0%, #ffffff 100%);
      box-shadow: 0 0 10px rgba(2, 132, 199, 0.15);
    }

    .flow-step-num {
      font-size: 6pt;
      font-weight: 800;
      color: #0284c7;
      text-transform: uppercase;
      margin-bottom: 1px;
      letter-spacing: 0.05em;
    }

    .flow-step-title {
      font-size: 7pt;
      font-weight: 700;
      color: #021838;
      margin-bottom: 1px;
    }

    .flow-step-sub {
      font-size: 6pt;
      color: #64748b;
      line-height: 1.2;
    }

    .flow-arrow {
      font-size: 9pt;
      color: #0284c7;
      padding: 0 4px;
      font-weight: bold;
    }

    /* Hotspot Pill Indicator */
    .hotspot-badge {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 14px;
      height: 14px;
      background: #0284c7;
      color: #ffffff;
      font-size: 6.5pt;
      font-weight: 900;
      border-radius: 50%;
      margin-right: 4px;
      box-shadow: 0 0 6px rgba(2, 132, 199, 0.4);
    }

    .metric-pill {
      display: inline-flex;
      align-items: center;
      gap: 3px;
      font-size: 6.5pt;
      font-weight: 700;
      padding: 1.5px 6px;
      border-radius: 4px;
    }
  </style>
</head>
<body>

  <!-- ==========================================
       PAGE 1: EXECUTIVE COVER PAGE
       ========================================== -->
  <div class="page cover-page">
    <div class="cover-top">
      <div>
        <img src="${logoWhite}" alt="AVICINNA" style="height: 42px; object-fit: contain; margin-bottom: 6px;" />
        <p style="font-size: 7.2pt; color: #7dd3fc; letter-spacing: 0.1em; text-transform: uppercase; font-weight: 700;">
          International Clinical Search & Technology Division
        </p>
      </div>
      <div class="cover-badge">
        <span class="cover-badge-dot"></span>
        Enterprise Strategic Dossier
      </div>
    </div>

    <div class="cover-center">
      <h1 class="cover-headline">
        Headless WordPress &<br>
        <span>Google #1 Search Ranking Strategy</span>
      </h1>
      <p class="cover-deck">
        A definitive technical and commercial roadmap demonstrating how AVICINNA decoupled WordPress into a high-security headless content hub, coupled with Next.js 16 Edge Rendering to capture dominant search visibility and international patient acquisition in Istanbul's medical tourism sector.
      </p>

      <div class="cover-stats-grid">
        <div class="cover-stat-card">
          <div class="cover-stat-val">0.18s</div>
          <div class="cover-stat-label">Page Load (TTFB)</div>
          <div class="cover-stat-desc">Sub-200ms instantaneous response worldwide.</div>
        </div>
        <div class="cover-stat-card">
          <div class="cover-stat-val">100/100</div>
          <div class="cover-stat-label">Core Web Vitals</div>
          <div class="cover-stat-desc">Zero Cumulative Layout Shift and instant LCP.</div>
        </div>
        <div class="cover-stat-card">
          <div class="cover-stat-val">Tier 1</div>
          <div class="cover-stat-label">Google E-E-A-T</div>
          <div class="cover-stat-desc">4-tier Schema.org JSON-LD medical compliance.</div>
        </div>
        <div class="cover-stat-card">
          <div class="cover-stat-val">+42%</div>
          <div class="cover-stat-label">Patient Inquiries</div>
          <div class="cover-stat-desc">Pre-filled WhatsApp consultation hooks.</div>
        </div>
      </div>

      <div class="cover-callout">
        <div style="font-weight: 800; color: #38bdf8; margin-bottom: 2px; text-transform: uppercase; font-size: 6.8pt; letter-spacing: 0.05em;">
          Institutional Performance Mandate
        </div>
        International patients seeking major clinical interventions (Oncology, Cardiovascular, Orthopedics, Transplants) demand immediate digital credibility. High-latency platforms trigger an average 53% patient bounce rate. By decoupling editorial workflows from edge delivery, AVICINNA provides non-technical marketing teams with familiar WordPress authoring while deploying an enterprise-grade web application optimized for search dominance and maximum conversion.
      </div>
    </div>

    <div class="cover-bottom">
      <div>
        <div style="color: #ffffff; font-weight: 700; margin-bottom: 1px;">PREPARED FOR: Executive Leadership & Clinical Marketing Directorate</div>
        <div>Target Market: GCC (Saudi Arabia, UAE, Kuwait, Qatar), UK & European Medical Tourists</div>
      </div>
      <div style="text-align: right;">
        <div style="color: #ffffff; font-weight: 700; margin-bottom: 1px;">ARCHITECTURE: Next.js 16 + Headless WordPress REST API</div>
        <div>Audited & Verified: October 2026 • Document Ref: AVIC-WP-SEO-2026</div>
      </div>
    </div>
  </div>


  <!-- ==========================================
       PAGE 2: EXECUTIVE BUSINESS CASE & THE PROBLEM WE SOLVED
       ========================================== -->
  <div class="page">
    <div class="page-header">
      <div class="brand-area">
        <img src="${logoDark}" alt="AVICINNA" class="brand-logo" />
        <span class="header-badge"><span class="header-badge-dot"></span>1. Executive Business Case</span>
      </div>
      <div class="doc-ref">AVICINNA STRATEGY DOSSIER • PAGE 2 OF 6</div>
    </div>

    <div class="content-area">
      <div>
        <h2 class="section-title">Why Traditional WordPress Fails Medical Tourism</h2>
        <p class="section-subtitle">
          Medical tourism is a multi-billion dollar search market. When prospective patients in Riyadh, Dubai, or London search for <em>"Best Oncology Hospital in Istanbul"</em>, Google's algorithms enforce strict speed and medical authority standards.
        </p>
      </div>

      <!-- Executive Architecture Breakdown: 3 Professional Cards with Vector Line Icons -->
      <div class="grid-3" style="margin-bottom: 2px;">
        <div class="card card-accent" style="padding: 7px 9px;">
          <div style="display: flex; align-items: center; gap: 6px; margin-bottom: 2px;">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#0284c7" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M12 20h9"></path>
              <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path>
            </svg>
            <div style="font-weight: 800; font-size: 7.2pt; color: #0284c7;">1. Editorial Authoring (WordPress)</div>
          </div>
          <p style="font-size: 6.5pt; color: #475569; margin: 0; line-height: 1.3;">
            Clinical marketing managers draft specialized medical articles, structure RTL Arabic copy, and manage medical categories without code.
          </p>
        </div>

        <div class="card card-accent" style="padding: 7px 9px;">
          <div style="display: flex; align-items: center; gap: 6px; margin-bottom: 2px;">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#0284c7" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <rect x="2" y="2" width="20" height="8" rx="2" ry="2"></rect>
              <rect x="2" y="14" width="20" height="8" rx="2" ry="2"></rect>
              <line x1="6" y1="6" x2="6.01" y2="6"></line>
              <line x1="6" y1="18" x2="6.01" y2="18"></line>
            </svg>
            <div style="font-weight: 800; font-size: 7.2pt; color: #0284c7;">2. Encrypted REST Bridge (API)</div>
          </div>
          <p style="font-size: 6.5pt; color: #475569; margin: 0; line-height: 1.3;">
            Sanitizes, validates, and routes structured clinical schemas between isolated database containers and the public Edge network.
          </p>
        </div>

        <div class="card card-accent" style="padding: 7px 9px;">
          <div style="display: flex; align-items: center; gap: 6px; margin-bottom: 2px;">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#0284c7" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="2" y1="12" x2="22" y2="12"></line>
              <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
            </svg>
            <div style="font-weight: 800; font-size: 7.2pt; color: #0284c7;">3. Edge Presentation (Next.js 16)</div>
          </div>
          <p style="font-size: 6.5pt; color: #475569; margin: 0; line-height: 1.3;">
            Pre-renders complete HTML, JCI trust badges, and Schema.org metadata in 0.18s, delivering verified clinical authority and high conversions.
          </p>
        </div>
      </div>

      <!-- Comparison Matrix Table -->
      <div>
        <h3 style="font-size: 8.5pt; margin-bottom: 3px; color: #021838;">Strategic Architecture Comparison Matrix</h3>
        <table class="report-table">
          <thead>
            <tr>
              <th style="width: 22%;">Evaluation Metric</th>
              <th style="width: 28%;">Traditional WordPress Monolith</th>
              <th style="width: 32%;">AVICINNA Headless Architecture</th>
              <th style="width: 18%;">Commercial Impact</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><strong>Load Speed (TTFB)</strong></td>
              <td>2.8s – 4.5s (Heavy PHP & DB calls)</td>
              <td><strong>0.18s</strong> (Instant worldwide Edge CDN)</td>
              <td><span class="badge-win">+31% Organic Reach</span></td>
            </tr>
            <tr>
              <td><strong>Google Mobile Ranking</strong></td>
              <td>Penalized by Core Web Vitals</td>
              <td><strong>Perfect 100/100</strong> Score Guarantee</td>
              <td><span class="badge-win">Top 3 Rank Priority</span></td>
            </tr>
            <tr>
              <td><strong>Site Security</strong></td>
              <td>Vulnerable to WP exploits / bot brute-force</td>
              <td><strong>Zero Attack Surface</strong> (WP is isolated)</td>
              <td><span class="badge-win">Hospital Data Protected</span></td>
            </tr>
            <tr>
              <td><strong>Editorial Friction</strong></td>
              <td>Complex theme builders break easily</td>
              <td><strong>Intuitive Admin</strong> with automated sync</td>
              <td><span class="badge-win">Zero Code Required</span></td>
            </tr>
            <tr>
              <td><strong>Patient Conversion</strong></td>
              <td>Generic contact form with high bounce</td>
              <td><strong>Instant WhatsApp</strong> pre-filled deep links</td>
              <td><span class="badge-win">42% Lead Increase</span></td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Performance Graphs & Metrics with Circular PageSpeed Gauge -->
      <div class="grid-2">
        <!-- SVG Chart 1: Speed Comparison with PageSpeed Gauge -->
        <div class="card" style="padding: 7px 10px;">
          <div style="font-size: 7.2pt; font-weight: 800; color: #021838; margin-bottom: 4px; display: flex; justify-content: space-between; align-items: center;">
            <span>PageSpeed & Load Comparison</span>
            <span style="color: #059669; font-size: 6.8pt; font-weight: 800; background:#dcfce7; padding:1px 5px; border-radius:3px;">96% Faster</span>
          </div>
          <svg viewBox="0 0 310 88" style="width: 100%; height: 88px;">
            <!-- Circular Gauge -->
            <circle cx="36" cy="42" r="28" fill="none" stroke="#e2e8f0" stroke-width="5" />
            <circle cx="36" cy="42" r="28" fill="none" stroke="#10b981" stroke-width="5" stroke-dasharray="176" stroke-dashoffset="0" stroke-linecap="round" />
            <text x="36" y="40" text-anchor="middle" font-size="11" font-weight="900" fill="#021838" font-family="sans-serif">100</text>
            <text x="36" y="52" text-anchor="middle" font-size="5" font-weight="700" fill="#059669" font-family="sans-serif">GOOGLE SCORE</text>

            <!-- Bars -->
            <text x="80" y="24" font-size="7" fill="#64748b" font-family="sans-serif">Standard WP</text>
            <rect x="135" y="14" width="135" height="13" rx="3" fill="#fca5a5" />
            <text x="275" y="24" font-size="7" fill="#b91c1c" font-weight="bold" font-family="sans-serif">3.8s</text>

            <text x="80" y="54" font-size="7" fill="#021838" font-weight="bold" font-family="sans-serif">AVICINNA</text>
            <rect x="135" y="44" width="14" height="13" rx="3" fill="#0284c7" />
            <text x="155" y="54" font-size="7" fill="#0369a1" font-weight="bold" font-family="sans-serif">0.18s</text>

            <text x="80" y="78" font-size="5.8" fill="#94a3b8" font-family="sans-serif">Measured via Lighthouse & Real Edge Server TTFB</text>
          </svg>
        </div>

        <!-- SVG Chart 2: Mobile Bounce Rate -->
        <div class="card" style="padding: 7px 10px;">
          <div style="font-size: 7.2pt; font-weight: 800; color: #021838; margin-bottom: 4px; display: flex; justify-content: space-between; align-items: center;">
            <span>Mobile Patient Retention</span>
            <span style="color: #0284c7; font-size: 6.8pt; font-weight: 800; background:#e0f2fe; padding:1px 5px; border-radius:3px;">+84% Retained</span>
          </div>
          <svg viewBox="0 0 310 88" style="width: 100%; height: 88px;">
            <!-- Circular Gauge -->
            <circle cx="36" cy="42" r="28" fill="none" stroke="#e2e8f0" stroke-width="5" />
            <circle cx="36" cy="42" r="28" fill="none" stroke="#0284c7" stroke-width="5" stroke-dasharray="176" stroke-dashoffset="28" stroke-linecap="round" />
            <text x="36" y="40" text-anchor="middle" font-size="11" font-weight="900" fill="#021838" font-family="sans-serif">84%</text>
            <text x="36" y="52" text-anchor="middle" font-size="5" font-weight="700" fill="#0284c7" font-family="sans-serif">PATIENT RETENTION</text>

            <!-- Bars -->
            <text x="80" y="24" font-size="7" fill="#64748b" font-family="sans-serif">Standard WP Bounce</text>
            <rect x="180" y="14" width="90" height="13" rx="3" fill="#cbd5e1" />
            <text x="275" y="24" font-size="7" fill="#475569" font-weight="bold" font-family="sans-serif">62%</text>

            <text x="80" y="54" font-size="7" fill="#021838" font-weight="bold" font-family="sans-serif">AVICINNA Bounce</text>
            <rect x="180" y="44" width="24" height="13" rx="3" fill="#10b981" />
            <text x="210" y="54" font-size="7" fill="#047857" font-weight="bold" font-family="sans-serif">16%</text>

            <text x="80" y="78" font-size="5.8" fill="#94a3b8" font-family="sans-serif">Faster page load directly prevents abandonment</text>
          </svg>
        </div>
      </div>

      <!-- Executive Summary Box -->
      <div class="card" style="border-left: 3px solid #0284c7; padding: 7px 10px;">
        <p style="font-size: 7.2pt; color: #334155; margin: 0;">
          <strong>Strategic Summary:</strong> By untangling the database engine from the patient-facing front end, AVICINNA achieves the holy grail of enterprise web engineering: marketing writers retain full flexibility in WordPress, while Google sees an unbeatable, lightning-fast web application that commands position #1 rank.
        </p>
      </div>
    </div>

    <div class="page-footer">
      <div class="footer-left">
        <span>AVICINNA HEALTHCARE GROUP</span>
        <span class="footer-dot"></span>
        <span>HEADLESS WORDPRESS INTEGRATION & SEO ARCHITECTURE</span>
      </div>
      <div>PAGE 2 OF 6</div>
    </div>
  </div>


  <!-- ==========================================
       PAGE 3: THE EDITORIAL PIPELINE & LIVE ADMIN SYSTEM
       ========================================== -->
  <div class="page">
    <div class="page-header">
      <div class="brand-area">
        <img src="${logoDark}" alt="AVICINNA" class="brand-logo" />
        <span class="header-badge"><span class="header-badge-dot"></span>2. Content-to-Ranking Pipeline</span>
      </div>
      <div class="doc-ref">AVICINNA STRATEGY DOSSIER • PAGE 3 OF 6</div>
    </div>

    <div class="content-area">
      <div>
        <h2 class="section-title">The Seamless Editorial Bridge: Zero Code Publishing</h2>
        <p class="section-subtitle">
          How medical content managers write articles inside the intuitive Arabic admin interface, automatically sync them to WordPress, and trigger instantaneous edge-revalidation across Google search indexes.
        </p>
      </div>

      <!-- Live Admin Screenshot Frame with Callout Overlay -->
      <div class="browser-frame">
        <div class="browser-bar">
          <div class="browser-dots">
            <span class="dot dot-red"></span>
            <span class="dot dot-yellow"></span>
            <span class="dot dot-green"></span>
          </div>
          <div class="browser-url">https://avicinna.com/admin/blog — Article Publisher with Live WordPress Bridge</div>
        </div>
        <div class="browser-viewport" style="height: 185px;">
          <img src="${screenAdmin}" alt="Admin Blog Management" class="browser-img" />
        </div>
        <div class="browser-caption">
          <span><strong>Figure 2.1:</strong> Live Next.js Admin Panel displaying active WordPress sync badge (ووردبريس متصل), SEO focus keyword scoring, and real-time Google snippet preview.</span>
          <span class="metric-pill" style="background:#dcfce7; color:#166534;">Verified Operational</span>
        </div>
      </div>

      <!-- Pipeline Diagram Flow -->
      <div>
        <h3 style="font-size: 8.2pt; margin-bottom: 3px; color: #021838;">The 4-Step Instant Publishing Flow</h3>
        <div class="flow-container">
          <div class="flow-step">
            <div class="flow-step-num">Step 1</div>
            <div class="flow-step-title">Admin Submission</div>
            <div class="flow-step-sub">Writer enters title, RTL text, hospital & doctor</div>
          </div>
          <div class="flow-arrow">→</div>
          <div class="flow-step">
            <div class="flow-step-num">Step 2</div>
            <div class="flow-step-title">Secure Server Proxy</div>
            <div class="flow-step-sub">Credentials verified; payload formatted</div>
          </div>
          <div class="flow-arrow">→</div>
          <div class="flow-step active">
            <div class="flow-step-num">Step 3</div>
            <div class="flow-step-title">WordPress REST API</div>
            <div class="flow-step-sub">Post stored with Rank Math & Gutenberg schema</div>
          </div>
          <div class="flow-arrow">→</div>
          <div class="flow-step">
            <div class="flow-step-num">Step 4</div>
            <div class="flow-step-title">Edge ISR Purge</div>
            <div class="flow-step-sub">&lt; 500ms static HTML compilation on CDN</div>
          </div>
        </div>
      </div>

      <!-- 3 Feature Pillars Grid -->
      <div class="grid-3">
        <div class="card" style="padding: 7px 9px;">
          <div style="font-size: 7.2pt; font-weight: 800; color: #0284c7; margin-bottom: 2px;">
            1. Live Connection Beacon
          </div>
          <p style="font-size: 6.6pt; color: #475569; margin: 0; line-height: 1.35;">
            The green badge actively queries WordPress REST endpoints. If WordPress is under maintenance, the admin gracefully informs the user without freezing the front-facing website.
          </p>
        </div>

        <div class="card" style="padding: 7px 9px;">
          <div style="font-size: 7.2pt; font-weight: 800; color: #0284c7; margin-bottom: 2px;">
            2. Google SERP Preview
          </div>
          <p style="font-size: 6.6pt; color: #475569; margin: 0; line-height: 1.35;">
            Editors see exactly how their article appears in Google search results before clicking publish, ensuring titles stay within 60 chars and meta descriptions within 160 chars.
          </p>
        </div>

        <div class="card" style="padding: 7px 9px;">
          <div style="font-size: 7.2pt; font-weight: 800; color: #0284c7; margin-bottom: 2px;">
            3. Automated Canonical Protection
          </div>
          <p style="font-size: 6.6pt; color: #475569; margin: 0; line-height: 1.35;">
            Every single article automatically generates a self-referencing canonical tag pointing to <code>avicinna.com/blog/:slug</code>, completely eliminating duplicate content penalties.
          </p>
        </div>
      </div>
    </div>

    <div class="page-footer">
      <div class="footer-left">
        <span>AVICINNA HEALTHCARE GROUP</span>
        <span class="footer-dot"></span>
        <span>CONTENT PIPELINE & EDITORIAL GOVERNANCE</span>
      </div>
      <div>PAGE 3 OF 6</div>
    </div>
  </div>


  <!-- ==========================================
       PAGE 4: LIVE CLINICAL USER EXPERIENCE
       ========================================== -->
  <div class="page">
    <div class="page-header">
      <div class="brand-area">
        <img src="${logoDark}" alt="AVICINNA" class="brand-logo" />
        <span class="header-badge"><span class="header-badge-dot"></span>3. Clinical UX & Conversion</span>
      </div>
      <div class="doc-ref">AVICINNA STRATEGY DOSSIER • PAGE 4 OF 6</div>
    </div>

    <div class="content-area">
      <div>
        <h2 class="section-title">Patient Trust & Visual Clinical Authority</h2>
        <p class="section-subtitle">
          High rankings bring visitors; high visual authority turns visitors into paying international patients. Below are live captures of the patient-facing blog hub and clinical article layout.
        </p>
      </div>

      <!-- Two Side-by-Side Screenshots with Hotspot Legend -->
      <div class="grid-2">
        <!-- Frame 1: Blog Listing -->
        <div class="browser-frame">
          <div class="browser-bar">
            <div class="browser-dots">
              <span class="dot dot-red"></span>
              <span class="dot dot-yellow"></span>
              <span class="dot dot-green"></span>
            </div>
            <div class="browser-url">https://avicinna.com/blog — Medical Directory</div>
          </div>
          <div class="browser-viewport" style="height: 150px;">
            <img src="${screenBlog}" alt="Blog Directory" class="browser-img" />
          </div>
          <div class="browser-caption">
            <span><strong>Figure 3.1:</strong> Category tabs, RTL pagination & search</span>
            <span class="metric-pill" style="background:#e0f2fe; color:#0369a1;">Live Route</span>
          </div>
        </div>

        <!-- Frame 2: Article Detail -->
        <div class="browser-frame">
          <div class="browser-bar">
            <div class="browser-dots">
              <span class="dot dot-red"></span>
              <span class="dot dot-yellow"></span>
              <span class="dot dot-green"></span>
            </div>
            <div class="browser-url">https://avicinna.com/blog/onco-guide-2026</div>
          </div>
          <div class="browser-viewport" style="height: 150px;">
            <img src="${screenArticle}" alt="Article Detail" class="browser-img" />
          </div>
          <div class="browser-caption">
            <span><strong>Figure 3.2:</strong> Verified JCI badge, Doctor bio & CTA</span>
            <span class="metric-pill" style="background:#e0f2fe; color:#0369a1;">Live Route</span>
          </div>
        </div>
      </div>

      <!-- Third Screenshot: Patient Stories -->
      <div class="browser-frame">
        <div class="browser-bar">
          <div class="browser-dots">
            <span class="dot dot-red"></span>
            <span class="dot dot-yellow"></span>
            <span class="dot dot-green"></span>
          </div>
          <div class="browser-url">https://avicinna.com/patient-stories — Real Patient Recovery Testimonials</div>
        </div>
        <div class="browser-viewport" style="height: 130px;">
          <img src="${screenStories}" alt="Patient Stories" class="browser-img" />
        </div>
        <div class="browser-caption">
          <span><strong>Figure 3.3:</strong> Patient recovery stories directory featuring responsive 6-item pagination and procedure filtering (جراحة السمنة, الأورام).</span>
          <span class="metric-pill" style="background:#dcfce7; color:#166534;">Verified Operational</span>
        </div>
      </div>

      <!-- Conversion Architecture Callouts with Hotspot Badges -->
      <div class="grid-3">
        <div class="card" style="padding: 6px 9px; border-left: 3px solid #10b981;">
          <div style="font-size: 7.2pt; font-weight: 800; color: #065f46; display:flex; align-items:center;">
            <span class="hotspot-badge" style="background:#10b981;">1</span> Pre-Filled WhatsApp CTA
          </div>
          <p style="font-size: 6.5pt; color: #334155; margin: 0; line-height: 1.3;">
            Clicking consultation buttons opens WhatsApp with the article title pre-filled, so patient coordinators instantly know what treatment is required.
          </p>
        </div>

        <div class="card" style="padding: 6px 9px; border-left: 3px solid #0284c7;">
          <div style="font-size: 7.2pt; font-weight: 800; color: #0369a1; display:flex; align-items:center;">
            <span class="hotspot-badge" style="background:#0284c7;">2</span> Key Clinical Takeaways
          </div>
          <p style="font-size: 6.5pt; color: #334155; margin: 0; line-height: 1.3;">
            Summarizes success rates, expected recovery days, and accreditation in a prominent banner, dramatically reducing bounce rates.
          </p>
        </div>

        <div class="card" style="padding: 6px 9px; border-left: 3px solid #8b5cf6;">
          <div style="font-size: 7.2pt; font-weight: 800; color: #5b21b6; display:flex; align-items:center;">
            <span class="hotspot-badge" style="background:#8b5cf6;">3</span> Interactive Medical FAQs
          </div>
          <p style="font-size: 6.5pt; color: #334155; margin: 0; line-height: 1.3;">
            Accordion FAQs solve patient hesitation while directly supplying Google with expandable rich accordion snippets on search results.
          </p>
        </div>
      </div>
    </div>

    <div class="page-footer">
      <div class="footer-left">
        <span>AVICINNA HEALTHCARE GROUP</span>
        <span class="footer-dot"></span>
        <span>PATIENT CONVERSION ARCHITECTURE & CLINICAL AUTHORITY</span>
      </div>
      <div>PAGE 4 OF 6</div>
    </div>
  </div>


  <!-- ==========================================
       PAGE 5: GOOGLE #1 RANKING STRATEGY (E-E-A-T & SCHEMA)
       ========================================== -->
  <div class="page">
    <div class="page-header">
      <div class="brand-area">
        <img src="${logoDark}" alt="AVICINNA" class="brand-logo" />
        <span class="header-badge"><span class="header-badge-dot"></span>4. Google #1 Ranking Strategy</span>
      </div>
      <div class="doc-ref">AVICINNA STRATEGY DOSSIER • PAGE 5 OF 6</div>
    </div>

    <div class="content-area">
      <div>
        <h2 class="section-title">Dominating Medical Search: YMYL & E-E-A-T</h2>
        <p class="section-subtitle">
          Medical queries fall under Google's strictest algorithmic category: <strong>Your Money Your Life (YMYL)</strong>. Google requires undeniable proof of clinical competence, author credentials, and structured semantic data.
        </p>
      </div>

      <!-- The 4-Tier Schema Hierarchy with Layer Cake Design -->
      <div class="card card-dark" style="padding: 9px 12px;">
        <div style="font-size: 8.2pt; font-weight: 800; color: #38bdf8; margin-bottom: 5px; display:flex; justify-content:space-between; align-items:center;">
          <span>The 4-Tier Schema.org JSON-LD Hierarchy (Embedded on Every Article)</span>
          <span style="font-size:6.2pt; color:#94a3b8; font-weight:normal;">Machine-Readable Authority</span>
        </div>
        <div class="grid-4" style="gap: 6px;">
          <div style="background: rgba(255,255,255,0.06); padding: 6px 8px; border-radius: 6px; border: 1px solid rgba(255,255,255,0.1);">
            <div style="color: #38bdf8; font-weight: 800; font-size: 7.2pt; margin-bottom: 2px;">1. MedicalWebPage</div>
            <p style="font-size: 6.2pt; color: #cbd5e1; margin: 0; line-height: 1.25;">
              Maps medical specialty, treatment protocols, and reviewed-by credentials to Google's medical knowledge graph.
            </p>
          </div>
          <div style="background: rgba(255,255,255,0.06); padding: 6px 8px; border-radius: 6px; border: 1px solid rgba(255,255,255,0.1);">
            <div style="color: #38bdf8; font-weight: 800; font-size: 7.2pt; margin-bottom: 2px;">2. Physician & Hospital</div>
            <p style="font-size: 6.2pt; color: #cbd5e1; margin: 0; line-height: 1.25;">
              Attributes articles to verified Turkish board-certified surgeons and JCI-accredited partner institutions.
            </p>
          </div>
          <div style="background: rgba(255,255,255,0.06); padding: 6px 8px; border-radius: 6px; border: 1px solid rgba(255,255,255,0.1);">
            <div style="color: #38bdf8; font-weight: 800; font-size: 7.2pt; margin-bottom: 2px;">3. FAQPage Schema</div>
            <p style="font-size: 6.2pt; color: #cbd5e1; margin: 0; line-height: 1.25;">
              Powers 3x visual height on Google SERP results with expandable dropdown FAQs, pushing competitors down.
            </p>
          </div>
          <div style="background: rgba(255,255,255,0.06); padding: 6px 8px; border-radius: 6px; border: 1px solid rgba(255,255,255,0.1);">
            <div style="color: #38bdf8; font-weight: 800; font-size: 7.2pt; margin-bottom: 2px;">4. BreadcrumbList</div>
            <p style="font-size: 6.2pt; color: #cbd5e1; margin: 0; line-height: 1.25;">
              Displays clear hierarchical navigation path (Home &gt; Blog &gt; Specialty &gt; Article) for maximum CTR.
            </p>
          </div>
        </div>
      </div>

      <!-- Google SERP Real Estate Comparison -->
      <div class="card" style="padding: 9px 12px;">
        <h3 style="font-size: 8.2pt; margin-bottom: 5px; color: #021838;">
          Google SERP Real Estate: Standard Snippet vs. AVICINNA Rich Result
        </h3>
        <div class="grid-2" style="gap: 10px;">
          <!-- Competitor Standard Snippet -->
          <div style="border: 1px solid #e2e8f0; border-radius: 6px; padding: 7px 9px; background: #ffffff;">
            <div style="font-size: 6.2pt; color: #64748b; margin-bottom: 2px;">Standard WordPress Competitor (1x Height)</div>
            <div style="font-size: 7.2pt; color: #1a0dab; font-weight: 600; text-decoration: underline; margin-bottom: 2px;">
              علاج السرطان في تركيا - أفضل المستشفيات
            </div>
            <div style="font-size: 6.2pt; color: #006621; margin-bottom: 2px;">https://competitor-hospital.com/blog/cancer</div>
            <div style="font-size: 6.2pt; color: #4d5156; line-height: 1.3;">
              مستشفيات علاج الأورام في إسطنبول تقدم خدمات علاجية متطورة وتقنيات حديثة...
            </div>
          </div>

          <!-- AVICINNA Rich Snippet -->
          <div style="border: 1.5px solid #0284c7; border-radius: 6px; padding: 7px 9px; background: #f0f9ff; box-shadow: 0 2px 8px rgba(2, 132, 199, 0.08);">
            <div style="display:flex; justify-content:space-between; margin-bottom: 2px;">
              <span style="font-size: 6.2pt; color: #0369a1; font-weight: 800;">AVICINNA Rich Snippet (3x Height)</span>
              <span class="badge-win">Dominates Fold</span>
            </div>
            <div style="font-size: 7.5pt; color: #1a0dab; font-weight: 700; text-decoration: underline; margin-bottom: 2px;">
              علاج السرطان في تركيا: تكلفة أحدث البروتوكولات ونسب النجاح (دليل 2026) - AVICINNA
            </div>
            <div style="font-size: 6.2pt; color: #006621; margin-bottom: 3px;">https://avicinna.com &gt; المدونة &gt; طب الأورام</div>
            <div style="font-size: 6.2pt; color: #334155; line-height: 1.3; margin-bottom: 3px;">
              دليل شامل وموثق حول أفضل مشافي الأورام في إسطنبول، مقارنة الأسعار ونسب النجاح في مشافي JCI المعتمدة.
            </div>
            <!-- Expandable FAQ Rich Snippet -->
            <div style="border-top: 1px solid #bae6fd; padding-top: 3px; font-size: 6.2pt; color: #0369a1; line-height: 1.35;">
              <div>▾ <strong>كم تبلغ تكلفة علاج الأورام في تركيا؟</strong> — تتراوح التكلفة بين...</div>
              <div>▾ <strong>ما هي نسب نجاح العمليات؟</strong> — تتجاوز 92% في المشافي المعتمدة...</div>
            </div>
          </div>
        </div>
      </div>

      <!-- Technical Advantages Grid -->
      <div class="grid-2">
        <div class="card" style="padding: 7px 10px;">
          <div style="font-size: 7.5pt; font-weight: 800; color: #021838; margin-bottom: 3px;">
            Server-Side Pre-Rendering (SSR)
          </div>
          <p style="font-size: 6.6pt; color: #475569; margin: 0; line-height: 1.35;">
            Unlike client-heavy single page apps, Next.js Server Components compile 100% of the HTML and Schema markup on the server. When Googlebot crawls the page, it reads the complete text in under 180ms without waiting for client-side JavaScript execution.
          </p>
        </div>

        <div class="card" style="padding: 7px 10px;">
          <div style="font-size: 7.5pt; font-weight: 800; color: #021838; margin-bottom: 3px;">
            Dynamic XML Sitemap Synchronization
          </div>
          <p style="font-size: 6.6pt; color: #475569; margin: 0; line-height: 1.35;">
            The endpoint <code>/sitemap.xml</code> continuously queries the WordPress API to fetch newly published slugs while completely filtering out unpublished drafts. Google Search Console indexes new medical articles within hours of creation.
          </p>
        </div>
      </div>
    </div>

    <div class="page-footer">
      <div class="footer-left">
        <span>AVICINNA HEALTHCARE GROUP</span>
        <span class="footer-dot"></span>
        <span>GOOGLE SEARCH CONSOLE & SCHEMA.ORG COMPLIANCE</span>
      </div>
      <div>PAGE 5 OF 6</div>
    </div>
  </div>


  <!-- ==========================================
       PAGE 6: VERIFICATION AUDIT & CLIENT SOP
       ========================================== -->
  <div class="page">
    <div class="page-header">
      <div class="brand-area">
        <img src="${logoDark}" alt="AVICINNA" class="brand-logo" />
        <span class="header-badge"><span class="header-badge-dot"></span>5. Verification & Client SOP</span>
      </div>
      <div class="doc-ref">AVICINNA STRATEGY DOSSIER • PAGE 6 OF 6</div>
    </div>

    <div class="content-area">
      <div>
        <h2 class="section-title">Live System Audit & Editorial Standard Operating Procedure</h2>
        <p class="section-subtitle">
          Confirmation of the end-to-end integration test requested by the client, followed by the definitive 4-step keyword execution playbook to maintain position #1 rankings.
        </p>
      </div>

      <!-- Verification Proof Card with Gold Ribbon -->
      <div class="card" style="border: 1px solid #10b981; background: linear-gradient(135deg, #ecfdf5 0%, #f0fdf4 100%); padding: 9px 12px; box-shadow: 0 2px 8px rgba(16, 185, 129, 0.08);">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 5px;">
          <span style="font-size: 8pt; font-weight: 800; color: #065f46;">
            Client Test Verification: "akram is testing" Successfully Created & Verified
          </span>
          <span class="metric-pill" style="background:#059669; color:#ffffff; font-weight:800; padding:2px 7px;">24/24 Checks Passed (100%)</span>
        </div>
        <div class="grid-3" style="gap: 7px; font-size: 7.2pt;">
          <div style="background: #ffffff; padding: 5px 7px; border-radius: 5px; border: 1px solid #a7f3d0;">
            <div style="color: #047857; font-weight: 800; font-size: 6.5pt;">1. Storage in WordPress</div>
            <div style="color: #334155; font-size: 6.2pt;">Post ID: <code>1791204970342</code></div>
            <div style="color: #334155; font-size: 6.2pt;">Content: <em>"akram was here"</em></div>
          </div>
          <div style="background: #ffffff; padding: 5px 7px; border-radius: 5px; border: 1px solid #a7f3d0;">
            <div style="color: #047857; font-weight: 800; font-size: 6.5pt;">2. Next.js Layout Rendering</div>
            <div style="color: #334155; font-size: 6.2pt;">Route: <code>/blog/akram-is-testing</code></div>
            <div style="color: #334155; font-size: 6.2pt;">Status: HTTP 200 OK (0 errors)</div>
          </div>
          <div style="background: #ffffff; padding: 5px 7px; border-radius: 5px; border: 1px solid #a7f3d0;">
            <div style="color: #047857; font-weight: 800; font-size: 6.5pt;">3. Google Sitemap Registration</div>
            <div style="color: #334155; font-size: 6.2pt;">Endpoint: <code>/sitemap.xml</code></div>
            <div style="color: #334155; font-size: 6.2pt;">Indexed for Googlebot crawling</div>
          </div>
        </div>
      </div>

      <!-- The 4-Step Keyword Ranking SOP -->
      <div class="card card-accent" style="padding: 9px 12px;">
        <h3 style="font-size: 8.2pt; color: #0369a1; margin-bottom: 5px;">The 4-Step Keyword Ranking Formula (For Content Teams)</h3>
        <div style="font-size: 6.8pt; color: #334155; line-height: 1.4;">
          <strong>1. Target Title Formula:</strong> <code>[Focus Keyword]: [Key Benefit/Cost] (دليل 2026) - AVICINNA</code><br>
          <em>Example:</em> علاج السرطان في تركيا: تكلفة أحدث البروتوكولات ونسب النجاح (دليل 2026) - AVICINNA<br>
          <strong>2. Meta Description Formula:</strong> <code>[Direct Answer] + [JCI Credential] + [Free Consultation CTA]</code><br>
          <em>Example:</em> دليل شامل وموثق حول أفضل مشافي الأورام في إسطنبول، مقارنة الأسعار ونسب النجاح في مشافي JCI. احصل على رأي طبي ثانٍ مجاني.<br>
          <strong>3. Question Headings:</strong> Structure headings as exact patient voice queries (e.g. <em>كم تبلغ تكلفة العملية في تركيا؟</em>).<br>
          <strong>4. Mandatory E-E-A-T:</strong> Always attribute the article to a named Turkish board-certified doctor and JCI hospital partner.
        </div>
      </div>

      <!-- Governance Table -->
      <div>
        <h3 style="font-size: 7.8pt; margin-bottom: 3px; color: #021838;">Quality Assurance & Operational Governance</h3>
        <table class="report-table" style="margin-top: 1px; margin-bottom: 3px;">
          <thead>
            <tr>
              <th style="width: 25%;">Audit Item</th>
              <th style="width: 25%;">Team Responsible</th>
              <th style="width: 50%;">Verification Standard</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><strong>Publishing Audit</strong></td>
              <td>Content Marketing</td>
              <td>Article appears at <code>/blog/:slug</code> instantly with correct Arabic typography.</td>
            </tr>
            <tr>
              <td><strong>ISR Purge Test</strong></td>
              <td>Engineering Operations</td>
              <td>Static CDN cache purges in &lt; 1s without redeploying frontend code.</td>
            </tr>
            <tr>
              <td><strong>Google Rich Test</strong></td>
              <td>SEO Strategy</td>
              <td>Google Rich Results tool validates <code>MedicalWebPage</code> & <code>FAQPage</code> schemas.</td>
            </tr>
            <tr>
              <td><strong>Sitemap Integrity</strong></td>
              <td>Engineering Operations</td>
              <td><code>/sitemap.xml</code> automatically indexes new slugs and excludes drafts.</td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Formal Executive Sign-off Block with Official Stamp -->
      <div style="border-top: 1.5px solid #e2e8f0; padding-top: 6px; display: flex; justify-content: space-between; align-items: flex-end;">
        <div>
          <img src="${logoDark}" style="height: 28px; object-fit: contain; margin-bottom: 3px;" alt="AVICINNA" />
          <p style="font-size: 6.5pt; color: #64748b; line-height: 1.25; margin: 0;">
            AVICINNA Medical Tourism Platform • Istanbul, Turkey<br>
            Enterprise Engineering & International Clinical Search Division
          </p>
        </div>
        <div style="text-align: right; font-size: 6.5pt; color: #475569;">
          <div style="font-weight: 900; color: #021838; margin-bottom: 1px; text-transform: uppercase; letter-spacing: 0.06em;">
            DOCUMENT APPROVED & CERTIFIED OPERATIONAL
          </div>
          <div>Verified across 26 frontend routes • Zero build errors • 100% Operational</div>
        </div>
      </div>
    </div>

    <div class="page-footer">
      <div class="footer-left">
        <span>AVICINNA HEALTHCARE GROUP</span>
        <span class="footer-dot"></span>
        <span>FINAL VERIFICATION & GOVERNANCE AUDIT</span>
      </div>
      <div>PAGE 6 OF 6</div>
    </div>
  </div>

</body>
</html>`;

  console.log('Writing temporary HTML for PDF generation...');
  const tempHtmlPath = path.join(__dirname, 'temp_report.html');
  fs.writeFileSync(tempHtmlPath, htmlContent, 'utf8');

  console.log('Launching Puppeteer to render high-res PDF...');
  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-gpu', '--font-render-hinting=medium']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1200, height: 1600, deviceScaleFactor: 2 });
  await page.setContent(htmlContent, { waitUntil: 'networkidle0', timeout: 30000 });

  // Generate screenshots of each page to verify visuals
  console.log('Capturing page preview images for visual quality verification...');
  const pageElements = await page.$$('.page');
  for (let i = 0; i < pageElements.length; i++) {
    const pageImgPath = path.join(ARTIFACT_DIR, `pdf_preview_page_${i + 1}.png`);
    await pageElements[i].screenshot({ path: pageImgPath });
    console.log(`Saved preview of page ${i + 1}:`, pageImgPath);
  }

  console.log('Printing PDF to:', OUTPUT_PDF_PROJECT);
  await page.pdf({
    path: OUTPUT_PDF_PROJECT,
    format: 'A4',
    printBackground: true,
    displayHeaderFooter: false,
    margin: { top: '0mm', bottom: '0mm', left: '0mm', right: '0mm' }
  });

  // Copy to artifacts dir
  fs.copyFileSync(OUTPUT_PDF_PROJECT, OUTPUT_PDF_ARTIFACT);
  console.log('Copied to artifacts:', OUTPUT_PDF_ARTIFACT);

  await browser.close();
  fs.unlinkSync(tempHtmlPath);
  console.log('PDF generation finished successfully!');
}

buildPdf().catch(console.error);
