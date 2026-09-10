import { useLayoutEffect, type RefObject } from 'react'
import { JOURNEY_PATH_POINTS_TABLET } from '@/components/experience/journey-config'
import { setupExperienceJourney } from '@/lib/motion/create-journey-scroll'

export function useTabletExperienceJourney(
  pinRef: RefObject<HTMLElement | null>,
  enabled: boolean,
) {
  useLayoutEffect(() => {
    if (!enabled || !pinRef.current) return undefined
    return setupExperienceJourney(pinRef.current, {
      pathPoints: JOURNEY_PATH_POINTS_TABLET,
      fullWidthPin: true,
      vhPerStep: 68,
    })
  }, [enabled, pinRef])
}
