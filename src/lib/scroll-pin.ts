import { gsap, ScrollTrigger } from '@/lib/gsap'

/** Keep pinned scenes full-bleed — GSAP fixed pin can shrink on mobile. */
export function patchPinnedSceneWidth(pinEl: HTMLElement) {
  const width = document.documentElement.clientWidth
  if (window.scrollX !== 0) {
    window.scrollTo(0, window.scrollY)
  }
  gsap.set(pinEl, {
    width,
    maxWidth: width,
    left: 0,
    right: 'auto',
    marginLeft: 0,
    marginRight: 0,
  })
}

type ScrollTriggerConfig = Parameters<typeof ScrollTrigger.create>[0]

export function withFullWidthPin(
  pinEl: HTMLElement,
  config: ScrollTriggerConfig,
): ScrollTriggerConfig {
  const syncWidth = (self: ScrollTrigger) => {
    if (self.isActive) patchPinnedSceneWidth(pinEl)
  }

  return {
    pinType: 'fixed',
    onEnter: syncWidth,
    onEnterBack: syncWidth,
    onToggle: syncWidth,
    onRefresh: syncWidth,
    ...config,
  }
}

/**
 * Resize + post-paint ScrollTrigger refresh used by every pinned scene.
 * Double rAF waits for the newly-mounted layout to finish painting.
 */
export function bindPinnedLayoutSync(
  pinEl: HTMLElement,
  options: { patchWidth?: boolean } = {},
) {
  const sync = () => {
    ScrollTrigger.refresh()
    if (options.patchWidth) patchPinnedSceneWidth(pinEl)
  }

  window.addEventListener('resize', sync)
  let rafId2 = 0
  const rafId1 = window.requestAnimationFrame(() => {
    rafId2 = window.requestAnimationFrame(sync)
  })

  return () => {
    window.cancelAnimationFrame(rafId1)
    window.cancelAnimationFrame(rafId2)
    window.removeEventListener('resize', sync)
  }
}
