/**
 * Cross-checks the live site against the Wix scrape manifest: every project's
 * cover and album items must come from the Wix page the project's albumKey
 * names. Run with: node --import tsx src/scripts/check-project-media.ts
 */
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

import { projects } from './content/projects'

const dirname = path.dirname(fileURLToPath(import.meta.url))
const manifest: Record<string, { file: string; posterFile?: string }[]> = JSON.parse(
  fs.readFileSync(path.resolve(dirname, '../../seed-media/manifest.json'), 'utf8'),
)

const BASE = process.env.CHECK_BASE ?? 'https://gefenstarlight.vercel.app'

type LiveProject = {
  slug: string
  title: string
  cover?: { sourceFile?: string | null } | null
  album?: { title?: string; items?: ({ sourceFile?: string | null } | number)[] } | null
}

const res = await fetch(`${BASE}/api/projects?limit=100&depth=2&locale=he`)
const { docs } = (await res.json()) as { docs: LiveProject[] }

for (const seed of projects) {
  const live = docs.find((d) => d.slug === seed.slug)
  if (!live) {
    console.log(`${seed.slug}: MISSING on live site`)
    continue
  }

  const pageFiles = new Set(
    (seed.albumKey ? (manifest[seed.albumKey] ?? []) : []).flatMap((i) =>
      [i.file, i.posterFile].filter(Boolean),
    ) as string[],
  )

  const cover = live.cover?.sourceFile ?? null
  const coverOk = cover === null ? 'none' : pageFiles.has(cover) ? 'ok' : 'WRONG'

  const items = (live.album?.items ?? [])
    .map((i) => (typeof i === 'object' && i ? (i.sourceFile ?? '?') : '?'))
    .filter((f) => f !== '?')
  const badItems = items.filter((f) => !pageFiles.has(f))

  console.log(
    `${seed.slug} [key=${seed.albumKey ?? '-'}] cover=${coverOk}${
      coverOk === 'WRONG' ? ` (${cover})` : ''
    } items=${items.length}/${pageFiles.size} wrongItems=${badItems.length}`,
  )
  for (const f of badItems) {
    const home = Object.entries(manifest).find(([, list]) =>
      list.some((i) => i.file === f || i.posterFile === f),
    )?.[0]
    console.log(`   item ${f} belongs to page "${home ?? 'unknown'}"`)
  }
  if (coverOk === 'WRONG' && cover) {
    const home = Object.entries(manifest).find(([, list]) =>
      list.some((i) => i.file === cover || i.posterFile === cover),
    )?.[0]
    console.log(`   cover ${cover} belongs to page "${home ?? 'unknown'}"`)
  }
}
