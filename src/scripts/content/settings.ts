/** Organisation details, menu and home-page copy, as carried over from Wix. */

export const siteSettings = {
  he: {
    organisationName: 'אור הכוכבים של גפן',
    legalName: 'עמותת מתנות קטנות — מתנות גדולות לזכרו של גפן אבירם ז״ל (ע.ר. 580713121)',
    tagline: 'עמותה לזכרו של גפן אבירם ז״ל, המממנת פעילות אומנויות לחימה לנוער בסיכון.',
    description:
      'עמותת אור הכוכבים של גפן מנציחה את זכרו של גפן אבירם ומממנת פעילות ג׳ודו וקרב מגע לנוער בסיכון, תוך הקניית ערכים של התמדה, נחישות ותקווה.',
    address: 'פשוש 9/29, הוד השרון',
    donationIntro:
      'כעמותה ללא כוונת רווח, אנו זקוקים לתמיכה כספית למימון המיזמים שלנו למען הקהילה. ניתן לתרום לנו במספר דרכים:',
    taxNote: 'אנו על סף קבלת פטור לפי סעיף 46 לפקודת מס הכנסה.',
    bank: {
      accountName: 'אור הכוכבים של גפן (ע״ר)',
      bankName: 'בנק הפועלים',
    },
  },
  en: {
    organisationName: "Gefen's Starlight",
    legalName:
      "Matanot Ktanot — Matanot Gdolot, in memory of Gefen Aviram (Registered Association 580713121)",
    tagline:
      'A foundation in memory of Gefen Aviram, funding martial-arts programmes for children and youth at risk.',
    description:
      "Gefen's Starlight Foundation honours the memory of Gefen Aviram by funding judo and Krav Maga programmes for children and youth at risk, teaching perseverance, determination and hope.",
    address: '9/29 Pashosh St, Hod Hasharon',
    donationIntro:
      'As a non-profit association, we depend on financial support to fund our projects for the community. There are several ways to donate:',
    taxNote: 'We are close to receiving tax-exempt status under Section 46 of the Israeli Income Tax Ordinance.',
    bank: {
      accountName: "Gefen's Starlight (Registered Association)",
      bankName: 'Bank Hapoalim',
    },
  },

  // Shared, language-independent values
  emails: ['aaviram1@012.net.il', 'sama2@netvision.net.il'],
  phones: [
    { number: '055-158-7096', he: 'נייד', en: 'Mobile' },
    { number: '054-771-1120', he: 'נייד', en: 'Mobile' },
  ],
  whatsapp: '972544249142',
  bank: { branch: '630', account: '630635' },
  international: {
    beneficiary: 'Matanot Ktanot Matanot Gdolot',
    swift: 'MIZBILIT',
    iban: 'IL38 0205 1200 0000 0281 826',
  },
}

/**
 * The live payment links carried over from the old site, unchanged. They point
 * at Grow (Meshulam) secure checkout pages.
 */
export const donationTiers = [
  {
    amount: 100,
    kind: 'oneTime' as const,
    url: 'https://pay.grow.link/d042791a0480edf3875b09fbd8a0d4df-MjYyMTM1OQ',
    he: 'תרומה 100 ש״ח',
    en: 'Donate ₪100',
  },
  {
    amount: 250,
    kind: 'oneTime' as const,
    url: 'https://pay.grow.link/075471e351a4378bbfdfe48c7eae1e23-MjYyMjE5MA',
    he: 'תרומה 250 ש״ח',
    en: 'Donate ₪250',
  },
  {
    amount: 500,
    kind: 'oneTime' as const,
    url: 'https://pay.grow.link/b80bb31362d34959b57997a74d33d9bb-MjYyMjIwMA',
    he: 'תרומה 500 ש״ח',
    en: 'Donate ₪500',
  },
  {
    amount: 1000,
    kind: 'oneTime' as const,
    url: 'https://pay.grow.link/b96a6d53dbc46cecf7ea4aaecd211cf3-MjYyMjIxMA',
    he: 'תרומה 1,000 ש״ח',
    en: 'Donate ₪1,000',
  },
  {
    kind: 'monthly' as const,
    url: 'https://pay.grow.link/603b6743381b5f0954a647144b220639-MjYyMjIyMw',
    he: 'הוראת קבע',
    en: 'Monthly standing order',
  },
  {
    kind: 'custom' as const,
    url: 'https://pay.grow.link/ce87e0a46e6b88ec5f8088f23577d150-MjYxMDU5MA',
    he: 'הקלד תרומתך',
    en: 'Enter your own amount',
  },
]

/**
 * `legacyPaths` are the old Wix section URLs. They are stored on the menu entry
 * so the owner can edit both the menu and its old links from the admin console.
 */
