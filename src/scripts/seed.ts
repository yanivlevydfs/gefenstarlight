/**
 * Imports everything carried over from the old Wix site into Payload.
 *
 *   npm run seed
 *
 * Safe to re-run: documents are matched by slug and updated in place, and media
 * is matched by filename so files are never uploaded twice.
 */
import fs from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

import { getPayload } from 'payload'
// Relative rather than the `@payload-config` alias — the seed runs through the
// Payload CLI, which does not resolve tsconfig path aliases.
import config from '../payload.config'

import { toLexical } from './lexical'
import { projects } from './content/projects'
import { pages as contentPages } from './content/pages'
import { boardMembers, testimonials } from './content/people'
import { donationTiers, homePage, navigationItems, siteSettings } from './content/settings'

const dirname = path.dirname(fileURLToPath(import.meta.url))
const MEDIA_DIR = path.resolve(dirname, '../../seed-media')

type ManifestItem = {
  file: string
  posterFile?: string
  isVideo: boolean
  width?: number
  height?: number
  originalName?: string
}
type Manifest = Record<string, ManifestItem[]>

/** Album titles, keyed by the old Wix page the photos came from. */
const albumTitles: Record<string, { he: string; en: string }> = {
  'גלריה': { he: 'תמונות מהפעילות', en: 'Photos from our activity' },
  'סרטונים': { he: 'סרטונים', en: 'Videos' },
  home: { he: 'רגעים נבחרים', en: 'Selected moments' },
  'תודות': { he: 'מכתבים ותודות', en: 'Letters and thanks' },
  'פרוייקטים': { he: 'מיזמים', en: 'Projects' },
  'פרויקט-1': { he: 'פורים 2020', en: 'Purim 2020' },
  'פרויקט-2': { he: 'נערים בסיכון 2021', en: 'Youth at risk 2021' },
  'פרויקט-3': { he: 'נערים בסיכון 2022', en: 'Youth at risk 2022' },
  'copy-of-פרויקט-1': { he: 'הוד השרון 2023', en: 'Hod Hasharon 2023' },
  'copy-of-פרויקט-1-1': { he: 'ערב התרמה עם קובי מימון', en: 'Fundraising evening with Kobi Maimon' },
  'copy-of-פרויקט-4': { he: 'רמלה 2023', en: 'Ramla 2023' },
  'copy-of-פרויקט-4-1': { he: 'הוד השרון 2024', en: 'Hod Hasharon 2024' },
  'copy-of-פרויקט-6': { he: 'פתח תקווה 2025', en: 'Petah Tikva 2025' },
  'copy-of-פרויקט-6-1': { he: 'מופע התרמה 2024', en: 'Benefit show 2024' },
  'copy-of-פרויקט-7-ערב-התרמה': { he: 'חוג ג׳ודו ברמלה 2024', en: 'Ramla judo club 2024' },
  'copy-of-פרויקט-קובי-מימון': { he: 'בית ציוני אמריקה 2024', en: 'ZOA House 2024' },
  'ערב-התרמה': { he: 'ערב התרמה 2023', en: 'Fundraising evening 2023' },
  'אודות-גפן': { he: 'גפן', en: 'Gefen' },
  'עלינו': { he: 'ועד העמותה', en: 'The board' },
}

/** Wix page keys that are chrome-only and should not become albums. */
const skipAlbums = new Set(['תרומות', 'צור-קשר', 'donate', 'about-us', 'en', 'תקנון'])

function slugForAlbum(key: string): string {
  const map: Record<string, string> = {
    'גלריה': 'gallery',
    'סרטונים': 'videos',
    home: 'highlights',
    'תודות': 'thanks',
    'פרוייקטים': 'projects',
    'פרויקט-1': 'purim-2020',
    'פרויקט-2': 'youth-at-risk-2021',
    'פרויקט-3': 'youth-at-risk-2022',
    'copy-of-פרויקט-1': 'hod-hasharon-2023',
    'copy-of-פרויקט-1-1': 'kobi-maimon-2023',
    'copy-of-פרויקט-4': 'ramla-2023',
    'copy-of-פרויקט-4-1': 'hod-hasharon-2024',
    'copy-of-פרויקט-6': 'petah-tikva-2025',
    'copy-of-פרויקט-6-1': 'benefit-show-2024',
    'copy-of-פרויקט-7-ערב-התרמה': 'ramla-judo-2024',
    'copy-of-פרויקט-קובי-מימון': 'zoa-house-2024',
    'ערב-התרמה': 'fundraising-evening-2023',
    'אודות-גפן': 'gefen',
    'עלינו': 'board',
  }
  return map[key] ?? key
}

