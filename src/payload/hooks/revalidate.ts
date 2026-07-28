import type { CollectionAfterChangeHook, CollectionAfterDeleteHook, GlobalAfterChangeHook } from 'payload'

/**
 * Clears the cached pages after a change in the admin console.
 *
 * Without this the site waits out its revalidation window, so a newly created
 * album or project is missing from the listing pages for up to two minutes —
 * long enough for the owner to assume saving did not work.
 *
 * `revalidatePath` only exists inside a Next.js request, and the seed script
 * runs outside one, so a failure here is expected there and must not abort the
 * write.
 */
async function purge(): Promise<void> {
  try {
    const { revalidatePath } = await import('next/cache')
    revalidatePath('/', 'layout')
  } catch {
    // Running outside Next (seed, migrations) — nothing to purge.
  }
}

export const revalidateAfterChange: CollectionAfterChangeHook = async ({ doc }) => {
  await purge()
  return doc
}

export const revalidateAfterDelete: CollectionAfterDeleteHook = async ({ doc }) => {
  await purge()
  return doc
}

export const revalidateGlobalAfterChange: GlobalAfterChangeHook = async ({ doc }) => {
  await purge()
  return doc
}