export const navigationItems = [
  { href: '/', he: 'בית', en: 'Home', heDesc: 'דף הבית', enDesc: 'Home page', legacyPaths: [] },
  {
    href: '/gefen',
    he: 'מיהו גפן',
    en: 'About Gefen',
    heDesc: 'הסיפור של גפן אבירם ז״ל',
    enDesc: "Gefen Aviram's story",
    legacyPaths: [],
  },
  {
    href: '/about',
    he: 'אודותינו',
    en: 'About Us',
    heDesc: 'האנשים שמאחורי העמותה',
    enDesc: 'The people behind the foundation',
    legacyPaths: ['/עלינו', '/about-us'],
  },
  {
    href: '/projects',
    he: 'מיזמים',
    en: 'Projects',
    heDesc: 'הפעילות שלנו בשטח',
    enDesc: 'Our work on the ground',
    legacyPaths: ['/פרוייקטים'],
  },
  {
    href: '/gallery',
    he: 'תמונות',
    en: 'Pictures',
    heDesc: 'אלבומי תמונות מהפעילות',
    enDesc: 'Photo albums from our activity',
    legacyPaths: ['/גלריה'],
  },
  {
    href: '/videos',
    he: 'סרטונים',
    en: 'Videos',
    heDesc: 'רגעים מתועדים',
    enDesc: 'Moments on film',
    legacyPaths: ['/סרטונים'],
  },
  {
    href: '/news',
    he: 'עדכונים',
    en: 'News',
    heDesc: 'חדשות מהעמותה',
    enDesc: 'News from the foundation',
    legacyPaths: [],
  },
  {
    href: '/thanks',
    he: 'תודות',
    en: 'Thank You',
    heDesc: 'מכתבים ממי שנמצא איתם בשטח',
    enDesc: 'Letters from the people on the mat',
    legacyPaths: ['/תודות'],
  },
  {
    href: '/contact',
    he: 'צור קשר',
    en: 'Contact',
    heDesc: 'נשמח לשמוע מכם',
    enDesc: "We'd love to hear from you",
    legacyPaths: ['/צור-קשר'],
  },
  {
    href: '/terms',
    he: 'תקנון',
    en: 'Bylaws',
    heDesc: 'תקנון ותנאי שימוש',
    enDesc: 'Terms of use',
    legacyPaths: [],
  },
  {
    href: '/donate',
    he: 'תרומות',
    en: 'Donate',
    heDesc: 'עזרו לנו לעזור להם',
    enDesc: 'Help us help them',
    highlight: true,
    legacyPaths: ['/תרומות', '/donate'],
  },
]

export const homePage = {
  he: {
    heroKicker: 'עמותת אור הכוכבים של גפן',
    heroTitle: 'כל ילד ראוי לכוכב משלו',
    heroLead:
      'העמותה מאפשרת לילדים ולנוער בסיכון להיות חלק מקבוצה בחוג אומנויות לחימה ולהשתתף באופן קבוע במפגשים ובאירועים.',
    focusTitle: 'מיקוד העמותה',
    focusBody:
      'העמותה מאפשרת לילדים ולנוער בסיכון להיות חלק מקבוצה בחוג אומנויות לחימה ולהשתתף באופן קבוע במפגשים ובאירועים. באמצעות רתימתם לתחביב ספורטיבי אהוב, שואפת העמותה להקנות למשתתפים ערכים של התמדה, השקעה, ספורטיביות ומחויבות, וכן להעצים את ערכם, לעודד אותם לעשייה חיובית ושאיפה למצוינות, ולהעניק להם תחושת מסוגלות עצמית גבוהה.',
    ctaTitle: 'עזרו לנו לעזור להם',
    ctaBody: 'כל תרומה מתורגמת ישירות לשעות אימון, לציוד ולתחושת שייכות של ילד שזקוק לה.',
  },
  en: {
    heroKicker: "Gefen's Starlight Foundation",
    heroTitle: 'Every child deserves a star of their own',
    heroLead:
      'The foundation gives children and youth at risk a place in a martial-arts group, and the routine of showing up — week after week.',
    focusTitle: 'What we focus on',
    focusBody:
      'The foundation allows children and youth at risk to be part of a group in a martial-arts club and to take part regularly in meetings and events. By drawing them into a sport they come to love, we aim to instil perseverance, commitment, sportsmanship and dedication — to raise their sense of worth, encourage positive action and a striving for excellence, and give them a strong sense of self-efficacy.',
    ctaTitle: 'Help us help them',
    ctaBody:
      'Every donation turns directly into training hours, equipment, and a sense of belonging for a child who needs it.',
  },
  goals: [
    {
      icon: 'heart' as const,
      he: {
        title: 'לעודד ילדים ונוער',
        body: 'לעודד ילדים ונוער בסיכון לעשייה חיובית ובעלת משמעות.',
      },
      en: {
        title: 'Encourage children and youth',
        body: 'Encourage children and youth at risk towards positive, meaningful activity.',
      },
    },
    {
      icon: 'users' as const,
      he: {
        title: 'לסייע לילדים ונוער',
        body: 'לסייע לילדים ולנוער בסיכון באמצעות יצירת שייכות לקבוצה.',
      },
      en: {
        title: 'Support through belonging',
        body: 'Support children and youth at risk by creating a sense of belonging to a group.',
      },
    },
    {
      icon: 'sparkles' as const,
      he: {
        title: 'להעשיר בתוכן ופעילות מהנה',
        body: 'להעשיר בתוכן ובפעילות מהנה את שעות הפנאי של הילדים.',
      },
      en: {
        title: 'Enrich their free time',
        body: 'Fill their leisure hours with enjoyable, worthwhile activity.',
      },
    },
    {
      icon: 'trophy' as const,
      he: {
        title: 'לאפשר השגת הישגים',
        body: 'לאפשר לילדים ונוער בסיכון לחוות השגת הישגים ותחושת שייכות למסגרת קבועה ורציפה, דרך אימון והתמדה.',
      },
      en: {
        title: 'Let them achieve',
        body: 'Let children and youth at risk experience real achievement and belonging to a steady, continuous framework through training and perseverance.',
      },
    },
    {
      icon: 'star' as const,
      he: {
        title: 'לחשוף לעולמות תוכן',
        body: 'לחשוף אותם ככל שניתן לעולמות תוכן ולכישרונות מעוררי השראה בעולם אומנויות הלחימה.',
      },
      en: {
        title: 'Open new worlds',
        body: 'Expose them, wherever possible, to inspiring people and talent from the world of martial arts.',
      },
    },
  ],
}
