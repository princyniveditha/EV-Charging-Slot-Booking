* {
  box-sizing: border-box;
}

:root {
  --bg: #07111e;
  --bg-soft: #0f1c2d;
  --panel: rgba(17, 29, 46, 0.92);
  --surface: #f4f8ff;
  --muted: #7d8ba0;
  --text: #eaf4ff;
  --heading: #0d1726;
  --primary: #12c2a6;
  --primary-dark: #0d8f7d;
  --secondary: #2d74ff;
  --warning: #ffb347;
  --danger: #fa5f6f;
  --success: #46d39a;
  --card-border: rgba(255, 255, 255, 0.08);
  --shadow: 0 24px 75px rgba(5, 16, 26, 0.36);
}

html, body {
  margin: 0;
  font-family: 'Inter', sans-serif;
  background: linear-gradient(135deg, #08121d 0%, #10253d 38%, #183052 100%);
  color: var(--text);
}

body {
  min-height: 100vh;
}

img {
  max-width: 100%;
  display: block;
}

a {
  color: inherit;
  text-decoration: none;
}

button, input, select {
  font: inherit;
}

.topbar, .dashboard-header {
  max-width: 1280px;
  margin: 0 auto;
  padding: 24px 32px 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.logo-wrap {
  display: flex;
  align-items: center;
  gap: 12px;
}

.logo {
  width: 42px;
  height: 42px;
  border-radius: 12px;
  display: grid;
  place-items: center;
  font-weight: 800;
  background: linear-gradient(135deg, var(--primary), var(--secondary));
  color: white;
}

.brand {
  margin: 0;
  font-weight: 700;
}

.logo-wrap small, .eyebrow {
  color: var(--muted);
  letter-spacing: 0.08em;
  text-transform: uppercase;
  font-size: 11px;
}

nav {
  display: flex;
  gap: 18px;
  align-items: center;
  color: rgba(234, 244, 255, 0.82);
}

.hero {
  max-width: 1280px;
  margin: 0 auto;
  padding: 72px 32px 32px;
  display: grid;
  grid-template-columns: 1.2fr 0.8fr;
  gap: 36px;
  align-items: center;
}

.hero-copy h1 {
  font-size: clamp(2.8rem, 4vw, 5rem);
  line-height: 1.05;
  margin: 20px 0 16px;
  letter-spacing: -0.05em;
}

.hero-copy p {
  max-width: 620px;
  line-height: 1.8;
  font-size: 1.05rem;
  color: rgba(234, 244, 255, 0.78);
}

.pill {
  display: inline-flex;
  padding: 10px 14px;
  border-radius: 999px;
  background: rgba(18, 194, 166, 0.12);
  border: 1px solid rgba(18, 194, 166, 0.28);
  color: var(--primary);
  font-weight: 600;
}

.button-row {
  margin-top: 28px;
  display: flex;
  gap: 16px;
  flex-wrap: wrap;
}

.primary-btn, .secondary-btn, .cancel-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 12px;
  padding: 14px 22px;
  font-weight: 700;
  border: none;
  cursor: pointer;
  transition: transform 0.2s ease;
}

.primary-btn {
  background: linear-gradient(135deg, var(--primary), var(--secondary));
  color: white;
  box-shadow: 0 10px 24px rgba(18, 194, 166, 0.3);
}

.secondary-btn {
  background: rgba(255, 255, 255, 0.06);
  color: white;
  border: 1px solid rgba(255, 255, 255, 0.08);
}

.primary-btn:hover,
.secondary-btn:hover,
.cancel-btn:hover {
  transform: translateY(-1px);
}

.full-width {
  width: 100%;
}

.small-btn {
  padding: 10px 14px;
  font-size: 0.9rem;
}

.feature-list {
  list-style: none;
  padding: 0;
  margin: 28px 0 0;
  display: grid;
  grid-template-columns: repeat(3, minmax(150px, 1fr));
  gap: 12px;
  color: rgba(234, 244, 255, 0.83);
}

.feature-list li {
  position: relative;
  padding-left: 18px;
}

.feature-list li::before {
  content: '•';
  position: absolute;
  left: 0;
  color: var(--primary);
}

.hero-panel {
  background: rgba(10, 22, 34, 0.7);
  border: 1px solid var(--card-border);
  border-radius: 30px;
  box-shadow: var(--shadow);
  padding: 24px;
}

.stat-card {
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.06);
  border-radius: 20px;
  padding: 18px 20px;
}

