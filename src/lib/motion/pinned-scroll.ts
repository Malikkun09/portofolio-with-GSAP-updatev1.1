import { ScrollTrigger } from 'gsap/ScrollTrigger'

/** Tight scrub so pinned scenes track the wheel instead of trailing behind. */
export const PINNED_SCRUB_SKILLS = 0.12
export const PINNED_SCRUB_JOURNEY = 0.16

export function skillsScrollLength(stepCount: number) {
  return `${stepCount * 68}%`
}

export function journeyScrollLength(stepCount: number, vhPerStep = 72) {
  return `${stepCount * vhPerStep}%`
}

/** Debounced refresh so resize storms don't stall ScrollTrigger. */
export function attachPinnedRefresh(onRefresh?: () => void) {
  let timeout = 0
  const refresh = () => {
    ScrollTrigger.refresh()
    onRefresh?.()
  }

  const onResize = () => {
    window.clearTimeout(timeout)
    timeout = window.setTimeout(refresh, 140)
  }

  window.addEventListener('resize', onResize)

  let rafId2 = 0
  const rafId1 = window.requestAnimationFrame(() => {
    rafId2 = window.requestAnimationFrame(refresh)
  })

  return () => {
    window.cancelAnimationFrame(rafId1)
    window.cancelAnimationFrame(rafId2)
    window.clearTimeout(timeout)
    window.removeEventListener('resize', onResize)
  }
}
