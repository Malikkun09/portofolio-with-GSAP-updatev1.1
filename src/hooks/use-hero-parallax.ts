import { useEffect, type RefObject } from 'react'
import { useMotionValue, useSpring } from 'framer-motion'

const MAX_X = 14
const MAX_Y = 10

export function useHeroParallax(ref: RefObject<HTMLElement | null>) {
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const springX = useSpring(x, { stiffness: 90, damping: 22, mass: 0.4 })
  const springY = useSpring(y, { stiffness: 90, damping: 22, mass: 0.4 })
  const bgX = useSpring(x, { stiffness: 50, damping: 28, mass: 0.6 })
  const bgY = useSpring(y, { stiffness: 50, damping: 28, mass: 0.6 })

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReduced) return

    const onMove = (e: MouseEvent) => {
      const rect = el.getBoundingClientRect()
      const px = (e.clientX - rect.left) / rect.width - 0.5
      const py = (e.clientY - rect.top) / rect.height - 0.5
      x.set(px * MAX_X)
      y.set(py * MAX_Y)
    }

    const onLeave = () => {
      x.set(0)
      y.set(0)
    }

    el.addEventListener('mousemove', onMove, { passive: true })
    el.addEventListener('mouseleave', onLeave)
    return () => {
      el.removeEventListener('mousemove', onMove)
      el.removeEventListener('mouseleave', onLeave)
    }
  }, [ref, x, y])

  return { springX, springY, bgX, bgY }
}
