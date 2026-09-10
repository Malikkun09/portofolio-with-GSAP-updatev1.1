import { useLayoutEffect, useRef, type RefObject } from 'react'
import { JOURNEY_MILESTONES } from '@/components/experience/journey-config'
import { nodeTopPercent } from '@/components/experience/MobileJourneyRail'
import {
  addMilestoneExit,
  addMilestoneReveal,
  hideMilestoneCard,
} from '@/lib/experience-reveal'
import { gsap, ScrollTrigger } from '@/lib/gsap'
import { withFullWidthPin, bindPinnedLayoutSync, patchPinnedSceneWidth } from '@/lib/scroll-pin'

/**
 * Mobile experience — pinned one-active-card journey.
 * Marker travels a vertical rail; each milestone (Learning → Full Stack)
 * enters from the left, then year / index, then the rest of the copy.
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
    const scrollLength = `${count * 120}%`

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

      const MOTION_START = 0.03
      const MOTION_DURATION = 0.94
      const slot = MOTION_DURATION / count

      const tl = gsap.timeline({
        paused: true,
        defaults: { ease: 'power2.out' },
      })

      tl.to(markerEl, { autoAlpha: 1, duration: 0.04 }, 0)
      tl.to(markerGlow, { autoAlpha: 1, duration: 0.04 }, 0)
      tl.to(markerOrbit, { autoAlpha: 0.7, duration: 0.04 }, 0)
      tl.to(markerCompass, { autoAlpha: 1, duration: 0.04 }, 0)

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

      cards.forEach((cardEl, index) => {
        const activateAt = MOTION_START + index * slot
        const node = nodes[index]

        if (index > 0) {
          const prev = cards[index - 1]
          if (prev) addMilestoneExit(tl, prev, activateAt - slot * 0.12, slot * 0.16)
        }

        addMilestoneReveal(tl, cardEl, activateAt + slot * 0.04, { slot: slot * 0.72 })

        if (node) {
          tl.to(
            node,
            {
              autoAlpha: 1,
              scale: 1,
              duration: slot * 0.18,
              ease: 'back.out(2)',
            },
            activateAt + slot * 0.08,
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
          scrub: 0.55,
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
