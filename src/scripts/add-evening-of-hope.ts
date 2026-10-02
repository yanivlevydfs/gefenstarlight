/**
 * Publishes "ערב של תקווה" — the memorial fundraiser evening on 7.11.2026 —
 * as a project, with the Instagram poster as its cover and the ticket site on
 * the page's button. Text follows the foundation's Instagram post (Dd9SUQHohtA).
 *
 *   node --env-file=.env.production.local --import tsx src/scripts/add-evening-of-hope.ts
 */
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { toLexical } from './lexical'

const { getPayload } = await import('payload')
const { default: config } = await import('../payload.config.js')

const dirname = path.dirname(fileURLToPath(import.meta.url))
const MEDIA_DIR = path.resolve(dirname, '../../seed-media')

const SLUG = 'evening-of-hope'
const POSTER = 'instagram-Dd9SUQHohtA.jpg'
const TICKETS = 'https://gefen-erev-shel-tikva.netlify.app'

const payload = await getPayload({ config })

const he = {
  title: 'ערב של תקווה — מופע התרמה לזכרו של גפן',
  summary: 'שבת, 7 בנובמבר 2026, 19:00, אולם גולדה בפתח תקווה. ערב לזכרו של גפן, שכל הכנסותיו לעמותה.',
  body: [
    'לרגל יום השנה ללכתו בטרם עת של גפן האהוב, אנחנו מזמינים אתכם לערב מיוחד ומרגש לזכרו — ערב שכולו תקווה, אהבה והמשך האור של גפן.',
    'כל ההכנסות מהערב יוקדשו לעמותת ״אור הכוכבים של גפן״, הפועלת לחיזוק והעצמת ילדים ובני נוער בסיכון באמצעות ג׳ודו ואמנויות לחימה.',
    'מתי ואיפה:',
    'שבת, 07.11.2026, בשעה 19:00 — אולם גולדה, אם המושבות, פתח תקווה.',
    'על הבמה:',
    'שלושה אנשים מיוחדים, שלכל אחד מהם חיבור לגפן:',
    'אריק זאבי — מדליסט אולימפי וסגן אלוף העולם בג׳ודו, בהרצאה ״לנצח בקרבות היום־יום״.',
    'נעם חורב — כותב השיר ״מתנות קטנות״, שהיה אהוב על גפן, בסיפור אישי מרגש ומעורר השראה.',
    'עמרי גליקמן — סולן התקווה 6, עם השירים שגפן כל כך אהב.',
    'יין של תקווה:',
    'לכבוד הערב יצרנו יחד עם יקב טוליפ מכפר תקווה, המעסיק אנשים עם צרכים מיוחדים, את ״יין של תקווה״ — בלנד איכותי מבציר 2023, שהתיישן 12 חודשים בחביות. מהדורה מוגבלת של 96 בקבוקים כשרים וממוספרים, עם דמותו של גפן על התווית.',
    'כרטיסים ומחירים:',
    'כרטיס לערב: 180 ₪. יין של תקווה: 140 ₪. כרטיס + בקבוק יין: 300 ₪.',
  ],
  location: 'אולם גולדה, פתח תקווה',
  ctaLabel: 'לרכישת כרטיסים ויין',
  closing: 'נשמח שתצטרפו אלינו לערב הזה, ותעזרו לנו להמשיך את האור של גפן הלאה.',
}

const en = {
  title: 'An Evening of Hope — a fundraiser in Gefen’s memory',
  summary: 'Saturday, 7 November 2026, 19:00, Golda Hall, Petah Tikva. An evening in Gefen’s memory, with all proceeds going to the foundation.',
  body: [
    'On the anniversary of the untimely passing of our beloved Gefen, we invite you to a special, moving evening in his memory — an evening of hope, love, and Gefen’s light carried on.',
    'All proceeds from the evening go to the Gefen Starlight Foundation, which strengthens and empowers children and youth at risk through judo and martial arts.',
    'When and where:',
    'Saturday, 07.11.2026, at 19:00 — Golda Hall, Em HaMoshavot, Petah Tikva.',
    'On stage:',
    'Three special guests, each with a connection to Gefen:',
    'Arik Zeevi — Olympic medalist and world judo vice-champion, with the talk “Winning the everyday battles”.',
    'Noam Horev — writer of the song “Matanot Ktanot”, a favourite of Gefen’s, with a moving and inspiring personal story.',
    'Omri Glikman — lead singer of HaTikva 6, with the songs Gefen loved so much.',
    'Wine of Hope:',
    'For the evening we created “Wine of Hope” together with Tulip Winery of Kfar Tikva, which employs people with special needs — a fine 2023 blend aged 12 months in barrels. A limited edition of 96 kosher, numbered bottles, with Gefen’s portrait on the label.',
    'Tickets and prices:',
    'Ticket: ₪180. Wine of Hope: ₪140. Ticket + bottle: ₪300.',
  ],
  location: 'Golda Hall, Petah Tikva',
  ctaLabel: 'Buy tickets and wine',
  closing: 'We would be glad to have you with us, helping carry Gefen’s light forward.',
}

const body = (c: typeof he, dir: 'rtl' | 'ltr') => toLexical([...c.body, c.closing], dir)

const existing = await payload.find({
  collection: 'projects',
  limit: 1,
  locale: 'he',
  where: { slug: { equals: SLUG } },
})
if (existing.docs[0]) {
  console.log(`${SLUG}: already exists (id ${existing.docs[0].id}) — skipped`)
  process.exit(0)
}

// Upload the poster once, recording its CDN address like the seed does.
const found = await payload.find({ collection: 'media', limit: 1, where: { sourceFile: { equals: POSTER } } })
let coverId = found.docs[0]?.id as number | undefined
if (!coverId) {
  const media = await payload.create({
    collection: 'media',
    locale: 'he',
    data: { alt: 'הזמנה לערב של תקווה — מופע התרמה לזכרו של גפן אבירם, 07.11.2026', sourceFile: POSTER },
    filePath: path.join(MEDIA_DIR, POSTER),
  })
  if (media.url?.startsWith('http')) {
    const publicSizes: Record<string, string> = {}
    for (const [name, variant] of Object.entries(media.sizes ?? {})) {
      const variantUrl = (variant as { url?: string | null } | undefined)?.url
      if (variantUrl?.startsWith('http')) publicSizes[name] = variantUrl
    }
    await payload.update({ collection: 'media', id: media.id, data: { publicUrl: media.url, publicSizes } })
  }
  await payload.update({
    collection: 'media',
    id: media.id,
    locale: 'en',
    data: { alt: 'Invitation to An Evening of Hope — a fundraiser in memory of Gefen Aviram, 07.11.2026' },
  })
  coverId = media.id as number
  console.log(`poster imported (id ${coverId})`)
}

const doc = await payload.create({
  collection: 'projects',
  locale: 'he',
  data: {
    title: he.title,
    slug: SLUG,
    date: '2026-11-07',
    location: he.location,
    summary: he.summary,
    body: body(he, 'rtl'),
    cover: coverId,
    ctaUrl: TICKETS,
    ctaLabel: he.ctaLabel,
    _status: 'published',
  },
})
await payload.update({
  collection: 'projects',
  id: doc.id,
  locale: 'en',
  data: { title: en.title, location: en.location, summary: en.summary, body: body(en, 'ltr'), ctaLabel: en.ctaLabel },
})
console.log(`${SLUG}: published (id ${doc.id}) — /he/projects/${SLUG}`)
process.exit(0)
