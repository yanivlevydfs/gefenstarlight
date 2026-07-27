/**
 * Minimal helpers for producing Lexical editor state from plain text, so the
 * seed script can write rich-text fields without a browser.
 */

type Direction = 'ltr' | 'rtl'

function textNode(text: string) {
  return {
    type: 'text',
    detail: 0,
    format: 0,
    mode: 'normal',
    style: '',
    text,
    version: 1,
  }
}

function paragraph(text: string, direction: Direction) {
  return {
    type: 'paragraph',
    children: [textNode(text)],
    direction,
    format: '',
    indent: 0,
    textFormat: 0,
    textStyle: '',
    version: 1,
  }
}

function heading(text: string, direction: Direction, tag: 'h2' | 'h3' = 'h2') {
  return {
    type: 'heading',
    tag,
    children: [textNode(text)],
    direction,
    format: '',
    indent: 0,
    version: 1,
  }
}

/** Build a Lexical document from an array of paragraphs. */
export function toLexical(paragraphs: string[], direction: Direction = 'rtl') {
  const children = paragraphs
    .map((p) => p.trim())
    .filter(Boolean)
    .map((p) =>
      // Short lines ending in a colon are the section titles in these documents.
      p.length < 60 && /:$/.test(p) ? heading(p, direction) : paragraph(p, direction),
    )

  return {
    root: {
      type: 'root',
      children: children.length > 0 ? children : [paragraph('', direction)],
      direction,
      format: '',
      indent: 0,
      version: 1,
    },
  }
}
