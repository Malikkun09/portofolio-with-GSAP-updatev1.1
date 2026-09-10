import { useEffect, useState } from 'react'
import { resolveDeviceKind, type DeviceKind } from '@/hooks/use-device-kind'

export type HeroLayout = DeviceKind

export function useHeroLayout(): HeroLayout {
  const [layout, setLayout] = useState<HeroLayout>(() =>
    typeof window !== 'undefined' ? resolveDeviceKind(window.innerWidth) : 'desktop',
  )

  useEffect(() => {
    const update = () => setLayout(resolveDeviceKind(window.innerWidth))
    update()
    window.addEventListener('resize', update)
    return () => window.removeEventListener('resize', update)
  }, [])

  return layout
}
