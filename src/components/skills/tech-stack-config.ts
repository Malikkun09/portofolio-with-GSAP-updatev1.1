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
    gradient:
      'linear-gradient(145deg, rgb(var(--cyber-bg-card) / 0.94) 0%, rgb(var(--cyber-bg-surface) / 0.96) 100%)',
    activeGradient:
      'linear-gradient(145deg, rgba(34,211,238,0.14) 0%, rgba(0,184,255,0.06) 50%, rgb(var(--cyber-bg-card) / 0.92) 100%)',
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
    gradient:
      'linear-gradient(145deg, rgb(var(--cyber-bg-card) / 0.94) 0%, rgb(var(--cyber-bg-surface) / 0.96) 100%)',
    activeGradient:
      'linear-gradient(145deg, rgba(99,102,241,0.14) 0%, rgba(129,140,248,0.06) 50%, rgb(var(--cyber-bg-card) / 0.92) 100%)',
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
    gradient:
      'linear-gradient(145deg, rgb(var(--cyber-bg-card) / 0.94) 0%, rgb(var(--cyber-bg-surface) / 0.96) 100%)',
    activeGradient:
      'linear-gradient(145deg, rgba(236,72,153,0.12) 0%, rgba(168,85,247,0.05) 50%, rgb(var(--cyber-bg-card) / 0.92) 100%)',
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
    gradient:
      'linear-gradient(145deg, rgb(var(--cyber-bg-card) / 0.94) 0%, rgb(var(--cyber-bg-surface) / 0.96) 100%)',
    activeGradient:
      'linear-gradient(145deg, rgba(250,204,21,0.1) 0%, rgba(134,239,172,0.05) 50%, rgb(var(--cyber-bg-card) / 0.92) 100%)',
  },
]

/** Hub + group anchors in viewBox 0–100 — aligned to card connection points */
export const TECH_ROUTE_DESKTOP = {
  hub: { x: 50, y: 50 } satisfies RouteNode,
  nodes: [
    { x: 50, y: 18 },
    { x: 82, y: 33 },
    { x: 70, y: 70 },
    { x: 16, y: 66 },
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
 * Tablet cross-hub route — cardinal points around center.
 * Frontend (top) → Backend (right) → Security (bottom) → Design (left)
 */
export const TECH_ROUTE_TABLET = {
  hub: { x: 50, y: 50 } satisfies RouteNode,
  nodes: [
    { x: 50, y: 14 },
    { x: 86, y: 50 },
    { x: 50, y: 86 },
    { x: 14, y: 50 },
  ] satisfies RouteNode[],
}

const desktopLayouts = [
  { top: '18%', left: '50%', translate: '-50%, -50%' },
  { top: '33%', left: '82%', translate: '-50%, -50%' },
  { top: '70%', left: '70%', translate: '-50%, -50%' },
  { top: '66%', left: '16%', translate: '-50%, -50%' },
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
  anchor: TECH_ROUTE_DESKTOP.nodes[index],
  desktop: desktopLayouts[index],
  mobile: mobileLayouts[index],
  theme: themes[index],
}))

export const TECH_STACK_STEP_COUNT = TECH_STACK_GROUPS.length

export function getRouteForLayout(isMobile: boolean) {
  return isMobile ? TECH_ROUTE_MOBILE : TECH_ROUTE_DESKTOP
}

export function getTabletRoute() {
  return TECH_ROUTE_TABLET
}
