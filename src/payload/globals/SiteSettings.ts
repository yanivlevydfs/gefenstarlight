import type { GlobalConfig } from 'payload'

/** Organisation details, contact channels and donation options. */
export const SiteSettings: GlobalConfig = {
  slug: 'site-settings',
  label: { he: 'הגדרות האתר', en: 'Site settings' },
  admin: { group: { he: 'עיצוב האתר', en: 'Site' } },
  access: { read: () => true },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: { he: 'כללי', en: 'General' },
          fields: [
            {
              name: 'organisationName',
              type: 'text',
              required: true,
              localized: true,
              label: { he: 'שם העמותה', en: 'Organisation name' },
            },
            {
              name: 'legalName',
              type: 'text',
              localized: true,
              label: { he: 'שם רשמי', en: 'Legal name' },
            },
            {
              name: 'tagline',
              type: 'text',
              localized: true,
              label: { he: 'משפט מלווה', en: 'Tagline' },
            },
            {
              name: 'description',
              type: 'textarea',
              localized: true,
              label: { he: 'תיאור לקידום אתרים', en: 'SEO description' },
            },
            {
              name: 'logo',
              type: 'upload',
              relationTo: 'media',
              label: { he: 'לוגו', en: 'Logo' },
            },
            {
              name: 'shareImage',
              type: 'upload',
              relationTo: 'media',
              label: { he: 'תמונת שיתוף (רשתות חברתיות)', en: 'Social share image' },
            },
          ],
        },
        {
          label: { he: 'יצירת קשר', en: 'Contact' },
          fields: [
            {
              name: 'address',
              type: 'text',
              localized: true,
              label: { he: 'כתובת', en: 'Address' },
            },
            {
              name: 'emails',
              type: 'array',
              label: { he: 'כתובות דוא״ל', en: 'Email addresses' },
              fields: [{ name: 'email', type: 'email', required: true }],
            },
            {
              name: 'phones',
              type: 'array',
              label: { he: 'טלפונים', en: 'Phone numbers' },
              fields: [
                { name: 'number', type: 'text', required: true, label: { he: 'מספר', en: 'Number' } },
                { name: 'label', type: 'text', localized: true, label: { he: 'תיאור', en: 'Label' } },
              ],
            },
            {
              name: 'whatsapp',
              type: 'text',
              label: { he: 'וואטסאפ (בפורמט בינלאומי)', en: 'WhatsApp (international format)' },
              admin: { placeholder: '972544249142' },
            },
          ],
        },
        {
          label: { he: 'תרומות', en: 'Donations' },
          fields: [
            {
              name: 'donationIntro',
              type: 'textarea',
              localized: true,
              label: { he: 'טקסט פתיחה בעמוד התרומות', en: 'Donation page intro' },
            },
            {
              name: 'donationTiers',
              type: 'array',
              label: { he: 'סכומי תרומה', en: 'Donation options' },
              admin: {
                description: {
                  he: 'כל כפתור מקשר לעמוד סליקה מאובטח.',
                  en: 'Each button links to a secure checkout page.',
                },
              },
              fields: [
                {
                  name: 'label',
                  type: 'text',
                  required: true,
                  localized: true,
                  label: { he: 'טקסט הכפתור', en: 'Button label' },
                },
                {
                  name: 'amount',
                  type: 'number',
                  label: { he: 'סכום בש״ח (ריק = סכום חופשי)', en: 'Amount in ILS (blank = open amount)' },
                },
                {
                  name: 'url',
                  type: 'text',
                  required: true,
                  label: { he: 'קישור סליקה', en: 'Checkout link' },
                },
                {
                  name: 'kind',
                  type: 'select',
                  defaultValue: 'oneTime',
                  label: { he: 'סוג', en: 'Kind' },
                  options: [
                    { value: 'oneTime', label: { he: 'תרומה חד־פעמית', en: 'One-time' } },
                    { value: 'monthly', label: { he: 'הוראת קבע', en: 'Monthly' } },
                    { value: 'custom', label: { he: 'סכום חופשי', en: 'Custom amount' } },
                  ],
                },
              ],
            },
            {
              name: 'bank',
              type: 'group',
              label: { he: 'העברה בנקאית (ישראל)', en: 'Bank transfer (Israel)' },
              fields: [
                { name: 'accountName', type: 'text', localized: true, label: { he: 'שם החשבון', en: 'Account name' } },
                { name: 'bankName', type: 'text', localized: true, label: { he: 'בנק', en: 'Bank' } },
                { name: 'branch', type: 'text', label: { he: 'סניף', en: 'Branch' } },
                { name: 'account', type: 'text', label: { he: 'מספר חשבון', en: 'Account number' } },
              ],
            },
            {
              name: 'international',
              type: 'group',
              label: { he: 'העברה מחו״ל', en: 'International transfer' },
              fields: [
                { name: 'beneficiary', type: 'text', label: { he: 'שם המוטב', en: 'Beneficiary' } },
                { name: 'swift', type: 'text', label: 'SWIFT' },
                { name: 'iban', type: 'text', label: 'IBAN' },
              ],
            },
            {
              name: 'taxNote',
              type: 'text',
              localized: true,
              label: { he: 'הערה על קבלה / סעיף 46', en: 'Receipt / tax note' },
            },
          ],
        },
      ],
    },
  ],
}
