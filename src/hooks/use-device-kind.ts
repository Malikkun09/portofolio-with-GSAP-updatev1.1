import { useEffect, useState } from 'react'

export type DeviceKind = 'mobile' | 'tablet' | 'desktop'

export function resolveDeviceKind(width: number): DeviceKind {
  if (width < 768) return 'mobile'
  if (width < 1024) return 'tablet'
  return 'desktop'
}

/**
 * Shared viewport + reduced-motion probe used by pinned GSAP scenes.
 * Starts as `null` so the first paint can wait for a measured layout.
 */
export function useDeviceKind() {
  const [device, setDevice] = useState<DeviceKind | null>(null)
  const [reducedMotion, setReducedMotion] = useState(false)

  useEffect(() => {
    const motionMq = window.matchMedia('(prefers-reduced-motion: reduce)')
    const update = () => {
      setDevice(resolveDeviceKind(window.innerWidth))
      setReducedMotion(motionMq.matches)
    }

    update()
    window.addEventListener('resize', update)
    motionMq.addEventListener('change', update)
    return () => {
      window.removeEventListener('resize', update)
      motionMq.removeEventListener('change', update)
    }
  }, [])

  return { device, reducedMotion }
}
