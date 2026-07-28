export type SeedPerson = {
  order: number
  /** Headshot filename inside `seed-media/`, carried over from the old Wix site. */
  photo?: string
  he: { name: string; role: string; bio?: string }
  en: { name: string; role: string; bio?: string }
}

export const boardMembers: SeedPerson[] = [
  {
    order: 1,
    photo: 'a50afb_cf8121a58f3d473d9f3596366014bec3~mv2.jpg',
    he: {
      name: 'אסף אבירם הגיתי',
      role: 'יו״ר העמותה',
      bio: 'בן 56, מנהל מכירות ופעילות עסקית בהייטק. אבא לגפן ואילה. בעל תואר ראשון בכלכלה וניהול ותואר שני במנהל עסקים מהמרכז הבינתחומי בהרצליה, בהתמחות במימון ובניהול סיכונים. מתגורר בהוד השרון.',
    },
    en: {
      name: 'Assaf Aviram Hagiti',
      role: 'Chair of the board',
      bio: '56, a sales and business director in high-tech. Father to Gefen and Ayala. Holds a BA in economics and management and an MBA from Reichman University, specialising in finance and risk management. Lives in Hod Hasharon.',
    },
  },
  {
    order: 2,
    photo: 'd7301b_f5929444ebea4d078b3c69b314945073~mv2.jpeg',
    he: {
      name: 'חגי אבירם',
      role: 'ועד העמותה',
      bio: 'בן 54 מתל אביב — מסעדן, מעצב ואמן. אופה לחמי מחמצת ומארגן ארוחות פרטיות חווייתיות בסטייל ייחודי.',
    },
    en: {
      name: 'Hagai Aviram',
      role: 'Board member',
      bio: '54, from Tel Aviv — a restaurateur, designer and artist. He bakes sourdough breads and hosts distinctive private dining experiences.',
    },
  },
  {
    order: 3,
    photo: 'd7301b_7ffa104440804d2fac600002a89c5105~mv2.jpg',
    he: {
      name: 'גל אבירם',
      role: 'ועד העמותה',
      bio: 'בת 34 מתל אביב. בעלת תואר ראשון ושני בהנדסה ביו-רפואית ותואר ראשון במדעי המוח מאוניברסיטת תל אביב. מפתחת אלגוריתמים בסטארטאפים רפואיים. חובבת מסעדות וטיולים.',
    },
    en: {
      name: 'Gal Aviram',
      role: 'Board member',
      bio: '34, from Tel Aviv. Holds a BSc and MSc in biomedical engineering and a BSc in neuroscience from Tel Aviv University. Develops algorithms at medical startups. Loves restaurants and travelling.',
    },
  },
  {
    order: 4,
    photo: 'd7301b_c0aa2f6f8cab4346b4db52041246825e~mv2.jpeg',
    he: {
      name: 'שיר אבירם',
      role: 'ועד העמותה',
      bio: 'בת 30 מתל אביב. דוקטורנטית לפיזיקה באוניברסיטת תל אביב. חוקרת חורים שחורים ומלמדת באוניברסיטה. מתנדבת בארגון מהנדסים ללא גבולות בטנזניה. אוהבת חיות, טבע וטיולים בעולם.',
    },
    en: {
      name: 'Shir Aviram',
      role: 'Board member',
      bio: '30, from Tel Aviv. A PhD candidate in physics at Tel Aviv University, researching black holes and teaching at the university. Volunteers with Engineers Without Borders in Tanzania. Loves animals, nature and travelling the world.',
    },
  },
  {
    order: 5,
    // The old site showed no headshot for him.
    he: {
      name: 'חגי נצר',
      role: 'ועד העמותה',
      bio: 'בן 53, נשוי ואב לשתי בנות. בוגר הטכניון בהנדסת תעשייה וניהול. מנהל מכירות בינלאומיות בהייטק. גר בהוד השרון.',
    },
    en: {
      name: 'Hagai Netzer',
      role: 'Board member',
      bio: '53, married and a father of two daughters. A Technion graduate in industrial engineering and management. International sales director in high-tech. Lives in Hod Hasharon.',
    },
  },
  {
    order: 6,
    photo: 'a50afb_17b62465c45a4f8ba030eba3e81a3344~mv2.jpg',
    he: {
      name: 'הדר טל',
      role: 'עורך דין',
      bio: 'בן 56, שותף בכיר במשרד ש. פרידמן. אב לשלושה ילדים, תושב שדה יצחק.',
    },
    en: {
      name: 'Hadar Tal',
      role: 'Legal counsel',
      bio: '56, a senior partner at S. Friedman & Co. Father of three, lives in Sde Yitzhak.',
    },
  },
  {
    order: 7,
    photo: 'a50afb_e4f321ca6d5845e191bd1dc0d369ced2~mv2.jpg',
    he: { name: 'ארנון מיינפלד', role: 'ועד העמותה' },
    en: { name: 'Arnon Meinfeld', role: 'Board member' },
  },
]

export type SeedTestimonial = {
  order: number
  featured?: boolean
  he: { quote: string; author: string; role?: string }
  en: { quote: string; author: string; role?: string }
}

export const testimonials: SeedTestimonial[] = [
  {
    order: 1,
    featured: true,
    he: {
      quote:
        'הקבוצה שהתגבשה התקדמה מאוד הן במישור הפיזי והן במישור המנטלי. התלמידים גילו התמדה, נחישות והצליחו להתגבר על קשיים במהלך האימונים. בעיקר בלט השיפור ברמת המשמעת והריכוז. הנערים עברו בהצלחה שני מבחני דרגה והגיעו לחגורה הצהובה. תודה רבה על הכל!',
      author: 'יוני',
      role: 'מאמן הקבוצה, מרכז יוספטל, פתח-תקווה',
    },
    en: {
      quote:
        'The group progressed a great deal, both physically and mentally. The students showed perseverance and determination, and overcame real difficulties during training. The improvement in discipline and concentration stood out in particular. They passed two grading exams and reached the yellow belt. Thank you for everything!',
      author: 'Yoni',
      role: 'Group coach, Yoseftal Centre, Petah Tikva',
    },
  },
  {
    order: 2,
    featured: true,
    he: {
      quote:
        'קבוצת הקראטה היא קבוצה שכשרואים אותה בפעולה אי אפשר שלא לחייך. אני ומורן, כאחראים על הקבוצה, מתפעלים מן הכבוד ההדדי, הרצינות והמסירות של הקבוצה. הקבוצה התגבשה בזמן קצר הודות ליוני המאמן שידע כיצד לגשת לכל ילד בגובה העיניים ולתת לו את התחושה שרואים אותו ואת הקושי שלו.',
      author: 'אברה',
      role: 'מרכז הפעילות במרכז יוספטל, פתח-תקווה',
    },
    en: {
      quote:
        'You cannot watch this group in action without smiling. Moran and I, who run the group, are constantly impressed by the mutual respect, the seriousness and the dedication. It came together quickly thanks to Yoni, the coach, who knows how to meet every child at eye level and make them feel seen — difficulties and all.',
      author: 'Avraha',
      role: 'Activity coordinator, Yoseftal Centre, Petah Tikva',
    },
  },
]
