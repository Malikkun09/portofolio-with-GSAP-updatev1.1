import { experiences } from '@/data/portfolio'

export interface JourneyMilestone {
  id: string
  year: string
  title: string
  company: string
  description: string
  tags: readonly string[]
  /** Horizontal rail position in viewBox 0–100 */
  x: number
  /** Vertical node position in viewBox 0–100 (one per stacked card) */
  y: number
}

/**
 * Reverse portfolio order (newest first) into chronological journey order.
 * Final order: Learning Phase → Frontend Student → Hackathon → Full Stack
 */
const chronological = [...experiences].reverse()

/** Equal quarters — matches four flex-1 stacked cards. */
const NODE_YS = [12.5, 37.5, 62.5, 87.5] as const

const DESKTOP_RAIL_X = 50
const TABLET_RAIL_X = 50
const MOBILE_RAIL_X = 50

function railPoints(x: number) {
  return [
    { x, y: 6 },
    ...NODE_YS.map((y) => ({ x, y })),
    { x, y: 94 },
  ]
}

export const JOURNEY_MILESTONES: JourneyMilestone[] = chronological.map((exp, index) => {
  const y = NODE_YS[index] ?? NODE_YS[NODE_YS.length - 1]
  return {
    id: `${exp.year}-${exp.title}`.toLowerCase().replace(/[^a-z0-9-]/g, '-'),
    year: exp.year,
    title: exp.title,
    company: exp.company,
    description: exp.description,
    tags: exp.tags,
    x: DESKTOP_RAIL_X,
    y,
  }
})

export const JOURNEY_STEP_COUNT = JOURNEY_MILESTONES.length

/** Desktop — vertical rail on the left of the stacked cards */
export const JOURNEY_PATH_POINTS = railPoints(DESKTOP_RAIL_X)

/** Tablet — same vertical timeline, rail nudged for the narrower stage */
export const JOURNEY_PATH_POINTS_TABLET = railPoints(TABLET_RAIL_X)

/** Mobile — vertical rail beside full-width cards */
export const JOURNEY_PATH_POINTS_MOBILE = railPoints(MOBILE_RAIL_X)

/** Build a smooth path through waypoints using quadratic curves */
export function buildJourneyPath(points: { x: number; y: number }[]): string {
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
