import type { RouteNode } from './tech-stack-config'

const SVG_NS = 'http://www.w3.org/2000/svg'

function createPathElement(d: string): SVGPathElement {
  const path = document.createElementNS(SVG_NS, 'path')
  path.setAttribute('d', d)
  return path
}

/** Build a precise circuit path: hub → each node in order */
export function buildCircuitPath(hub: RouteNode, nodes: RouteNode[]): string {
  const points = [hub, ...nodes]
  if (points.length < 2) return ''

  return points
    .map((point, index) => {
      if (index === 0) return `M ${point.x} ${point.y}`
      const prev = points[index - 1]
      const midX = (prev.x + point.x) / 2
      const midY = (prev.y + point.y) / 2
      return `Q ${midX} ${midY} ${point.x} ${point.y}`
    })
    .join(' ')
}

function measurePathLength(d: string): number {
  const svg = document.createElementNS(SVG_NS, 'svg')
  const path = createPathElement(d)
  svg.appendChild(path)
  svg.setAttribute('width', '0')
  svg.setAttribute('height', '0')
  svg.style.position = 'absolute'
  svg.style.visibility = 'hidden'
  svg.style.pointerEvents = 'none'
  document.body.appendChild(svg)
  const length = path.getTotalLength()
  document.body.removeChild(svg)
  return length
}

/** Measure normalized scroll milestones where each segment completes */
export function measureSegmentMilestones(hub: RouteNode, nodes: RouteNode[]): number[] {
  const points = [hub, ...nodes]
  const segmentLengths: number[] = []

  for (let i = 0; i < points.length - 1; i += 1) {
    const segmentD = `M ${points[i].x} ${points[i].y} Q ${(points[i].x + points[i + 1].x) / 2} ${(points[i].y + points[i + 1].y) / 2} ${points[i + 1].x} ${points[i + 1].y}`
    segmentLengths.push(measurePathLength(segmentD))
  }

  const total = segmentLengths.reduce((sum, len) => sum + len, 0)
  if (total <= 0) return nodes.map((_, i) => (i + 1) / nodes.length)

  let cumulative = 0
  return segmentLengths.map((len) => {
    cumulative += len
    return cumulative / total
  })
}

export function getPointOnPath(pathEl: SVGPathElement, progress: number): { x: number; y: number } {
  const length = pathEl.getTotalLength()
  const clamped = Math.max(0, Math.min(1, progress))
  const point = pathEl.getPointAtLength(length * clamped)
  return { x: point.x, y: point.y }
}
