/**
 * Emits structured data for search engines.
 *
 * The payload is serialised with `<` escaped so a stray character in CMS text
 * can never break out of the script tag.
 */
export function JsonLd({ data }: { data: Record<string, unknown> | Record<string, unknown>[] }) {
  const json = JSON.stringify(data, (_key, value) => value ?? undefined).replace(/</g, '\\u003c')

  return (
    <script
      type="application/ld+json"
      // The content is generated here, not supplied by a visitor.
      dangerouslySetInnerHTML={{ __html: json }}
    />
  )
}
