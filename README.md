# אור הכוכבים של גפן — Gefen Starlight

The website of the Gefen Starlight foundation, which funds martial-arts
programmes for children and youth at risk in memory of Gefen Aviram.

Hebrew and English, Hebrew first. The site owner edits everything — pages,
projects, photo albums, videos, articles, the menu, contact and donation
details — from an admin console in Hebrew, with no code changes.

- Site: [gefenstarlight.vercel.app](https://gefenstarlight.vercel.app) (`/he` and `/en`)
- Admin: [/admin](https://gefenstarlight.vercel.app/admin)
- Configuration check: [/health](https://gefenstarlight.vercel.app/health)

---

## What it is built from

| Concern | Choice |
| --- | --- |
| Framework | Next.js 16 (App Router, React 19 server components) |
| Content | [Payload CMS 3](https://payloadcms.com) running inside the same app |
| Database | Postgres in production, SQLite locally |
| Files | Vercel Blob, through a small adapter in `src/payload/storage` |
| Languages | `next-intl`, Hebrew default, RTL/LTR handled automatically |
| Styling | Tailwind CSS 4 with a "starlight" token set in `src/app/globals.css` |
| Lightbox | `yet-another-react-lightbox`, with video support |

There is no separate CMS to host and no build step to publish: saving in the
admin console clears the affected pages and the change is live.

---

## Running it locally

```bash
run.bat          # installs, creates .env, starts the dev server
```

or

```bash
npm install
npm run dev      # http://localhost:3001
npm run seed     # imports the content and photos carried over from Wix
```

The first visit to `/admin` asks you to create an account if none exists.

### Checks

```bash
npm run typecheck   # types only, no build needed
npm run lint
npm run build       # exactly what Vercel runs
npm run e2e -- http://localhost:3001   # drives the admin console end to end
```

`npm run e2e` uploads a photo, creates an album, a project and an article,
translates them, checks each appears on the public pages, then deletes them.

---

## Where things live

```text
src/
├── app/
│   ├── (frontend)/[locale]/   the public site, one folder per route
│   ├── (payload)/             the admin console and REST API
│   ├── health/                reports what configuration the deploy can see
│   ├── sitemap.ts, robots.ts
│   └── globals.css            design tokens
├── components/site/           header, footer, gallery, forms
├── i18n/                      locale routing and request config
├── lib/                       CMS reads, media helpers, SEO helpers
├── payload/
│   ├── collections/           Projects, Albums, Articles, Pages, Media, People
│   ├── globals/               home page, menu, site settings
│   ├── hooks/                 cache invalidation on save
│   └── storage/               Vercel Blob adapter
├── payload.config.ts
└── scripts/                   import from Wix, seeding, checks, e2e
messages/                      interface strings (he, en)
seed-media/                    the photos and videos carried over from Wix
```

---

## Content model

| Collection | Purpose |
| --- | --- |
| **Projects** | Each becomes a page at `/he/projects/<slug>` |
| **Albums** | Photo and video albums shown in the gallery |
| **Articles** | News and updates at `/he/news/<slug>` |
| **Pages** | Free-form pages such as "Who is Gefen" and the bylaws |
| **Media** | Every photo and video, with generated sizes |
| **Board members** / **Testimonials** | The about and thank-you pages |
| **Enquiries** | Contact-form submissions |

Globals cover the home page, the menu (each entry can carry its own artwork)
and site settings (contact details, bank details, donation links).

### Old Wix links keep working

Every project, album, article and page has a **legacy URLs** field, and the menu
entries have one too. A request for an old address is resolved from the CMS and
permanently redirected. Adding a page and its old link needs no code change.

All 25 addresses the Wix site published were verified as resolving.

---

## Deploying

See [DEPLOYMENT.md](DEPLOYMENT.md). In short: set `PAYLOAD_SECRET`,
`BLOB_READ_WRITE_TOKEN` and `NEXT_PUBLIC_SITE_URL` **on the project** (variables
on the team-wide "Shared" tab do not reach it unless linked), connect a Postgres
database and a **public** Blob store, then push.

`/health` will tell you what the deployment can actually see.

---

## Licence

MIT — see [LICENSE.md](LICENSE.md).
