import { redirect } from 'next/navigation'
import type { AdminViewServerProps } from 'payload'
import { DefaultTemplate } from '@payloadcms/next/templates'
import { Gutter } from '@payloadcms/ui'

/**
 * The team's manual, living inside the admin console at /admin/manual —
 * written in Hebrew, matching the admin's light/dark theme via its CSS
 * variables. A banner on the dashboard (below) leads here.
 */

const css = `
.gs-manual { direction: rtl; max-width: 60rem; padding-block: 2rem 6rem; line-height: 1.7; }
.gs-manual h1 { font-size: 2rem; margin: 0 0 .25rem; }
.gs-manual .lead { color: var(--theme-elevation-500); margin: 0 0 1.5rem; font-size: 1.05rem; }
.gs-manual h2 { font-size: 1.35rem; margin: 2.2rem 0 .4rem; padding-top: 1.2rem; border-top: 1px solid var(--theme-elevation-150); }
.gs-manual h3 { font-size: 1.05rem; margin: 1.1rem 0 .2rem; }
.gs-manual p, .gs-manual li { font-size: .95rem; }
.gs-manual ol, .gs-manual ul { padding-inline-start: 1.4rem; margin: .3rem 0 .8rem; }
.gs-manual li { margin: .25rem 0; }
.gs-manual .tip { background: var(--theme-elevation-50); border-inline-start: 3px solid var(--theme-success-500, #2e6b46); border-radius: 8px; padding: .7rem 1rem; margin: .8rem 0; font-size: .92rem; }
.gs-manual .warn { background: var(--theme-elevation-50); border-inline-start: 3px solid var(--theme-warning-500, #b47d12); border-radius: 8px; padding: .7rem 1rem; margin: .8rem 0; font-size: .92rem; }
.gs-manual a { color: var(--theme-success-600, inherit); font-weight: 600; }
.gs-manual code { background: var(--theme-elevation-100); border-radius: 4px; padding: 0 .35rem; font-size: .85em; }
.gs-manual-banner { direction: rtl; display: flex; align-items: center; gap: .8rem; background: var(--theme-elevation-50); border: 1px solid var(--theme-elevation-150); border-radius: 10px; padding: .9rem 1.2rem; margin-bottom: 1.5rem; }
.gs-manual-banner b { font-size: 1rem; }
.gs-manual-banner span { color: var(--theme-elevation-500); font-size: .9rem; }
.gs-manual-banner a { margin-inline-start: auto; font-weight: 700; white-space: nowrap; }
`

/** The card at the top of the dashboard, leading to the manual. */
export function ManualBanner() {
  return (
    <div className="gs-manual-banner">
      <style dangerouslySetInnerHTML={{ __html: css }} />
      <b>📖 מדריך עדכון האתר</b>
      <span>איך מפרסמים כתבה, מחליפים תמונות, מעדכנים פרטי קשר ועוד — צעד אחר צעד.</span>
      <a href="/admin/manual">לפתיחת המדריך ←</a>
    </div>
  )
}

