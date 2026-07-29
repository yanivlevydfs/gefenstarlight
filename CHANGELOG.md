# Changelog

All notable changes to the **GefenStarlight** project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [Unreleased]

### Added — 2026-07-29
- Accessibility statement and privacy policy, both bilingual and both ordinary CMS pages (`pages/3`, `pages/4`) so every word is owner-editable. The privacy text describes what the code actually does, including that the visitor's IP is hashed and never stored.
- Footer card row for the three legal pages plus a cookie-preferences control, replacing three small underlined links nobody found.
- Sienna accessibility toolbar (MIT, pinned to 2.2.333), loaded outside the cookie gate so it never waits on consent.
- `/.well-known/security.txt` (RFC 9116) as a route, so `Expires` is always a year out and the contact address tracks site settings.
- `coverImage()` and `<CoverImage>`: a listing card resolves its picture from the entry's own cover, its photos, or its attached album, and always draws the frame — the starlight mark stands in when there is genuinely no picture.
- `cover` leads the admin list columns for articles, projects and albums, so a missing preview is visible without opening the entry.

### Changed — 2026-07-29
- Subtle premium refinements, tagged `pre-refinements-2026-07-29` for rollback: light surfaces warmed to `#faf8f2` paper, starlight gold moved onto a champagne hue in both themes, a very weak radial of morning light behind the hero, and the vine watermark raised to 0.062 with the leaves enlarged and the grapes reduced.
- Cookie banner appears on the production deployment only and no longer persists the answer — it holds for the visit and asks again next time.
- Both manuals (in-console and standalone) cover the new pages, the toolbar, the cookie control and security.txt.

### Fixed — 2026-07-29
- The wine article had no preview picture anywhere — news card, WhatsApp share and JSON-LD alike — because it was created before its album had a cover. Backfilled, and the resolver above makes the shape impossible to repeat.
- Postgres `sslmode` pinned to `verify-full`. `pg` treats `require` as verified today but warns that v9 will not, which would have silently downgraded the connection.
- Clearing the cookie choice could not reopen the banner in the same page view (a local `dismissed` flag outranked the store).
- Editor no longer reports Tailwind v4's `@theme` as an unknown at-rule.

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
