/**
 * Publishes the first news articles, so the news section stops looking
 * "missing" — three items drawn from the foundation's own recent milestones,
 * each linked to its photo album. The owner can edit or remove them in the
 * admin console under תוכן › כתבות.
 *
 *   node --env-file=.env.production.local --import tsx src/scripts/add-first-articles.ts
 */
import { toLexical } from './lexical'

const { getPayload } = await import('payload')
const { default: config } = await import('../payload.config.js')

const payload = await getPayload({ config })

async function mediaBySource(sourceFile: string): Promise<number | null> {
  const r = await payload.find({
    collection: 'media',
    limit: 1,
    where: { sourceFile: { equals: sourceFile } },
  })
  return (r.docs[0]?.id as number) ?? null
}

async function albumBySlug(slug: string): Promise<number | null> {
  const r = await payload.find({
    collection: 'albums',
    limit: 1,
    locale: 'he',
    where: { slug: { equals: slug } },
  })
  return (r.docs[0]?.id as number) ?? null
}

type Draft = {
  slug: string
  publishedAt: string
  coverSource?: string
  albumSlug?: string
  he: { title: string; excerpt: string; body: string[] }
  en: { title: string; excerpt: string; body: string[] }
}

const articles: Draft[] = [
  {
    slug: 'gefen-wine',
    publishedAt: '2026-07-28',
    albumSlug: 'בקבוקי-היין',
    he: {
      title: 'יין גפן — מיזם ההתרמה החדש של העמותה',
      excerpt: 'סדרת יינות לזכרו של גפן — כל בקבוק מממן פעילות אומנויות לחימה לנוער בסיכון.',
      body: [
        'אנחנו גאים להשיק את יין גפן — מיזם התרמה חדש של העמותה. סדרת יינות שנוצרה באהבה לזכרו של גפן אבירם ז״ל, שכל הכנסותיה מוקדשות למימון חוגי אומנויות לחימה לילדים ולנוער בסיכון.',
        'כל בקבוק נושא את שמו של גפן — הגפן שממשיכה לתת פרי. רכישת היין היא דרך יפה לתמוך בפעילות העמותה ולהעניק לילד נוסף מקום בקבוצה.',
        'אפשר לרכוש דרך עמוד המיזם באתר, ותודה מכל הלב לכל התומכים.',
      ],
    },
    en: {
      title: 'Gefen Wine — our new fundraising project',
      excerpt: 'A wine series in Gefen’s memory — every bottle funds martial-arts training for youth at risk.',
      body: [
        'We are proud to launch Gefen Wine, the foundation’s new fundraiser: a wine series created with love in memory of Gefen Aviram, with all proceeds funding martial-arts groups for children and youth at risk.',
        'Every bottle carries Gefen’s name — the vine that keeps bearing fruit. Buying a bottle is a beautiful way to support the foundation and give one more child a place in a group.',
        'Bottles are available through the project page on this site. Our heartfelt thanks to every supporter.',
      ],
    },
  },
  {
    slug: 'petah-tikva-judo-opening',
    publishedAt: '2025-01-03',
    coverSource: 'a50afb_ca7cbfaf052143b3920c02c28f06424f~mv2.jpg',
    albumSlug: 'petah-tikva-2025',
    he: {
      title: 'נבחרת הג׳ודו לזכרו של גפן יצאה לדרך בפתח תקווה',
      excerpt: 'טקס פתיחה מרגש בבית הספר לטבע ומדעים, במעמד ראש העיר מר רמי גרינברג.',
      body: [
        'בטקס מרגש בבית הספר לטבע ומדעים בפתח תקווה, במעמד ראש העיר מר רמי גרינברג, נפתחה פעילות נבחרת הג׳ודו לשנת 2025 לזכרו של גפן אבירם ז״ל.',
        'הילדים קיבלו ערכות ציוד אישיות — מדים, חולצה ותיק — וצפו יחד בסרט על גפן ועל המסר שלו: להודות על החיים, לעשות כל יום טוב, ולגלות סבלנות כלפי האחר.',
        'תודה לעיריית פתח תקווה, לצוות בית הספר ולמאמנים על השותפות.',
      ],
    },
    en: {
      title: 'The judo team in Gefen’s memory opens in Petah Tikva',
      excerpt: 'A moving opening ceremony at the School of Nature and Sciences, attended by Mayor Rami Greenberg.',
      body: [
        'At a moving ceremony at the School of Nature and Sciences in Petah Tikva, attended by Mayor Rami Greenberg, the 2025 judo team in memory of Gefen Aviram began its training.',
        'Every child received a personal kit — uniform, shirt and bag — and together they watched the film about Gefen and his message: be thankful for life, make every day good, and be patient with one another.',
        'Our thanks to the Petah Tikva municipality, the school staff and the coaches for the partnership.',
      ],
    },
  },
  {
    slug: 'ramla-judo-third-year',
    publishedAt: '2024-12-09',
    coverSource: 'd7301b_473ad8d0d82a4e278c636bd425240dba~mv2.jpg',
    albumSlug: 'ramla-judo-2024',
    he: {
      title: 'שנה שלישית לחוג הג׳ודו על שם גפן ברמלה',
      excerpt: 'טקס פתיחה חגיגי לחוג — זו השנה השלישית שהעמותה מממנת קבוצת אימון ברמלה.',
      body: [
        'ב־9 בדצמבר קיימנו טקס פתיחה לחוג הג׳ודו על שמו של גפן ברמלה — זו השנה השלישית ברציפות שהעמותה מממנת את קבוצת האימון בעיר.',
        'בטקס השתתפו הילדים המתאמנים, מנהלת מחלקת הספורט, המדריך הראשי ומאמן הקבוצה. פתחנו בסרטון קצר לזכרו של גפן ובדברים על חשיבות ההתמדה, וכל מתאמן קיבל ערכת ציוד אישית.',
        'בהצלחה לקבוצה — אנחנו גאים בכם.',
      ],
    },
    en: {
      title: 'Third year of the Gefen judo group in Ramla',
      excerpt: 'A festive opening ceremony — the third consecutive year the foundation funds the Ramla training group.',
      body: [
        'On December 9th we held the opening ceremony of the judo group named after Gefen in Ramla — the third consecutive year the foundation funds the city’s training group.',
        'The ceremony brought together the young trainees, the head of the sports department, the head instructor and the group’s coach. We opened with a short film in Gefen’s memory and words about perseverance, and every trainee received a personal kit.',
        'Good luck to the group — we are proud of you.',
      ],
    },
  },
]

