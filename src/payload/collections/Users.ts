import type { CollectionConfig } from 'payload'

/** Admin console accounts. Payload handles login, sessions and password reset. */
export const Users: CollectionConfig = {
  slug: 'users',
  labels: {
    singular: { he: 'משתמש', en: 'User' },
    plural: { he: 'משתמשים', en: 'Users' },
  },
  admin: {
    group: { he: 'מערכת', en: 'System' },
    useAsTitle: 'email',
  },
  auth: {
    tokenExpiration: 60 * 60 * 12,
    maxLoginAttempts: 8,
    lockTime: 10 * 60 * 1000,
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      label: { he: 'שם', en: 'Name' },
    },
  ],
}
