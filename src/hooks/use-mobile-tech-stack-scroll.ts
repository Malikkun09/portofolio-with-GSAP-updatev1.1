import { useLayoutEffect, useRef, type RefObject } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { TECH_STACK_STEP_COUNT } from '@/components/skills/tech-stack-config'
import { withFullWidthPin, patchPinnedSceneWidth } from '@/lib/scroll-pin'
import { PINNED_SCRUB_SKILLS, attachPinnedRefresh, skillsScrollLength } from '@/lib/motion/pinned-scroll'

gsap.registerPlugin(ScrollTrigger)

export function useMobileTechStackScroll(
  pinRef: RefObject<HTMLElement | null>,
  enabled: boolean,
) {
  const scrollTriggerRef = useRef<ScrollTrigger | null>(null)

  useLayoutEffect(() => {
    if (!enabled || !pinRef.current) return undefined

    const pinEl = pinRef.current
    const groups = gsap.utils.toArray<HTMLElement>('[data-group]', pinEl)
    const trackActive = pinEl.querySelector<HTMLElement>('[data-mobile-track-active]')
    const trackTip = pinEl.querySelector<HTMLElement>('[data-mobile-track-tip]')
    const nodes = gsap.utils.toArray<HTMLElement>('[data-mobile-node]')
    const scrollLength = skillsScrollLength(TECH_STACK_STEP_COUNT)

    const ctx = gsap.context(() => {
      groups.forEach((groupEl) => {
        gsap.set(groupEl, { autoAlpha: 0, y: 28, force3D: true })

        const glowBorder = groupEl.querySelector('[data-glow-border]')
        const card = groupEl.querySelector('[data-group-card]')
        const label = groupEl.querySelector('[data-group-label]')
        const chips = groupEl.querySelectorAll<HTMLElement>('[data-tech-chip]')

        if (glowBorder) gsap.set(glowBorder, { autoAlpha: 0, scale: 0.98 })
        if (label) gsap.set(label, { opacity: 0.35 })
        gsap.set(chips, { autoAlpha: 0, y: 8 })
        if (card) gsap.set(card, { clearProps: 'filter' })
      })

      if (trackActive) gsap.set(trackActive, { scaleY: 0 })
      if (trackTip) gsap.set(trackTip, { autoAlpha: 0, y: 0 })
      nodes.forEach((node) => gsap.set(node, { scale: 0.55, autoAlpha: 0.35 }))

      const tl = gsap.timeline({ paused: true, defaults: { ease: 'power2.out' } })
      const slot = 1 / TECH_STACK_STEP_COUNT

      if (trackActive) {
        tl.to(trackActive, { scaleY: 1, duration: 0.92, ease: 'none' }, 0.02)
      }

      groups.forEach((groupEl, index) => {
        const activateAt = 0.04 + index * slot * 0.9
        const node = nodes[index]
        const glowBorder = groupEl.querySelector('[data-glow-border]')
        const label = groupEl.querySelector('[data-group-label]')
        const chips = groupEl.querySelectorAll<HTMLElement>('[data-tech-chip]')

        tl.to(
          groupEl,
          { autoAlpha: 1, y: 0, duration: slot * 0.28, ease: 'power3.out' },
          activateAt,
        )

        if (node) {
          tl.to(
            node,
            { autoAlpha: 1, scale: 1, duration: 0.05, ease: 'back.out(1.8)' },
            activateAt,
          )
        }

        if (glowBorder) {
          tl.to(glowBorder, { autoAlpha: 0.75, scale: 1, duration: slot * 0.24 }, activateAt)
        }

        if (label) {
          tl.to(label, { opacity: 1, duration: 0.05 }, activateAt + 0.015)
        }

        if (chips.length > 0) {
          tl.to(
            chips,
            {
              autoAlpha: 1,
              y: 0,
              duration: slot * 0.2,
              stagger: 0.012,
              ease: 'power2.out',
            },
            activateAt + 0.03,
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
          scrub: PINNED_SCRUB_SKILLS,
          anticipatePin: 1,
          fastScrollEnd: true,
          animation: tl,
          invalidateOnRefresh: true,
          onUpdate: () => {
            if (!trackActive || !trackTip) return

            const scaleY = Number(gsap.getProperty(trackActive, 'scaleY') ?? 0)
            const drawProgress = gsap.utils.clamp(0, 1, scaleY)

            if (drawProgress > 0.01 && drawProgress < 0.99) {
              const trackRect = trackActive.getBoundingClientRect()
              const pinRect = pinEl.getBoundingClientRect()
              const tipY = trackRect.height * drawProgress
              const relativeY = trackRect.top - pinRect.top + tipY
              gsap.set(trackTip, { autoAlpha: 0.95, y: relativeY })
            } else {
              gsap.set(trackTip, { autoAlpha: 0 })
            }
          },
        }),
      )

      patchPinnedSceneWidth(pinEl)
    }, pinEl)

    const detachRefresh = attachPinnedRefresh(() => patchPinnedSceneWidth(pinEl))

    return () => {
      detachRefresh()
      scrollTriggerRef.current?.kill()
      scrollTriggerRef.current = null
      ctx.revert()
    }
  }, [enabled, pinRef])

  return scrollTriggerRef
}
