import { useLayoutEffect, useRef, type RefObject } from 'react'
import { TECH_STACK_GROUPS, TECH_STACK_STEP_COUNT } from '@/components/skills/tech-stack-config'
import { gsap, ScrollTrigger } from '@/lib/gsap'
import { withFullWidthPin, bindPinnedLayoutSync, patchPinnedSceneWidth } from '@/lib/scroll-pin'

/**
 * Tablet-specific scroll controller.
 * Draws 4 orthogonal segments from center hub to each cardinal node.
 * Each segment activates its card when the line reaches it.
 */
export function useTabletTechStackScroll(
  pinRef: RefObject<HTMLElement | null>,
  enabled: boolean,
) {
  const scrollTriggerRef = useRef<ScrollTrigger | null>(null)

  useLayoutEffect(() => {
    if (!enabled || !pinRef.current) return undefined

    const pinEl = pinRef.current
    const groups = gsap.utils.toArray<HTMLElement>('[data-group]', pinEl)
    const pathEl = pinEl.querySelector<SVGPathElement>('[data-tech-path]')
    const pathBgEl = pinEl.querySelector<SVGPathElement>('[data-tech-path-bg]')
    const hubEl = pinEl.querySelector<SVGCircleElement>('[data-tech-hub]')
    const tipEl = pinEl.querySelector<SVGCircleElement>('[data-tech-path-tip]')
    const anchorEls = gsap.utils.toArray<SVGCircleElement>('[data-tech-anchor]', pinEl)

    const scrollLength = `${TECH_STACK_STEP_COUNT * 95}%`

    const ctx = gsap.context(() => {
      groups.forEach((groupEl) => {
        gsap.set(groupEl, { autoAlpha: 0, scale: 0.96, y: 10 })

        const glowBorder = groupEl.querySelector('[data-glow-border]')
        const card = groupEl.querySelector('[data-group-card]')
        const label = groupEl.querySelector('[data-group-label]')
        const chips = groupEl.querySelectorAll<HTMLElement>('[data-tech-chip]')

        if (glowBorder) gsap.set(glowBorder, { autoAlpha: 0, scale: 0.98 })
        if (card) gsap.set(card, { filter: 'blur(4px)' })
        if (label) gsap.set(label, { opacity: 0.4 })
        gsap.set(chips, { autoAlpha: 0, y: 8 })
      })

      let pathLength = 0
      if (pathEl) {
        pathLength = pathEl.getTotalLength()
        gsap.set(pathEl, {
          strokeDasharray: pathLength,
          strokeDashoffset: pathLength,
        })
      }

      if (hubEl) gsap.set(hubEl, { autoAlpha: 0, scale: 0.5 })
      if (tipEl) gsap.set(tipEl, { autoAlpha: 0 })
      if (pathBgEl) gsap.set(pathBgEl, { opacity: 0.4 })
      anchorEls.forEach((anchor) => gsap.set(anchor, { opacity: 0.15, scale: 0.8 }))

      // `paused: true` prevents the timeline from playing before
      // ScrollTrigger attaches and takes control via `scrub`.
      const tl = gsap.timeline({
        paused: true,
        defaults: { ease: 'power2.out' },
      })

      // Hub appears first
      tl.to(hubEl, { autoAlpha: 0.9, scale: 1, duration: 0.05, ease: 'power2.out' }, 0)

      // Path draws linearly with scroll
      if (pathEl && pathLength > 0) {
        tl.to(
          pathEl,
          {
            strokeDashoffset: 0,
            duration: 0.9,
            ease: 'none',
          },
          0.03,
        )
      }

      // 4 equal segments — each card activates at 25%, 50%, 75%, 100% of draw
      const slot = 1 / TECH_STACK_STEP_COUNT

      TECH_STACK_GROUPS.forEach((group, index) => {
        const groupEl = groups[index]
        if (!groupEl) return

        const activateAt = 0.03 + (index + 1) * slot * 0.9 - slot * 0.55
        const animSlot = 0.07

        const glowBorder = groupEl.querySelector('[data-glow-border]')
        const card = groupEl.querySelector('[data-group-card]')
        const label = groupEl.querySelector('[data-group-label]')
        const chips = groupEl.querySelectorAll<HTMLElement>('[data-tech-chip]')
        const anchor = anchorEls[index]

        tl.to(
          groupEl,
          {
            autoAlpha: 1,
            scale: 1,
            y: 0,
            duration: animSlot,
            ease: 'power3.out',
          },
          activateAt,
        )

        if (glowBorder) {
          tl.to(
            glowBorder,
            { autoAlpha: 0.7, scale: 1, duration: animSlot * 0.9, ease: 'power2.out' },
            activateAt,
          )
        }

        if (card) {
          tl.to(
            card,
            {
              filter: 'blur(0px)',
              boxShadow: group.theme.activeGlow,
              duration: animSlot,
              ease: 'power2.out',
            },
            activateAt,
          )
        }

        if (label) {
          tl.to(label, { opacity: 1, duration: animSlot * 0.8 }, activateAt + 0.01)
        }

        if (anchor) {
          tl.to(
            anchor,
            {
              opacity: 1,
              scale: 1.25,
              attr: { fill: 'rgba(103, 232, 249, 0.7)' },
              duration: animSlot * 0.7,
            },
            activateAt,
          )
        }

        if (chips.length > 0) {
          tl.to(
            chips,
            {
              autoAlpha: 1,
              y: 0,
              duration: animSlot * 0.65,
              stagger: 0.012,
              ease: 'power2.out',
            },
            activateAt + animSlot * 0.15,
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
          scrub: 0.45,
          anticipatePin: 1,
          animation: tl,
          invalidateOnRefresh: true,
          onUpdate: () => {
          if (!pathEl || !tipEl || pathLength <= 0) return

          const offset = Number(gsap.getProperty(pathEl, 'strokeDashoffset') ?? pathLength)
          const drawProgress = gsap.utils.clamp(0, 1, 1 - offset / pathLength)
          const totalLen = pathEl.getTotalLength()
          const point = pathEl.getPointAtLength(totalLen * drawProgress)

          tipEl.setAttribute('cx', String(point.x))
          tipEl.setAttribute('cy', String(point.y))

          if (drawProgress > 0.008 && drawProgress < 0.992) {
            gsap.set(tipEl, { autoAlpha: 0.9, attr: { r: 0.8 } })
          } else {
            gsap.set(tipEl, { autoAlpha: 0, attr: { r: 0.5 } })
          }
        },
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
