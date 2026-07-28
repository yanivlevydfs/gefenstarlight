import { del, head, put } from '@vercel/blob'
import { cloudStoragePlugin } from '@payloadcms/plugin-cloud-storage'
import type { Adapter, GeneratedAdapter } from '@payloadcms/plugin-cloud-storage/types'
import type { Plugin, UploadCollectionSlug } from 'payload'

/**
 * Vercel Blob storage for Payload uploads.
 *
 * This exists instead of `@payloadcms/storage-vercel-blob` because that adapter
 * passes the upload straight through as a Node `Buffer`. Node allocates small
 * buffers from a shared pool, and Vercel's runtime refuses such a view as a
 * fetch body — every upload failed with "ArrayBuffer: SharedArrayBuffer is not
 * allowed", surfaced to the admin console as "Something went wrong".
 *
 * Copying the bytes into a standalone `Uint8Array` before the request removes
 * the shared backing store and the upload succeeds. Verified against the
 * deployed runtime: a pooled Buffer is rejected, a detached copy is accepted.
 */
function detach(buffer: Buffer, type: string): Blob {
  const copy = new Uint8Array(buffer.byteLength)
  copy.set(buffer)
  return new Blob([copy], { type })
}

const CACHE_MAX_AGE = 365 * 24 * 60 * 60

function blobBaseUrl(token: string): string | null {
  // A read/write token looks like vercel_blob_rw_<storeId>_<secret>; the public
  // host is derived from the store id. A malformed token returns null instead
  // of throwing — this runs at config import, and a crash here would take down
  // every page and the admin console, not just uploads.
  const storeId = token.split('_')[3]
  if (!/^[a-z0-9]+$/i.test(storeId ?? '')) return null
  return `https://${storeId.toLowerCase()}.public.blob.vercel-storage.com`
}

function createAdapter(token: string, base: string): Adapter {
  return (): GeneratedAdapter => {
    const keyFor = (filename: string, prefix?: string) =>
      prefix ? `${prefix.replace(/\/$/, '')}/${filename}` : filename

    return {
      name: 'vercel-blob',

      generateURL: ({ filename, prefix }) => `${base}/${keyFor(filename, prefix)}`,

      handleUpload: async ({ data, file }) => {
        await put(keyFor(file.filename, data?.prefix), detach(file.buffer, file.mimeType), {
          access: 'public',
          addRandomSuffix: false,
          allowOverwrite: true,
          cacheControlMaxAge: CACHE_MAX_AGE,
          contentType: file.mimeType,
          token,
        })
        return data
      },

      handleDelete: async ({ doc, filename }) => {
        const prefix = (doc as { prefix?: string })?.prefix
        try {
          await del(`${base}/${keyFor(filename, prefix)}`, { token })
        } catch {
          // Already gone, or never written — deleting the document should still
          // succeed rather than leave an unremovable record behind.
        }
      },

      // Files are public, so the browser fetches them from the CDN directly.
      // This only runs if something requests them through Payload.
      staticHandler: async (_req, { params }) => {
        const url = `${base}/${keyFor(params.filename, params.prefix)}`
        try {
          const meta = await head(url, { token })
          const upstream = await fetch(meta.url)
          return new Response(upstream.body, {
            status: upstream.status,
            headers: {
              'Content-Type': meta.contentType ?? 'application/octet-stream',
              'Cache-Control': `public, max-age=${CACHE_MAX_AGE}, immutable`,
            },
          })
        } catch {
          return new Response('Not found', { status: 404 })
        }
      },
    }
  }
}

/** Enables Blob storage for the given upload collections. */
export function vercelBlobStorage({
  collections,
  token,
}: {
  collections: Partial<Record<UploadCollectionSlug, true>>
  token: string
}): Plugin {
  const base = blobBaseUrl(token)
  if (!base) {
    console.error(
      '[storage] BLOB_READ_WRITE_TOKEN does not look like a Blob token — storage stays off, uploads will be served locally.',
    )
    return (config) => config
  }

  return cloudStoragePlugin({
    collections: Object.fromEntries(
      Object.keys(collections).map((slug) => [
        slug,
        { adapter: createAdapter(token, base), disablePayloadAccessControl: true },
      ]),
    ),
  })
}
