import { useLayoutEffect, type RefObject } from 'react'
import { setupTechStackSpokes } from '@/lib/motion/create-tech-stack-scroll'

export function useTabletTechStackScroll(
  pinRef: RefObject<HTMLElement | null>,
  enabled: boolean,
) {
  useLayoutEffect(() => {
    if (!enabled || !pinRef.current) return undefined
    return setupTechStackSpokes(pinRef.current, { fullWidthPin: true })
  }, [enabled, pinRef])
}
