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
  /** Vertical anchor (top row = 22, bottom row = 78) */
  y: number
  /** Card sits above (true) or below (false) the path */
  row: 'top' | 'bottom'
}

/**
 * Reverse portfolio order (newest first) into chronological journey order.
 * Final order: Learning Phase → Frontend Student → Hackathon → Full Stack
 */
const chronological = [...experiences].reverse()

/** Alternating top/bottom row positions for desktop editorial layout */
const desktopAnchors = [
  { x: 10, y: 22, row: 'top' as const },
  { x: 37, y: 78, row: 'bottom' as const },
  { x: 64, y: 22, row: 'top' as const },
  { x: 90, y: 78, row: 'bottom' as const },
]

/** Tablet anchors — tighter, single row top with shorter vertical variance */
const tabletAnchors = [
  { x: 12, y: 28, row: 'top' as const },
  { x: 38, y: 72, row: 'bottom' as const },
  { x: 64, y: 28, row: 'top' as const },
  { x: 88, y: 72, row: 'bottom' as const },
]

/**
 * Mobile anchors — horizontal alternating zig-zag.
 * Tighter spacing so all 4 cards fit within viewport width.
 */
const mobileAnchors = [
  { x: 18, y: 28, row: 'top' as const },
  { x: 40, y: 72, row: 'bottom' as const },
  { x: 60, y: 28, row: 'top' as const },
  { x: 82, y: 72, row: 'bottom' as const },
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

/**
 * Desktop path waypoints: start (off-screen left) → each milestone anchor → end (off-screen right)
 */
export const JOURNEY_PATH_POINTS = [
  { x: -4, y: 50 },
  ...JOURNEY_MILESTONES.map((m) => ({ x: m.x, y: m.y })),
  { x: 104, y: 50 },
]

/**
 * Tablet path waypoints — gentler zig-zag
 */
export const JOURNEY_PATH_POINTS_TABLET = [
  { x: -4, y: 50 },
  ...JOURNEY_MILESTONES.map((m, i) => ({ x: tabletAnchors[i]?.x ?? m.x, y: tabletAnchors[i]?.y ?? m.y })),
  { x: 104, y: 50 },
]

/**
 * Mobile path waypoints — horizontal zig-zag, tighter spacing
 */
export const JOURNEY_PATH_POINTS_MOBILE = [
  { x: -6, y: 50 },
  ...JOURNEY_MILESTONES.map((m, i) => ({ x: mobileAnchors[i]?.x ?? m.x, y: mobileAnchors[i]?.y ?? m.y })),
  { x: 106, y: 50 },
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
  top: m.row === 'top' ? '4%' : 'auto',
  bottom: m.row === 'bottom' ? '4%' : 'auto',
  translateX: '-50%',
}))

/** Tablet card positions — slightly tighter */
export const MILESTONE_CARD_POSITIONS_TABLET = JOURNEY_MILESTONES.map((_m, i) => {
  const anchor = tabletAnchors[i] ?? tabletAnchors[tabletAnchors.length - 1]
  return {
    left: `${anchor.x}%`,
    top: anchor.row === 'top' ? '2%' : 'auto',
    bottom: anchor.row === 'bottom' ? '2%' : 'auto',
    translateX: '-50%',
  }
})

/** Mobile card positions — horizontal alternating, all 4 fit in viewport */
export const MILESTONE_CARD_POSITIONS_MOBILE = JOURNEY_MILESTONES.map((_m, i) => {
  const anchor = mobileAnchors[i] ?? mobileAnchors[mobileAnchors.length - 1]
  return {
    left: `${anchor.x}%`,
    top: anchor.row === 'top' ? '6%' : 'auto',
    bottom: anchor.row === 'bottom' ? '6%' : 'auto',
    translateX: '-50%',
  }
})

/** Mobile milestone anchors (row info for card rendering) */
export const MOBILE_MILESTONE_ANCHORS = mobileAnchors

// Legacy export for any consumer still importing it
export const MILESTONE_CARD_POSITIONS = MILESTONE_CARD_POSITIONS_DESKTOP
