import { NextResponse } from 'next/server'

/**
 * Reports which pieces of configuration the running deployment can see.
 *
 * Only booleans and harmless prefixes are returned — never a secret — so it is
 * safe to leave public. It exists because a missing environment variable is
 * otherwise invisible: the site looks fine but uploads fail and images vanish.
 */
export const dynamic = 'force-dynamic'

/**
 * Uploads need sharp to build the resized variants. If it cannot load, or
 * cannot run, every upload fails with an unhelpful "Something went wrong".
 */
async function checkImageProcessing() {
  try {
    const { default: sharp } = await import('sharp')
    const png = await sharp({
      create: { width: 8, height: 8, channels: 3, background: '#000000' },
    })
      .png()
      .toBuffer()
    const meta = await sharp(png).metadata()
    return { ok: true, format: meta.format, width: meta.width }
  } catch (error) {
    return { ok: false, error: (error as Error).message.slice(0, 200) }
  }
}

export async function GET() {
  const blobToken = process.env.BLOB_READ_WRITE_TOKEN
  const databaseUrl =
    process.env.DATABASE_URI || process.env.POSTGRES_URL || process.env.DATABASE_URL

  const imageProcessing = await checkImageProcessing()

  return NextResponse.json({
    imageProcessing,
    ok: true,
    checkedAt: new Date().toISOString(),
    config: {
      payloadSecret: Boolean(process.env.PAYLOAD_SECRET),
      database: databaseUrl ? (databaseUrl.startsWith('postgres') ? 'postgres' : 'sqlite') : 'none',
      blobStorage: Boolean(blobToken),
      // The store id is public — it appears in every image URL.
      blobStore: blobToken ? blobToken.split('_').slice(0, 4).join('_') : null,
      siteUrl: process.env.NEXT_PUBLIC_SITE_URL ?? null,
    },
    hint: blobToken
      ? 'Uploads are configured.'
      : 'BLOB_READ_WRITE_TOKEN is missing — uploading a new file will fail.',
  })
}
