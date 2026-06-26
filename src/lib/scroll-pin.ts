import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

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
