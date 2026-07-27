import type { CollectionConfig } from 'payload'

/** Board members shown on the "About us" page. */
export const BoardMembers: CollectionConfig = {
  slug: 'board-members',
  labels: {
    singular: { he: 'חבר/ת ועד', en: 'Board member' },
    plural: { he: 'ועד העמותה', en: 'Board members' },
  },
  admin: {
    group: { he: 'אודות', en: 'About' },
    useAsTitle: 'name',
    defaultColumns: ['name', 'role', 'order'],
  },
  access: { read: () => true },
  defaultSort: 'order',
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
      localized: true,
      label: { he: 'שם', en: 'Name' },
    },
    {
      name: 'role',
      type: 'text',
      localized: true,
      label: { he: 'תפקיד', en: 'Role' },
    },
    {
      name: 'bio',
      type: 'textarea',
      localized: true,
      label: { he: 'תיאור', en: 'Bio' },
    },
    {
      name: 'photo',
      type: 'upload',
      relationTo: 'media',
      label: { he: 'תמונה', en: 'Photo' },
    },
    {
      name: 'order',
      type: 'number',
      defaultValue: 0,
      label: { he: 'סדר תצוגה', en: 'Display order' },
      admin: { position: 'sidebar' },
    },
  ],
}

/** Letters and thanks from coaches and community centres. */
export const Testimonials: CollectionConfig = {
  slug: 'testimonials',
  labels: {
    singular: { he: 'מכתב תודה', en: 'Testimonial' },
    plural: { he: 'מכתבים ותודות', en: 'Testimonials' },
  },
  admin: {
    group: { he: 'אודות', en: 'About' },
    useAsTitle: 'author',
    defaultColumns: ['author', 'order'],
  },
  access: { read: () => true },
  defaultSort: 'order',
  fields: [
    {
      name: 'quote',
      type: 'textarea',
      required: true,
      localized: true,
      label: { he: 'הציטוט', en: 'Quote' },
    },
    {
      name: 'author',
      type: 'text',
      required: true,
      localized: true,
      label: { he: 'מי כתב', en: 'Author' },
    },
    {
      name: 'role',
      type: 'text',
      localized: true,
      label: { he: 'תפקיד / מקום', en: 'Role / place' },
    },
    {
      name: 'featured',
      type: 'checkbox',
      label: { he: 'להציג בדף הבית', en: 'Feature on the home page' },
      admin: { position: 'sidebar' },
    },
    {
      name: 'order',
      type: 'number',
      defaultValue: 0,
      label: { he: 'סדר תצוגה', en: 'Display order' },
      admin: { position: 'sidebar' },
    },
  ],
}

/** Contact-form submissions, stored so nothing is ever lost. */
export const Enquiries: CollectionConfig = {
  slug: 'enquiries',
  labels: {
    singular: { he: 'פנייה', en: 'Enquiry' },
    plural: { he: 'פניות מהאתר', en: 'Enquiries' },
  },
  admin: {
    group: { he: 'מערכת', en: 'System' },
    useAsTitle: 'name',
    defaultColumns: ['name', 'email', 'createdAt'],
  },
  access: {
    // Anyone may submit the contact form; only logged-in staff may read.
    create: () => true,
    read: ({ req }) => Boolean(req.user),
    update: () => false,
  },
  fields: [
    { name: 'name', type: 'text', required: true, label: { he: 'שם', en: 'Name' } },
    { name: 'email', type: 'email', required: true, label: { he: 'דוא״ל', en: 'Email' } },
    { name: 'phone', type: 'text', label: { he: 'טלפון', en: 'Phone' } },
    { name: 'message', type: 'textarea', required: true, label: { he: 'הודעה', en: 'Message' } },
    { name: 'locale', type: 'text', label: { he: 'שפת הפנייה', en: 'Submitted in' } },
  ],
}
