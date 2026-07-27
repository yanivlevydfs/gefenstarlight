import type { Field } from 'payload'

/** Turn any Hebrew/English title into a clean, URL-safe slug. */
export function slugify(input: string): string {
  return input
    .normalize('NFKD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .trim()
    .replace(/['"׳״]/g, '')
    .replace(/[^a-z0-9֐-׿]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

/**
 * A URL slug that fills itself in from `sourceField` when left blank, so the
 * site owner never has to think about it — but can still override it.
 */
export const slugField = (sourceField = 'title'): Field => ({
  name: 'slug',
  type: 'text',
  unique: true,
  index: true,
  label: { he: 'כתובת בקישור (slug)', en: 'URL slug' },
  admin: {
    position: 'sidebar',
    description: {
      he: 'נוצר אוטומטית מהכותרת. אפשר לערוך, אבל שינוי ישבור קישורים קיימים.',
      en: 'Generated from the title. You can edit it, but changing it breaks existing links.',
    },
  },
  hooks: {
    beforeValidate: [
      ({ value, data }) => {
        if (typeof value === 'string' && value.trim()) return slugify(value)
        const source = (data as Record<string, unknown> | undefined)?.[sourceField]
        return typeof source === 'string' && source.trim() ? slugify(source) : value
      },
    ],
  },
})

/**
 * Old Wix URLs that should permanently redirect to this document. Seeded with
 * the historical paths; the owner can add more if a link ever changes.
 */
export const legacyPathsField: Field = {
  name: 'legacyPaths',
  type: 'array',
  label: { he: 'כתובות ישנות (הפניה אוטומטית)', en: 'Legacy URLs (auto-redirect)' },
  admin: {
    position: 'sidebar',
    description: {
      he: 'כתובות מהאתר הישן שיפנו אוטומטית לעמוד הזה, למשל /פרויקט-1',
      en: 'Paths from the old site that will redirect here, e.g. /project-1',
    },
    initCollapsed: true,
  },
  fields: [
    {
      name: 'path',
      type: 'text',
      required: true,
      label: { he: 'נתיב', en: 'Path' },
    },
  ],
}
