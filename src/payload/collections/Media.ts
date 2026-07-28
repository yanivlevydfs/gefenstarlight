import type { CollectionConfig } from 'payload'

import { revalidateAfterChange, revalidateAfterDelete } from '../hooks/revalidate'

/**
 * Every photo and video on the site. Uploads are handled entirely by Payload —
 * it generates the resized variants listed in `imageSizes` on upload.
 */
export const Media: CollectionConfig = {
  slug: 'media',
  labels: {
    singular: { he: 'קובץ מדיה', en: 'Media item' },
    plural: { he: 'מדיה', en: 'Media' },
  },
  admin: {
    group: { he: 'תוכן', en: 'Content' },
    useAsTitle: 'filename',
    description: {
      he: 'תמונות וסרטונים. אפשר לגרור לכאן קבצים כדי להעלות.',
      en: 'Photos and videos. Drag files here to upload.',
    },
  },
  access: {
    read: () => true,
  },
  hooks: { afterChange: [revalidateAfterChange], afterDelete: [revalidateAfterDelete] },
  upload: {
    mimeTypes: ['image/*', 'video/*'],
    focalPoint: true,
    imageSizes: [
      { name: 'thumbnail', width: 480, height: 480, position: 'centre' },
      { name: 'card', width: 900 },
      { name: 'wide', width: 1600 },
      { name: 'full', width: 2400 },
    ],
  },
  fields: [
    {
      name: 'alt',
      type: 'text',
      localized: true,
      label: { he: 'טקסט חלופי (נגישות)', en: 'Alt text (accessibility)' },
      admin: {
        description: {
          he: 'תיאור קצר של התמונה עבור קוראי מסך ומנועי חיפוש.',
          en: 'A short description of the image for screen readers and search engines.',
        },
      },
    },
    {
      name: 'caption',
      type: 'text',
      localized: true,
      label: { he: 'כיתוב', en: 'Caption' },
    },
    {
      name: 'credit',
      type: 'text',
      label: { he: 'קרדיט צילום', en: 'Photo credit' },
    },
    {
      name: 'publicUrl',
      type: 'text',
      admin: { hidden: true },
      label: { he: 'כתובת ציבורית', en: 'Public URL' },
      // Absolute CDN address, recorded at import time. Payload only builds Blob
      // URLs when its storage plugin is active, so a deployment missing the Blob
      // token would otherwise serve image paths that resolve to nothing.
    },
    {
      name: 'publicSizes',
      type: 'json',
      admin: { hidden: true },
      label: { he: 'כתובות הגדלים', en: 'Sized URLs' },
    },
    {
      name: 'sourceFile',
      type: 'text',
      index: true,
      admin: { hidden: true },
      label: { he: 'קובץ מקור', en: 'Source file' },
      // The importer matches on this rather than on `filename`: Payload renames
      // an upload when the name is already taken (foo.jpg -> foo-1.jpg), which
      // made a re-run fail to recognise its own files and upload them twice.
    },
    {
      name: 'poster',
      type: 'upload',
      relationTo: 'media',
      label: { he: 'תמונת פתיחה לסרטון', en: 'Video poster frame' },
      admin: {
        description: {
          he: 'רלוונטי רק לסרטונים — התמונה שתוצג לפני ההפעלה.',
          en: 'Videos only — the still shown before playback starts.',
        },
        condition: (data) => Boolean(data?.mimeType?.startsWith('video/')),
      },
    },
  ],
}
