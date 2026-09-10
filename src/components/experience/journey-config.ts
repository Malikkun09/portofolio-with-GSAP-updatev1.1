import { experiences } from '@/data/portfolio'

export interface JourneyMilestone {
  id: string
  year: string
  title: string
  company: string
  description: string
  tags: readonly string[]
  /** Horizontal anchor in viewBox 0–100 */
  x: number
  /** Vertical anchor */
  y: number
  /** Card sits above (true) or below (false) the path */
  row: 'top' | 'bottom'
}

/**
 * Reverse portfolio order (newest first) into chronological journey order.
 * Final order: Learning Phase → Frontend Student → Hackathon → Full Stack
 */
const chronological = [...experiences].reverse()

/**
 * Desktop anchors — right-to-left rising career path.
 * Learning starts bottom-right; Full Stack lands top-left.
 */
const desktopAnchors = [
  { x: 84, y: 76, row: 'bottom' as const },
  { x: 61, y: 24, row: 'top' as const },
  { x: 39, y: 76, row: 'bottom' as const },
  { x: 16, y: 24, row: 'top' as const },
]

/** Tablet anchors — same R→L ascent, slightly tighter */
const tabletAnchors = [
  { x: 82, y: 72, row: 'bottom' as const },
  { x: 60, y: 28, row: 'top' as const },
  { x: 40, y: 72, row: 'bottom' as const },
  { x: 18, y: 28, row: 'top' as const },
]

/**
 * Mobile anchors — horizontal R→L zig-zag with room for larger cards.
 * Centers stay inside 22–78% so 40%-wide cards do not clip the viewport.
 */
const mobileAnchors = [
  { x: 76, y: 70, row: 'bottom' as const },
  { x: 58, y: 28, row: 'top' as const },
  { x: 40, y: 70, row: 'bottom' as const },
  { x: 22, y: 28, row: 'top' as const },
]

export const JOURNEY_MILESTONES: JourneyMilestone[] = chronological.map((exp, index) => {
  const anchor = desktopAnchors[index] ?? desktopAnchors[desktopAnchors.length - 1]
  return {
    id: `${exp.year}-${exp.title}`.toLowerCase().replace(/[^a-z0-9-]/g, '-'),
    year: exp.year,
    title: exp.title,
    company: exp.company,
    description: exp.description,
    tags: exp.tags,
    x: anchor.x,
    y: anchor.y,
    row: anchor.row,
  }
})

export const JOURNEY_STEP_COUNT = JOURNEY_MILESTONES.length

/** Pixel stroke weights (paths use non-scaling-stroke) */
export const JOURNEY_STROKE = {
  bg: 2.6,
  active: 3.6,
} as const

/** Node radii in viewBox units */
export const JOURNEY_NODE = {
  ring: 1.85,
  dot: 0.72,
  stroke: 0.38,
} as const

/**
 * Desktop path waypoints: enter bottom-right → each milestone → exit top-left
 */
export const JOURNEY_PATH_POINTS = [
  { x: 106, y: 90 },
  ...JOURNEY_MILESTONES.map((m) => ({ x: m.x, y: m.y })),
  { x: -6, y: 12 },
]

/**
 * Tablet path waypoints — gentler R→L ascent
 */
export const JOURNEY_PATH_POINTS_TABLET = [
  { x: 106, y: 88 },
  ...JOURNEY_MILESTONES.map((m, i) => ({ x: tabletAnchors[i]?.x ?? m.x, y: tabletAnchors[i]?.y ?? m.y })),
  { x: -6, y: 14 },
]

/**
 * Mobile path waypoints — R→L zig-zag
 */
export const JOURNEY_PATH_POINTS_MOBILE = [
  { x: 108, y: 86 },
  ...JOURNEY_MILESTONES.map((m, i) => ({ x: mobileAnchors[i]?.x ?? m.x, y: mobileAnchors[i]?.y ?? m.y })),
  { x: -8, y: 16 },
]

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

/** Desktop card positions (in % of container) */
export const MILESTONE_CARD_POSITIONS_DESKTOP = JOURNEY_MILESTONES.map((m) => ({
  left: `${m.x}%`,
  top: m.row === 'top' ? '2%' : 'auto',
  bottom: m.row === 'bottom' ? '2%' : 'auto',
  translateX: '-50%',
}))

/** Tablet card positions */
export const MILESTONE_CARD_POSITIONS_TABLET = JOURNEY_MILESTONES.map((_m, i) => {
  const anchor = tabletAnchors[i] ?? tabletAnchors[tabletAnchors.length - 1]
  return {
    left: `${anchor.x}%`,
    top: anchor.row === 'top' ? '1%' : 'auto',
    bottom: anchor.row === 'bottom' ? '1%' : 'auto',
    translateX: '-50%',
  }
})

/** Mobile card positions */
export const MILESTONE_CARD_POSITIONS_MOBILE = JOURNEY_MILESTONES.map((_m, i) => {
  const anchor = mobileAnchors[i] ?? mobileAnchors[mobileAnchors.length - 1]
  return {
    left: `${anchor.x}%`,
    top: anchor.row === 'top' ? '3%' : 'auto',
    bottom: anchor.row === 'bottom' ? '3%' : 'auto',
    translateX: '-50%',
  }
})

/** Mobile milestone anchors (row info for card rendering) */
export const MOBILE_MILESTONE_ANCHORS = mobileAnchors

// Legacy export for any consumer still importing it
export const MILESTONE_CARD_POSITIONS = MILESTONE_CARD_POSITIONS_DESKTOP
