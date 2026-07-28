import { cache } from 'react'
import { getPayload, type Payload, type Where } from 'payload'
import config from '@payload-config'

import type { Locale } from '@/i18n/routing'
import type {
  Album,
  Article,
  BoardMember,
  HomePage,
  Media,
  Navigation,
  Page,
  Project,
  SiteSetting,
  Testimonial,
  YoutubeVideo,
} from '@/payload-types'

/** Shared Payload instance. `getPayload` is already memoised per process. */
export const getPayloadClient = cache(async () => getPayload({ config }))

/**
 * Every CMS read goes through here.
 *
 * Payload throws if it cannot reach a database or `PAYLOAD_SECRET` is unset —
 * which happens on a fresh clone before seeding, and on a CI build with no env
 * vars. The public site must still render in those cases, so failures fall back
 * to a default rather than breaking the page.
 */
async function safely<T>(read: (payload: Payload) => Promise<T>, fallback: T): Promise<T> {
  try {
    return await read(await getPayloadClient())
  } catch (error) {
    console.warn('[payload] read failed, using fallback:', (error as Error).message)
    return fallback
  }
}

/* ------------------------------------------------------------------ globals */

export const getHomePage = cache(
  async (locale: Locale): Promise<HomePage | null> =>
    safely<HomePage | null>(
      (payload) => payload.findGlobal({ slug: 'home-page', locale, depth: 2 }),
      null,
    ),
)

export const getSiteSettings = cache(
  async (locale: Locale): Promise<SiteSetting | null> =>
    safely<SiteSetting | null>(
      (payload) => payload.findGlobal({ slug: 'site-settings', locale, depth: 2 }),
      null,
    ),
)

/**
 * The image every page header falls back to — the portrait of Gefen the home
 * page opens on — so no page is left with a flat, empty banner.
 */
export const getDefaultHero = cache(async (locale: Locale) => {
  const settings = await getSiteSettings(locale)
  return settings?.shareImage ?? null
})

/**
 * The foundation's film, carried over from the old Wix home page. It lives in
 * the media library like any upload, so the owner can replace the file in the
 * admin console without touching code — the page finds it by its source name.
 */
export const FILM_SOURCE_FILE = 'd7301b_1ad63cea63354905941e685bbea39916.mp4'

export const getFilm = cache(async (): Promise<Media | null> =>
  safely<Media | null>(async (payload) => {
    const found = await payload.find({
      collection: 'media',
      limit: 1,
      depth: 1,
      where: { sourceFile: { equals: FILM_SOURCE_FILE } },
    })
    return (found.docs[0] as Media) ?? null
  }, null),
)

/**
 * The old Wix home page paired each goal with a photograph of Gefen in a
 * slider. The pairing lives here, in the order the goals are seeded, so the
 * carousel can rebuild it from media that is already in the library. A goal
 * without a photo (or a photo that fails to load) renders as text alone.
 */
export const GOAL_PHOTO_SOURCE_FILES = [
  'a50afb_6a0968b313a14a339ef4b2d5843dce5f~mv2.jpg', // לעודד — judo certificate
  'a50afb_e2dfaadc060149c4b6adf94e75809551~mv2.jpg', // לסייע — climbing wall
  'a50afb_fb33877734ed4fbdb52b707098d3f360~mv2.jpg', // להעשיר — painting
  'a50afb_797baa42b6f04bc883dd02e1934d622d~mv2.jpg', // הישגים — classroom
  'a50afb_f4e801d151644effac1d6c18a6b63954~mv2.jpg', // לחשוף — rock climbing
  'd7301b_61e1678c813d4fdd8e80efc4d50c029d~mv2.jpg', // ציוד — the kit
]

export const getGoalPhotos = cache(async (): Promise<(Media | null)[]> =>
  safely<(Media | null)[]>(async (payload) => {
    const { docs } = await payload.find({
      collection: 'media',
      limit: GOAL_PHOTO_SOURCE_FILES.length,
      depth: 0,
      where: { sourceFile: { in: GOAL_PHOTO_SOURCE_FILES } },
    })
    return GOAL_PHOTO_SOURCE_FILES.map(
      (file) => docs.find((d) => d.sourceFile === file) ?? null,
    )
  }, []),
)

export const getNavigation = cache(
  async (locale: Locale): Promise<Navigation | null> =>
    safely<Navigation | null>(
      (payload) => payload.findGlobal({ slug: 'navigation', locale, depth: 2 }),
      null,
    ),
)

/* -------------------------------------------------------------- collections */

/**
 * The draft-enabled collections must be filtered explicitly: the local API
 * bypasses access control, so without this a half-written draft would be
 * publicly visible the moment it is saved.
 */
const published: Where = { _status: { equals: 'published' } }

const withPublished = (where?: Where): Where =>
  where ? { and: [published, where] } : published

type ListArgs = {
  locale: Locale
  limit?: number
  where?: Where
  sort?: string
  depth?: number
}

export const listProjects = cache(
  async ({ locale, limit = 200, where, sort = '-date', depth = 2 }: ListArgs): Promise<Project[]> =>
    safely<Project[]>(async (payload) => {
      const { docs } = await payload.find({
        collection: 'projects',
        locale,
        limit,
        where: withPublished(where),
        sort,
        depth,
      })
      return docs
    }, []),
)

export const listAlbums = cache(
  async ({ locale, limit = 200, where, sort = '-date', depth = 1 }: ListArgs): Promise<Album[]> =>
    safely<Album[]>(async (payload) => {
      const { docs } = await payload.find({ collection: 'albums', locale, limit, where: withPublished(where), sort, depth })
      return docs
    }, []),
)

