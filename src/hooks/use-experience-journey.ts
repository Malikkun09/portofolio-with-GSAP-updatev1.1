import { useLayoutEffect, useRef, type RefObject } from 'react'
import {
  JOURNEY_MILESTONES,
  JOURNEY_PATH_POINTS,
} from '@/components/experience/journey-config'
import {
  addMilestoneReveal,
  hideMilestoneCard,
  planEqualWindows,
} from '@/lib/experience-reveal'
import { gsap, ScrollTrigger } from '@/lib/gsap'
import { bindPinnedLayoutSync } from '@/lib/scroll-pin'

const MOTION_START = 0.04
const MOTION_DURATION = 0.92
const PATH_X_PERCENT = -50

export function useExperienceJourney(
  pinRef: RefObject<HTMLElement | null>,
  enabled: boolean,
) {
  const scrollTriggerRef = useRef<ScrollTrigger | null>(null)

  useLayoutEffect(() => {
    if (!enabled || !pinRef.current) return undefined

    const pinEl = pinRef.current
    const pathEl = pinEl.querySelector<SVGPathElement>('[data-journey-path]')
    const pathBgEl = pinEl.querySelector<SVGPathElement>('[data-journey-path-bg]')
    const markerEl = pinEl.querySelector<HTMLElement>('[data-journey-marker]')
    const markerGlow = pinEl.querySelector<HTMLElement>('[data-marker-glow]')
    const markerOrbit = pinEl.querySelector<HTMLElement>('[data-marker-orbit]')
    const markerCompass = pinEl.querySelector<HTMLElement>('[data-marker-compass]')
    const cards = gsap.utils
      .toArray<HTMLElement>('[data-milestone]', pinEl)
      .sort(
        (a, b) =>
          Number(a.dataset.milestoneIndex ?? 0) - Number(b.dataset.milestoneIndex ?? 0),
      )
    const nodes = gsap.utils.toArray<SVGCircleElement>('[data-journey-node]', pinEl)
    const nodeDots = gsap.utils.toArray<SVGCircleElement>('[data-journey-node-dot]', pinEl)

    const windows = planEqualWindows(JOURNEY_MILESTONES.length, {
      motionStart: MOTION_START,
      motionDuration: MOTION_DURATION,
      cascadeRatio: 0.9,
    })
    const scrollLength = `${JOURNEY_MILESTONES.length * 140}%`

    const ctx = gsap.context(() => {
      cards.forEach((cardEl) => hideMilestoneCard(cardEl, { xPercent: PATH_X_PERCENT, fromX: -72 }))

      let pathLength = 0
      if (pathEl) {
        pathLength = pathEl.getTotalLength()
        gsap.set(pathEl, {
          strokeDasharray: pathLength,
          strokeDashoffset: pathLength,
        })
      }

      if (markerEl) {
        const startPoint = JOURNEY_PATH_POINTS[0]
        gsap.set(markerEl, {
          left: `${startPoint.x}%`,
          top: `${startPoint.y}%`,
          autoAlpha: 0,
        })
      }
      if (markerGlow) gsap.set(markerGlow, { autoAlpha: 0 })
      if (markerOrbit) gsap.set(markerOrbit, { autoAlpha: 0 })
      if (markerCompass) gsap.set(markerCompass, { autoAlpha: 0 })
      if (pathBgEl) gsap.set(pathBgEl, { opacity: 0.5 })
      nodes.forEach((node) => gsap.set(node, { opacity: 0.4, scale: 0.85 }))
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
            if (!pathEl || !markerEl || pathLength <= 0) return
            const point = pathEl.getPointAtLength(pathLength * motionObj.progress)
            markerEl.style.left = `${point.x}%`
            markerEl.style.top = `${point.y}%`
          },
        },
        MOTION_START,
      )

      windows.forEach((window, index) => {
        const cardEl = cards[index]
        if (!cardEl) return

        addMilestoneReveal(tl, cardEl, window.revealStart, {
          xPercent: PATH_X_PERCENT,
          slot: window.revealSlot,
        })

        const stampAt = window.revealStart + window.revealSlot * 0.36
        const node = nodes[index]
        const nodeDot = nodeDots[index]
        const nodeAt = stampAt

        if (node) {
          tl.to(
            node,
            {
              opacity: 1,
              scale: 1.2,
              attr: { stroke: 'rgba(103,232,249,0.7)' },
              duration: window.revealSlot * 0.1,
              ease: 'power2.out',
            },
            nodeAt,
          )
        }

        if (nodeDot) {
          tl.to(
            nodeDot,
            { opacity: 1, scale: 1, duration: window.revealSlot * 0.08, ease: 'power2.out' },
            nodeAt,
          )
        }
      })

      scrollTriggerRef.current = ScrollTrigger.create({
        trigger: pinEl,
        start: 'top top',
        end: `+=${scrollLength}`,
        pin: true,
        pinSpacing: true,
        scrub: 0.4,
        anticipatePin: 1,
        animation: tl,
        invalidateOnRefresh: true,
      })
    }, pinEl)

    const unbindLayout = bindPinnedLayoutSync(pinEl)

    return () => {
      unbindLayout()
      scrollTriggerRef.current?.kill()
      scrollTriggerRef.current = null
      ctx.revert()
    }
  }, [enabled, pinRef])

  return scrollTriggerRef
}
