import type { CollectionConfig } from 'payload'

import { revalidateAfterChange, revalidateAfterDelete } from '../hooks/revalidate'

/**
 * Extracts the video id from any YouTube address the owner might paste:
 * watch?v=, youtu.be/, shorts/, live/ or embed/ links, with or without extra
 * query parameters.
 */
export function youtubeId(url: string): string | null {
  const match = url.match(
    /(?:youtube\.com\/(?:watch\?(?:.*&)?v=|shorts\/|live\/|embed\/)|youtu\.be\/)([\w-]{11})/,
  )
  return match?.[1] ?? null
}

/**
 * Videos hosted on YouTube rather than uploaded here. Vercel caps uploads
 * through the admin console at ~4.5 MB, which no real video fits — YouTube
 * carries the large files (and its player picks the right quality), while the
 * site embeds them on the videos page.
 */
export const YouTubeVideos: CollectionConfig = {
  slug: 'youtube-videos',
  labels: {
    singular: { he: 'סרטון יוטיוב', en: 'YouTube video' },
    plural: { he: 'סרטוני יוטיוב', en: 'YouTube videos' },
  },
  admin: {
    group: { he: 'תוכן', en: 'Content' },
    useAsTitle: 'title',
    defaultColumns: ['title', 'url', 'date'],
    description: {
      he: 'סרטונים גדולים מדי להעלאה ישירה — העלו אותם ליוטיוב והדביקו כאן את הקישור.',
      en: 'Videos too large to upload directly — put them on YouTube and paste the link here.',
    },
  },
  access: { read: () => true },
  hooks: { afterChange: [revalidateAfterChange], afterDelete: [revalidateAfterDelete] },
  defaultSort: '-date',
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
      localized: true,
      label: { he: 'כותרת', en: 'Title' },
    },
    {
      name: 'url',
      type: 'text',
      required: true,
      label: { he: 'קישור ליוטיוב', en: 'YouTube link' },
      admin: { placeholder: 'https://www.youtube.com/watch?v=…' },
      validate: (value: string | null | undefined) =>
        value && youtubeId(value)
          ? true
          : 'צריך קישור יוטיוב מלא, למשל https://youtu.be/xxxx / A full YouTube link is required',
    },
    {
      name: 'date',
      type: 'date',
      label: { he: 'תאריך', en: 'Date' },
      admin: { position: 'sidebar', description: { he: 'לסידור הרשימה', en: 'Used for ordering' } },
    },
  ],
}
