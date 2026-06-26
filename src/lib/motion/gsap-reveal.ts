import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

interface GsapRevealOptions {
  y?: number
  blur?: number
  duration?: number
  delay?: number
  start?: string
}

export function useGsapReveal<T extends HTMLElement>(
  options: GsapRevealOptions = {},
) {
  const ref = useRef<T>(null)
  const { y = 32, blur = 0, duration = 0.8, delay = 0, start = 'top 88%' } = options

  useEffect(() => {
    const el = ref.current
    if (!el) return undefined

    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReduced) {
      gsap.set(el, { opacity: 1, y: 0, filter: 'blur(0px)' })
      return undefined
    }

    const ctx = gsap.context(() => {
      gsap.fromTo(
        el,
        { opacity: 0, y, filter: blur ? `blur(${blur}px)` : 'blur(0px)' },
        {
          opacity: 1,
          y: 0,
          filter: 'blur(0px)',
          duration,
          delay,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: el,
            start,
            once: true,
          },
        },
      )
    }, el)

    return () => ctx.revert()
  }, [y, blur, duration, delay, start])

  return ref
}

export function animateStaggerChildren(
  container: HTMLElement,
  selector = '[data-reveal-item]',
) {
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  const items = container.querySelectorAll(selector)
  if (prefersReduced || items.length === 0) return () => {}

  const ctx = gsap.context(() => {
    gsap.fromTo(
      items,
      { opacity: 0, y: 24 },
      {
        opacity: 1,
        y: 0,
        duration: 0.65,
        stagger: 0.08,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: container,
          start: 'top 85%',
          once: true,
        },
      },
    )
  }, container)

  return () => ctx.revert()
}
