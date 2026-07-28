import type { CollectionConfig } from 'payload'
import { slugField, legacyPathsField } from '../fields/slug'
import { revalidateAfterChange, revalidateAfterDelete } from '../hooks/revalidate'

/**
 * A project / initiative page. The site owner creates these from the admin
 * console and a page appears at /he/projects/<slug> and /en/projects/<slug>.
 */
export const Projects: CollectionConfig = {
  slug: 'projects',
  labels: {
    singular: { he: 'מיזם', en: 'Project' },
    plural: { he: 'מיזמים', en: 'Projects' },
  },
  admin: {
    group: { he: 'תוכן', en: 'Content' },
    useAsTitle: 'title',
    defaultColumns: ['title', 'date', 'featured', '_status'],
    description: {
      he: 'כל מיזם הופך לעמוד באתר. הוסיפו מיזם חדש בלחיצה על "צור חדש".',
      en: 'Each project becomes its own page. Click “Create new” to add one.',
    },
  },
  access: { read: () => true },
  versions: { drafts: true },
  // Publish immediately instead of waiting out the revalidation window.
  hooks: { afterChange: [revalidateAfterChange], afterDelete: [revalidateAfterDelete] },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
      localized: true,
      label: { he: 'כותרת המיזם', en: 'Project title' },
    },
    slugField(),
    legacyPathsField,
    {
      name: 'date',
      type: 'date',
      required: true,
      label: { he: 'תאריך', en: 'Date' },
      admin: { position: 'sidebar', date: { pickerAppearance: 'dayOnly' } },
    },
    {
      name: 'location',
      type: 'text',
      localized: true,
      label: { he: 'מיקום', en: 'Location' },
      admin: { position: 'sidebar', placeholder: 'פתח תקווה' },
    },
    {
      name: 'featured',
      type: 'checkbox',
      label: { he: 'להציג בדף הבית', en: 'Feature on the home page' },
      admin: { position: 'sidebar' },
    },
    {
      name: 'summary',
      type: 'textarea',
      // Deliberately not required. It is localised, and a required localised
      // field blocks saving the second language until it is filled in — the
      // owner could not add an English title without also writing an English
      // summary. Left empty, the Hebrew text shows through instead.
      localized: true,
      label: { he: 'תקציר', en: 'Summary' },
      admin: {
        description: {
          he: 'משפט או שניים שמופיעים בכרטיס המיזם ברשימת המיזמים.',
          en: 'A sentence or two shown on the project card in the projects list.',
        },
      },
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
      label: { he: 'תוכן העמוד', en: 'Page content' },
    },
    {
      name: 'album',
      type: 'relationship',
      relationTo: 'albums',
      label: { he: 'אלבום תמונות מצורף', en: 'Attached photo album' },
      admin: {
        description: {
          he: 'בחרו אלבום קיים או צרו חדש — התמונות יוצגו בתחתית עמוד המיזם.',
          en: 'Pick or create an album — its photos appear at the bottom of the project page.',
        },
      },
    },
    {
      name: 'quotes',
      type: 'array',
      localized: true,
      label: { he: 'ציטוטים', en: 'Quotes' },
      labels: {
        singular: { he: 'ציטוט', en: 'Quote' },
        plural: { he: 'ציטוטים', en: 'Quotes' },
      },
      fields: [
        {
          name: 'quote',
          type: 'textarea',
          required: true,
          label: { he: 'הציטוט', en: 'Quote' },
        },
        { name: 'author', type: 'text', label: { he: 'מי אמר', en: 'Attribution' } },
      ],
    },
    {
      name: 'ctaUrl',
      type: 'text',
      label: { he: 'קישור לכפתור (אופציונלי)', en: 'Button link (optional)' },
      admin: {
        description: {
          he: 'למשל קישור לרכישת כרטיסים לאירוע.',
          en: 'For example, a ticket-purchase link for an event.',
        },
      },
    },
    {
      name: 'ctaLabel',
      type: 'text',
      localized: true,
      label: { he: 'טקסט הכפתור', en: 'Button label' },
    },
  ],
}
