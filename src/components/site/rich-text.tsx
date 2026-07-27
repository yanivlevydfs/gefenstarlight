import { RichText as LexicalRichText } from '@payloadcms/richtext-lexical/react'
import type { SerializedEditorState } from '@payloadcms/richtext-lexical/lexical'

/**
 * Renders a Lexical field from the CMS. Styling is applied through the wrapper
 * so editors never have to think about classes.
 */
export function RichText({ data, className }: { data: unknown; className?: string }) {
  if (!data || typeof data !== 'object') return null

  return (
    <div
      className={[
        'space-y-5 text-lg leading-relaxed text-cream-50/80',
        '[&_h2]:mt-12 [&_h2]:mb-3 [&_h2]:text-2xl [&_h2]:text-star-300',
        '[&_h3]:mt-8 [&_h3]:mb-2 [&_h3]:text-xl [&_h3]:text-star-300',
        '[&_a]:text-star-300 [&_a]:underline [&_a]:underline-offset-4 hover:[&_a]:text-star-200',
        '[&_ul]:list-disc [&_ul]:space-y-2 [&_ul]:ps-6',
        '[&_ol]:list-decimal [&_ol]:space-y-2 [&_ol]:ps-6',
        '[&_blockquote]:border-s-2 [&_blockquote]:border-star-400/60 [&_blockquote]:ps-5 [&_blockquote]:italic',
        className ?? '',
      ].join(' ')}
    >
      <LexicalRichText data={data as SerializedEditorState} />
    </div>
  )
}
