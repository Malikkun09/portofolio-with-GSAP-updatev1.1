import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { TECH_STACK_GROUPS, TECH_STACK_STEP_COUNT } from '@/components/skills/tech-stack-config'
import { patchPinnedSceneWidth, withFullWidthPin } from '@/lib/scroll-pin'
import { PINNED_SCRUB_SKILLS, attachPinnedRefresh, skillsScrollLength } from '@/lib/motion/pinned-scroll'

gsap.registerPlugin(ScrollTrigger)

interface TechStackScrollOptions {
  fullWidthPin?: boolean
}

function syncSpokeTip(
  spoke: SVGPathElement,
  tipEl: SVGCircleElement | null,
  length: number,
) {
  if (!tipEl || length <= 0) return
  const offset = Number(gsap.getProperty(spoke, 'strokeDashoffset') ?? length)
  const drawn = gsap.utils.clamp(0, 1, 1 - offset / length)
  const point = spoke.getPointAtLength(length * drawn)
  tipEl.setAttribute('cx', String(point.x))
  tipEl.setAttribute('cy', String(point.y))
  const visible = drawn > 0.04 && drawn < 0.97
  gsap.set(tipEl, { autoAlpha: visible ? 0.95 : 0, attr: { r: visible ? 0.9 : 0.45 } })
}

/** Radial spoke scene used by desktop + tablet tech stack. */
export function setupTechStackSpokes(pinEl: HTMLElement, options: TechStackScrollOptions = {}) {
  const { fullWidthPin = false } = options
  const groups = gsap.utils.toArray<HTMLElement>('[data-group]', pinEl)
  const spokes = gsap.utils.toArray<SVGPathElement>('[data-tech-spoke]', pinEl)
  const hubEl = pinEl.querySelector<SVGCircleElement>('[data-tech-hub]')
  const hubRings = gsap.utils.toArray<SVGElement>('[data-tech-hub-ring]', pinEl)
  const tipEl = pinEl.querySelector<SVGCircleElement>('[data-tech-path-tip]')
  const pathBgEl = pinEl.querySelector<SVGElement>('[data-tech-path-bg]')
  const anchorEls = gsap.utils.toArray<SVGCircleElement>('[data-tech-anchor]', pinEl)

  const scrollLength = skillsScrollLength(TECH_STACK_STEP_COUNT)

  const ctx = gsap.context(() => {
    groups.forEach((groupEl) => {
      gsap.set(groupEl, { autoAlpha: 0, scale: 0.94, y: 12, force3D: true })

      const glowBorder = groupEl.querySelector('[data-glow-border]')
      const cardBg = groupEl.querySelector('[data-group-card-bg]')
      const card = groupEl.querySelector('[data-group-card]')
      const label = groupEl.querySelector('[data-group-label]')
      const chips = groupEl.querySelectorAll<HTMLElement>('[data-tech-chip]')

      if (glowBorder) gsap.set(glowBorder, { autoAlpha: 0, scale: 0.98 })
      if (cardBg) gsap.set(cardBg, { opacity: 0 })
      if (label) gsap.set(label, { opacity: 0.35 })
      gsap.set(chips, { autoAlpha: 0, y: 8 })
      if (card) gsap.set(card, { clearProps: 'filter' })
    })

    const spokeLengths = spokes.map((spoke) => {
      const length = spoke.getTotalLength()
      gsap.set(spoke, { strokeDasharray: length, strokeDashoffset: length })
      return length
    })

    if (hubEl) gsap.set(hubEl, { autoAlpha: 0, scale: 0.4, transformOrigin: '50% 50%' })
    gsap.set(hubRings, { autoAlpha: 0 })
    if (tipEl) gsap.set(tipEl, { autoAlpha: 0 })
    if (pathBgEl) gsap.set(pathBgEl, { opacity: 0.4 })
    anchorEls.forEach((anchor) => gsap.set(anchor, { opacity: 0.12, scale: 0.75 }))

    const tl = gsap.timeline({ paused: true, defaults: { ease: 'power2.out' } })
    const slot = 1 / TECH_STACK_STEP_COUNT

    tl.to(hubEl, { autoAlpha: 1, scale: 1, duration: 0.05, ease: 'back.out(1.6)' }, 0)
    tl.to(hubRings, { autoAlpha: 0.85, duration: 0.06, ease: 'power2.out' }, 0)

    TECH_STACK_GROUPS.forEach((group, index) => {
      const groupEl = groups[index]
      const spoke = spokes[index]
      const spokeLength = spokeLengths[index] ?? 0
      if (!groupEl) return

      const startAt = index * slot + 0.02
      const glowBorder = groupEl.querySelector('[data-glow-border]')
      const cardBg = groupEl.querySelector('[data-group-card-bg]')
      const card = groupEl.querySelector('[data-group-card]')
      const label = groupEl.querySelector('[data-group-label]')
      const chips = groupEl.querySelectorAll<HTMLElement>('[data-tech-chip]')
      const anchor = anchorEls[index]

      if (spoke && spokeLength > 0) {
        tl.to(
          spoke,
          {
            strokeDashoffset: 0,
            duration: slot * 0.5,
            ease: 'none',
            onUpdate: () => syncSpokeTip(spoke, tipEl, spokeLength),
          },
          startAt,
        )
      }

      if (hubEl) {
        tl.fromTo(
          hubEl,
          { scale: 1 },
          { scale: 1.18, duration: 0.04, yoyo: true, repeat: 1, ease: 'power2.out' },
          startAt,
        )
      }

      const revealAt = startAt + slot * 0.18

      tl.to(
        groupEl,
        {
          autoAlpha: 1,
          scale: 1,
          y: 0,
          duration: slot * 0.32,
          ease: 'power3.out',
        },
        revealAt,
      )

      if (glowBorder) {
        tl.to(
          glowBorder,
          { autoAlpha: 1, scale: 1, duration: slot * 0.28, ease: 'power2.out' },
          revealAt,
        )
      }

      if (cardBg) {
        tl.to(cardBg, { opacity: 1, duration: slot * 0.3, ease: 'power2.out' }, revealAt)
      }

      if (card) {
        tl.to(
          card,
          { boxShadow: group.theme.activeGlow, duration: slot * 0.3, ease: 'power2.out' },
          revealAt,
        )
      }

      if (label) {
        tl.to(label, { opacity: 1, duration: slot * 0.22 }, revealAt + 0.01)
      }

      if (anchor) {
        tl.to(
          anchor,
          {
            opacity: 1,
            scale: 1.25,
            attr: { fill: 'rgba(103, 232, 249, 0.75)' },
            duration: slot * 0.22,
          },
          startAt + slot * 0.12,
        )
      }

      if (chips.length > 0) {
        tl.to(
          chips,
          {
            autoAlpha: 1,
            y: 0,
            duration: slot * 0.22,
            stagger: 0.01,
            ease: 'power2.out',
          },
          revealAt + slot * 0.08,
        )
      }
    })

    const triggerConfig = {
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
      onUpdate: (self: ScrollTrigger) => {
        const active = Math.min(
          TECH_STACK_STEP_COUNT - 1,
          Math.max(0, Math.floor(self.progress * TECH_STACK_STEP_COUNT + 0.02)),
        )
        groups.forEach((groupEl, index) => {
          const isCurrent = index === active && self.progress > 0.02
          const revealed = self.progress > (index + 0.15) / TECH_STACK_STEP_COUNT
          groupEl.classList.toggle('tech-stack-group--current', isCurrent)
          groupEl.classList.toggle('tech-stack-group--dim', revealed && !isCurrent)
        })
      },
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
