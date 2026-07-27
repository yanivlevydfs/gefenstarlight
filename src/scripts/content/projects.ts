/**
 * Every project page from the old Wix site, in both languages.
 *
 * `legacyPaths` carries the original Wix URL so the redirect is resolved from
 * the CMS — nothing about these pages is hard-coded into the app.
 */

export type SeedQuote = { quote: string; author?: string }

export type SeedProject = {
  slug: string
  date: string
  featured?: boolean
  legacyPaths: string[]
  /** Matches an album key in albums.ts, so photos land on the right page. */
  albumKey?: string
  ctaUrl?: string
  he: {
    title: string
    location?: string
    summary: string
    body: string[]
    quotes?: SeedQuote[]
    ctaLabel?: string
  }
  en: {
    title: string
    location?: string
    summary: string
    body: string[]
    quotes?: SeedQuote[]
    ctaLabel?: string
  }
}

export const projects: SeedProject[] = [
  {
    slug: 'purim-2020',
    date: '2020-03-10',
    legacyPaths: ['/פרויקט-1'],
    albumKey: 'פרויקט-1',
    he: {
      title: 'מיזם פורים 2020',
      summary:
        'מיזם קמפיין גיוס תרומות בשיתוף עם חברת VMware לזכרו של גפן, מימון וחלוקת תחפושות, משלוחי מנות וערכות לגו לילדים אונקולוגיים בתל השומר, שניידר, איכילוב ושערי צדק.',
      body: [
        'איסוף תרומות ביום ההולדת של גפן – רכישת וחלוקת תחפושות ואביזרים לפורים, לגו ומשלוחי מנות לכ-400 ילדים אונקולוגיים בבתי חולים תל השומר, שניידר, איכילוב ושערי צדק.',
      ],
    },
    en: {
      title: 'Purim 2020',
      summary:
        'A fundraising campaign in partnership with VMware in memory of Gefen — funding and distributing costumes, Purim gift baskets and LEGO sets to children in oncology wards.',
      body: [
        'Donations were collected on Gefen’s birthday, and used to buy and distribute Purim costumes and accessories, LEGO sets and gift baskets to some 400 children in the oncology departments of Tel Hashomer, Schneider, Ichilov and Shaare Zedek hospitals.',
      ],
    },
  },
  {
    slug: 'youth-at-risk-2021',
    date: '2021-09-01',
    legacyPaths: ['/פרויקט-2'],
    albumKey: 'פרויקט-2',
    he: {
      title: 'מיזם נערים בסיכון 2021',
      location: 'מרכז יוספטל, פתח תקווה',
      summary: 'מימון פעילות קרב מגע לנערים בסיכון בשכונת יוספטל בפתח תקווה.',
      body: [
        'הקמת קבוצה של נערים בסיכון ביוספטל, פתח תקווה — מימון כלל הפעילות של קרב מגע, כולל הפעילות השוטפת וציוד לאימונים במשך שנה. חינוך לנחישות ולמצוינות, לפי ערכיו של גפן.',
      ],
      quotes: [
        {
          quote:
            'קבוצת הקראטה היא קבוצה שכשרואים אותה בפעולה אי אפשר שלא לחייך. אני ומורן, כאחראים על הקבוצה, מתפעלים מן הכבוד ההדדי, הרצינות והמסירות של הקבוצה. הקבוצה התגבשה בזמן קצר הודות ליוני המאמן שידע כיצד לגשת לכל ילד בגובה העיניים ולתת לו את התחושה שרואים אותו ואת הקושי שלו. אנחנו שמחים לראות שכל ילד בקבוצה לא מוותר לעצמו וחשוב לו להצליח גם כשזה לוקח זמן. ההתמדה היא נכס שאנחנו בטוחים שהנערים ייהנו מהפירות עוד שנים רבות, ובהזדמנות זו גם להודות לעמותת מתנות קטנות מתנות גדולות לזכרו של גפן אבירם ז״ל שמאפשרת את הפעילות.',
          author: 'אברה, מרכז הפעילות במרכז יוספטל, פתח-תקווה',
        },
        {
          quote:
            'הקבוצה שהתגבשה התקדמה מאוד הן במישור הפיזי והן במישור המנטלי. התלמידים גילו התמדה, נחישות והצליחו להתגבר על קשיים במהלך האימונים. בעיקר בלט השיפור ברמת המשמעת והריכוז. הנערים עברו בהצלחה שני מבחני דרגה והגיעו לחגורה הצהובה, תודה רבה על הכל!',
          author: 'יוני, מאמן הקבוצה, מרכז יוספטל, פתח-תקווה',
        },
      ],
    },
    en: {
      title: 'Youth at risk 2021',
      location: 'Yoseftal Centre, Petah Tikva',
      summary: 'Funding Krav Maga training for youth at risk in the Yoseftal neighbourhood of Petah Tikva.',
      body: [
        'A group of youth at risk was established in Yoseftal, Petah Tikva. The foundation funded the entire Krav Maga programme for a year — the sessions themselves and all training equipment — teaching determination and excellence, in keeping with Gefen’s values.',
      ],
      quotes: [
        {
          quote:
            'You cannot watch this group in action without smiling. Moran and I, who run the group, are constantly impressed by the mutual respect, the seriousness and the dedication. It came together quickly thanks to Yoni, the coach, who knows how to meet every child at eye level and make them feel seen — difficulties and all. It is wonderful to see that no child gives up on themselves, and that succeeding matters to them even when it takes time. That perseverance is an asset we are certain they will draw on for many years. Our thanks to the foundation, in memory of Gefen Aviram, for making this possible.',
          author: 'Avraha, activity coordinator, Yoseftal Centre, Petah Tikva',
        },
        {
          quote:
            'The group progressed a great deal, both physically and mentally. The students showed perseverance and determination, and overcame real difficulties during training. The improvement in discipline and concentration stood out in particular. They passed two grading exams and reached the yellow belt. Thank you for everything!',
          author: 'Yoni, group coach, Yoseftal Centre, Petah Tikva',
        },
      ],
    },
  },
  {
    slug: 'youth-at-risk-2022',
    date: '2022-09-01',
    featured: true,
    legacyPaths: ['/פרויקט-3'],
    albumKey: 'פרויקט-3',
    he: {
      title: 'מיזם נערים בסיכון 2022',
      location: 'מרכז יוספטל, פתח תקווה',
      summary: 'הרחבת פעילות קבוצת הנערים בסיכון ופתיחת שנה שנייה בשכונת יוספטל.',
      body: [
        'חלוקת תעודות הוקרה לממשיכי הקורס של אמנויות הלחימה בשנה השנייה, והרחבת הפעילות לנערים נוספים — כולל ציוד וכלל הפעילות השוטפת, במימון העמותה.',
      ],
      quotes: [
        {
          quote:
            'קבוצת הקרטה היא קבוצה שכשרואים אותה בפעולה אי אפשר שלא לחייך. אני ומורן, כאחראים על הקבוצה, מתפעלים מהכבוד ההדדי, הרצינות והמסירות. הקבוצה התגבשה בזמן קצר הודות ליוני המאמן שידע לגשת לכל ילד בגובה העיניים ולתת לו את התחושה שרואים אותו ואת הקושי שלו. אנו שמחים לראות שכל ילד בקבוצה לא מוותר לעצמו וחשוב לו להצליח. ההתמדה היא נכס שאנו בטוחים שהנערים ייהנו מהפירות עוד שנים רבות.',
          author: 'אברה, מרכז הפעילות במרכז יוספטל, פתח-תקווה',
        },
        {
          quote:
            'הקבוצה שהתגבשה התקדמה מאוד הן במישור הפיזי והן במישור המנטלי. התלמידים גילו התמדה, נחישות והצליחו להתגבר על קשיים במהלך האימונים. בעיקר בלט השיפור ברמת המשמעת והריכוז. הנערים עברו בהצלחה שני מבחני דרגה והגיעו לחגורה הצהובה. תודה רבה על הכל!',
          author: 'יוני, מאמן הקבוצה, מרכז יוספטל פתח-תקווה',
        },
      ],
    },
    en: {
      title: 'Youth at risk 2022',
      location: 'Yoseftal Centre, Petah Tikva',
      summary: 'Expanding the youth-at-risk group and opening a second year in the Yoseftal neighbourhood.',
      body: [
        'Certificates of appreciation were awarded to the trainees continuing into the second year of the martial-arts course, and the programme was expanded to more young people — equipment and all running costs funded by the foundation.',
      ],
      quotes: [
        {
          quote:
            'You cannot watch this group in action without smiling. Moran and I are constantly impressed by the mutual respect, the seriousness and the dedication. It came together quickly thanks to Yoni, the coach, who meets every child at eye level and makes them feel seen. It is wonderful that no child gives up on themselves, and that succeeding matters to them. That perseverance is an asset they will draw on for many years.',
          author: 'Avraha, activity coordinator, Yoseftal Centre, Petah Tikva',
        },
        {
          quote:
            'The group progressed a great deal, both physically and mentally. The students showed perseverance and determination and overcame difficulties during training. The improvement in discipline and concentration stood out. They passed two grading exams and reached the yellow belt. Thank you for everything!',
          author: 'Yoni, group coach, Yoseftal Centre, Petah Tikva',
        },
      ],
    },
  },
  {
    slug: 'hod-hasharon-2023',
    date: '2023-02-01',
    legacyPaths: ['/copy-of-פרויקט-1'],
    albumKey: 'copy-of-פרויקט-1',
    he: {
      title: 'נערים בסיכון — הוד השרון — 2023',
      location: 'הוד השרון',
      summary: 'גיבוש ותחילת פעילות קבוצת הג׳ודו בהוד השרון במימון העמותה.',
      body: [
        'גובשה והתחילה פעילות קבוצת הג׳ודו, במימון העמותה. טקס הפתיחה וחלוקת הציוד למתאמנים נערך במהלך חודש פברואר, סמוך ליום הולדתו של גפן.',
      ],
    },
    en: {
      title: 'Youth at risk — Hod Hasharon — 2023',
      location: 'Hod Hasharon',
      summary: 'A judo group was formed and began training in Hod Hasharon, funded by the foundation.',
      body: [
        'The judo group came together and began training, funded by the foundation. The opening ceremony and the handing out of equipment took place in February, close to Gefen’s birthday.',
      ],
    },
  },
  {
    slug: 'ramla-2023',
    date: '2023-11-01',
    legacyPaths: ['/copy-of-פרויקט-4'],
    albumKey: 'copy-of-פרויקט-4',
    he: {
      title: 'נערים בסיכון — רמלה — 2023',
      location: 'מרכז הג׳ודו העירוני ע״ש יהודה בוהדנה, רמלה',
      summary:
        'פתיחת פעילות קרב מגע לנערים בסיכון לזכר גפן במרכז הג׳ודו העירוני ע״ש יהודה בוהדנה.',
      body: [
        'בטקס מרגש שנערך לפתיחת הפעילות לקבוצת המתאמנים, בנוכחות ראש העיר מיכאל וידל, התחילה פעילות הקבוצה וחולק ציוד למתאמנים.',
      ],
      quotes: [
        {
          quote:
            'בעיר רמלה שואפים למצוינות ומעוניינים להקנות את הערכים בהם האמין גפן — נחישות, מצוינות והתמדה. אנו נקרא לקבוצת הג׳ודו ״קבוצת גפן״, לזכרו. מאמינים שנצליח להוציא את האלוף הבא מהקבוצה המיוחדת הזו.',
          author: 'מיכאל וידל, ראש עיריית רמלה',
        },
      ],
    },
    en: {
      title: 'Youth at risk — Ramla — 2023',
      location: 'Yehuda Bohadana Municipal Judo Centre, Ramla',
      summary:
        'Krav Maga training for youth at risk opened in Gefen’s memory at the Yehuda Bohadana Municipal Judo Centre.',
      body: [
        'At a moving ceremony marking the start of the programme, attended by Mayor Michael Vidal, the group began training and equipment was distributed to the trainees.',
      ],
      quotes: [
        {
          quote:
            'In Ramla we strive for excellence, and we want to pass on the values Gefen believed in — determination, excellence and perseverance. We will call the judo group “Gefen’s Group”, in his memory. We believe the next champion will come out of this special group.',
          author: 'Michael Vidal, Mayor of Ramla',
        },
      ],
    },
  },
  {
    slug: 'hod-hasharon-2024',
    date: '2024-02-01',
    legacyPaths: ['/copy-of-פרויקט-4-1'],
    albumKey: 'copy-of-פרויקט-4-1',
    he: {
      title: 'נערים בסיכון — הוד השרון — 2024',
      location: 'הוד השרון',
      summary: 'המשך הפעילות והרחבת הקבוצה, עם טקס חלוקת ציוד לילדים שהצטרפו.',
      body: [
        'המשכנו בפעילות הקבוצה הנפלאה וערכנו טקס מרגש שבו חילקנו ציוד לילדים שהצטרפו, והודענו על המשך הפעילות והרחבת הקבוצה.',
      ],
    },
    en: {
      title: 'Youth at risk — Hod Hasharon — 2024',
      location: 'Hod Hasharon',
      summary: 'The group continued and grew, with a ceremony handing out equipment to the new arrivals.',
      body: [
        'We continued with this wonderful group and held a moving ceremony where equipment was given to the children who had joined, announcing that the programme would continue and the group would grow.',
      ],
    },
  },
  {
    slug: 'petah-tikva-2025',
    date: '2025-03-01',
    featured: true,
    legacyPaths: ['/copy-of-פרויקט-6'],
    albumKey: 'copy-of-פרויקט-6',
    he: {
      title: 'פתח תקווה — 2025',
      location: 'בית הספר לטבע ומדעים, פתח תקווה',
      summary: 'מיזם מיוחד עם בית הספר לטבע ומדעים בפתח תקווה.',
      body: [
        'מיזם מיוחד עם בית הספר לטבע ומדעים בפתח-תקווה, במעמד ראש העיר מר רמי גרינברג.',
      ],
    },
    en: {
      title: 'Petah Tikva — 2025',
      location: 'School of Nature and Sciences, Petah Tikva',
      summary: 'A special project with the School of Nature and Sciences in Petah Tikva.',
      body: [
        'A special project with the School of Nature and Sciences in Petah Tikva, in the presence of Mayor Rami Greenberg.',
      ],
    },
  },
  {
    slug: 'benefit-show-2024',
    date: '2024-12-01',
    legacyPaths: ['/copy-of-פרויקט-6-1'],
    albumKey: 'copy-of-פרויקט-6-1',
    he: {
      title: 'מופע התרמה — נמרוד הראל ואבי נוסבאום',
      location: 'בית ציוני אמריקה, תל אביב',
      summary: 'ערב התרמה עם מופע אמנות חושים ומופע סטנד-אפ.',
      body: ['בית ציוני אמריקה, תל-אביב — 1 בדצמבר 2024.'],
    },
    en: {
      title: 'Benefit show — Nimrod Harel and Avi Nussbaum',
      location: 'ZOA House, Tel Aviv',
      summary: 'A fundraising evening with a mentalism show and stand-up comedy.',
      body: ['ZOA House, Tel Aviv — 1 December 2024.'],
    },
  },
  {
    slug: 'ramla-judo-2024',
    date: '2024-12-09',
    featured: true,
    legacyPaths: ['/copy-of-פרויקט-7-ערב-התרמה'],
    albumKey: 'copy-of-פרויקט-7-ערב-התרמה',
    he: {
      title: 'חוג ג׳ודו ברמלה — 2024',
      location: 'רמלה',
      summary: 'טקס פתיחה לחוג הג׳ודו על שמו של גפן — השנה השלישית שהעמותה מממנת קבוצת אימון ברמלה.',
      body: [
        'בתאריך 9.12.24 קיימנו טקס פתיחה לחוג ג׳ודו על שמו של גפן ברמלה. זו השנה השלישית שהעמותה מממנת קבוצת אימון ברמלה.',
        'בטקס נכחו, חוץ מהילדים המתאמנים, מנהלת מחלקת הספורט ענת, איתי המדריך הראשי, וכן מאמן הקבוצה שלומי ומנהלת הצהרון ארנת.',
        'פתחנו את הטקס בסרטון קצר ובכמה מילים לזכרו של גפן שנאמרו על ידי שרלי, וכן על חשיבות ההתמדה בהגעה לחוג. לאחר מכן ענת נשאה נאום קצר ובו הודתה לצוות העמותה ולצוות המאמנים, והדגישה את תרומת העמותה לילדים ואת חשיבות ההשתתפות בחוג.',
        'כל מתאמן קיבל חולצה, תיק וממיה מתנה. שיהיה בהצלחה לילדים ולמאמן!',
      ],
    },
    en: {
      title: 'Judo club in Ramla — 2024',
      location: 'Ramla',
      summary:
        'The opening ceremony for the judo club named after Gefen — the third year the foundation has funded a training group in Ramla.',
      body: [
        'On 9 December 2024 we held the opening ceremony for the judo club named after Gefen in Ramla. This is the third year the foundation has funded a training group in the city.',
        'Alongside the trainees, the ceremony was attended by Anat, head of the sports department, Itai, the head instructor, Shlomi, the group’s coach, and Ornat, who runs the after-school programme.',
        'We opened with a short film and a few words in Gefen’s memory from Charlie, and on the importance of showing up to training week after week. Anat then spoke briefly, thanking the foundation and the coaching team and emphasising what the foundation gives these children — and why attending matters.',
        'Every trainee received a shirt, a bag and a water bottle. Good luck to the children and their coach!',
      ],
    },
  },
  {
    slug: 'kobi-maimon-2023',
    date: '2023-05-18',
    legacyPaths: ['/copy-of-פרויקט-1-1'],
    albumKey: 'copy-of-פרויקט-1-1',
    he: {
      title: 'ערב התרמה ראשון ומופע של קובי מימון',
      location: 'בית התותחן, זכרון יעקב',
      summary: 'ב-18 במאי 2023 נערך אירוע ההתרמה הראשון של העמותה לזכרו של גפן, עם האמן קובי מימון.',
      body: [
        'ערב ההתרמה הראשון לעמותה התקיים ביום חמישי, 18.5.2023, בבית התותחן בזכרון יעקב, ובמרכזו מופע הסטנד-אפ של קובי מימון. נכחו כ-150 חברים ובני משפחה שתרמו ברוחב לב לפעילות לזכרו של גפן האהוב.',
        'קובי הרים ערב מכל הלב, הופיע והצחיק אותנו עד דמעות. ברוח חיובית ואנרגטית סייע לנו לעמוד בכבוד ביעד שהצבנו להמשך פעילות העמותה, עבור העצמת נוער באמצעות אומנויות לחימה.',
        'בעזרתו ובאמצעות תרומותיכם הנדיבות נמשיך בפעילויות המבורכות לחיזוק הנוער של עם ישראל.',
      ],
    },
    en: {
      title: 'Our first fundraising evening, with Kobi Maimon',
      location: 'Beit HaTotchan, Zichron Yaakov',
      summary:
        'On 18 May 2023 the foundation held its first fundraising event in Gefen’s memory, headlined by the comedian Kobi Maimon.',
      body: [
        'The foundation’s first fundraising evening took place on Thursday 18 May 2023 at Beit HaTotchan in Zichron Yaakov, built around Kobi Maimon’s stand-up show. Around 150 friends and family attended and gave generously to the work carried out in memory of our beloved Gefen.',
        'Kobi gave the evening everything he had, performing and making us laugh until we cried. With warmth and energy he helped us meet the target we had set for the foundation’s continued work empowering young people through martial arts.',
        'With his help, and through your generous donations, we will carry on with this work strengthening Israel’s young people.',
      ],
    },
  },
  {
    slug: 'zoa-house-2024',
    date: '2024-12-01',
    legacyPaths: ['/copy-of-פרויקט-קובי-מימון'],
    albumKey: 'copy-of-פרויקט-קובי-מימון',
    he: {
      title: 'מופע התרמה בבית ציוני אמריקה',
      location: 'בית ציוני אמריקה, תל אביב',
      summary:
        'ערב התרמה עם מופע אמנות חושים של נמרוד הראל ומופע סטנד-אפ של אבי נוסבאום.',
      body: [
        'ערב ההתרמה כלל מופע אמנות חושים של נמרוד הראל ומופע סטנד-אפ של אבי נוסבאום. האירוע התקיים ביום א׳, 1.12.24, בשעה 19:30, בבית ציוני אמריקה, תל אביב.',
      ],
      ctaLabel: 'לרכישה',
    },
    en: {
      title: 'Benefit show at ZOA House',
      location: 'ZOA House, Tel Aviv',
      summary: 'A fundraising evening with a mentalism show by Nimrod Harel and stand-up by Avi Nussbaum.',
      body: [
        'The evening featured a mentalism show by Nimrod Harel and a stand-up set by Avi Nussbaum. It took place on Sunday 1 December 2024 at 19:30 at ZOA House, Tel Aviv.',
      ],
      ctaLabel: 'Buy tickets',
    },
  },
  {
    slug: 'fundraising-evening-2023',
    date: '2023-05-18',
    legacyPaths: ['/ערב-התרמה'],
    albumKey: 'ערב-התרמה',
    he: {
      title: 'ערב התרמה לזכרו של גפן',
      location: 'בית התותחן, זכרון יעקב',
      summary: 'האירוע התקיים ב-18.5.23 בשעה 20:00 בבית התותחן, זכרון יעקב, עם מופע של קובי מימון.',
      body: [
        'האירוע התקיים ב-18/5/23 בשעה 20:00 בבית התותחן, זכרון יעקב.',
        'המופע התקיים בהתנדבותו האדיבה של האמן קובי מימון.',
        'מודים לכם על השתתפותכם ותרומתכם לזכרו של גפן. עם הרכישה התקבלה קבלה שהיוותה כרטיס כניסה לאירוע. ההושבה באולם הייתה חופשית — כל הקודם זוכה.',
      ],
    },
    en: {
      title: 'A fundraising evening in Gefen’s memory',
      location: 'Beit HaTotchan, Zichron Yaakov',
      summary:
        'Held on 18 May 2023 at 20:00 at Beit HaTotchan, Zichron Yaakov, with a show by Kobi Maimon.',
      body: [
        'The event took place on 18 May 2023 at 20:00 at Beit HaTotchan, Zichron Yaakov.',
        'The show was performed by Kobi Maimon, who generously gave his time.',
        'Thank you for attending and for donating in Gefen’s memory. Each purchase produced a receipt that served as the entry ticket, and seating in the hall was unreserved — first come, first served.',
      ],
    },
  },
]
