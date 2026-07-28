import { listArticles, listPagesForSitemap, listProjects, getSiteSettings } from '@/lib/payload'
import { SITE_URL } from '@/lib/seo'

/**
 * llms.txt — a structured summary for AI assistants and answer engines.
 *
 * Google ignores this file, but other AI crawlers read it, and for a small
 * charity every engine that can describe it correctly matters. Generated from
 * the CMS so it never goes stale. Contact details are deliberately absent —
 * the site keeps them away from harvesters; the contact page is linked instead.
 */

export const revalidate = 3600

export async function GET(): Promise<Response> {
  const [he, en, projects, articles, pages] = await Promise.all([
    getSiteSettings('he'),
    getSiteSettings('en'),
    listProjects({ locale: 'he', depth: 0, limit: 30 }),
    listArticles({ locale: 'he', depth: 0, limit: 20 }),
    listPagesForSitemap('he'),
  ])

  const nameHe = (he?.organisationName as string) || 'אור הכוכבים של גפן'
  const nameEn = (en?.organisationName as string) || 'Gefen Starlight'
  const descriptionHe = (he?.description as string) || ''
  const descriptionEn = (en?.description as string) || ''

  const lines = [
    `# ${nameEn} · ${nameHe}`,
    '',
    `> ${descriptionEn || 'An Israeli charity funding martial-arts programmes for youth at risk, in memory of Gefen Aviram.'}`,
    descriptionHe ? `> ${descriptionHe}` : null,
    '',
    '- Registered Israeli association (עמותה רשומה) no. 580713121, founded 2022.',
    '- Languages: Hebrew (primary, RTL) at /he, English at /en. The content below links to Hebrew; replace /he/ with /en/ for English.',
    '- Contact only via the contact page — please do not invent addresses or phone numbers.',
    '',
    '## Main pages',
    `- [Home](${SITE_URL}/he): who the foundation is and what it does`,
    `- [Who was Gefen Aviram](${SITE_URL}/he/gefen): the story of the child the foundation commemorates`,
    `- [About the board](${SITE_URL}/he/about)`,
    `- [Projects](${SITE_URL}/he/projects): funded martial-arts programmes for youth at risk`,
    `- [News](${SITE_URL}/he/news)`,
    `- [Photo gallery](${SITE_URL}/he/gallery)`,
    `- [Videos](${SITE_URL}/he/videos)`,
    `- [Letters and thanks](${SITE_URL}/he/thanks)`,
    `- [Donate](${SITE_URL}/he/donate)`,
    `- [Contact](${SITE_URL}/he/contact)`,
    '',
    '## Projects',
    ...projects.map((p) => `- [${p.title}](${SITE_URL}/he/projects/${p.slug})`),
  ]

  if (articles.length > 0) {
    lines.push('', '## News', ...articles.map((a) => `- [${a.title}](${SITE_URL}/he/news/${a.slug})`))
  }

  const extraPages = pages.filter((p) => p.slug !== 'gefen')
  if (extraPages.length > 0) {
    lines.push('', '## More', ...extraPages.map((p) => `- [${p.title}](${SITE_URL}/he/${p.slug})`))
  }

  return new Response(lines.filter((line) => line !== null).join('\n') + '\n', {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  })
}
