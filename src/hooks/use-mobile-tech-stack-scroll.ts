import { useLayoutEffect, useRef, type RefObject } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { TECH_STACK_STEP_COUNT } from '@/components/skills/tech-stack-config'
import { withFullWidthPin, patchPinnedSceneWidth } from '@/lib/scroll-pin'

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

    const scrollLength = `${TECH_STACK_STEP_COUNT * 80}%`

    const ctx = gsap.context(() => {
      groups.forEach((groupEl) => {
        gsap.set(groupEl, { autoAlpha: 0, y: 24 })

        const glowBorder = groupEl.querySelector('[data-glow-border]')
        const card = groupEl.querySelector('[data-group-card]')
        const label = groupEl.querySelector('[data-group-label]')
        const chips = groupEl.querySelectorAll<HTMLElement>('[data-tech-chip]')

        if (glowBorder) gsap.set(glowBorder, { autoAlpha: 0, scale: 0.98 })
        if (card) gsap.set(card, { filter: 'blur(4px)' })
        if (label) gsap.set(label, { opacity: 0.4 })
        gsap.set(chips, { autoAlpha: 0, y: 10 })
      })

      if (trackActive) gsap.set(trackActive, { scaleY: 0 })
      if (trackTip) gsap.set(trackTip, { autoAlpha: 0, y: 0 })
      nodes.forEach((node) => gsap.set(node, { scale: 0.6, autoAlpha: 0.4 }))

      // `paused: true` prevents the timeline from playing before
      // ScrollTrigger attaches and takes control via `scrub`.
      const tl = gsap.timeline({
        paused: true,
        defaults: { ease: 'power2.out' },
      })

      // Line draws vertically from top to bottom, bound to scroll progress
      if (trackActive) {
        tl.to(
          trackActive,
          { scaleY: 1, duration: 0.9, ease: 'none' },
          0.02,
        )
      }

      const slot = 1 / TECH_STACK_STEP_COUNT

      groups.forEach((groupEl, index) => {
        const activateAt = 0.04 + index * slot * 0.92
        const node = nodes[index]
        const glowBorder = groupEl.querySelector('[data-glow-border]')
        const card = groupEl.querySelector('[data-group-card]')
        const label = groupEl.querySelector('[data-group-label]')
        const chips = groupEl.querySelectorAll<HTMLElement>('[data-tech-chip]')

        tl.to(
          groupEl,
          { autoAlpha: 1, y: 0, duration: 0.08, ease: 'power3.out' },
          activateAt,
        )

        if (node) {
          tl.to(
            node,
            {
              autoAlpha: 1,
              scale: 1,
              duration: 0.06,
              ease: 'back.out(2)',
            },
            activateAt,
          )
        }

        if (glowBorder) {
          tl.to(glowBorder, { autoAlpha: 0.7, scale: 1, duration: 0.08 }, activateAt)
        }

        if (card) {
          tl.to(
            card,
            { filter: 'blur(0px)', duration: 0.08, ease: 'power2.out' },
            activateAt,
          )
        }

        if (label) {
          tl.to(label, { opacity: 1, duration: 0.06 }, activateAt + 0.02)
        }

        if (chips.length > 0) {
          tl.to(
            chips,
            {
              autoAlpha: 1,
              y: 0,
              duration: 0.06,
              stagger: 0.015,
              ease: 'power2.out',
            },
            activateAt + 0.04,
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
          scrub: 0.4,
          anticipatePin: 1,
          animation: tl,
          invalidateOnRefresh: true,
          onUpdate: () => {
          if (!trackActive || !trackTip) return

          const scaleY = Number(gsap.getProperty(trackActive, 'scaleY') ?? 0)
          const drawProgress = gsap.utils.clamp(0, 1, scaleY)

          if (drawProgress > 0.005 && drawProgress < 0.99) {
            const trackRect = trackActive.getBoundingClientRect()
            const pinRect = pinEl.getBoundingClientRect()
            const tipY = trackRect.height * drawProgress
            const relativeY = trackRect.top - pinRect.top + tipY

            gsap.set(trackTip, {
              autoAlpha: 0.95,
              y: relativeY,
            })
          } else {
            gsap.set(trackTip, { autoAlpha: 0 })
          }
        },
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
