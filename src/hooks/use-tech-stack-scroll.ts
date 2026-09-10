import { useLayoutEffect, type RefObject } from 'react'
import { setupTechStackSpokes } from '@/lib/motion/create-tech-stack-scroll'

export function useTechStackScroll(
  pinRef: RefObject<HTMLElement | null>,
  enabled: boolean,
  _isMobile = false,
) {
  useLayoutEffect(() => {
    if (!enabled || !pinRef.current) return undefined
    return setupTechStackSpokes(pinRef.current)
  }, [enabled, pinRef])
}
