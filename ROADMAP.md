# Project Roadmap

This document outlines the planned roadmap, feature goals, and milestones for **GefenStarlight**.

---

## 🎯 Release Milestones

### Phase 1: Foundation & Setup (Current)
- [x] Repository initialization & Next.js App Router setup
- [x] Standardized Markdown documentation suite (`README`, `CONTRIBUTING`, `ARCHITECTURE`, etc.)
- [x] AI agent guidelines (`.agents/AGENTS.md`)
- [x] Development helper scripts (`run.bat`)
- [ ] Core UI Layout & Design Token System setup in Vanilla CSS

### Phase 2: Core Features & Components
- [ ] Build reusable component library (Header, Footer, Navigation, Modal, Cards)
- [x] Implement responsive Dark/Light theme toggle
- [ ] Set up interactive dashboard views
- [ ] API integration layer & data fetching utilities

### Open decisions & near-term work (2026-07-29)
- [ ] **Design refinements awaiting team sign-off** — warm paper background, champagne gold, hero glow and a stronger vine watermark are live; `design-refinements.html` is the before/after sheet sent to the team. Rollback point: tag `pre-refinements-2026-07-29`, or revert commit `c22d8e4`.
- [ ] **Named accessibility coordinator** — the statement currently points at the contact page. The regulations expect a person; add the name to `pages/3` once chosen.
- [ ] **DNS still on Wix** — `www.gefenstarlight.com` serves the old site; the new one is only on the Vercel address.
- [ ] **Site palette** — the team is choosing between five mockup directions (`palette-mockups.html`); applying the choice is a token swap in `globals.css`.
- [ ] **Full-CMS plan phases** — audit done; Phase 1 (film upload field, SEO extras, hide empty news), Phase 2 (logo uploads, PWA manifest from settings), Phase 3 (editable-texts global) await go-ahead.
- [ ] Optional: lighter 720p web variant of the home-page film to cut autoplay bandwidth.

### Phase 3: Polish, SEO & Performance
- [ ] Micro-animations and responsive UX transitions
- [ ] OpenGraph metadata & dynamic SEO optimization
- [ ] Automated end-to-end testing suite
- [ ] Production build verification & deployment CI/CD pipeline

---

## 💡 Feature Ideas & Backlog

Have a feature request or idea? Feel free to open a feature request issue using our [Feature Request Template](.github/ISSUE_TEMPLATE/feature_request.md)!
