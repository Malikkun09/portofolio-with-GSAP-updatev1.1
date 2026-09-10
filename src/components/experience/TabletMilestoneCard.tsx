import { forwardRef } from 'react'
import MilestoneCard from './MilestoneCard'
import type { JourneyMilestone } from './journey-config'

interface TabletMilestoneCardProps {
  milestone: JourneyMilestone
  index: number
  staticVisible?: boolean
}

const TabletMilestoneCard = forwardRef<HTMLDivElement, TabletMilestoneCardProps>(
  function TabletMilestoneCard(props, ref) {
    return <MilestoneCard ref={ref} size="tablet" {...props} />
  },
)

export default TabletMilestoneCard