export function ManualView({ initPageResult, params, searchParams }: AdminViewServerProps) {
  // Custom views are public by default — keep the manual behind the login.
  if (!initPageResult.req.user) redirect('/admin/login')

  return (
    <DefaultTemplate
      i18n={initPageResult.req.i18n}
      locale={initPageResult.locale}
      params={params}
      payload={initPageResult.req.payload}
      permissions={initPageResult.permissions}
      searchParams={searchParams}
      user={initPageResult.req.user || undefined}
      visibleEntities={initPageResult.visibleEntities}
    >
      <Gutter>
        <div className="gs-manual">
          <style dangerouslySetInnerHTML={{ __html: css }} />

          <h1>📖 מדריך עדכון האתר</h1>
          <p className="lead">
            כל מה שצריך כדי לנהל את אתר העמותה — בלי מתכנת. עורכים, לוחצים שמירה, והאתר
            מתעדכן תוך כדקה.
          </p>

          <div className="tip">
            <b>שלושה עקרונות שחשוב להכיר:</b>
            <ol>
              <li><b>שמירה = פרסום.</b> כל שינוי שנשמר מופיע באתר תוך עד דקה.</li>
              <li><b>שתי שפות.</b> בראש כל מסך עריכה יש בורר שפה (עברית / English) — כל טקסט קיים בשתי גרסאות. עורכים בעברית, עוברים לאנגלית ומעדכנים גם שם.</li>
              <li><b>שום דבר לא אבוד.</b> לתכנים יש גרסאות (Versions בתחתית המסך) — תמיד אפשר לשחזר נוסח קודם.</li>
            </ol>
          </div>

          <h2>📰 חדשות — פרסום כתבה</h2>
          <ol>
            <li>נכנסים אל <a href="/admin/collections/articles">כתבות</a> ולוחצים <b>Create new / צור חדש</b>.</li>
            <li>ממלאים כותרת, תאריך פרסום ותקציר (מופיע ברשימת החדשות).</li>
            <li>בוחרים <b>תמונת נושא</b> — מהמדיה הקיימת או מעלים חדשה.</li>
            <li>כותבים את התוכן בעורך — אפשר כותרות משנה, הדגשות ורשימות.</li>
            <li>אפשר לצרף <b>אלבום תמונות</b> — הוא יופיע בתחתית הכתבה.</li>
            <li>לוחצים <b>Publish / פרסם</b>. הכתבה מופיעה מיד בעמוד העדכונים.</li>
          </ol>

          <h2>👦 העמודים "מיהו גפן" והתקנון</h2>
          <p>
            נמצאים תחת <a href="/admin/collections/pages">עמודים</a>: לוחצים על העמוד ועורכים את
            הטקסט בעורך. אפשר גם ליצור עמוד חדש לגמרי — הכתובת שלו באתר נקבעת לפי שדה
            ה־<code>slug</code>, ואפשר לקשר אליו מהתפריט.
          </p>

          <h2>🥋 מיזמים</h2>
          <ol>
            <li><a href="/admin/collections/projects">מיזמים</a> ← בוחרים מיזם או יוצרים חדש.</li>
            <li>שדות חשובים: כותרת, תקציר (מופיע בכרטיס), תוכן מלא, <b>תמונת נושא</b>, תאריך.</li>
            <li><b>אלבום מקושר</b> — התמונות של המיזם. חיבור אלבום למיזם גם מוסיף לעמוד האלבום בגלריה כפתור שמוביל למיזם.</li>
            <li><b>כפתור תשלום</b>: בשדות ctaUrl / ctaLabel שמים את קישור Grow ואת הטקסט (כמו במיזם היין).</li>
          </ol>

          <h2>🖼️ תמונות ואלבומים</h2>
          <h3>העלאת קבצים</h3>
          <ol>
            <li><a href="/admin/collections/media">מדיה</a> ← Create new ← גוררים תמונה או וידאו.</li>
            <li>ממלאים <b>טקסט חלופי</b> (עוזר לנגישות ולגוגל).</li>
            <li>התמונות מוקטנות אוטומטית לכל הגדלים — מעלים פעם אחת בלבד.</li>
          </ol>
          <h3>אלבום</h3>
          <ol>
            <li><a href="/admin/collections/albums">אלבומים</a> ← בוחרים אלבום או יוצרים חדש.</li>
            <li>מוסיפים פריטים מהמדיה, בוחרים <b>תמונת שער</b>, ומסמנים אם להציג בגלריה הראשית.</li>
          </ol>
          <div className="warn">
            <b>לא מוחקים קובץ מדיה שנמצא בשימוש</b> — קודם מחליפים אותו בכל מקום שבו הוא מופיע,
            ורק אז מוחקים.
          </div>

          <h2>🏠 דף הבית</h2>
          <p>הכול במסך אחד: <a href="/admin/globals/home-page">דף הבית</a>.</p>
          <ul>
            <li><b>כותרת ראשית</b> — הטקסטים ותמונת הרקע של פתיח האתר.</li>
            <li><b>מיקוד העמותה</b> — הפסקה שאחרי הסרט.</li>
            <li><b>המטרות שלנו — הקרוסלה:</b> כל מטרה היא שקופית. לכל מטרה יש שדה
              <b> תמונה בקרוסלה</b> — מחליפים תמונה בלחיצה, מוסיפים מטרה חדשה בכפתור
              <b> Add / הוסף</b>, מוחקים בתפריט השורה, וגוררים לשינוי הסדר.</li>
            <li><b>קריאה לתרומה</b> — הכותרת והטקסט בתחתית דף הבית.</li>
          </ul>

          <h2>🧭 התפריט</h2>
          <p>
            <a href="/admin/globals/navigation">התפריט</a> — כל פריט הוא שורה: שם, קישור, תיאור
            ותמונה (מופיעים בתפריט המסך המלא). גרירה משנה סדר; הפריט המסומן כמודגש הופך
            לכפתור התרומות הזהוב.
          </p>

          <h2>📞 פרטי קשר, תרומות ופרטי העמותה</h2>
          <p>
            <a href="/admin/globals/site-settings">הגדרות האתר</a> — שם העמותה והתקציר, כתובת,
            דוא״ל, טלפון, וואטסאפ, <b>סכומי התרומה וקישורי Grow</b>, פרטי חשבון הבנק, תרומות
            מחו״ל והערת המס. כל אלה מופיעים אוטומטית בעמוד התרומות, בעמוד צור קשר ובתחתית
            כל עמוד.
          </p>

          <h2>👥 ועד העמותה, המלצות וסרטונים</h2>
          <ul>
            <li><a href="/admin/collections/board-members">ועד העמותה</a> — שם, תפקיד, ביוגרפיה ותמונה לכל חבר/ה.</li>
            <li><a href="/admin/collections/testimonials">המלצות</a> — ציטוטים ומכתבי תודה שמופיעים בעמודי המיזמים.</li>
            <li><a href="/admin/collections/youtube-videos">סרטוני YouTube</a> — מדביקים קישור, והסרטון מופיע בעמוד הסרטונים.</li>
          </ul>

          <h2>✉️ פניות מהאתר</h2>
          <p>
            כל פנייה מטופס יצירת הקשר נשמרת ב<a href="/admin/collections/enquiries">פניות</a>
            {' '}(וגם נשלחת למייל העמותה).
          </p>

          <h2>⚙️ טיפים אחרונים</h2>
          <ul>
            <li><b>שפת המערכת:</b> <a href="/admin/account">החשבון שלי</a> ← Language ← עברית.</li>
            <li><b>משתמש חדש לצוות:</b> <a href="/admin/collections/users">משתמשים</a> ← Create new.</li>
            <li><b>קישורי וויקס ישנים:</b> לכל מיזם/עמוד/כתבה יש שדה "כתובות ישנות" — כתובת ישנה שתוזן שם תפנה אוטומטית לעמוד החדש.</li>
            <li>אחרי כל שינוי — לרענן את האתר אחרי כדקה ולוודא שהכול נראה טוב, בעברית ובאנגלית.</li>
          </ul>
        </div>
      </Gutter>
    </DefaultTemplate>
  )
}
