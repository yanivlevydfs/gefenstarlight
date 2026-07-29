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
        'For any question regarding these terms, or to raise a concern about content published on this site, please reach us through the contact page — full contact details are shown there.',
      ],
    },
  },
  {
    // Required of an Israeli non-profit site by the Equal Rights for Persons
    // with Disabilities Regulations. Written as an honest account rather than
    // a conformance claim: what has been done, what is known to be missing,
    // and where to report a problem.
    slug: 'accessibility',
    legacyPaths: [],
    he: {
      title: 'הצהרת נגישות',
      subtitle:
        'עמותת מתנות קטנות — מתנות גדולות לזכרו של גפן אבירם ז״ל (ע.ר. 580713121)',
      body: [
        'עמותת "מתנות קטנות — מתנות גדולות" רואה חשיבות רבה במתן שירות שוויוני לכלל הגולשים, ופועלת להנגיש את האתר לאנשים עם מוגבלות בהתאם לתקנות שוויון זכויות לאנשים עם מוגבלות (התאמות נגישות לשירות), התשע״ג-2013, ולתקן הישראלי ת״י 5568 המבוסס על הנחיות WCAG 2.0 ברמה AA.',
        'האתר תוכנן ונבנה במטרה לעמוד ברמה AA. ההנגשה היא תהליך מתמשך: אנחנו ממשיכים לבדוק ולשפר, ולכן ייתכן שבחלקים מסוימים באתר טרם הושלמה ההתאמה.',
        'מה כבר נעשה באתר: מבנה סמנטי תקין המאפשר קריאה בתוכנות הקראה; ניווט מלא באמצעות מקלדת, כולל סימון ברור של הפריט שבמיקוד; יחסי ניגודיות תואמים בין הטקסט לרקע בשתי ערכות הצבע, בהירה וכהה; טקסט חלופי לתמונות; תמיכה בהגדלת הטקסט בדפדפן בלי אובדן תוכן; תמיכה מלאה בעברית ובאנגלית ובכיווניות הכתיבה של כל אחת מהן; והפחתה אוטומטית של אנימציות עבור מי שהגדיר זאת במערכת ההפעלה.',
        'סרגל נגישות: בכל עמוד באתר מופיע לחצן נגישות הפותח סרגל כלים המאפשר, בין היתר, להגדיל ולהקטין טקסט, להגדיל את הריווח בין שורות ואותיות, לשנות ניגודיות, להציג סמן עכבר גדול, להוסיף קו הנחיה לקריאה ולעצור אנימציות. הסרגל הוא תוספת נוחות והוא אינו מחליף את הנגישות של האתר עצמו.',
        'מגבלות ידועות: תכנים המשובצים מאתרים חיצוניים — ובכללם נגני הווידאו של YouTube — כפופים לנגישות של אותם שירותים ואינם בשליטתנו המלאה. כמו כן, חלק מהתמונות שיובאו מהאתר הקודם של העמותה עשויות להיות חסרות טקסט חלופי מלא. אנו פועלים להשלים זאת.',
        'נתקלתם בבעיה? אם מצאתם באתר תוכן שאינו נגיש, או שנתקלתם בקושי כלשהו בשימוש, נשמח מאוד שתעדכנו אותנו. פנו אלינו דרך עמוד "יצירת קשר" שבאתר, שבו מופיעים כתובת הדוא״ל ומספרי הטלפון של העמותה, ונטפל בפנייה בהקדם האפשרי.',
        'הצהרה זו עודכנה ביולי 2026.',
      ],
    },
    en: {
      title: 'Accessibility statement',
      subtitle:
        'Matanot Ktanot — Matanot Gdolot, in memory of Gefen Aviram (Registered Association 580713121)',
      body: [
        'The Matanot Ktanot — Matanot Gdolot foundation considers equal service to every visitor important, and works to make this site usable by people with disabilities in line with the Israeli Equal Rights for Persons with Disabilities (Service Accessibility Adjustments) Regulations, 2013, and Israeli Standard IS 5568, which is based on the WCAG 2.0 guidelines at level AA.',
        'The site was designed and built to meet level AA. Accessibility is an ongoing effort: we keep testing and improving, so some parts of the site may not yet be fully adapted.',
        'What has already been done: sound semantic structure that screen readers can follow; full keyboard navigation, with a clear indicator of the focused item; contrast ratios between text and background that meet the standard in both the light and dark colour schemes; alternative text for images; support for enlarging text in the browser without losing content; full support for Hebrew and English and for the writing direction of each; and automatic reduction of animation for anyone who has asked for that in their operating system.',
        'Accessibility toolbar: every page carries an accessibility button that opens a toolbar offering, among other things, larger and smaller text, increased line and letter spacing, contrast adjustments, a large mouse cursor, a reading guide, and a way to stop animations. The toolbar is a convenience; it does not replace the accessibility of the site itself.',
        'Known limitations: content embedded from external sites — including the YouTube video players — depends on the accessibility of those services and is not fully within our control. Some images carried over from the foundation’s previous site may also lack complete alternative text. We are working through them.',
        'Found a problem? If you come across content that is not accessible, or have any difficulty using the site, we would genuinely like to hear about it. Please reach us through the contact page, where the foundation’s email address and telephone numbers are listed, and we will address it as soon as we can.',
        'This statement was last updated in July 2026.',
      ],
    },
  },
  {
    // Describes what the site actually does, checked against the code: the
    // contact action, the spam module (which hashes the address rather than
    // storing it) and the consent gate. Keep it in step if any of those change.
    slug: 'privacy',
    legacyPaths: [],
    he: {
      title: 'מדיניות פרטיות',
      subtitle:
        'עמותת מתנות קטנות — מתנות גדולות לזכרו של גפן אבירם ז״ל (ע.ר. 580713121)',
      body: [
        'העמותה מכבדת את פרטיותכם. מדיניות זו מסבירה איזה מידע נאסף באתר, לשם מה הוא משמש, וכיצד תוכלו לממש את זכויותיכם לפי חוק הגנת הפרטיות, התשמ״א-1981.',
        'מידע שאתם מוסרים ביוזמתכם: כאשר אתם שולחים הודעה דרך טופס "יצירת קשר" באתר, אנו שומרים את השם, כתובת הדוא״ל, מספר הטלפון (אם מולא) ותוכן ההודעה, יחד עם שפת הפנייה. המידע נשמר כדי שנוכל לחזור אליכם ולטפל בפנייה, ולצורך רישום פניות העמותה. אין חובה חוקית למסור את הפרטים, אך בלעדיהם לא נוכל להשיב.',
        'כתובת ה-IP שלכם אינה נשמרת. כדי למנוע הצפה של הטופס בהודעות זבל, אנו מחשבים מהכתובת חתימה חד-כיוונית (Hash) עם מפתח סודי ושומרים רק אותה. לא ניתן לשחזר ממנה את הכתובת עצמה.',
        'עוגיות ומדידת שימוש: האתר אינו מציג פרסומות ואינו מוכר מידע לאף גורם. מדידת השימוש (Vercel Analytics ו-Speed Insights) נטענת אך ורק לאחר שנתתם הסכמה בבאנר העוגיות, והיא אינה עוקבת אחריכם בין אתרים. בחירתכם בבאנר, שפת הממשק ומצב התצוגה (בהיר או כהה) נשמרים בדפדפן שלכם בלבד. תוכלו לשנות את בחירתכם בכל עת באמצעות הקישור "העדפות עוגיות" שבתחתית כל עמוד.',
        'סרטונים מוטמעים: עמודים מסוימים מציגים סרטוני YouTube. הנגן נטען מהשרתים של Google, ובעת הצפייה חלה גם מדיניות הפרטיות של אותו שירות.',
        'היכן המידע נשמר ומי נחשף אליו: האתר מתארח בשירות Vercel ומסד הנתונים מתארח בשירות Neon בשרתים באיחוד האירופי. הודעות דוא״ל נשלחות לעמותה באמצעות שירות Resend. ספקים אלה משמשים כמאחסנים בלבד. מלבדם, המידע נגיש לבעלי התפקידים בעמותה הזקוקים לו לצורך הטיפול בפנייה. איננו מוכרים, משכירים או מעבירים מידע אישי לצדדים שלישיים למטרות שיווק.',
        'משך השמירה: פניות נשמרות כל עוד הן נדרשות לטיפול ולתיעוד פעילות העמותה. תוכלו לבקש את מחיקתן בכל עת.',
        'זכויותיכם: על פי חוק הגנת הפרטיות אתם רשאים לעיין במידע המוחזק עליכם, לבקש לתקנו אם אינו נכון, שלם או מעודכן, ולבקש את מחיקתו. לשם כך פנו אלינו דרך עמוד "יצירת קשר" שבאתר, שבו מופיעים כתובת הדוא״ל ומספרי הטלפון של העמותה. נשיב לפנייתכם בהקדם.',
        'אבטחה: התעבורה לאתר מוצפנת, והגישה למערכת הניהול מוגבלת למורשים בלבד. עם זאת, כמו בכל שירות מקוון, אין באפשרותנו להבטיח הגנה מוחלטת.',
        'שינויים במדיניות: נעדכן עמוד זה אם דרכי הטיפול במידע ישתנו. המדיניות עודכנה לאחרונה ביולי 2026.',
      ],
    },
    en: {
      title: 'Privacy policy',
      subtitle:
        'Matanot Ktanot — Matanot Gdolot, in memory of Gefen Aviram (Registered Association 580713121)',
      body: [
        'The foundation respects your privacy. This policy explains what information the site collects, what it is used for, and how you can exercise your rights under the Israeli Protection of Privacy Law, 1981.',
        'Information you choose to give us: when you send a message through the contact form we store your name, email address, telephone number (if you filled one in) and the text of your message, along with the language you wrote in. We keep it so that we can reply and handle your enquiry, and as part of the foundation’s record of correspondence. You are under no legal obligation to provide these details, but without them we cannot answer.',
        'Your IP address is not stored. To stop the form being flooded with spam we compute a one-way hash of the address using a secret key and keep only that. The address itself cannot be recovered from it.',
        'Cookies and usage measurement: the site carries no advertising and sells no data to anyone. Usage measurement (Vercel Analytics and Speed Insights) loads only after you have agreed in the cookie banner, and does not follow you across other sites. Your banner choice, your interface language and your display mode (light or dark) are kept in your own browser only. You can change your choice at any time through the “Cookie preferences” link at the foot of every page.',
        'Embedded video: some pages show YouTube videos. The player is loaded from Google’s servers, and while you watch, that service’s own privacy policy applies as well.',
        'Where the information is held and who sees it: the site is hosted on Vercel and the database is hosted on Neon, on servers in the European Union. Email notifications reach the foundation through Resend. These providers act purely as hosts. Beyond them, the information is available to the people at the foundation who need it in order to deal with your enquiry. We do not sell, rent or pass personal information to third parties for marketing.',
        'How long we keep it: enquiries are kept for as long as they are needed to handle and to document the foundation’s activity. You may ask us to delete yours at any time.',
        'Your rights: under the Protection of Privacy Law you may inspect the information held about you, ask for it to be corrected if it is wrong, incomplete or out of date, and ask for it to be deleted. To do so, reach us through the contact page, where the foundation’s email address and telephone numbers are listed. We will respond as soon as we can.',
        'Security: traffic to the site is encrypted and access to the admin console is limited to authorised people. As with any online service, however, we cannot promise absolute protection.',
        'Changes to this policy: we will update this page if the way we handle information changes. It was last updated in July 2026.',
      ],
    },
  },
]
