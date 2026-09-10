import { useEffect, useState } from 'react'
import { useAppReady } from '@/contexts/AppReadyContext'

export type DeviceKind = 'mobile' | 'tablet' | 'desktop'

export function resolveDevice(width: number): DeviceKind {
  if (width < 768) return 'mobile'
  if (width < 1024) return 'tablet'
  return 'desktop'
}

/** Shared viewport + reduced-motion gate for pinned GSAP scenes. */
export function usePinnedScene() {
  const [device, setDevice] = useState<DeviceKind | null>(null)
  const [reducedMotion, setReducedMotion] = useState(false)
  const appReady = useAppReady()

  useEffect(() => {
    const motionMq = window.matchMedia('(prefers-reduced-motion: reduce)')
    const update = () => {
      setDevice(resolveDevice(window.innerWidth))
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

  return {
    device,
    reducedMotion,
    scrollEnabled: Boolean(device) && !reducedMotion && appReady,
  }
}
