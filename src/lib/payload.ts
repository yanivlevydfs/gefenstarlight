import { cache } from 'react'
import { getPayload } from 'payload'
import config from '@payload-config'

import type { Locale } from '@/i18n/routing'

/** Shared Payload instance. `getPayload` is already memoised per process. */
export const getPayloadClient = cache(async () => getPayload({ config }))

/**
 * Payload throws if the database has not been created yet (first run, before
 * `seed`). The site should still render, so reads fall back to a default.
 */
async function safely<T>(read: () => Promise<T>, fallback: T): Promise<T> {
  try {
    return await read()
  } catch (error) {
    if (process.env.NODE_ENV !== 'production') {
      console.warn('[payload] read failed, using fallback:', (error as Error).message)
    }
    return fallback
  }
}

export const getHomePage = cache(async (locale: Locale) => {
  const payload = await getPayloadClient()
  return safely(
    () => payload.findGlobal({ slug: 'home-page', locale, depth: 2 }),
    null as Awaited<ReturnType<typeof payload.findGlobal>> | null,
  )
})

export const getSiteSettings = cache(async (locale: Locale) => {
  const payload = await getPayloadClient()
  return safely(
    () => payload.findGlobal({ slug: 'site-settings', locale, depth: 2 }),
    null as Awaited<ReturnType<typeof payload.findGlobal>> | null,
  )
})

export const getNavigation = cache(async (locale: Locale) => {
  const payload = await getPayloadClient()
  return safely(
    () => payload.findGlobal({ slug: 'navigation', locale, depth: 2 }),
    null as Awaited<ReturnType<typeof payload.findGlobal>> | null,
  )
})

type ListArgs = {
  locale: Locale
  limit?: number
  where?: Record<string, unknown>
  sort?: string
  depth?: number
}

export const listDocs = cache(
  async (
    collection: 'projects' | 'albums' | 'articles' | 'pages' | 'board-members' | 'testimonials',
    { locale, limit = 100, where, sort, depth = 2 }: ListArgs,
  ) => {
    const payload = await getPayloadClient()
    return safely(
      async () =>
        (await payload.find({ collection, locale, limit, where, sort, depth })).docs,
      [] as unknown[],
    )
  },
)

export const findDocBySlug = cache(
  async (
    collection: 'projects' | 'albums' | 'articles' | 'pages',
    slug: string,
    locale: Locale,
  ) => {
    const payload = await getPayloadClient()
    return safely(async () => {
      const { docs } = await payload.find({
        collection,
        locale,
        depth: 3,
        limit: 1,
        where: { slug: { equals: slug } },
      })
      return docs[0] ?? null
    }, null as unknown)
  },
)
