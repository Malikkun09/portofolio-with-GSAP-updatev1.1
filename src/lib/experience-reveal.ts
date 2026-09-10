import { gsap } from '@/lib/gsap'

export interface MilestoneParts {
  glow: Element | null
  card: HTMLElement | null
  year: HTMLElement | null
  indexLabel: HTMLElement | null
  title: HTMLElement | null
  company: HTMLElement | null
  desc: HTMLElement | null
  tags: HTMLElement[]
  leg: HTMLElement | null
}

export interface MilestoneHideOptions {
  /** Combined with GSAP `x` so path-centered cards keep translateX(-50%). */
  xPercent?: number
  fromX?: number
}

export interface MilestoneRevealOptions extends MilestoneHideOptions {
  /**
   * Timeline length reserved for one card's cascade.
   * Keep this readable while scrubbing — not a single 60ms flash.
   */
  slot?: number
}

export function queryMilestoneParts(cardEl: HTMLElement): MilestoneParts {
  return {
    glow: cardEl.querySelector('[data-milestone-glow]'),
    card: cardEl.querySelector<HTMLElement>('[data-milestone-card]'),
    year: cardEl.querySelector<HTMLElement>('[data-milestone-year]'),
    indexLabel: cardEl.querySelector<HTMLElement>('[data-milestone-index-label]'),
    title: cardEl.querySelector<HTMLElement>('[data-milestone-title]'),
    company: cardEl.querySelector<HTMLElement>('[data-milestone-company]'),
    desc: cardEl.querySelector<HTMLElement>('[data-milestone-desc]'),
    tags: gsap.utils.toArray<HTMLElement>('[data-milestone-tag]', cardEl),
    leg: cardEl.querySelector<HTMLElement>('[data-milestone-leg]'),
  }
}

/**
 * Hidden rest state: panel sits off-left so the first tween is a left → fade.
 */
export function hideMilestoneCard(cardEl: HTMLElement, options: MilestoneHideOptions = {}) {
  const { xPercent, fromX = -56 } = options
  const parts = queryMilestoneParts(cardEl)

  gsap.set(cardEl, {
    autoAlpha: 0,
    x: fromX,
    ...(xPercent !== undefined ? { xPercent } : {}),
  })

  if (parts.glow) gsap.set(parts.glow, { autoAlpha: 0 })
  if (parts.card) gsap.set(parts.card, { filter: 'blur(8px)' })
  if (parts.year) gsap.set(parts.year, { autoAlpha: 0, x: -18, scale: 0.92 })
  if (parts.indexLabel) gsap.set(parts.indexLabel, { autoAlpha: 0, y: -8 })
  if (parts.title) gsap.set(parts.title, { autoAlpha: 0, y: 12 })
  if (parts.company) gsap.set(parts.company, { autoAlpha: 0, y: 10 })
  if (parts.desc) gsap.set(parts.desc, { autoAlpha: 0, y: 10 })
  if (parts.leg) gsap.set(parts.leg, { autoAlpha: 0 })
  gsap.set(parts.tags, { autoAlpha: 0, y: 8 })
}

/**
 * Sequential scrub reveal:
 * 1. Card/panel from the left + fade in
 * 2. Year / step number
 * 3. Title → company → description → tags
 */
export function addMilestoneReveal(
  tl: gsap.core.Timeline,
  cardEl: HTMLElement,
  startAt: number,
  options: MilestoneRevealOptions = {},
) {
  const { xPercent, slot = 0.14 } = options
  const parts = queryMilestoneParts(cardEl)

  const enterDur = slot * 0.42
  const stampAt = startAt + enterDur * 0.72
  const stampDur = slot * 0.28
  const copyAt = stampAt + stampDur * 0.55

  tl.to(
    cardEl,
    {
      autoAlpha: 1,
      x: 0,
      ...(xPercent !== undefined ? { xPercent } : {}),
      duration: enterDur,
      ease: 'power3.out',
    },
    startAt,
  )

  if (parts.glow) {
    tl.to(parts.glow, { autoAlpha: 0.75, duration: enterDur * 0.9, ease: 'power2.out' }, startAt)
  }

  if (parts.card) {
    tl.to(
      parts.card,
      {
        filter: 'blur(0px)',
        boxShadow: 'var(--milestone-active-shadow)',
        duration: enterDur,
        ease: 'power2.out',
      },
      startAt,
    )
  }

  if (parts.leg) {
    tl.to(parts.leg, { autoAlpha: 0.7, duration: enterDur * 0.7 }, startAt + enterDur * 0.2)
  }

  if (parts.year) {
    tl.to(
      parts.year,
      { autoAlpha: 1, x: 0, scale: 1, duration: stampDur, ease: 'back.out(1.6)' },
      stampAt,
    )
  }

  if (parts.indexLabel) {
    tl.to(
      parts.indexLabel,
      { autoAlpha: 1, y: 0, duration: stampDur * 0.85, ease: 'power2.out' },
      stampAt + stampDur * 0.12,
    )
  }

  if (parts.title) {
    tl.to(parts.title, { autoAlpha: 1, y: 0, duration: slot * 0.22, ease: 'power2.out' }, copyAt)
  }

  if (parts.company) {
    tl.to(
      parts.company,
      { autoAlpha: 0.9, y: 0, duration: slot * 0.2, ease: 'power2.out' },
      copyAt + slot * 0.08,
    )
  }

  if (parts.desc) {
    tl.to(
      parts.desc,
      { autoAlpha: 0.95, y: 0, duration: slot * 0.22, ease: 'power2.out' },
      copyAt + slot * 0.15,
    )
  }

  if (parts.tags.length > 0) {
    tl.to(
      parts.tags,
      {
        autoAlpha: 0.95,
        y: 0,
        duration: slot * 0.18,
        stagger: 0.018,
        ease: 'power2.out',
      },
      copyAt + slot * 0.24,
    )
  }
}

export function addMilestoneExit(
  tl: gsap.core.Timeline,
  cardEl: HTMLElement,
  startAt: number,
  duration = 0.06,
) {
  tl.to(
    cardEl,
    { autoAlpha: 0, x: -28, duration, ease: 'power2.in' },
    startAt,
  )
}