.stat-card.highlight {
  background: linear-gradient(135deg, rgba(18, 194, 166, 0.15), rgba(45, 116, 255, 0.15));
  margin-bottom: 20px;
}

.stat-card span {
  display: block;
  color: rgba(234, 244, 255, 0.75);
  font-size: 0.8rem;
  margin-bottom: 8px;
}

.stat-card strong {
  font-size: 2rem;
  line-height: 1;
}

.stat-card small {
  display: block;
  margin-top: 8px;
  color: rgba(234, 244, 255, 0.7);
}

.mini-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(120px, 1fr));
  gap: 16px;
}

.features {
  max-width: 1280px;
  margin: 0 auto;
  padding: 40px 32px 80px;
}

.section-heading {
  display: flex;
  justify-content: center;
  text-align: center;
  margin-bottom: 32px;
}

.section-heading h2 {
  color: var(--text);
  margin: 10px 0 0;
  font-size: clamp(2rem, 3vw, 2.6rem);
}

.cards {
  display: grid;
  grid-template-columns: repeat(4, minmax(220px, 1fr));
  gap: 20px;
}

.feature-card {
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.06);
  border-radius: 22px;
  padding: 24px 20px;
  color: rgba(234, 244, 255, 0.8);
}

.feature-card h3 {
  margin: 0 0 16px;
  font-size: 1.2rem;
  color: white;
}

.feature-card p {
  line-height: 1.8;
  margin: 0;
}

.auth-page {
  display: grid;
  place-items: center;
  padding: 44px 20px;
}

.auth-shell {
  width: min(100%, 520px);
}

.auth-card, .sidebar-card, .table-card, .booking-box, .station-card, .summary-card {
  background: rgba(11, 18, 30, 0.78);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 24px;
  box-shadow: var(--shadow);
}

.form-card {
  padding: 30px 28px;
}

.form-card h1 {
  margin: 10px 0 20px;
  font-size: clamp(2rem, 3vw, 2.5rem);
  color: white;
}

#loginForm, #registerForm, .booking-form {
  display: grid;
  gap: 18px;
}

label {
  display: grid;
  gap: 8px;
  font-weight: 600;
  color: rgba(234, 244, 255, 0.9);
}

input, select {
  width: 100%;
  background: rgba(255, 255, 255, 0.04);
  color: white;
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 12px;
  padding: 14px 14px;
}

input::placeholder {
  color: rgba(255, 255, 255, 0.42);
}

.switch-link {
  margin-top: 18px;
  text-align: center;
  color: rgba(234, 244, 255, 0.76);
}

.switch-link a {
  color: var(--primary);
  font-weight: 600;
}

.demo-note {
  text-align: center;
  margin-top: 10px;
  color: rgba(234, 244, 255, 0.62);
}

.dashboard-page {
  padding-bottom: 60px;
}

.dashboard-shell, .admin-shell {
  max-width: 1280px;
  margin: 28px auto 0;
  padding: 0 32px;
  display: grid;
  grid-template-columns: 300px minmax(0, 1fr);
  gap: 24px;
}

.sidebar {
  display: grid;
  gap: 20px;
}

.sidebar-card {
  padding: 20px 18px;
}

.profile-card h2 {
  margin: 8px 0 4px;
}

.tiny-list {
  display: grid;
  gap: 14px;
  margin-top: 16px;
}

.tiny-list div {
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: rgba(234, 244, 255, 0.76);
}

.content-panel {
  display: grid;
  gap: 24px;
}

.section-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16px;
}

.section-header h2, .section-header h3 {
  margin: 10px 0 0;
  color: white;
}

