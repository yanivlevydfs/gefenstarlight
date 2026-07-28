/**
 * Exercises the admin console against a running site: uploading a photo,
 * creating an album, a project and an article, translating them, and confirming
 * each appears on the public pages. Everything it creates is removed again.
 *
 *   npm run e2e                      # against production
 *   npm run e2e -- http://localhost:3001
 *
 * Credentials come from E2E_EMAIL / E2E_PASSWORD, falling back to the seeded
 * account.
 */
export {}

import fs from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const BASE = (process.argv[2] || 'https://gefenstarlight.vercel.app').replace(/\/$/, '')
const EMAIL = process.env.E2E_EMAIL || 'admin@gefenstarlight.com'
const PASSWORD = process.env.E2E_PASSWORD || 'ChangeMe!2026'

const dirname = path.dirname(fileURLToPath(import.meta.url))
const SAMPLE = path.resolve(dirname, '../../seed-media/a50afb_99d4162785f34f9dba63b197e6e756e5~mv2.jpg')

let failures = 0
const created: Record<string, (string | number)[]> = { media: [], albums: [], projects: [], articles: [] }

function check(name: string, ok: boolean, detail = '') {
  if (!ok) failures++
  console.log(`${ok ? 'PASS' : 'FAIL'}  ${name}${detail ? '  ' + detail : ''}`)
}

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms))

async function run() {
  console.log(`testing ${BASE}\n`)

  const login = await fetch(`${BASE}/api/users/login`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ email: EMAIL, password: PASSWORD }),
  })
  const loginBody = (await login.json()) as { token?: string; user?: { email?: string } }
  check('admin can log in', login.ok && Boolean(loginBody.token), loginBody.user?.email ?? '')
  if (!loginBody.token) return

  const auth = { Authorization: `JWT ${loginBody.token}` }
  const json = { ...auth, 'content-type': 'application/json' }

  // ------------------------------------------------------------------ upload
  const bytes = await fs.readFile(SAMPLE)
  const form = new FormData()
  form.append('file', new Blob([bytes], { type: 'image/jpeg' }), `e2e-${Date.now()}.jpg`)
  form.append('_payload', JSON.stringify({ alt: 'בדיקה אוטומטית' }))

  const upload = await fetch(`${BASE}/api/media?locale=he`, { method: 'POST', headers: auth, body: form })
  const uploaded = (await upload.json().catch(() => ({}))) as { doc?: { id: number; url: string } }
  check('photo uploads', upload.ok, uploaded.doc?.url ?? '')
  if (uploaded.doc?.id) created.media.push(uploaded.doc.id)

  if (uploaded.doc?.url) {
    let head = await fetch(uploaded.doc.url, { method: 'HEAD', cache: 'no-store' })
    for (let i = 0; i < 8 && head.status !== 200; i++) {
      await sleep(3000)
      head = await fetch(uploaded.doc.url, { method: 'HEAD', cache: 'no-store' })
    }
    check('uploaded photo is served', head.status === 200, String(head.status))
  }

  // ------------------------------------------------------------------ create
  const album = await create('albums', {
    title: 'אלבום בדיקה',
    slug: 'e2e-album',
    kind: 'photos',
    showInGallery: true,
    items: created.media,
    cover: created.media[0],
    _status: 'published',
  })
  const project = await create('projects', {
    title: 'מיזם בדיקה',
    slug: 'e2e-project',
    date: new Date().toISOString().slice(0, 10),
    summary: 'נוצר בבדיקה אוטומטית.',
    cover: created.media[0],
    album: album?.id,
    legacyPaths: [{ path: '/e2e-legacy' }],
    _status: 'published',
  })
  const article = await create('articles', {
    title: 'כתבה לבדיקה',
    slug: 'e2e-article',
    publishedAt: new Date().toISOString().slice(0, 10),
    excerpt: 'נוצרה בבדיקה אוטומטית.',
    _status: 'published',
  })

  async function create(collection: string, data: Record<string, unknown>) {
    const res = await fetch(`${BASE}/api/${collection}?locale=he`, {
      method: 'POST',
      headers: json,
      body: JSON.stringify(data),
    })
    const body = (await res.json().catch(() => ({}))) as { doc?: { id: number } }
    check(`create ${collection.replace(/s$/, '')}`, res.ok, `id=${body.doc?.id ?? '-'}`)
    if (body.doc?.id) created[collection].push(body.doc.id)
    return body.doc
  }

  // --------------------------------------------------------------- translate
  for (const [collection, id, title] of [
    ['albums', album?.id, 'Test album'],
    ['projects', project?.id, 'Test project'],
    ['articles', article?.id, 'Test article'],
  ] as const) {
    if (!id) continue
    const res = await fetch(`${BASE}/api/${collection}/${id}?locale=en`, {
      method: 'PATCH',
      headers: json,
      body: JSON.stringify({ title }),
    })
    check(`translate ${collection.replace(/s$/, '')}`, res.ok)
  }

  // ------------------------------------------------- visible on the live site
  await sleep(5000)
  for (const [name, urlPath, needle] of [
    ['album shows in the gallery', '/he/gallery', 'אלבום בדיקה'],
    ['album page', '/he/gallery/e2e-album', 'אלבום בדיקה'],
    ['project shows in the list', '/he/projects', 'מיזם בדיקה'],
    ['project page', '/he/projects/e2e-project', 'מיזם בדיקה'],
    ['article shows in the news', '/he/news', 'כתבה לבדיקה'],
    ['article page', '/he/news/e2e-article', 'כתבה לבדיקה'],
    ['english album title', '/en/gallery/e2e-album', 'Test album'],
    ['old link redirects to the new project', '/e2e-legacy', 'מיזם בדיקה'],
  ] as const) {
    const res = await fetch(BASE + urlPath, { cache: 'no-store' })
    const html = await res.text()
    check(name, res.status === 200 && html.includes(needle), String(res.status))
  }

  // ----------------------------------------------------------------- tidy up
  for (const [collection, ids] of Object.entries(created)) {
    for (const id of ids) {
      await fetch(`${BASE}/api/${collection}/${id}`, { method: 'DELETE', headers: auth })
    }
  }
  console.log('\ntest content removed')
}

await run()
console.log(failures === 0 ? '\nALL TESTS PASSED' : `\n${failures} TEST(S) FAILED`)
process.exit(failures === 0 ? 0 : 1)
