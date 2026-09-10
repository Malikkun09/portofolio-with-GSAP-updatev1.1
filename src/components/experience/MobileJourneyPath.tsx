import { forwardRef } from 'react'
import { JOURNEY_PATH_POINTS_MOBILE } from './journey-config'
import { JourneyRailPath } from './JourneyPath'

interface MobileJourneyPathProps {
  staticVisible?: boolean
}

const MobileJourneyPath = forwardRef<SVGSVGElement, MobileJourneyPathProps>(
  function MobileJourneyPath({ staticVisible = false }, ref) {
    return (
      <JourneyRailPath
        ref={ref}
        points={JOURNEY_PATH_POINTS_MOBILE}
        idPrefix="mobile-journey"
        staticVisible={staticVisible}
      />
    )
  },
)

export default MobileJourneyPath
