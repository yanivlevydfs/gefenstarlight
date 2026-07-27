import type { CollectionConfig } from 'payload'
import { slugField, legacyPathsField } from '../fields/slug'

/** News / update articles, published at /he/news/<slug>. */
export const Articles: CollectionConfig = {
  slug: 'articles',
  labels: {
    singular: { he: 'כתבה', en: 'Article' },
    plural: { he: 'כתבות ועדכונים', en: 'Articles' },
  },
  admin: {
    group: { he: 'תוכן', en: 'Content' },
    useAsTitle: 'title',
    defaultColumns: ['title', 'publishedAt', '_status'],
    description: {
      he: 'עדכונים וחדשות מהעמותה.',
      en: 'News and updates from the foundation.',
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
      name: 'publishedAt',
      type: 'date',
      required: true,
      label: { he: 'תאריך פרסום', en: 'Published on' },
      admin: { position: 'sidebar', date: { pickerAppearance: 'dayOnly' } },
    },
    {
      name: 'excerpt',
      type: 'textarea',
      localized: true,
      label: { he: 'תקציר', en: 'Excerpt' },
    },
    {
      name: 'cover',
      type: 'upload',
      relationTo: 'media',
      label: { he: 'תמונת נושא', en: 'Cover image' },
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
