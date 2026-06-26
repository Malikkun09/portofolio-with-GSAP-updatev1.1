import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

const NAV_OFFSET = 80

/**
 * Lenis instance registry — set by SmoothScrollProvider so that non-React
 * utilities (like scrollToSection) can drive Lenis-driven smooth scrolling
 * without conflicting with native `window.scrollTo({behavior:'smooth'})`,
 * which causes stutter/crash when both run at once.
 */
let registeredLenis: {
  scrollTo: (
    target: string | number | HTMLElement,
    options?: { offset?: number; duration?: number; immediate?: boolean },
  ) => void
} | null = null

export function registerLenisInstance(
  inst: {
    scrollTo: (
      target: string | number | HTMLElement,
      options?: { offset?: number; duration?: number; immediate?: boolean },
    ) => void
  } | null,
) {
  registeredLenis = inst
}

export function scrollToSection(id: string) {
  const el = document.getElementById(id)
  if (!el) return

  if (registeredLenis) {
    registeredLenis.scrollTo(el, { offset: -NAV_OFFSET, duration: 1.4 })
    return
  }

  // Reduced-motion fallback — no Lenis, use native jump (avoid native smooth
  // because it can stutter on heavy pages).
  const top = el.getBoundingClientRect().top + window.scrollY - NAV_OFFSET
  window.scrollTo(0, Math.max(0, top))
}

export function scrollToTop() {
  if (registeredLenis) {
    registeredLenis.scrollTo(0, { duration: 1.4 })
    return
  }
  window.scrollTo(0, 0)
}
