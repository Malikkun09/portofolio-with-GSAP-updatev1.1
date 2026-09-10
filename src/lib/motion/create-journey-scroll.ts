import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { JOURNEY_MILESTONES } from '@/components/experience/journey-config'
import { patchPinnedSceneWidth, withFullWidthPin } from '@/lib/scroll-pin'
import { PINNED_SCRUB_JOURNEY, attachPinnedRefresh, journeyScrollLength } from '@/lib/motion/pinned-scroll'

gsap.registerPlugin(ScrollTrigger)

const MOTION_START = 0.03
const MOTION_DURATION = 0.94

function polylineLength(points: { x: number; y: number }[]) {
  let total = 0
  for (let i = 1; i < points.length; i++) {
    total += Math.hypot(points[i].x - points[i - 1].x, points[i].y - points[i - 1].y)
  }
  return total
}

function pointAlongPolyline(
  points: { x: number; y: number }[],
  t: number,
): { x: number; y: number } {
  if (points.length === 0) return { x: 0, y: 0 }
  if (points.length === 1 || t <= 0) return points[0]
  if (t >= 1) return points[points.length - 1]

  let remaining = t * polylineLength(points)
  for (let i = 1; i < points.length; i++) {
    const dx = points[i].x - points[i - 1].x
    const dy = points[i].y - points[i - 1].y
    const len = Math.hypot(dx, dy)
    if (len === 0) continue
    if (remaining <= len || i === points.length - 1) {
      const r = remaining / len
      return { x: points[i - 1].x + dx * r, y: points[i - 1].y + dy * r }
    }
    remaining -= len
  }

  return points[points.length - 1]
}

function resolveMilestoneProgresses(pathPoints: { x: number; y: number }[]): number[] {
  const total = polylineLength(pathPoints)
  if (total <= 0) {
    return JOURNEY_MILESTONES.map((_, i) => (i + 1) / (JOURNEY_MILESTONES.length + 1))
  }

  const waypoints = pathPoints.slice(1, -1)
  return waypoints.map((_wp, index) => {
    const wpIndex = index + 1
    return polylineLength(pathPoints.slice(0, wpIndex + 1)) / total
  })
}

interface JourneyScrollOptions {
  pathPoints: { x: number; y: number }[]
  fullWidthPin?: boolean
  vhPerStep?: number
}

