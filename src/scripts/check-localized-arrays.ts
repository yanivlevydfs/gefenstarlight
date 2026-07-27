/**
 * Reports whether localized fields inside array fields survived in both
 * languages. Updating an array in a second locale without re-sending each row's
 * id makes Payload treat them as new rows, dropping the first locale's text.
 */
export {}

const { getPayload } = await import('payload')
const { default: config } = await import('../payload.config.js')

const payload = await getPayload({ config })

for (const locale of ['he', 'en'] as const) {
  const home = await payload.findGlobal({ slug: 'home-page', locale, depth: 0 })
  const nav = await payload.findGlobal({ slug: 'navigation', locale, depth: 0 })
  const settings = await payload.findGlobal({ slug: 'site-settings', locale, depth: 0 })

  console.log(`\n===== ${locale} =====`)
  console.log('goals:', home.goals?.length ?? 0)
  for (const goal of home.goals ?? []) {
    console.log(`   id=${goal.id} icon=${goal.icon} title=${JSON.stringify(goal.title)}`)
  }
  console.log('nav items:', nav.items?.length ?? 0)
  for (const item of (nav.items ?? []).slice(0, 3)) {
    console.log(`   id=${item.id} href=${item.href} label=${JSON.stringify(item.label)}`)
  }
  console.log('donation tiers:', settings.donationTiers?.length ?? 0)
  for (const tier of (settings.donationTiers ?? []).slice(0, 3)) {
    console.log(`   id=${tier.id} amount=${tier.amount} label=${JSON.stringify(tier.label)}`)
  }
}

process.exit(0)
