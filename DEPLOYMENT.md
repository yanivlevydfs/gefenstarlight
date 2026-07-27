# Deployment

The site is a single Next.js application. The public pages and the Payload admin
console are the same deployment — there is no separate CMS to host.

---

## 1. Environment variables

Set these in **Vercel → Project → Settings → Environment Variables**, for
Production, Preview and Development.

| Variable | Required | Value |
| --- | --- | --- |
| `PAYLOAD_SECRET` | **yes** | A long random string. Signs admin sessions. Generate once and never change it, or everyone is logged out. |
| `DATABASE_URI` | **yes** | A `postgres://…` connection string. |
| `BLOB_READ_WRITE_TOKEN` | **yes** | From Vercel Blob. Without it, uploads from the admin console fail. |
| `NEXT_PUBLIC_SITE_URL` | recommended | `https://www.gefenstarlight.com` — used for canonical URLs, `sitemap.xml` and social previews. |

Generate a secret:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

> **The build fails without `PAYLOAD_SECRET`.** Everything else degrades
> gracefully — the site renders with fallback copy — but the secret is checked
> at start-up.

### Why Postgres and not the local file

Locally the site runs on SQLite (`gefen.db`) so `run.bat` works with no setup.
Vercel's filesystem is read-only, so SQLite cannot be used there. The adapter
switches automatically: any `DATABASE_URI` starting with `postgres` uses
Postgres, anything else uses SQLite. No code change is needed.

Create the database from **Vercel → Storage → Create → Neon (Postgres)**. Vercel
sets `DATABASE_URL`; copy that value into `DATABASE_URI` as well.

Create blob storage from **Vercel → Storage → Create → Blob**, which sets
`BLOB_READ_WRITE_TOKEN` automatically.

---

## 2. First deploy

The repository is connected to Vercel, so pushing to `main` deploys.

```bash
git push
```

The build runs `next build`, which also generates `src/payload-types.ts` and the
admin import map.

---

## 3. Seed production content

The content imported from Wix lives in the local SQLite database. To copy it
into the production Postgres database, run the seed against the production
connection string **once**:

```bash
# PowerShell
$env:DATABASE_URI = "postgres://…"          # the production string
$env:BLOB_READ_WRITE_TOKEN = "vercel_blob_…" # so media uploads to Blob
npm run seed
```

This uploads the 152 photos and videos in `seed-media/` and creates every album,
project, page, board member, testimonial and the site settings, in Hebrew and
English.

The seed is safe to re-run: documents are matched by slug and media by filename,
so nothing is duplicated.

It also creates the first admin account if none exists:

- email: `admin@gefenstarlight.com`
- password: `ChangeMe!2026`

**Change that password immediately after the first login**, or set
`SEED_ADMIN_EMAIL` and `SEED_ADMIN_PASSWORD` before running the seed.

---

## 4. Point the domain at Vercel

In **Vercel → Settings → Domains**, add `gefenstarlight.com` and
`www.gefenstarlight.com`, then update the DNS records at the registrar as Vercel
instructs. Do this only once the content has been seeded and checked.

Old Wix URLs keep working: every project, album, page and article carries a
`legacyPaths` field, and the catch-all route resolves those paths from the CMS
and issues a permanent redirect. Adding a new page with an old link needs no
code change.

---

## 5. After deploying

- `/{he,en}` — the public site, Hebrew by default
- `/admin` — the admin console, in Hebrew
- `/sitemap.xml`, `/robots.txt` — generated from the CMS

---

## Local development

```bash
run.bat
```

Or:

```bash
npm install
npm run dev      # http://localhost:3001
npm run seed     # imports the Wix content into the local database
```

Useful checks, all of which must pass before pushing:

```bash
npm run typecheck   # types only, no build artifacts needed
npm run lint
npm run build       # exactly what Vercel runs
```
