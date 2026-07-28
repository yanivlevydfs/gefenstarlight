/**
 * Reverses a contact detail before it is handed to the link component.
 *
 * Lives here rather than beside that component because the component is a
 * client module, and a function exported from one cannot be called while
 * rendering on the server.
 *
 * See `components/site/protected-contact.tsx` for why the value has to arrive
 * already reversed.
 */
export function reverseValue(value: string): string {
  return [...value].reverse().join('')
}
