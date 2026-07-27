import { cache } from 'react'
import { getPayload, type Payload, type Where } from 'payload'
import config from '@payload-config'

import type { Locale } from '@/i18n/routing'

/** Shared Payload instance. `getPayload` is already memoised per process. */
export const getPayloadClient = cache(async () => getPayload({ config }))

/**
 * Every CMS read goes through here.
 *
 * Payload throws if it cannot reach a database or `PAYLOAD_SECRET` is unset —
 * which happens on a fresh clone before seeding, and on a CI build that has no
 * env vars yet. The public site must still render in those cases, so failures
 * fall back to a default rather than breaking the page.
 */
async function safely<T>(read: (payload: Payload) => Promise<T>, fallback: T): Promise<T> {
  try {
    return await read(await getPayloadClient())
  } catch (error) {
    console.warn('[payload] read failed, using fallback:', (error as Error).message)
    return fallback
  }
}

type Doc = Record<string, unknown>

export type CollectionName =
  | 'projects'
  | 'albums'
  | 'articles'
  | 'pages'
  | 'board-members'
  | 'testimonials'

export const getHomePage = cache(async (locale: Locale) =>
  safely<Doc | null>(
    (payload) => payload.findGlobal({ slug: 'home-page', locale, depth: 2 }) as Promise<Doc>,
    null,
  ),
)

export const getSiteSettings = cache(async (locale: Locale) =>
  safely<Doc | null>(
    (payload) => payload.findGlobal({ slug: 'site-settings', locale, depth: 2 }) as Promise<Doc>,
    null,
  ),
)

export const getNavigation = cache(async (locale: Locale) =>
  safely<Doc | null>(
    (payload) => payload.findGlobal({ slug: 'navigation', locale, depth: 2 }) as Promise<Doc>,
    null,
  ),
)

type ListArgs = {
  locale: Locale
  limit?: number
  where?: Where
  sort?: string
  depth?: number
}

export const listDocs = cache(
  async (
    collection: CollectionName,
    { locale, limit = 100, where, sort, depth = 2 }: ListArgs,
  ): Promise<Doc[]> =>
    safely<Doc[]>(async (payload) => {
      const result = await payload.find({ collection, locale, limit, where, sort, depth })
      return result.docs as Doc[]
    }, []),
)

export const findDocBySlug = cache(
  async (
    collection: 'projects' | 'albums' | 'articles' | 'pages',
    slug: string,
    locale: Locale,
  ): Promise<Doc | null> =>
    safely<Doc | null>(async (payload) => {
      const { docs } = await payload.find({
        collection,
        locale,
        depth: 3,
        limit: 1,
        where: { slug: { equals: slug } },
      })
      return (docs[0] as Doc) ?? null
    }, null),
)

/**
 * Resolve an old Wix path (e.g. `/גלריה`) to its new home by asking the CMS
 * which document claims it. Keeps redirects data-driven instead of hard-coded.
 */
export const findByLegacyPath = cache(
  async (path: string, locale: Locale): Promise<string | null> => {
    const targets: { collection: 'projects' | 'articles' | 'pages' | 'albums'; prefix: string }[] = [
      { collection: 'projects', prefix: 'projects' },
      { collection: 'articles', prefix: 'news' },
      { collection: 'albums', prefix: 'gallery' },
      { collection: 'pages', prefix: '' },
    ]

    return safely<string | null>(async (payload) => {
      for (const { collection, prefix } of targets) {
        const { docs } = await payload.find({
          collection,
          locale,
          depth: 0,
          limit: 1,
          where: { 'legacyPaths.path': { equals: path } },
        })
        const doc = docs[0] as { slug?: string } | undefined
        if (doc?.slug) {
          return prefix ? `/${locale}/${prefix}/${doc.slug}` : `/${locale}/${doc.slug}`
        }
      }
      return null
    }, null)
  },
)