/** Shared Experience GSAP scene — snappy scrub, no filter blur, GPU transforms. */
export function setupExperienceJourney(pinEl: HTMLElement, options: JourneyScrollOptions) {
  const { pathPoints, fullWidthPin = false, vhPerStep = 72 } = options

  const pathEl = pinEl.querySelector<SVGPathElement>('[data-journey-path]')
  const pathBgEl = pinEl.querySelector<SVGPathElement>('[data-journey-path-bg]')
  const markerEl = pinEl.querySelector<HTMLElement>('[data-journey-marker]')
  const markerGlow = pinEl.querySelector<HTMLElement>('[data-marker-glow]')
  const markerOrbit = pinEl.querySelector<HTMLElement>('[data-marker-orbit]')
  const markerCompass = pinEl.querySelector<HTMLElement>('[data-marker-compass]')
  const cards = gsap.utils.toArray<HTMLElement>('[data-milestone]', pinEl)
  const nodes = gsap.utils.toArray<HTMLElement>('[data-journey-node]', pinEl)
  const nodeDots = gsap.utils.toArray<HTMLElement>('[data-journey-node-dot]', pinEl)

  const scrollLength = journeyScrollLength(JOURNEY_MILESTONES.length, vhPerStep)

  const ctx = gsap.context(() => {
    cards.forEach((cardEl) => {
      gsap.set(cardEl, { autoAlpha: 0.86, y: 10, force3D: true })

      const glow = cardEl.querySelector('[data-milestone-glow]')
      const card = cardEl.querySelector('[data-milestone-card]')
      const year = cardEl.querySelector('[data-milestone-year]')
      const title = cardEl.querySelector('[data-milestone-title]')
      const company = cardEl.querySelector('[data-milestone-company]')
      const desc = cardEl.querySelector('[data-milestone-desc]')
      const tags = cardEl.querySelectorAll<HTMLElement>('[data-milestone-tag]')
      const leg = cardEl.querySelector('[data-milestone-leg]')

      if (glow) gsap.set(glow, { autoAlpha: 0 })
      if (year) gsap.set(year, { opacity: 0.82 })
      if (title) gsap.set(title, { opacity: 0.92 })
      if (company) gsap.set(company, { opacity: 0.78 })
      if (desc) gsap.set(desc, { opacity: 0.78 })
      if (leg) gsap.set(leg, { opacity: 0.4 })
      gsap.set(tags, { autoAlpha: 0.7, y: 0 })
      if (card) gsap.set(card, { clearProps: 'filter' })
    })

    let pathLength = 0
    if (pathEl) {
      pathLength = pathEl.getTotalLength()
      gsap.set(pathEl, {
        strokeDasharray: pathLength,
        strokeDashoffset: pathLength,
      })
    }

    const milestoneProgresses = resolveMilestoneProgresses(pathPoints)

    if (markerEl) {
      const startPoint = pathPoints[0]
      gsap.set(markerEl, {
        left: `${startPoint.x}%`,
        top: `${startPoint.y}%`,
        autoAlpha: 0,
      })
    }
    if (markerGlow) gsap.set(markerGlow, { autoAlpha: 0 })
    if (markerOrbit) gsap.set(markerOrbit, { autoAlpha: 0 })
    if (markerCompass) gsap.set(markerCompass, { autoAlpha: 0 })
    if (pathBgEl) gsap.set(pathBgEl, { opacity: 0.45 })
    nodes.forEach((node) => gsap.set(node, { opacity: 0.45, scale: 0.92, transformOrigin: '50% 50%' }))
    nodeDots.forEach((dot) => gsap.set(dot, { opacity: 0, scale: 0 }))

    const tl = gsap.timeline({
      paused: true,
      defaults: { ease: 'power2.out' },
    })

    tl.to(markerEl, { autoAlpha: 1, duration: 0.04 }, 0)
    tl.to(markerGlow, { autoAlpha: 1, duration: 0.04 }, 0)
    tl.to(markerOrbit, { autoAlpha: 0.7, duration: 0.04 }, 0)
    tl.to(markerCompass, { autoAlpha: 1, duration: 0.04 }, 0)

    if (pathEl && pathLength > 0) {
      tl.to(
        pathEl,
        {
          strokeDashoffset: 0,
          duration: MOTION_DURATION,
          ease: 'none',
        },
        MOTION_START,
      )
    }

    const motionObj = { progress: 0 }
    tl.to(
      motionObj,
      {
        progress: 1,
        duration: MOTION_DURATION,
        ease: 'none',
        onUpdate: () => {
          if (!markerEl) return
          const point = pointAlongPolyline(pathPoints, motionObj.progress)
          markerEl.style.left = `${point.x}%`
          markerEl.style.top = `${point.y}%`
        },
      },
      MOTION_START,
    )

    JOURNEY_MILESTONES.forEach((_milestone, index) => {
      const nodeProgress = milestoneProgresses[index] ?? 0
      const activateAt = MOTION_START + nodeProgress * MOTION_DURATION
      const animSlot = 0.09
      const cardEl = cards[index]
      if (!cardEl) return

      const glow = cardEl.querySelector('[data-milestone-glow]')
      const card = cardEl.querySelector('[data-milestone-card]')
      const year = cardEl.querySelector('[data-milestone-year]')
      const title = cardEl.querySelector('[data-milestone-title]')
      const company = cardEl.querySelector('[data-milestone-company]')
      const desc = cardEl.querySelector('[data-milestone-desc]')
      const tags = cardEl.querySelectorAll<HTMLElement>('[data-milestone-tag]')
      const leg = cardEl.querySelector('[data-milestone-leg]')
      const node = nodes[index]
      const nodeDot = nodeDots[index]
      const preActivate = Math.max(MOTION_START, activateAt - 0.02)

      tl.to(
        cardEl,
        { autoAlpha: 1, y: 0, duration: animSlot, ease: 'power3.out' },
        preActivate,
      )

      if (glow) tl.to(glow, { autoAlpha: 0.75, duration: animSlot * 0.8 }, preActivate)

      if (card) {
        tl.to(
          card,
          {
            boxShadow:
              '0 0 0 1px rgba(0,184,255,0.4), 0 0 24px rgba(0,184,255,0.26), 0 0 48px rgba(0,184,255,0.1)',
            duration: animSlot,
          },
          preActivate,
        )
      }

      if (year) tl.to(year, { opacity: 1, duration: animSlot * 0.7 }, preActivate)
      if (title) tl.to(title, { opacity: 1, duration: animSlot * 0.8 }, preActivate + 0.008)
      if (company) tl.to(company, { opacity: 0.85, duration: animSlot * 0.8 }, preActivate + 0.012)
      if (desc) tl.to(desc, { opacity: 0.9, duration: animSlot }, preActivate + 0.018)
      if (leg) tl.to(leg, { opacity: 0.7, duration: animSlot * 0.7 }, preActivate)

      if (node) {
        tl.to(
          node,
          {
            opacity: 1,
            scale: 1.18,
            borderColor: 'rgba(103,232,249,0.85)',
            duration: animSlot * 0.55,
            ease: 'back.out(1.8)',
          },
          activateAt,
        )
      }

      if (nodeDot) {
        tl.to(
          nodeDot,
          { opacity: 1, scale: 1, duration: animSlot * 0.45, ease: 'back.out(1.8)' },
          activateAt,
        )
      }

      if (tags.length > 0) {
        tl.to(
          tags,
          {
            autoAlpha: 0.95,
            y: 0,
            duration: animSlot * 0.5,
            stagger: 0.01,
            ease: 'power2.out',
          },
          preActivate + animSlot * 0.12,
        )
      }
    })

    const triggerConfig = {
      trigger: pinEl,
      start: 'top top',
      end: `+=${scrollLength}`,
      pin: true,
      pinSpacing: true,
      scrub: PINNED_SCRUB_JOURNEY,
      anticipatePin: 1,
      fastScrollEnd: true,
      animation: tl,
      invalidateOnRefresh: true,
    }

    ScrollTrigger.create(fullWidthPin ? withFullWidthPin(pinEl, triggerConfig) : triggerConfig)

    if (fullWidthPin) patchPinnedSceneWidth(pinEl)
  }, pinEl)

  const detachRefresh = attachPinnedRefresh(
    fullWidthPin ? () => patchPinnedSceneWidth(pinEl) : undefined,
  )

  return () => {
    detachRefresh()
    ctx.revert()
  }
}
