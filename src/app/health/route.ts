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

/**
 * Performs a real upload through Payload and returns whatever error it raised.
 *
 * Payload replies to a failed upload with "Something went wrong" and keeps the
 * cause in the server log, which is not reachable from here. Guarded by a token
 * so it cannot be triggered casually; remove once uploads are known good.
 */
const PROBE_TOKEN = 'gefen-upload-probe-2026'

async function probeUpload() {
  try {
    const [{ getPayload }, { default: config }, { default: sharp }] = await Promise.all([
      import('payload'),
      import('@payload-config'),
      import('sharp'),
    ])

    const payload = await getPayload({ config })
    const file = await sharp({
      create: { width: 1200, height: 800, channels: 3, background: '#123456' },
    })
      .jpeg()
      .toBuffer()

    const doc = await payload.create({
      collection: 'media',
      data: { alt: 'upload probe' },
      file: {
        data: file,
        mimetype: 'image/jpeg',
        name: `upload-probe-${Date.now()}.jpg`,
        size: file.length,
      },
    })

    await payload.delete({ collection: 'media', id: doc.id })
    return { ok: true, url: doc.url, sizes: Object.keys(doc.sizes ?? {}) }
  } catch (error) {
    const e = error as Error & { cause?: unknown; data?: unknown }
    return {
      ok: false,
      name: e.name,
      message: e.message?.slice(0, 400),
      cause: e.cause ? String(e.cause).slice(0, 300) : undefined,
      data: e.data ? JSON.stringify(e.data).slice(0, 300) : undefined,
      stack: e.stack?.split('\n').slice(0, 6).join(' | ').slice(0, 700),
    }
  }
}

export async function GET(request: Request) {
  const probe = new URL(request.url).searchParams.get('probe')
  if (probe === PROBE_TOKEN) {
    return NextResponse.json({ uploadProbe: await probeUpload() })
  }

  return handleStatus()
}

async function handleStatus() {
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
