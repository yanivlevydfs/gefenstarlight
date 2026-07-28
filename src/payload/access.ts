import type { Access } from 'payload'

/**
 * Read access for draft-enabled collections. The public REST/GraphQL API obeys
 * this rule, so without it anyone could fetch half-written drafts with
 * `?draft=true` (or read their `_status: 'draft'` rows directly) before the
 * owner ever publishes them. Logged-in editors still see everything.
 */
export const publishedOnly: Access = ({ req }) =>
  req.user ? true : { _status: { equals: 'published' } }
