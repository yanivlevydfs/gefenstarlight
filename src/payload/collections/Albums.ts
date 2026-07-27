import type { CollectionConfig } from 'payload'
import { slugField, legacyPathsField } from '../fields/slug'

/** A photo/video album. This is the single container for gallery media. */
export const Albums: CollectionConfig = {
  slug: 'albums',
  labels: {
    singular: { he: 'אלבום', en: 'Album' },
    plural: { he: 'אלבומים', en: 'Albums' },
  },
  admin: {
    group: { he: 'תוכן', en: 'Content' },
    useAsTitle: 'title',
    defaultColumns: ['title', 'date', 'kind', 'updatedAt'],
    description: {
      he: 'אלבומי תמונות וסרטונים. גררו תמונות לשדה "פריטים" כדי לסדר אותן.',
      en: 'Photo and video albums. Drag items to reorder them.',
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
      label: { he: 'שם האלבום', en: 'Album title' },
    },
    slugField(),
    legacyPathsField,
    {
      name: 'kind',
      type: 'select',
      defaultValue: 'photos',
      label: { he: 'סוג', en: 'Kind' },
      options: [
        { value: 'photos', label: { he: 'תמונות', en: 'Photos' } },
        { value: 'videos', label: { he: 'סרטונים', en: 'Videos' } },
      ],
      admin: { position: 'sidebar' },
    },
    {
      name: 'date',
      type: 'date',
      label: { he: 'תאריך', en: 'Date' },
      admin: { position: 'sidebar', date: { pickerAppearance: 'dayOnly' } },
    },
    {
      name: 'showInGallery',
      type: 'checkbox',
      defaultValue: true,
      label: { he: 'להציג בעמוד הגלריה', en: 'Show on the gallery page' },
      admin: { position: 'sidebar' },
    },
    {
      name: 'description',
      type: 'textarea',
      localized: true,
      label: { he: 'תיאור', en: 'Description' },
    },
    {
      name: 'cover',
      type: 'upload',
      relationTo: 'media',
      label: { he: 'תמונת נושא', en: 'Cover image' },
      admin: {
        description: {
          he: 'אם לא נבחרה תמונה, תוצג הראשונה באלבום.',
          en: 'If left empty, the first item in the album is used.',
        },
      },
    },
    {
      name: 'items',
      type: 'upload',
      relationTo: 'media',
      hasMany: true,
      label: { he: 'פריטים באלבום', en: 'Album items' },
      admin: {
        description: {
          he: 'העלו או בחרו תמונות וסרטונים. הסדר כאן הוא הסדר באתר.',
          en: 'Upload or pick photos and videos. The order here is the order on the site.',
        },
      },
    },
  ],
}
