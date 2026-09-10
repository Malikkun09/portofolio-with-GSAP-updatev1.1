import { forwardRef } from 'react'
import MilestoneCard from './MilestoneCard'
import type { JourneyMilestone } from './journey-config'

interface MobileMilestoneCardProps {
  milestone: JourneyMilestone
  index: number
  staticVisible?: boolean
}

const MobileMilestoneCard = forwardRef<HTMLDivElement, MobileMilestoneCardProps>(
  function MobileMilestoneCard(props, ref) {
    return <MilestoneCard ref={ref} size="mobile" {...props} />
  },
)

export default MobileMilestoneCard