async function main() {
  const payload = await getPayload({ config })
  const log = (msg: string) => payload.logger.info(msg)

  // ------------------------------------------------------------ admin user
  const { totalDocs: userCount } = await payload.count({ collection: 'users' })
  if (userCount === 0) {
    const email = process.env.SEED_ADMIN_EMAIL || 'admin@gefenstarlight.com'
    const password = process.env.SEED_ADMIN_PASSWORD || 'ChangeMe!2026'
    await payload.create({
      collection: 'users',
      data: { email, password, name: 'Site owner' },
    })
    log(`created admin user ${email} (password: ${password}) — change it after first login`)
  }

  // ---------------------------------------------------------------- media
  let manifest: Manifest = {}
  try {
    manifest = JSON.parse(await fs.readFile(path.join(MEDIA_DIR, 'manifest.json'), 'utf8'))
  } catch {
    log('no seed-media/manifest.json found — skipping media import')
  }

  /** filename -> Payload media id */
  const mediaIds = new Map<string, string | number>()

  async function uploadOnce(filename: string, alt: string): Promise<string | number | null> {
    if (mediaIds.has(filename)) return mediaIds.get(filename)!

    const existing = await payload.find({
      collection: 'media',
      limit: 1,
      where: { filename: { equals: filename } },
    })
    if (existing.docs[0]) {
      mediaIds.set(filename, existing.docs[0].id)
      return existing.docs[0].id
    }

    try {
      const filePath = path.join(MEDIA_DIR, filename)
      await fs.access(filePath)
      const doc = await payload.create({
        collection: 'media',
        locale: 'he',
        data: { alt },
        filePath,
      })
      mediaIds.set(filename, doc.id)
      return doc.id
    } catch (error) {
      log(`  media upload failed for ${filename}: ${(error as Error).message}`)
      return null
    }
  }

  // ---------------------------------------------------------------- albums
  /** album key -> Payload album id */
  const albumIds = new Map<string, string | number>()

  for (const [key, items] of Object.entries(manifest)) {
    if (skipAlbums.has(key)) continue
    const titles = albumTitles[key] ?? { he: key, en: key }
    const slug = slugForAlbum(key)

    const uploaded: (string | number)[] = []
    for (const item of items) {
      const id = await uploadOnce(item.file, titles.he)
      if (id) uploaded.push(id)
      if (item.posterFile) await uploadOnce(item.posterFile, titles.he)
    }
    if (uploaded.length === 0) continue

    const hasVideo = items.some((i) => i.isVideo)
    const existing = await payload.find({
      collection: 'albums',
      limit: 1,
      where: { slug: { equals: slug } },
    })

    const data = {
      title: titles.he,
      slug,
      kind: hasVideo && items.every((i) => i.isVideo) ? ('videos' as const) : ('photos' as const),
      showInGallery: !['board', 'gefen', 'projects'].includes(slug),
      cover: uploaded[0],
      items: uploaded,
      _status: 'published' as const,
    }

    const doc = existing.docs[0]
      ? await payload.update({ collection: 'albums', id: existing.docs[0].id, locale: 'he', data })
      : await payload.create({ collection: 'albums', locale: 'he', data })

    await payload.update({
      collection: 'albums',
      id: doc.id,
      locale: 'en',
      data: { title: titles.en },
    })

    albumIds.set(key, doc.id)
    log(`album ${slug}: ${uploaded.length} items`)
  }

  // -------------------------------------------------------------- projects
  for (const project of projects) {
    const albumId = project.albumKey ? albumIds.get(project.albumKey) : undefined
    const existing = await payload.find({
      collection: 'projects',
      limit: 1,
      where: { slug: { equals: project.slug } },
    })

    const heData = {
      title: project.he.title,
      slug: project.slug,
      date: project.date,
      location: project.he.location,
      featured: Boolean(project.featured),
      summary: project.he.summary,
      body: toLexical(project.he.body, 'rtl'),
      quotes: project.he.quotes,
      album: albumId,
      ctaUrl: project.ctaUrl,
      ctaLabel: project.he.ctaLabel,
      legacyPaths: project.legacyPaths.map((p) => ({ path: p })),
      _status: 'published' as const,
    }

    const doc = existing.docs[0]
      ? await payload.update({
          collection: 'projects',
          id: existing.docs[0].id,
          locale: 'he',
          data: heData,
        })
      : await payload.create({ collection: 'projects', locale: 'he', data: heData })

    await payload.update({
      collection: 'projects',
      id: doc.id,
      locale: 'en',
      data: {
        title: project.en.title,
        location: project.en.location,
        summary: project.en.summary,
        body: toLexical(project.en.body, 'ltr'),
        quotes: project.en.quotes,
        ctaLabel: project.en.ctaLabel,
        _status: 'published' as const,
      },
    })

    log(`project ${project.slug}`)
  }

  // ----------------------------------------------------------------- pages
  for (const page of contentPages) {
    let heBody = page.he.body ?? []
    if (page.bodyFile) {
      const raw = await fs.readFile(path.join(dirname, 'content', page.bodyFile), 'utf8')
      heBody = raw.split('\n').filter(Boolean)
    }

    const existing = await payload.find({
      collection: 'pages',
      limit: 1,
      where: { slug: { equals: page.slug } },
    })

    const heData = {
      title: page.he.title,
      slug: page.slug,
      subtitle: page.he.subtitle,
      body: toLexical(heBody, 'rtl'),
      legacyPaths: page.legacyPaths.map((p) => ({ path: p })),
      album: page.albumKey ? albumIds.get(page.albumKey) : undefined,
      _status: 'published' as const,
    }

    const doc = existing.docs[0]
      ? await payload.update({ collection: 'pages', id: existing.docs[0].id, locale: 'he', data: heData })
      : await payload.create({ collection: 'pages', locale: 'he', data: heData })

    await payload.update({
      collection: 'pages',
      id: doc.id,
      locale: 'en',
      data: {
        title: page.en.title,
        subtitle: page.en.subtitle,
        body: toLexical(page.en.body ?? [], 'ltr'),
        _status: 'published' as const,
      },
    })

    log(`page ${page.slug}`)
  }

  // ---------------------------------------------------------------- people
  for (const person of boardMembers) {
    const existing = await payload.find({
      collection: 'board-members',
      limit: 1,
      locale: 'he',
      where: { name: { equals: person.he.name } },
    })

    const doc = existing.docs[0]
      ? await payload.update({
          collection: 'board-members',
          id: existing.docs[0].id,
          locale: 'he',
          data: { ...person.he, order: person.order },
        })
      : await payload.create({
          collection: 'board-members',
          locale: 'he',
          data: { ...person.he, order: person.order },
        })

    await payload.update({
      collection: 'board-members',
      id: doc.id,
      locale: 'en',
      data: person.en,
    })
  }
  log(`board members: ${boardMembers.length}`)

  for (const item of testimonials) {
    const existing = await payload.find({
      collection: 'testimonials',
      limit: 1,
      locale: 'he',
      where: { author: { equals: item.he.author } },
    })

    const doc = existing.docs[0]
      ? await payload.update({
          collection: 'testimonials',
          id: existing.docs[0].id,
          locale: 'he',
          data: { ...item.he, order: item.order, featured: item.featured },
        })
      : await payload.create({
          collection: 'testimonials',
          locale: 'he',
          data: { ...item.he, order: item.order, featured: item.featured },
        })

    await payload.update({ collection: 'testimonials', id: doc.id, locale: 'en', data: item.en })
  }
  log(`testimonials: ${testimonials.length}`)

  // --------------------------------------------------------------- globals
  const heroAlbum = manifest['home'] ?? manifest['גלריה'] ?? []
  const heroImageId = heroAlbum[0] ? mediaIds.get(heroAlbum[0].file) : undefined

  await payload.updateGlobal({
    slug: 'site-settings',
    locale: 'he',
    data: {
      ...siteSettings.he,
      bank: { ...siteSettings.he.bank, ...siteSettings.bank },
      international: siteSettings.international,
      emails: siteSettings.emails.map((email) => ({ email })),
      phones: siteSettings.phones.map((p) => ({ number: p.number, label: p.he })),
      whatsapp: siteSettings.whatsapp,
      donationTiers: donationTiers.map((tier) => ({
        label: tier.he,
        amount: tier.amount,
        url: tier.url,
        kind: tier.kind,
      })),
    },
  })

  await payload.updateGlobal({
    slug: 'site-settings',
    locale: 'en',
    data: {
      ...siteSettings.en,
      bank: { ...siteSettings.en.bank, ...siteSettings.bank },
      phones: siteSettings.phones.map((p) => ({ number: p.number, label: p.en })),
      donationTiers: donationTiers.map((tier) => ({
        label: tier.en,
        amount: tier.amount,
        url: tier.url,
        kind: tier.kind,
      })),
    },
  })
  log('site settings')

  await payload.updateGlobal({
    slug: 'navigation',
    locale: 'he',
    data: {
      items: navigationItems.map((item) => ({
        label: item.he,
        href: item.href,
        description: item.heDesc,
        highlight: Boolean(item.highlight),
      })),
    },
  })

  await payload.updateGlobal({
    slug: 'navigation',
    locale: 'en',
    data: {
      items: navigationItems.map((item) => ({
        label: item.en,
        href: item.href,
        description: item.enDesc,
        highlight: Boolean(item.highlight),
      })),
    },
  })
  log('navigation')

  await payload.updateGlobal({
    slug: 'home-page',
    locale: 'he',
    data: {
      ...homePage.he,
      heroImage: heroImageId,
      goals: homePage.goals.map((goal) => ({ ...goal.he, icon: goal.icon })),
      featuredAlbum: albumIds.get('גלריה'),
    },
  })

  await payload.updateGlobal({
    slug: 'home-page',
    locale: 'en',
    data: {
      ...homePage.en,
      goals: homePage.goals.map((goal) => ({ ...goal.en, icon: goal.icon })),
    },
  })
  log('home page')

  log('seed complete')
  process.exit(0)
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
