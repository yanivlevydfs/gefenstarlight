export {}

const { getPayload } = await import('payload')
const { default: config } = await import('../payload.config.js')

const payload = await getPayload({ config })

const { docs, totalDocs } = await payload.find({ collection: 'media', limit: 5, depth: 0 })
console.log('total media:', totalDocs)

for (const doc of docs) {
  console.log(`\nfilename: ${doc.filename}`)
  console.log(`  url:   ${doc.url}`)
  console.log(`  thumb: ${doc.sizes?.thumbnail?.url}`)
  console.log(`  card:  ${doc.sizes?.card?.url}`)
}

// Are the URLs actually reachable?
const target = docs[0]?.sizes?.card?.url ?? docs[0]?.url
if (target?.startsWith('http')) {
  const res = await fetch(target, { method: 'HEAD' })
  console.log(`\nfetch ${res.status} ${res.headers.get('content-type')} ${res.headers.get('content-length')}B`)
} else {
  console.log('\nURL is relative — Payload is still proxying instead of using the CDN')
}

process.exit(0)
