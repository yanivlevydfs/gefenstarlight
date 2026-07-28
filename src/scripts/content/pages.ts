export type SeedPage = {
  slug: string
  legacyPaths: string[]
  /** Loaded from a sibling .txt file instead of being inlined. */
  bodyFile?: string
  albumKey?: string
  he: { title: string; subtitle?: string; body?: string[] }
  en: { title: string; subtitle?: string; body?: string[] }
}

export const pages: SeedPage[] = [
  {
    slug: 'gefen',
    legacyPaths: ['/אודות-גפן'],
    // Personal photographs of Gefen, carried over from the old home page.
    albumKey: 'home',
    he: {
      title: 'מיהו גפן אבירם',
      subtitle: 'גפן אבירם ז״ל, בן 9.8 שנים במותו',
      body: [
        'גפן אבירם, זכרונו לברכה, בן 9.8 שנים במותו, היה ילד נבון ואהוב שהקסים בענווה ובשקט שלו את כל מי שפגש אותו. כבר בגיל צעיר גילה סקרנות רבה לחקור ולגלות דברים חדשים, כל דבר למד בשקיקה ובצימאון רב, ובתוך כך נהנה לשחק עם חברים ולהתאמן בענפי ספורט מגוונים: כדורסל, ג׳ודו וטיפוס קירות.',
        'בסיום כיתה א׳ אובחן אצל גפן גידול בראש. הוא עבר ניתוח להסרת הגידול וסדרת טיפולים שנמשכו כשנה, כשהוא מנהל את שגרת היומיום בין טיפולים, חברים, לימודים ומשחקים — והכל מתובל בחיוך ובהבנה שאת המכשול הזה הוא יכול לעבור בגבורה. אך מיד עם סיום הטיפול, לאחר שנה, התבשרנו שהמחלה חזרה.',
        'גפן, בדרכו ההרואית, גילה נחישות ורוח לחימה והחל בטיפולים חדשים שנמשכו שנה נוספת. לצד הטיפולים המשיך לצבור חוויות ולחיות את החיים במלואם, עם אותה שמחה והומור לאורך כל הדרך. במשך כל השנתיים וחצי, מרגע גילוי המחלה ועד יומו האחרון, גפן היה גיבור אמיתי. כל טיפול הפך לחוויה, וכל קושי הפך למסיבה ולמשחק.',
        'גפן ניחן באופי נינוח, בשכל ישר וביכולת למצוא את השקט הפנימי ואת האיזון הנפשי בכוחות מופלאים שהיו חבויים בתוכו. במשך כל אותו הזמן שבו היה מרוחק מהשגרה שכל כך אהב, הוא דמיין את הרגע שבו הוא מבריא וחוזר להיות ילד רגיל כמו כולם.',
        'תזכרו שתמיד יש לכם את היכולת להסתכל סביבכם, לגלות סבלנות כלפי מי ששונה מכם ולתת לו או לה את ההרגשה המופלאה הזו. זה פשוט ואפשרי.',
      ],
    },
    en: {
      title: 'Who was Gefen Aviram',
      subtitle: 'Gefen Aviram, 9.8 years old at the time of his death',
      body: [
        'Gefen Aviram, may he rest in peace, 9.8 years old at the time of his death, was a wise and beloved child who quietly and humbly charmed everyone who met him. From an early age he was deeply curious to explore and discover new things; he learned everything with eagerness and thirst, and along the way he loved playing with friends and training in a range of sports — basketball, judo and wall climbing.',
        'At the end of first grade, Gefen was diagnosed with a tumour in his head. He underwent surgery to remove it and a course of treatment lasting about a year, managing daily life between treatments, friends, school and games — all of it seasoned with a smile and an understanding that he could overcome this obstacle heroically. But immediately after the treatment ended, a year later, we were told the illness had returned.',
        'Gefen, in his heroic way, showed determination and a fighting spirit and began new treatments that lasted another year. Alongside them he carried on gathering experiences and living life to the full, with the same joy and humour throughout. For the entire two and a half years, from the moment the illness was discovered until his last day, Gefen was a true hero. Every treatment became an experience, and every hardship became a party and a game.',
        'Gefen was blessed with a calm nature, good sense, and an ability to find inner quiet and emotional balance through the remarkable strength hidden within him. Throughout all that time away from the routine he loved so much, he imagined the moment he would recover and go back to being an ordinary child like everyone else.',
        'Remember that you always have the ability to look around you, to be patient with someone different from you, and to give them that wonderful feeling. It is simple, and it is possible.',
      ],
    },
  },
  {
    slug: 'terms',
    legacyPaths: ['/תקנון'],
    bodyFile: 'terms.he.txt',
    he: {
      title: 'תקנון ותנאי שימוש',
      subtitle: 'עמותת מתנות קטנות — מתנות גדולות לזכרו של גפן אבירם ז״ל (ע.ר. 580713121)',
    },
    en: {
      title: 'Terms of use',
      subtitle:
        'Matanot Ktanot — Matanot Gdolot, in memory of Gefen Aviram (Registered Association 580713121)',
      body: [
        'The full terms of use and site policy are published in Hebrew, which is the binding version. In the event of any conflict between the Hebrew text and a translation, the Hebrew version prevails.',
        'For any question regarding these terms, or to raise a concern about content published on this site, please contact us at sama2@netvision.net.il or on +972-54-771-1120.',
      ],
    },
  },
]
