import { useLayoutEffect, type RefObject } from 'react'
import { JOURNEY_PATH_POINTS } from '@/components/experience/journey-config'
import { setupExperienceJourney } from '@/lib/motion/create-journey-scroll'

export function useExperienceJourney(
  pinRef: RefObject<HTMLElement | null>,
  enabled: boolean,
) {
  useLayoutEffect(() => {
    if (!enabled || !pinRef.current) return undefined
    return setupExperienceJourney(pinRef.current, {
      pathPoints: JOURNEY_PATH_POINTS,
      vhPerStep: 72,
    })
  }, [enabled, pinRef])
}