.station-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 16px;
}

.station-card {
  overflow: hidden;
}

.station-banner {
  height: 160px;
  background-size: cover;
  background-position: center;
}

.station-card-body {
  padding: 18px;
}

.station-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}

.station-head h3 {
  margin: 0;
  font-size: 1.1rem;
}

.tag {
  padding: 6px 10px;
  border-radius: 999px;
  font-size: 0.8rem;
  background: rgba(18, 194, 166, 0.12);
  color: var(--primary);
}

.station-card-body p {
  margin: 12px 0;
  color: rgba(234, 244, 255, 0.75);
}

.station-meta {
  display: flex;
  justify-content: space-between;
  color: rgba(234, 244, 255, 0.8);
  font-size: 0.92rem;
}

.booking-box, .table-card, .summary-card {
  padding: 20px;
}

.booking-form {
  grid-template-columns: repeat(5, minmax(110px, 1fr));
  align-items: end;
}

.data-panel {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
}

.table-wrap {
  display: grid;
  gap: 12px;
}

.table-header, .table-row {
  display: grid;
  align-items: center;
  gap: 12px;
}

.table-header {
  grid-template-columns: 1.5fr 1fr 1.2fr 0.8fr 0.7fr;
  padding-bottom: 8px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
  color: rgba(234, 244, 255, 0.7);
  font-size: 0.82rem;
  text-transform: uppercase;
  letter-spacing: 0.04em;
}

.table-row {
  grid-template-columns: 1.5fr 1fr 1.2fr 0.8fr 0.7fr;
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid rgba(255, 255, 255, 0.04);
  border-radius: 14px;
  padding: 12px 14px;
  color: rgba(234, 244, 255, 0.88);
}

.compact-row {
  grid-template-columns: 1.5fr 1fr 0.7fr;
}

.status {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 6px 10px;
  border-radius: 999px;
  font-size: 0.74rem;
  font-weight: 700;
  text-transform: capitalize;
}

.status.confirmed {
  background: rgba(70, 211, 154, 0.12);
  color: var(--success);
}

.status.overstay {
  background: rgba(250, 95, 111, 0.12);
  color: var(--danger);
}

.status.completed {
  background: rgba(45, 116, 255, 0.12);
  color: #7fb7ff;
}

.status.cancelled {
  background: rgba(255, 179, 71, 0.12);
  color: var(--warning);
}

.alert {
  color: var(--danger);
  font-weight: 700;
}

.cancel-btn {
  background: rgba(250, 95, 111, 0.18);
  color: var(--danger);
  padding: 8px 10px;
  border-radius: 10px;
}

.empty-state {
  padding: 20px;
  border-radius: 14px;
  background: rgba(255, 255, 255, 0.02);
  color: rgba(234, 244, 255, 0.72);
}

.summary-grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(180px, 1fr));
  gap: 16px;
}

.summary-card {
  display: grid;
  gap: 8px;
  padding: 20px 18px;
}

.summary-card span {
  color: rgba(234, 244, 255, 0.7);
}

.summary-card strong {
  font-size: clamp(1.8rem, 2vw, 2.4rem);
}

.admin-table {
  margin-top: 12px;
}

@media (max-width: 980px) {
  .hero {
    grid-template-columns: 1fr;
    padding-top: 48px;
  }

  .cards {
    grid-template-columns: repeat(2, minmax(220px, 1fr));
  }

  .dashboard-shell, .admin-shell {
    grid-template-columns: 1fr;
  }

  .booking-form {
    grid-template-columns: 1fr 1fr;
  }
}

@media (max-width: 640px) {
  nav {
    flex-wrap: wrap;
    justify-content: flex-end;
  }

  .button-row,
  .feature-list,
  .cards,
  .booking-form,
  .data-panel,
  .summary-grid {
    grid-template-columns: 1fr;
  }

  .topbar, .dashboard-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 14px;
  }

  .table-header {
    display: none;
  }

  .table-row {
    grid-template-columns: 1fr;
  }
}
