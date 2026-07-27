import type { GlobalConfig } from 'payload'

/** Everything on the home page, editable without touching code. */
export const HomePage: GlobalConfig = {
  slug: 'home-page',
  label: { he: 'דף הבית', en: 'Home page' },
  admin: { group: { he: 'עיצוב האתר', en: 'Site' } },
  access: { read: () => true },
  fields: [
    {
      type: 'collapsible',
      label: { he: 'כותרת ראשית', en: 'Hero' },
      fields: [
        { name: 'heroKicker', type: 'text', localized: true, label: { he: 'שורה עליונה', en: 'Kicker' } },
        {
          name: 'heroTitle',
          type: 'text',
          required: true,
          localized: true,
          label: { he: 'כותרת', en: 'Headline' },
        },
        { name: 'heroLead', type: 'textarea', localized: true, label: { he: 'תקציר', en: 'Lead' } },
        {
          name: 'heroImage',
          type: 'upload',
          relationTo: 'media',
          label: { he: 'תמונת רקע', en: 'Background image' },
        },
      ],
    },
    {
      type: 'collapsible',
      label: { he: 'מיקוד העמותה', en: 'Focus' },
      fields: [
        { name: 'focusTitle', type: 'text', localized: true, label: { he: 'כותרת', en: 'Title' } },
        { name: 'focusBody', type: 'textarea', localized: true, label: { he: 'תוכן', en: 'Body' } },
      ],
    },
    {
      name: 'goals',
      type: 'array',
      label: { he: 'המטרות שלנו', en: 'Our goals' },
      labels: { singular: { he: 'מטרה', en: 'Goal' }, plural: { he: 'מטרות', en: 'Goals' } },
      fields: [
        {
          name: 'title',
          type: 'text',
          required: true,
          localized: true,
          label: { he: 'כותרת', en: 'Title' },
        },
        { name: 'body', type: 'textarea', localized: true, label: { he: 'תיאור', en: 'Body' } },
        {
          name: 'icon',
          type: 'select',
          defaultValue: 'star',
          label: { he: 'סמל', en: 'Icon' },
          options: [
            { value: 'star', label: { he: 'כוכב', en: 'Star' } },
            { value: 'users', label: { he: 'קבוצה', en: 'Group' } },
            { value: 'heart', label: { he: 'לב', en: 'Heart' } },
            { value: 'trophy', label: { he: 'גביע', en: 'Trophy' } },
            { value: 'sparkles', label: { he: 'ניצוצות', en: 'Sparkles' } },
          ],
        },
      ],
    },
    {
      type: 'collapsible',
      label: { he: 'קריאה לתרומה', en: 'Donation call-out' },
      fields: [
        { name: 'ctaTitle', type: 'text', localized: true, label: { he: 'כותרת', en: 'Title' } },
        { name: 'ctaBody', type: 'textarea', localized: true, label: { he: 'תוכן', en: 'Body' } },
        {
          name: 'ctaImage',
          type: 'upload',
          relationTo: 'media',
          label: { he: 'תמונה', en: 'Image' },
        },
      ],
    },
    {
      name: 'featuredAlbum',
      type: 'relationship',
      relationTo: 'albums',
      label: { he: 'אלבום מוצג בדף הבית', en: 'Featured album' },
    },
  ],
}
