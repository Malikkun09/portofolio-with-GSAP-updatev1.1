import { forwardRef } from 'react'
import { JOURNEY_PATH_POINTS_TABLET } from './journey-config'
import { JourneyRailPath } from './JourneyPath'

interface TabletJourneyPathProps {
  staticVisible?: boolean
}

const TabletJourneyPath = forwardRef<SVGSVGElement, TabletJourneyPathProps>(
  function TabletJourneyPath({ staticVisible = false }, ref) {
    return (
      <JourneyRailPath
        ref={ref}
        points={JOURNEY_PATH_POINTS_TABLET}
        idPrefix="tablet-journey"
        staticVisible={staticVisible}
      />
    )
  },
)

export default TabletJourneyPath
