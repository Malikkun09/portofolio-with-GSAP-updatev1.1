import { useLayoutEffect, useRef, type RefObject } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import {
  getRouteForLayout,
  TECH_STACK_GROUPS,
  TECH_STACK_STEP_COUNT,
} from '@/components/skills/tech-stack-config'
import { getPointOnPath, measureSegmentMilestones } from '@/components/skills/tech-stack-path'

gsap.registerPlugin(ScrollTrigger)

export function useTechStackScroll(
  pinRef: RefObject<HTMLElement | null>,
  enabled: boolean,
  isMobile: boolean,
) {
  const scrollTriggerRef = useRef<ScrollTrigger | null>(null)

  useLayoutEffect(() => {
    if (!enabled || !pinRef.current) return undefined

    const pinEl = pinRef.current
    const route = getRouteForLayout(isMobile)
    const groups = gsap.utils.toArray<HTMLElement>('[data-group]', pinEl)
    const pathEl = pinEl.querySelector<SVGPathElement>('[data-tech-path]')
    const pathBgEl = pinEl.querySelector<SVGPathElement>('[data-tech-path-bg]')
    const hubEl = pinEl.querySelector<SVGCircleElement>('[data-tech-hub]')
    const tipEl = pinEl.querySelector<SVGCircleElement>('[data-tech-path-tip]')
    const anchorEls = gsap.utils.toArray<SVGCircleElement>('[data-tech-anchor]', pinEl)

    const scrollLength = isMobile
      ? `${TECH_STACK_STEP_COUNT * 75}%`
      : `${TECH_STACK_STEP_COUNT * 105}%`

    const ctx = gsap.context(() => {
      const milestones = measureSegmentMilestones(route.hub, route.nodes)

      groups.forEach((groupEl) => {
        gsap.set(groupEl, { autoAlpha: 0, scale: 0.96, y: 8 })

        const glowBorder = groupEl.querySelector('[data-glow-border]')
        const cardBg = groupEl.querySelector('[data-group-card-bg]')
        const card = groupEl.querySelector('[data-group-card]')
        const label = groupEl.querySelector('[data-group-label]')
        const chips = groupEl.querySelectorAll<HTMLElement>('[data-tech-chip]')

        if (glowBorder) gsap.set(glowBorder, { autoAlpha: 0, scale: 0.98 })
        if (cardBg) gsap.set(cardBg, { opacity: 0 })
        if (card) gsap.set(card, { filter: 'blur(4px)' })
        if (label) gsap.set(label, { opacity: 0.4 })
        gsap.set(chips, { autoAlpha: 0, y: 6 })
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
      if (pathBgEl) gsap.set(pathBgEl, { opacity: 0.35 })
      anchorEls.forEach((anchor) => gsap.set(anchor, { opacity: 0.15, scale: 0.8 }))

      // `paused: true` prevents the timeline from playing before
      // ScrollTrigger attaches and takes control via `scrub`. Without this,
      // the timeline can briefly play to completion during the gap between
      // `gsap.timeline()` and `ScrollTrigger.create()`, causing the path and
      // cards to appear fully drawn/visible before the user starts scrolling.
      const tl = gsap.timeline({ paused: true, defaults: { ease: 'power2.out' } })

      tl.to(hubEl, { autoAlpha: 0.85, scale: 1, duration: 0.06, ease: 'power2.out' }, 0)

      if (pathEl && pathLength > 0) {
        tl.to(
          pathEl,
          {
            strokeDashoffset: 0,
            duration: 0.88,
            ease: 'none',
          },
          0.04,
        )
      }

      TECH_STACK_GROUPS.forEach((group, index) => {
        const groupEl = groups[index]
        if (!groupEl) return

        const milestone = milestones[index] ?? (index + 1) / TECH_STACK_STEP_COUNT
        const activateAt = 0.04 + milestone * 0.88
        const slot = 0.07

        const glowBorder = groupEl.querySelector('[data-glow-border]')
        const cardBg = groupEl.querySelector('[data-group-card-bg]')
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
            duration: slot,
            ease: 'power3.out',
          },
          activateAt,
        )

        if (glowBorder) {
          tl.to(
            glowBorder,
            { autoAlpha: 1, scale: 1, duration: slot * 0.9, ease: 'power2.out' },
            activateAt,
          )
        }

        if (cardBg) {
          tl.to(cardBg, { opacity: 1, duration: slot, ease: 'power2.out' }, activateAt)
        }

        if (card) {
          tl.to(
            card,
            {
              filter: 'blur(0px)',
              boxShadow: group.theme.activeGlow,
              duration: slot,
              ease: 'power2.out',
            },
            activateAt,
          )
        }

        if (label) {
          tl.to(label, { opacity: 1, duration: slot * 0.8 }, activateAt + slot * 0.1)
        }

        if (anchor) {
          tl.to(
            anchor,
            {
              opacity: 1,
              scale: 1.2,
              attr: { fill: 'rgba(103, 232, 249, 0.7)' },
              duration: slot * 0.7,
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
              duration: slot * 0.65,
              stagger: 0.012,
              ease: 'power2.out',
            },
            activateAt + slot * 0.15,
          )
        }
      })

      scrollTriggerRef.current = ScrollTrigger.create({
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

          const point = getPointOnPath(pathEl, drawProgress)
          tipEl.setAttribute('cx', String(point.x))
          tipEl.setAttribute('cy', String(point.y))

          if (drawProgress > 0.008 && drawProgress < 0.992) {
            gsap.set(tipEl, { autoAlpha: 0.92, attr: { r: 0.85 } })
          } else {
            gsap.set(tipEl, { autoAlpha: 0, attr: { r: 0.5 } })
          }
        },
      })
    }, pinEl)

    const onResize = () => ScrollTrigger.refresh()
    window.addEventListener('resize', onResize)
    // Defer the first refresh until after the browser has painted the
    // newly-mounted layout. A double rAF guarantees we run after the
    // next commit + paint cycle, so ScrollTrigger measures the final
    // post-mount dimensions rather than a transient pre-paint state.
    let rafId2 = 0
    const rafId1 = window.requestAnimationFrame(() => {
      rafId2 = window.requestAnimationFrame(() => {
        ScrollTrigger.refresh()
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
  }, [enabled, isMobile, pinRef])

  return scrollTriggerRef
}
