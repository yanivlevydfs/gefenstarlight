import type { CollectionConfig } from 'payload'
import { slugField, legacyPathsField } from '../fields/slug'

/**
 * Free-form content pages (e.g. "Who is Gefen", the bylaws). The owner can add
 * new ones; they appear at /he/<slug> and can be linked from the menu.
 */
export const Pages: CollectionConfig = {
  slug: 'pages',
  labels: {
    singular: { he: 'עמוד', en: 'Page' },
    plural: { he: 'עמודי תוכן', en: 'Pages' },
  },
  admin: {
    group: { he: 'תוכן', en: 'Content' },
    useAsTitle: 'title',
    defaultColumns: ['title', 'slug', '_status'],
    description: {
      he: 'עמודי תוכן חופשיים. הכתובת נקבעת לפי ה־slug.',
      en: 'Free-form content pages. The URL comes from the slug.',
    },
  },
  access: { read: () => true },
  versions: { drafts: true },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
      localized: true,
      label: { he: 'כותרת', en: 'Title' },
    },
    slugField(),
    legacyPathsField,
    {
      name: 'subtitle',
      type: 'text',
      localized: true,
      label: { he: 'כותרת משנה', en: 'Subtitle' },
    },
    {
      name: 'hero',
      type: 'upload',
      relationTo: 'media',
      label: { he: 'תמונת נושא', en: 'Hero image' },
    },
    {
      name: 'body',
      type: 'richText',
      localized: true,
      label: { he: 'תוכן', en: 'Body' },
    },
    {
      name: 'album',
      type: 'relationship',
      relationTo: 'albums',
      label: { he: 'אלבום תמונות מצורף', en: 'Attached photo album' },
    },
  ],
}
