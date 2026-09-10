interface PathPoint {
  x: number
  y: number
}

/**
 * Map waypoint coordinates to normalized positions (0–1) along an SVG path
 * by sampling the rendered path length and finding the closest point.
 */
export function resolveClosestPathProgresses(
  pathEl: SVGPathElement | null,
  totalLength: number,
  waypoints: ReadonlyArray<PathPoint>,
  fallbackCount: number,
  samples = 200,
): number[] {
  const fallback = () =>
    Array.from({ length: fallbackCount }, (_, i) => (i + 1) / (fallbackCount + 1))

  if (!pathEl || totalLength <= 0) return fallback()

  const sampled: { x: number; y: number; t: number }[] = []
  for (let i = 0; i <= samples; i++) {
    const t = i / samples
    const point = pathEl.getPointAtLength(totalLength * t)
    sampled.push({ x: point.x, y: point.y, t })
  }

  return waypoints.map((waypoint) => {
    let bestT = 0
    let bestDist = Infinity
    for (const sample of sampled) {
      const dx = sample.x - waypoint.x
      const dy = sample.y - waypoint.y
      const dist = dx * dx + dy * dy
      if (dist < bestDist) {
        bestDist = dist
        bestT = sample.t
      }
    }
    return bestT
  })
}