export const listArticles = cache(
  async ({
    locale,
    limit = 200,
    where,
    sort = '-publishedAt',
    depth = 2,
  }: ListArgs): Promise<Article[]> =>
    safely<Article[]>(async (payload) => {
      const { docs } = await payload.find({
        collection: 'articles',
        locale,
        limit,
        where: withPublished(where),
        sort,
        depth,
      })
      return docs
    }, []),
)

export const listBoardMembers = cache(
  async (locale: Locale): Promise<BoardMember[]> =>
    safely<BoardMember[]>(async (payload) => {
      const { docs } = await payload.find({
        collection: 'board-members',
        locale,
        limit: 100,
        sort: 'order',
        depth: 1,
      })
      return docs
    }, []),
)

export const listTestimonials = cache(
  async (locale: Locale, where?: Where): Promise<Testimonial[]> =>
    safely<Testimonial[]>(async (payload) => {
      const { docs } = await payload.find({
        collection: 'testimonials',
        locale,
        limit: 100,
        sort: 'order',
        where,
        depth: 0,
      })
      return docs
    }, []),
)

/** Every uploaded video, newest first — the source for the videos page. */
export const listVideos = cache(
  async (locale: Locale): Promise<Media[]> =>
    safely<Media[]>(async (payload) => {
      const { docs } = await payload.find({
        collection: 'media',
        locale,
        depth: 1,
        limit: 200,
        sort: '-createdAt',
        where: { mimeType: { like: 'video' } },
      })
      return docs
    }, []),
)

/** Videos hosted on YouTube — the large files the admin console cannot accept. */
export const listYouTubeVideos = cache(
  async (locale: Locale): Promise<YoutubeVideo[]> =>
    safely<YoutubeVideo[]>(async (payload) => {
      const { docs } = await payload.find({
        collection: 'youtube-videos',
        locale,
        limit: 100,
        sort: '-date',
        depth: 0,
      })
      return docs
    }, []),
)

/** Owner-created content pages, used to build the sitemap. */
export const listPagesForSitemap = cache(
  async (locale: Locale): Promise<Page[]> =>
    safely<Page[]>(async (payload) => {
      const { docs } = await payload.find({
        collection: 'pages',
        locale,
        limit: 200,
        depth: 0,
        where: published,
      })
      return docs
    }, []),
)

/* ------------------------------------------------------------ single lookups */

export const findProject = cache(
  async (slug: string, locale: Locale): Promise<Project | null> =>
    safely<Project | null>(async (payload) => {
      const { docs } = await payload.find({
        collection: 'projects',
        locale,
        depth: 3,
        limit: 1,
        where: withPublished({ slug: { equals: slug } }),
      })
      return docs[0] ?? null
    }, null),
)

/**
 * The project an album belongs to, when one claims it. Album pages use this
 * to send visitors onward — the wine-bottles album, for example, links to the
 * wine fundraiser and its purchase button.
 */
export const findProjectByAlbum = cache(
  async (albumId: number, locale: Locale): Promise<Project | null> =>
    safely<Project | null>(async (payload) => {
      const { docs } = await payload.find({
        collection: 'projects',
        locale,
        depth: 0,
        limit: 1,
        where: withPublished({ album: { equals: albumId } }),
      })
      return docs[0] ?? null
    }, null),
)

export const findAlbum = cache(
  async (slug: string, locale: Locale): Promise<Album | null> =>
    safely<Album | null>(async (payload) => {
      const { docs } = await payload.find({
        collection: 'albums',
        locale,
        depth: 2,
        limit: 1,
        where: withPublished({ slug: { equals: slug } }),
      })
      return docs[0] ?? null
    }, null),
)

export const findArticle = cache(
  async (slug: string, locale: Locale): Promise<Article | null> =>
    safely<Article | null>(async (payload) => {
      const { docs } = await payload.find({
        collection: 'articles',
        locale,
        depth: 3,
        limit: 1,
        where: withPublished({ slug: { equals: slug } }),
      })
      return docs[0] ?? null
    }, null),
)

export const findPage = cache(
  async (slug: string, locale: Locale): Promise<Page | null> =>
    safely<Page | null>(async (payload) => {
      const { docs } = await payload.find({
        collection: 'pages',
        locale,
        depth: 3,
        limit: 1,
        where: withPublished({ slug: { equals: slug } }),
      })
      return docs[0] ?? null
    }, null),
)

/**
 * Resolve an old Wix path (e.g. `/גלריה`) to its new home by asking the CMS
 * which document claims it. Keeps redirects data-driven instead of hard-coded,
 * so the site owner can add a page and its old link without a code change.
 */
export const findByLegacyPath = cache(
  async (path: string, locale: Locale): Promise<string | null> =>
    safely<string | null>(async (payload) => {
      const lookups = [
        { collection: 'projects', prefix: 'projects' },
        { collection: 'articles', prefix: 'news' },
        { collection: 'albums', prefix: 'gallery' },
        { collection: 'pages', prefix: '' },
      ] as const

      for (const { collection, prefix } of lookups) {
        const { docs } = await payload.find({
          collection,
          locale,
          depth: 0,
          limit: 1,
          where: withPublished({ 'legacyPaths.path': { equals: path } }),
        })
        const slug = docs[0]?.slug
        if (slug) return prefix ? `/${locale}/${prefix}/${slug}` : `/${locale}/${slug}`
      }

      // Section URLs (/גלריה, /תרומות…) are claimed by menu entries instead,
      // so the owner manages those redirects from the menu editor.
      const nav = await payload.findGlobal({ slug: 'navigation', locale, depth: 0 })
      const match = nav.items?.find((item) =>
        item.legacyPaths?.some((entry) => entry.path === path),
      )
      if (match?.href) {
        return match.href === '/' ? `/${locale}` : `/${locale}${match.href}`
      }

      return null
    }, null),
)