for (const a of articles) {
  const existing = await payload.find({
    collection: 'articles',
    limit: 1,
    locale: 'he',
    where: { slug: { equals: a.slug } },
  })
  if (existing.docs[0]) {
    console.log(`${a.slug}: already exists — skipped`)
    continue
  }

  const cover = a.coverSource ? await mediaBySource(a.coverSource) : null
  const album = a.albumSlug ? await albumBySlug(a.albumSlug) : null

  // The wine album's cover doubles as the article cover when none is named.
  let coverId = cover
  if (!coverId && album) {
    const alb = await payload.findByID({ collection: 'albums', id: album, depth: 0 })
    coverId = (alb.cover as number) ?? null
  }

  const doc = await payload.create({
    collection: 'articles',
    locale: 'he',
    data: {
      title: a.he.title,
      slug: a.slug,
      publishedAt: a.publishedAt,
      excerpt: a.he.excerpt,
      body: toLexical(a.he.body, 'rtl'),
      ...(coverId ? { cover: coverId } : {}),
      ...(album ? { album } : {}),
      _status: 'published',
    },
  })
  await payload.update({
    collection: 'articles',
    id: doc.id,
    locale: 'en',
    data: {
      title: a.en.title,
      excerpt: a.en.excerpt,
      body: toLexical(a.en.body, 'ltr'),
    },
  })
  console.log(`${a.slug}: published (id ${doc.id})`)
}

console.log('done')
process.exit(0)
