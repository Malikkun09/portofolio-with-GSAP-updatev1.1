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
   * Beats are laid out end-to-end inside this window — they do not overlap.
   */
  slot?: number
}

export interface JourneyWindow {
  index: number
  windowStart: number
  windowEnd: number
  revealStart: number
  revealSlot: number
  revealEnd: number
  exitStart: number
  exitDuration: number
}

/**
 * Fractions of `slot`. Each beat starts after the previous one has finished.
 *
 * 0.00–0.32  card enters from the left and fades in (inner copy stays off)
 * 0.36–0.54  year + step number
 * 0.58–0.70  title
 * 0.70–0.80  company
 * 0.80–0.90  description
 * 0.90–1.00  tags
 */
const BEAT = {
  enterStart: 0,
  enterEnd: 0.32,
  stampStart: 0.36,
  stampEnd: 0.54,
  titleStart: 0.58,
  companyStart: 0.70,
  descStart: 0.80,
  tagsStart: 0.90,
  end: 1,
} as const

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
 * Inner copy stays fully off until its own beat.
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
  if (parts.card) gsap.set(parts.card, { filter: 'blur(10px)' })
  if (parts.year) gsap.set(parts.year, { autoAlpha: 0, x: -16, y: 0, scale: 1 })
  if (parts.indexLabel) gsap.set(parts.indexLabel, { autoAlpha: 0, x: 0, y: 0 })
  if (parts.title) gsap.set(parts.title, { autoAlpha: 0, y: 10 })
  if (parts.company) gsap.set(parts.company, { autoAlpha: 0, y: 8 })
  if (parts.desc) gsap.set(parts.desc, { autoAlpha: 0, y: 8 })
  if (parts.leg) gsap.set(parts.leg, { autoAlpha: 0 })
  gsap.set(parts.tags, { autoAlpha: 0, y: 6 })
}

/**
 * Equal chronological windows so milestone N cannot start its timestamp
 * while milestone N-1 is still mid-cascade.
 */
export function planEqualWindows(
  count: number,
  options: {
    motionStart?: number
    motionDuration?: number
    /** Share of each window used by the reveal cascade (rest is hold / exit). */
    cascadeRatio?: number
    exitRatio?: number
  } = {},
): JourneyWindow[] {
  const motionStart = options.motionStart ?? 0.04
  const motionDuration = options.motionDuration ?? 0.92
  const cascadeRatio = options.cascadeRatio ?? 0.86
  const exitRatio = options.exitRatio ?? 0
  const n = Math.max(count, 1)
  const slot = motionDuration / n

  return Array.from({ length: count }, (_, index) => {
    const windowStart = motionStart + index * slot
    const revealSlot = slot * cascadeRatio
    const exitDuration = slot * exitRatio
    const exitStart = windowStart + revealSlot + slot * 0.04

    return {
      index,
      windowStart,
      windowEnd: windowStart + slot,
      revealStart: windowStart,
      revealSlot,
      revealEnd: windowStart + revealSlot,
      exitStart,
      exitDuration,
    }
  })
}

/**
 * Sequential scrub reveal. Returns the timeline time when this cascade ends.
 *
 * 1. Card/panel from the left + fade in
 * 2. Year / step number — only after the enter has landed
 * 3. Title → company → description → tags, each after the previous beat
 */
export function addMilestoneReveal(
  tl: gsap.core.Timeline,
  cardEl: HTMLElement,
  startAt: number,
  options: MilestoneRevealOptions = {},
): number {
  const { xPercent, slot = 0.2 } = options
  const parts = queryMilestoneParts(cardEl)
  const at = (frac: number) => startAt + slot * frac
  const dur = (startFrac: number, endFrac: number) => slot * (endFrac - startFrac)

  const enterDur = dur(BEAT.enterStart, BEAT.enterEnd)
  const stampDur = dur(BEAT.stampStart, BEAT.stampEnd)
  const titleDur = dur(BEAT.titleStart, BEAT.companyStart)
  const companyDur = dur(BEAT.companyStart, BEAT.descStart)
  const descDur = dur(BEAT.descStart, BEAT.tagsStart)
  const tagsDur = dur(BEAT.tagsStart, BEAT.end)

  tl.to(
    cardEl,
    {
      autoAlpha: 1,
      x: 0,
      ...(xPercent !== undefined ? { xPercent } : {}),
      duration: enterDur,
      ease: 'power2.out',
    },
    at(BEAT.enterStart),
  )

  if (parts.glow) {
    tl.to(
      parts.glow,
      { autoAlpha: 0.75, duration: enterDur, ease: 'power2.out' },
      at(BEAT.enterStart),
    )
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
      at(BEAT.enterStart),
    )
  }

  if (parts.leg) {
    tl.to(
      parts.leg,
      { autoAlpha: 0.7, duration: enterDur * 0.6, ease: 'power2.out' },
      at(BEAT.enterStart) + enterDur * 0.25,
    )
  }

  if (parts.year) {
    tl.to(
      parts.year,
      { autoAlpha: 1, x: 0, duration: stampDur, ease: 'power2.out' },
      at(BEAT.stampStart),
    )
  }

  if (parts.indexLabel) {
    tl.to(
      parts.indexLabel,
      { autoAlpha: 1, duration: stampDur * 0.85, ease: 'power2.out' },
      at(BEAT.stampStart) + stampDur * 0.12,
    )
  }

  if (parts.title) {
    tl.to(
      parts.title,
      { autoAlpha: 1, y: 0, duration: titleDur, ease: 'power2.out' },
      at(BEAT.titleStart),
    )
  }

  if (parts.company) {
    tl.to(
      parts.company,
      { autoAlpha: 0.9, y: 0, duration: companyDur, ease: 'power2.out' },
      at(BEAT.companyStart),
    )
  }

  if (parts.desc) {
    tl.to(
      parts.desc,
      { autoAlpha: 0.95, y: 0, duration: descDur, ease: 'power2.out' },
      at(BEAT.descStart),
    )
  }

  if (parts.tags.length > 0) {
    const tagStagger = Math.min(slot * 0.02, tagsDur / Math.max(parts.tags.length, 1))
    tl.to(
      parts.tags,
      {
        autoAlpha: 0.95,
        y: 0,
        duration: tagsDur * 0.7,
        stagger: tagStagger,
        ease: 'power2.out',
      },
      at(BEAT.tagsStart),
    )
  }

  return startAt + slot
}

export function addMilestoneExit(
  tl: gsap.core.Timeline,
  cardEl: HTMLElement,
  startAt: number,
  duration = 0.06,
): number {
  tl.to(
    cardEl,
    { autoAlpha: 0, x: -32, duration, ease: 'power2.in' },
    startAt,
  )
  return startAt + duration
}
