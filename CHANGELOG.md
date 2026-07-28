# Changelog

All notable changes to the **GefenStarlight** project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [Unreleased]

### Added — 2026-07-28
- Light/dark theme toggle on every page: palette-variable remap, pre-paint script, choice persists across reloads and language switches.
- Vine-leaves watermark background site-wide, tinted per theme.
- The foundation film on the home page (autoplay muted, no download entry), imported from the old Wix site into the media library and leading the videos album.
- Goals picture carousel on the home page, rebuilt from the old Wix slider; photos are admin-managed per goal (`image` field on home-page goals) and it auto-loops.
- Donate button visible in the header on every viewport (heart icon on phones).
- Organisation logo in the footer — transparent, centred, with an automatically tinted starlight colourway for the dark theme.
- Buy button on album pages whose album is claimed by a project (wine album → Gefen Wine project CTA).
- First three news articles published (wine launch, Petah Tikva 2025 opening, Ramla judo third year), bilingual with covers and albums.
- Hebrew team manual inside the admin console at `/admin/manual`, with a dashboard banner (login-gated).
- Team artifacts: palette mockups (`palette-mockups.html`) and the admin cheat-sheet (`admin-guide.html`).

### Fixed — 2026-07-28
- Percent-encoded non-ASCII slugs 404ing on ISR re-render (albums, projects, articles now decode before lookup).
- Hebrew street address rendering mirrored: the anti-harvester reverse-and-flip trick now applies only to Latin/digit values.
- Published contact details reduced to the only correct set (`054-4249142`, `aaviram1@012.net.il`).
- Board headshots: Hagai Netzer / Arnon Meinfeld / Hadar Tal untangled; Arnon received a new photo.
- Project albums re-sorted to their real events after the Wix scraper's cross-page bleed (Petah Tikva 2025 / Ramla judo 2024 / Hod Hasharon 2024).
- Wine album: cover set and English title/description added.

### Added
- Initial Next.js (App Router, TypeScript, Vanilla CSS) project structure.
- Core project documentation (`README.md`, `CONTRIBUTING.md`, `CODE_OF_CONDUCT.md`, `CHANGELOG.md`, `SECURITY.md`, `ARCHITECTURE.md`, `ROADMAP.md`, `LICENSE.md`).
- Project-scoped agent guidelines (`.agents/AGENTS.md`).
- Issue and Pull Request templates (`.github/`).
- `run.bat` Windows helper script for starting local development server.

---

## [0.1.0] - 2026-07-27

### Added
- Project repository initialization.
