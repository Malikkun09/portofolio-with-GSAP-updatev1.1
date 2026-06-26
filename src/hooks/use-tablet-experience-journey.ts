import { useLayoutEffect, useRef, type RefObject } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import {
  JOURNEY_MILESTONES,
  JOURNEY_PATH_POINTS_TABLET,
} from '@/components/experience/journey-config'
import { withFullWidthPin, patchPinnedSceneWidth } from '@/lib/scroll-pin'

gsap.registerPlugin(ScrollTrigger)

/** Sample the SVG path to find each milestone node's normalized position */
function resolveMilestoneProgresses(
  pathEl: SVGPathElement,
  totalLength: number,
): number[] {
  if (totalLength <= 0) return JOURNEY_MILESTONES.map((_, i) => (i + 1) / (JOURNEY_MILESTONES.length + 1))
  const samples = 200
  const sampled: { x: number; y: number; t: number }[] = []
  for (let i = 0; i <= samples; i++) {
    const t = i / samples
    const p = pathEl.getPointAtLength(totalLength * t)
    sampled.push({ x: p.x, y: p.y, t })
  }
  const waypoints = JOURNEY_PATH_POINTS_TABLET.slice(1, -1)
  return waypoints.map((wp) => {
    let bestT = 0
    let bestDist = Infinity
    for (const s of sampled) {
      const dx = s.x - wp.x
      const dy = s.y - wp.y
      const d = dx * dx + dy * dy
      if (d < bestDist) {
        bestDist = d
        bestT = s.t
      }
    }
    return bestT
  })
}

/**
 * Tablet experience journey — compact horizontal path with tighter zig-zag.
 * Uses the same SVG path/marker mechanism as desktop but with tablet anchors.
 */
