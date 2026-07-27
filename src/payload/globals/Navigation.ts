import type { GlobalConfig } from 'payload'

/**
 * The main menu. Every entry carries its own artwork, which the mega-menu
 * renders as a picture tile — so "menu graphics" are editable, not hard-coded.
 */
export const Navigation: GlobalConfig = {
  slug: 'navigation',
  label: { he: 'תפריט ראשי', en: 'Main menu' },
  admin: {
    group: { he: 'עיצוב האתר', en: 'Site' },
    description: {
      he: 'סדר הפריטים כאן הוא הסדר בתפריט. לכל פריט אפשר לצרף תמונה שתוצג בתפריט.',
      en: 'The order here is the order in the menu. Each item can carry an image shown in the menu.',
    },
  },
  access: { read: () => true },
  fields: [
    {
      name: 'items',
      type: 'array',
      label: { he: 'פריטי תפריט', en: 'Menu items' },
      labels: {
        singular: { he: 'פריט', en: 'Item' },
        plural: { he: 'פריטים', en: 'Items' },
      },
      fields: [
        {
          name: 'label',
          type: 'text',
          required: true,
          localized: true,
          label: { he: 'שם הפריט', en: 'Label' },
        },
        {
          name: 'href',
          type: 'text',
          required: true,
          label: { he: 'קישור', en: 'Link' },
          admin: {
            description: {
              he: 'נתיב יחסי ללא קידומת שפה, למשל /projects או /gallery',
              en: 'A relative path without the locale prefix, e.g. /projects or /gallery',
            },
          },
        },
        {
          name: 'description',
          type: 'text',
          localized: true,
          label: { he: 'תיאור קצר', en: 'Short description' },
        },
        {
          name: 'image',
          type: 'upload',
          relationTo: 'media',
          label: { he: 'תמונת תפריט', en: 'Menu artwork' },
        },
        {
          name: 'highlight',
          type: 'checkbox',
          label: { he: 'להדגיש (כפתור תרומה)', en: 'Highlight (donate button)' },
        },
      ],
    },
    {
      name: 'footerNote',
      type: 'text',
      localized: true,
      label: { he: 'שורת תחתית', en: 'Footer note' },
    },
  ],
}
