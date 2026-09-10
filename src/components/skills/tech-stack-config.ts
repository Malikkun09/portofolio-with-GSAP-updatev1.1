import { skillCategories } from '@/data/portfolio'

export type TechAccent = 'cyan' | 'blue' | 'purple' | 'pink' | 'yellow' | 'green'

export interface TechGroupTheme {
  accent: TechAccent
  borderColor: string
  glowColor: string
  activeGlow: string
  chipBorder: string
  chipBg: string
  labelColor: string
  gradient: string
  activeGradient: string
}

export interface RouteNode {
  x: number
  y: number
}

export interface TechGroupLayout {
  id: string
  title: string
  skills: readonly string[]
  index: number
  anchor: RouteNode
  desktop: { top: string; left: string; translate: string }
  mobile: { top: string; left: string; translate: string }
  theme: TechGroupTheme
}

const themes: TechGroupTheme[] = [
  {
    accent: 'cyan',
    borderColor: 'rgba(34, 211, 238, 0.22)',
    glowColor: 'rgba(34, 211, 238, 0.1)',
    activeGlow:
      '0 0 0 1px rgba(34,211,238,0.45), 0 0 28px rgba(34,211,238,0.35), 0 0 56px rgba(0,184,255,0.15)',
    chipBorder: 'rgba(34, 211, 238, 0.22)',
    chipBg: 'rgba(34, 211, 238, 0.06)',
    labelColor: '#67e8f9',
    gradient: 'linear-gradient(145deg, rgba(12,12,12,0.92) 0%, rgba(8,16,20,0.95) 100%)',
    activeGradient:
      'linear-gradient(145deg, rgba(34,211,238,0.14) 0%, rgba(0,184,255,0.06) 50%, rgba(12,12,12,0.9) 100%)',
  },
  {
    accent: 'blue',
    borderColor: 'rgba(99, 102, 241, 0.22)',
    glowColor: 'rgba(99, 102, 241, 0.1)',
    activeGlow:
      '0 0 0 1px rgba(129,140,248,0.45), 0 0 28px rgba(99,102,241,0.35), 0 0 56px rgba(168,85,247,0.12)',
    chipBorder: 'rgba(129, 140, 248, 0.24)',
    chipBg: 'rgba(99, 102, 241, 0.07)',
    labelColor: '#a5b4fc',
    gradient: 'linear-gradient(145deg, rgba(12,12,12,0.92) 0%, rgba(10,10,18,0.95) 100%)',
    activeGradient:
      'linear-gradient(145deg, rgba(99,102,241,0.14) 0%, rgba(129,140,248,0.06) 50%, rgba(12,12,12,0.9) 100%)',
  },
  {
    accent: 'pink',
    borderColor: 'rgba(236, 72, 153, 0.2)',
    glowColor: 'rgba(236, 72, 153, 0.08)',
    activeGlow:
      '0 0 0 1px rgba(244,114,182,0.42), 0 0 28px rgba(236,72,153,0.32), 0 0 56px rgba(168,85,247,0.1)',
    chipBorder: 'rgba(244, 114, 182, 0.22)',
    chipBg: 'rgba(236, 72, 153, 0.06)',
    labelColor: '#f9a8d4',
    gradient: 'linear-gradient(145deg, rgba(12,12,12,0.92) 0%, rgba(16,10,14,0.95) 100%)',
    activeGradient:
      'linear-gradient(145deg, rgba(236,72,153,0.12) 0%, rgba(168,85,247,0.05) 50%, rgba(12,12,12,0.9) 100%)',
  },
  {
    accent: 'yellow',
    borderColor: 'rgba(250, 204, 21, 0.18)',
    glowColor: 'rgba(250, 204, 21, 0.08)',
    activeGlow:
      '0 0 0 1px rgba(250,204,21,0.38), 0 0 28px rgba(250,204,21,0.28), 0 0 56px rgba(134,239,172,0.1)',
    chipBorder: 'rgba(250, 204, 21, 0.2)',
    chipBg: 'rgba(250, 204, 21, 0.05)',
    labelColor: '#fde047',
    gradient: 'linear-gradient(145deg, rgba(12,12,12,0.92) 0%, rgba(14,13,8,0.95) 100%)',
    activeGradient:
      'linear-gradient(145deg, rgba(250,204,21,0.1) 0%, rgba(134,239,172,0.05) 50%, rgba(12,12,12,0.9) 100%)',
  },
]

/** Hub + group anchors in viewBox 0–100 — aligned to card connection points */
export const TECH_ROUTE_DESKTOP = {
  hub: { x: 50, y: 50 } satisfies RouteNode,
  nodes: [
    { x: 50, y: 20 },
    { x: 80, y: 50 },
    { x: 50, y: 80 },
    { x: 20, y: 50 },
  ] satisfies RouteNode[],
}

export const TECH_ROUTE_MOBILE = {
  hub: { x: 50, y: 40 } satisfies RouteNode,
  nodes: [
    { x: 50, y: 8 },
    { x: 50, y: 28 },
    { x: 50, y: 50 },
    { x: 50, y: 72 },
  ] satisfies RouteNode[],
}

/**
 * Tablet 2×2 grid — spokes land on each card cell center.
 * Frontend (TL) → Backend (TR) → Security (BL) → Design (BR)
 */
export const TECH_ROUTE_TABLET = {
  hub: { x: 50, y: 50 } satisfies RouteNode,
  nodes: [
    { x: 25, y: 25 },
    { x: 75, y: 25 },
    { x: 25, y: 75 },
    { x: 75, y: 75 },
  ] satisfies RouteNode[],
}

const desktopLayouts = [
  { top: '20%', left: '50%', translate: '-50%, -50%' },
  { top: '50%', left: '80%', translate: '-50%, -50%' },
  { top: '80%', left: '50%', translate: '-50%, -50%' },
  { top: '50%', left: '20%', translate: '-50%, -50%' },
]

const mobileLayouts = [
  { top: '8%', left: '50%', translate: '-50%, -50%' },
  { top: '28%', left: '50%', translate: '-50%, -50%' },
  { top: '50%', left: '50%', translate: '-50%, -50%' },
  { top: '72%', left: '50%', translate: '-50%, -50%' },
]

export const TECH_STACK_GROUPS: TechGroupLayout[] = skillCategories.map((cat, index) => ({
  id: cat.title.toLowerCase(),
  title: cat.title,
  skills: cat.skills,
  index,
  anchor: TECH_ROUTE_DESKTOP.nodes[index] ?? TECH_ROUTE_DESKTOP.nodes[0],
  desktop: desktopLayouts[index] ?? desktopLayouts[0],
  mobile: mobileLayouts[index] ?? mobileLayouts[0],
  theme: themes[index] ?? themes[0],
}))

export const TECH_STACK_STEP_COUNT = TECH_STACK_GROUPS.length

export const AI_GRADIENT_BORDERS = [
  'conic-gradient(from 180deg, #67e8f9, #00B8FF, #818cf8, #c084fc, #67e8f9)',
  'conic-gradient(from 200deg, #818cf8, #6366f1, #00B8FF, #a78bfa, #818cf8)',
  'conic-gradient(from 160deg, #f472b6, #ec4899, #a855f7, #818cf8, #f472b6)',
  'conic-gradient(from 220deg, #fde047, #86efac, #00B8FF, #fbbf24, #fde047)',
] as const

export function getRouteForLayout(isMobile: boolean) {
  return isMobile ? TECH_ROUTE_MOBILE : TECH_ROUTE_DESKTOP
}

export function getTabletRoute() {
  return TECH_ROUTE_TABLET
}
