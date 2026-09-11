import { useLayoutEffect, useRef, type RefObject } from 'react'
import { JOURNEY_MILESTONES } from '@/components/experience/journey-config'
import { nodeTopPercent } from '@/components/experience/MobileJourneyRail'
import {
  addMilestoneExit,
  addMilestoneReveal,
  hideMilestoneCard,
  planEqualWindows,
} from '@/lib/experience-reveal'
import { gsap, ScrollTrigger } from '@/lib/gsap'
import { withFullWidthPin, bindPinnedLayoutSync, patchPinnedSceneWidth } from '@/lib/scroll-pin'

const MOTION_START = 0.03
const MOTION_DURATION = 0.94

/**
 * Mobile experience — pinned one-active-card journey.
 * Each milestone owns a non-overlapping scroll window:
 * enter from left → year/index → copy, then the card exits before the next starts.
 */
export function useMobileExperienceJourney(
  pinRef: RefObject<HTMLElement | null>,
  enabled: boolean,
) {
  const scrollTriggerRef = useRef<ScrollTrigger | null>(null)

  useLayoutEffect(() => {
    if (!enabled || !pinRef.current) return undefined

    const pinEl = pinRef.current
    const markerEl = pinEl.querySelector<HTMLElement>('[data-journey-marker]')
    const markerGlow = pinEl.querySelector<HTMLElement>('[data-marker-glow]')
    const markerOrbit = pinEl.querySelector<HTMLElement>('[data-marker-orbit]')
    const markerCompass = pinEl.querySelector<HTMLElement>('[data-marker-compass]')
    const trackActive = pinEl.querySelector<HTMLElement>('[data-mobile-track-active]')
    const cards = gsap.utils
      .toArray<HTMLElement>('[data-milestone]', pinEl)
      .sort(
        (a, b) =>
          Number(a.dataset.milestoneIndex ?? 0) - Number(b.dataset.milestoneIndex ?? 0),
      )
    const nodes = gsap.utils
      .toArray<HTMLElement>('[data-mobile-node]', pinEl)
      .sort(
        (a, b) =>
          Number(a.dataset.mobileNodeIndex ?? 0) - Number(b.dataset.mobileNodeIndex ?? 0),
      )

    const count = JOURNEY_MILESTONES.length
    const windows = planEqualWindows(count, {
      motionStart: MOTION_START,
      motionDuration: MOTION_DURATION,
      cascadeRatio: 0.74,
      exitRatio: 0.14,
    })
    const scrollLength = `${count * 150}%`

    const ctx = gsap.context(() => {
      cards.forEach((cardEl) => hideMilestoneCard(cardEl, { fromX: -64 }))
      nodes.forEach((node) => gsap.set(node, { scale: 0.7, autoAlpha: 0.4 }))

      if (trackActive) gsap.set(trackActive, { scaleY: 0 })
      if (markerEl) {
        gsap.set(markerEl, {
          top: `${nodeTopPercent(0, count)}%`,
          autoAlpha: 0,
        })
      }
      if (markerGlow) gsap.set(markerGlow, { autoAlpha: 0 })
      if (markerOrbit) gsap.set(markerOrbit, { autoAlpha: 0 })
      if (markerCompass) gsap.set(markerCompass, { autoAlpha: 0 })

      const tl = gsap.timeline({
        paused: true,
        defaults: { ease: 'power2.out' },
      })

      tl.to(markerEl, { autoAlpha: 1, duration: 0.03 }, 0)
      tl.to(markerGlow, { autoAlpha: 1, duration: 0.03 }, 0)
      tl.to(markerOrbit, { autoAlpha: 0.7, duration: 0.03 }, 0)
      tl.to(markerCompass, { autoAlpha: 1, duration: 0.03 }, 0)

      if (trackActive) {
        tl.to(trackActive, { scaleY: 1, duration: MOTION_DURATION, ease: 'none' }, MOTION_START)
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
            const start = nodeTopPercent(0, count)
            const end = nodeTopPercent(Math.max(count - 1, 0), count)
            markerEl.style.top = `${start + (end - start) * motionObj.progress}%`
          },
        },
        MOTION_START,
      )

      windows.forEach((window, index) => {
        const cardEl = cards[index]
        if (!cardEl) return

        addMilestoneReveal(tl, cardEl, window.revealStart, { slot: window.revealSlot })

        const node = nodes[index]
        if (node) {
          tl.to(
            node,
            {
              autoAlpha: 1,
              scale: 1,
              duration: window.revealSlot * 0.12,
              ease: 'power2.out',
            },
            window.revealStart + window.revealSlot * 0.36,
          )
        }

        if (index < windows.length - 1 && window.exitDuration > 0) {
          addMilestoneExit(tl, cardEl, window.exitStart, window.exitDuration)
        }
      })

      scrollTriggerRef.current = ScrollTrigger.create(
        withFullWidthPin(pinEl, {
          trigger: pinEl,
          start: 'top top',
          end: `+=${scrollLength}`,
          pin: true,
          pinSpacing: true,
          scrub: 0.4,
          anticipatePin: 1,
          animation: tl,
          invalidateOnRefresh: true,
        }),
      )

      patchPinnedSceneWidth(pinEl)
    }, pinEl)

    const unbindLayout = bindPinnedLayoutSync(pinEl, { patchWidth: true })

    return () => {
      unbindLayout()
      scrollTriggerRef.current?.kill()
      scrollTriggerRef.current = null
      ctx.revert()
    }
  }, [enabled, pinRef])

  return scrollTriggerRef
}
