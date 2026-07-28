/**
 * A faint watermark of vine leaves, grapes and tendrils behind every page —
 * Gefen means grapevine. Drawn once as an SVG pattern and fixed to the
 * viewport; it inherits the starlight gold, so it deepens to bronze in the
 * light theme and glows softly on the night sky in the dark one. Sections
 * that paint their own background sit above it, exactly like a paper
 * watermark.
 */
export function VineBackdrop() {
  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 -z-10 text-star-500 opacity-[0.055]"
    >
      <svg className="size-full" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern id="vine-tile" width="300" height="340" patternUnits="userSpaceOnUse">
            {/* Large vine leaf */}
            <g transform="translate(78 92) rotate(-14)" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M0,-48 C10,-40 20,-42 26,-33 C37,-37 45,-28 42,-18 C52,-13 52,0 43,4 C47,15 38,25 27,22 C25,33 13,39 5,32 C3,42 -3,42 -5,32 C-13,39 -25,33 -27,22 C-38,25 -47,15 -43,4 C-52,0 -52,-13 -42,-18 C-45,-28 -37,-37 -26,-33 C-20,-42 -10,-40 0,-48 Z" />
              <path d="M0,-42 L0,30 M0,-8 L-22,10 M0,-8 L22,10 M0,-26 L-14,-14 M0,-26 L14,-14" strokeWidth="1.5" />
              <path d="M0,30 C2,40 -2,46 -6,50" strokeWidth="2" />
            </g>

            {/* Bunch of grapes with stem */}
            <g transform="translate(212 232) rotate(8)" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M0,-34 C4,-28 2,-22 0,-18 M0,-34 C-8,-36 -14,-42 -14,-48" />
              <circle cx="-13" cy="-8" r="7.5" />
              <circle cx="0" cy="-10" r="7.5" />
              <circle cx="13" cy="-8" r="7.5" />
              <circle cx="-7" cy="4" r="7.5" />
              <circle cx="7" cy="4" r="7.5" />
              <circle cx="0" cy="17" r="7.5" />
            </g>

            {/* Small leaf */}
            <g transform="translate(224 66) rotate(22) scale(0.55)" fill="none" stroke="currentColor" strokeWidth="3">
              <path d="M0,-48 C10,-40 20,-42 26,-33 C37,-37 45,-28 42,-18 C52,-13 52,0 43,4 C47,15 38,25 27,22 C25,33 13,39 5,32 C3,42 -3,42 -5,32 C-13,39 -25,33 -27,22 C-38,25 -47,15 -43,4 C-52,0 -52,-13 -42,-18 C-45,-28 -37,-37 -26,-33 C-20,-42 -10,-40 0,-48 Z" />
              <path d="M0,-42 L0,30 M0,-8 L-22,10 M0,-8 L22,10" strokeWidth="2" />
            </g>

            {/* Curling tendril */}
            <path
              transform="translate(64 268)"
              d="M-20,10 C-6,-6 16,-12 32,-2 C44,6 42,22 30,24 C21,25 16,16 22,10 C26,6 32,8 33,13"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#vine-tile)" />
      </svg>
    </div>
  )
}
