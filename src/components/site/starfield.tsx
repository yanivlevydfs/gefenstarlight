/**
 * Decorative starfield behind the hero. Positions are deterministic so the
 * server and client render identically, and it is hidden from assistive tech.
 */
const STARS = Array.from({ length: 44 }, (_, i) => {
  // A cheap deterministic hash keeps the layout stable between renders.
  const a = Math.sin(i * 12.9898) * 43758.5453
  const b = Math.sin(i * 78.233) * 12345.6789
  return {
    left: ((a - Math.floor(a)) * 100).toFixed(3),
    top: ((b - Math.floor(b)) * 100).toFixed(3),
    size: (i % 3) + 1,
    delay: ((i * 37) % 40) / 10,
  }
})

export function Starfield() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
      {STARS.map((star, i) => (
        <span
          key={i}
          className="absolute animate-twinkle rounded-full bg-star-200"
          style={{
            left: `${star.left}%`,
            top: `${star.top}%`,
            width: star.size,
            height: star.size,
            animationDelay: `${star.delay}s`,
          }}
        />
      ))}
    </div>
  )
}
