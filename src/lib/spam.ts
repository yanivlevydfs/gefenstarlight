import { createHash } from 'node:crypto'

/**
 * Spam defences for the contact form.
 *
 * No third-party service and no puzzle for the visitor. The checks are layered
 * so that a bot has to defeat all of them, while a person filling in the form
 * normally trips none:
 *
 *  1. A hidden field no person can see, but form-fillers populate.
 *  2. The time taken to fill the form in — bots submit instantly.
 *  3. A limit on submissions from one sender within a short window.
 *  4. Heuristics on the message itself: links, shouting, known spam wording.
 *
 * Everything happens on the server, so none of it can be bypassed by editing
 * the page.
 */

/** Minimum time a person plausibly needs to complete the form. */
const MIN_FILL_MS = 3_000

/** Beyond this the token is stale and probably replayed. */
const MAX_FILL_MS = 6 * 60 * 60 * 1000

/** How many submissions one sender may make, and over what period. */
export const RATE_LIMIT = { max: 3, windowMs: 15 * 60 * 1000 }

/** Anything at or above this is refused outright. */
const REJECT_AT = 5

function secret(): string {
  return process.env.PAYLOAD_SECRET || process.env.POSTGRES_URL || 'gefen-fallback'
}

/**
 * A stable, non-reversible identifier for a sender. The raw IP address is never
 * stored — only this hash, which is enough to count repeat submissions.
 */
export function senderKey(ip: string | null): string {
  return createHash('sha256')
    .update(`gefen-sender:${ip ?? 'unknown'}:${secret()}`)
    .digest('hex')
    .slice(0, 32)
}

/**
 * A signed timestamp planted in the form when it is rendered, so the server can
 * tell how long the visitor spent on it without trusting the browser.
 */
export function issueFormToken(now = Date.now()): string {
  const signature = createHash('sha256').update(`${now}:${secret()}`).digest('hex').slice(0, 16)
  return `${now}.${signature}`
}

export function readFormToken(token: string | null): { ageMs: number; valid: boolean } {
  if (!token) return { ageMs: 0, valid: false }

  const [issuedAt, signature] = token.split('.')
  const expected = createHash('sha256').update(`${issuedAt}:${secret()}`).digest('hex').slice(0, 16)
  if (!issuedAt || signature !== expected) return { ageMs: 0, valid: false }

  return { ageMs: Date.now() - Number(issuedAt), valid: true }
}

const SPAM_PHRASES = [
  'seo service',
  'backlink',
  'crypto',
  'bitcoin',
  'casino',
  'viagra',
  'cialis',
  'loan offer',
  'make money',
  'work from home',
  'click here now',
  'buy now',
  'increase traffic',
  'rank #1',
  'guest post',
  'telegram.me',
  'bit.ly',
]

export type SpamAssessment = {
  score: number
  reasons: string[]
  reject: boolean
}

/**
 * Scores a submission. Each signal is worth points; a person writing a genuine
 * message in Hebrew or English scores zero.
 */
export function assessSubmission({
  name,
  email,
  message,
  honeypot,
  token,
  recentFromSender,
}: {
  name: string
  email: string
  message: string
  honeypot?: string
  token: string | null
  recentFromSender: number
}): SpamAssessment {
  const reasons: string[] = []
  let score = 0

  // 1. Hidden field. Only automation fills this in.
  if (honeypot) {
    score += 10
    reasons.push('hidden field completed')
  }

  // 2. How long the form was open.
  const { ageMs, valid } = readFormToken(token)
  if (!valid) {
    score += 3
    reasons.push('missing or altered form token')
  } else if (ageMs < MIN_FILL_MS) {
    score += 5
    reasons.push(`submitted after ${Math.round(ageMs)}ms`)
  } else if (ageMs > MAX_FILL_MS) {
    score += 2
    reasons.push('form token expired')
  }

  // 3. Too many attempts from the same sender.
  if (recentFromSender >= RATE_LIMIT.max) {
    score += 10
    reasons.push(`${recentFromSender} submissions in the last ${RATE_LIMIT.windowMs / 60000} minutes`)
  }

  // 4. What the message looks like.
  const body = `${name} ${message}`.toLowerCase()

  const links = (message.match(/https?:\/\/|www\.|\[url|<a\s/gi) ?? []).length
  if (links >= 3) {
    score += 4
    reasons.push(`${links} links`)
  } else if (links > 0) {
    score += 1
    reasons.push('contains a link')
  }

  const matched = SPAM_PHRASES.filter((phrase) => body.includes(phrase))
  if (matched.length) {
    score += 3 * matched.length
    reasons.push(`spam wording: ${matched.slice(0, 3).join(', ')}`)
  }

  // A message with no letters of any alphabet is not a message.
  if (!/[\p{Letter}]{4}/u.test(message)) {
    score += 3
    reasons.push('no readable words')
  }

  // Shouting, ignoring short messages where caps are normal.
  const letters = message.replace(/[^A-Za-z]/g, '')
  if (letters.length > 25) {
    const upper = (message.match(/[A-Z]/g) ?? []).length / letters.length
    if (upper > 0.7) {
      score += 2
      reasons.push('mostly capital letters')
    }
  }

  // Cyrillic or CJK in a Hebrew/English form is a strong signal.
  if (/[\p{Script=Cyrillic}\p{Script=Han}]{4}/u.test(message)) {
    score += 4
    reasons.push('unexpected script')
  }

  // A name that is really a URL.
  if (/https?:\/\/|www\./i.test(name)) {
    score += 4
    reasons.push('link in the name')
  }

  // Disposable address domains.
  if (/@(mailinator|guerrillamail|10minutemail|tempmail|yopmail|trashmail)\./i.test(email)) {
    score += 4
    reasons.push('disposable email address')
  }

  return { score, reasons, reject: score >= REJECT_AT }
}