export function useTabletExperienceJourney(
  pinRef: RefObject<HTMLElement | null>,
  enabled: boolean,
) {
  const scrollTriggerRef = useRef<ScrollTrigger | null>(null)

  useLayoutEffect(() => {
    if (!enabled || !pinRef.current) return undefined

    const pinEl = pinRef.current
    const pathEl = pinEl.querySelector<SVGPathElement>('[data-journey-path]')
    const markerEl = pinEl.querySelector<HTMLElement>('[data-journey-marker]')
    const markerGlow = pinEl.querySelector<HTMLElement>('[data-marker-glow]')
    const markerOrbit = pinEl.querySelector<HTMLElement>('[data-marker-orbit]')
    const markerCompass = pinEl.querySelector<HTMLElement>('[data-marker-compass]')
    const cards = gsap.utils.toArray<HTMLElement>('[data-milestone]', pinEl)
    const nodes = gsap.utils.toArray<SVGCircleElement>('[data-journey-node]', pinEl)
    const nodeDots = gsap.utils.toArray<SVGCircleElement>('[data-journey-node-dot]', pinEl)

    const scrollLength = `${JOURNEY_MILESTONES.length * 80}%`

    const ctx = gsap.context(() => {
      cards.forEach((cardEl) => {
        gsap.set(cardEl, { autoAlpha: 0.32, y: 12 })
        const glow = cardEl.querySelector('[data-milestone-glow]')
        const card = cardEl.querySelector('[data-milestone-card]')
        const year = cardEl.querySelector('[data-milestone-year]')
        const title = cardEl.querySelector('[data-milestone-title]')
        const company = cardEl.querySelector('[data-milestone-company]')
        const desc = cardEl.querySelector('[data-milestone-desc]')
        const tags = cardEl.querySelectorAll<HTMLElement>('[data-milestone-tag]')

        if (glow) gsap.set(glow, { autoAlpha: 0 })
        if (card) gsap.set(card, { filter: 'blur(4px)' })
        if (year) gsap.set(year, { opacity: 0.45 })
        if (title) gsap.set(title, { opacity: 0.45 })
        if (company) gsap.set(company, { opacity: 0.35 })
        if (desc) gsap.set(desc, { opacity: 0.28 })
        gsap.set(tags, { autoAlpha: 0.2, y: 8 })
      })

      let pathLength = 0
      if (pathEl) {
        pathLength = pathEl.getTotalLength()
        gsap.set(pathEl, {
          strokeDasharray: pathLength,
          strokeDashoffset: pathLength,
        })
      }

      const milestoneProgresses = pathEl
        ? resolveMilestoneProgresses(pathEl, pathLength)
        : JOURNEY_MILESTONES.map((_, i) => (i + 1) / (JOURNEY_MILESTONES.length + 1))

      if (markerEl) {
        const start = JOURNEY_PATH_POINTS_TABLET[0]
        gsap.set(markerEl, {
          left: `${start.x}%`,
          top: `${start.y}%`,
          autoAlpha: 0,
        })
      }
      if (markerGlow) gsap.set(markerGlow, { autoAlpha: 0 })
      if (markerOrbit) gsap.set(markerOrbit, { autoAlpha: 0 })
      if (markerCompass) gsap.set(markerCompass, { autoAlpha: 0 })
      nodes.forEach((node) => gsap.set(node, { opacity: 0.4, scale: 0.85 }))
      nodeDots.forEach((dot) => gsap.set(dot, { opacity: 0, scale: 0 }))

      const MOTION_START = 0.04
      const MOTION_DURATION = 0.92

      // `paused: true` prevents the timeline from playing before
      // ScrollTrigger attaches and takes control via `scrub`.
      const tl = gsap.timeline({
        paused: true,
        defaults: { ease: 'power2.out' },
      })

      tl.to(markerEl, { autoAlpha: 1, duration: 0.05 }, 0)
      tl.to(markerGlow, { autoAlpha: 1, duration: 0.05 }, 0)
      tl.to(markerOrbit, { autoAlpha: 0.7, duration: 0.05 }, 0)
      tl.to(markerCompass, { autoAlpha: 1, duration: 0.05 }, 0)

      if (pathEl && pathLength > 0) {
        tl.to(
          pathEl,
          { strokeDashoffset: 0, duration: MOTION_DURATION, ease: 'none' },
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
            if (!pathEl || !markerEl || pathLength <= 0) return
            const point = pathEl.getPointAtLength(pathLength * motionObj.progress)
            markerEl.style.left = `${point.x}%`
            markerEl.style.top = `${point.y}%`
          },
        },
        MOTION_START,
      )

      JOURNEY_MILESTONES.forEach((_m, index) => {
        const nodeProgress = milestoneProgresses[index] ?? 0
        const activateAt = MOTION_START + nodeProgress * MOTION_DURATION
        const animSlot = 0.06

        const cardEl = cards[index]
        if (!cardEl) return

        const glow = cardEl.querySelector('[data-milestone-glow]')
        const card = cardEl.querySelector('[data-milestone-card]')
        const year = cardEl.querySelector('[data-milestone-year]')
        const title = cardEl.querySelector('[data-milestone-title]')
        const company = cardEl.querySelector('[data-milestone-company]')
        const desc = cardEl.querySelector('[data-milestone-desc]')
        const tags = cardEl.querySelectorAll<HTMLElement>('[data-milestone-tag]')
        const node = nodes[index]
        const nodeDot = nodeDots[index]

        const preActivate = Math.max(MOTION_START, activateAt - 0.015)

        tl.to(cardEl, { autoAlpha: 1, y: 0, duration: animSlot, ease: 'power3.out' }, preActivate)
        if (glow) tl.to(glow, { autoAlpha: 0.7, duration: animSlot * 0.9 }, preActivate)
        if (card) {
          tl.to(
            card,
            {
              filter: 'blur(0px)',
              boxShadow:
                '0 0 0 1px rgba(0,184,255,0.4), 0 0 28px rgba(0,184,255,0.28), 0 0 56px rgba(0,184,255,0.12)',
              duration: animSlot,
            },
            preActivate,
          )
        }
        if (year) tl.to(year, { opacity: 1, duration: animSlot * 0.7 }, preActivate)
        if (title) tl.to(title, { opacity: 1, duration: animSlot * 0.8 }, preActivate + 0.005)
        if (company) tl.to(company, { opacity: 0.85, duration: animSlot * 0.8 }, preActivate + 0.01)
        if (desc) tl.to(desc, { opacity: 0.9, duration: animSlot }, preActivate + 0.015)
        if (node) {
          tl.to(
            node,
            {
              opacity: 1,
              scale: 1.2,
              attr: { stroke: 'rgba(103,232,249,0.7)' },
              duration: animSlot * 0.6,
              ease: 'back.out(2)',
            },
            activateAt,
          )
        }
        if (nodeDot) {
          tl.to(
            nodeDot,
            { opacity: 1, scale: 1, duration: animSlot * 0.5, ease: 'back.out(2)' },
            activateAt,
          )
        }
        if (tags.length > 0) {
          tl.to(
            tags,
            {
              autoAlpha: 0.95,
              y: 0,
              duration: animSlot * 0.55,
              stagger: 0.012,
              ease: 'power2.out',
            },
            preActivate + animSlot * 0.15,
          )
        }
      })

      scrollTriggerRef.current = ScrollTrigger.create(
        withFullWidthPin(pinEl, {
          trigger: pinEl,
          start: 'top top',
          end: `+=${scrollLength}`,
          pin: true,
          pinSpacing: true,
          scrub: 0.5,
          anticipatePin: 1,
          animation: tl,
          invalidateOnRefresh: true,
        }),
      )

      patchPinnedSceneWidth(pinEl)
    }, pinEl)

    const onResize = () => {
      ScrollTrigger.refresh()
      patchPinnedSceneWidth(pinEl)
    }
    window.addEventListener('resize', onResize)
    let rafId2 = 0
    const rafId1 = window.requestAnimationFrame(() => {
      rafId2 = window.requestAnimationFrame(() => {
        ScrollTrigger.refresh()
        patchPinnedSceneWidth(pinEl)
      })
    })

    return () => {
      window.cancelAnimationFrame(rafId1)
      window.cancelAnimationFrame(rafId2)
      window.removeEventListener('resize', onResize)
      scrollTriggerRef.current?.kill()
      scrollTriggerRef.current = null
      ctx.revert()
    }
  }, [enabled, pinRef])

  return scrollTriggerRef
}
