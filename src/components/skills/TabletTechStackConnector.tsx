import { forwardRef } from 'react'
import TechStackConnector from './TechStackConnector'
import { TECH_ROUTE_TABLET } from './tech-stack-config'

interface TabletTechStackConnectorProps {
  staticVisible?: boolean
  className?: string
}

const TabletTechStackConnector = forwardRef<SVGSVGElement, TabletTechStackConnectorProps>(
  function TabletTechStackConnector({ staticVisible = false, className }, ref) {
    return (
      <TechStackConnector
        ref={ref}
        route={TECH_ROUTE_TABLET}
        staticVisible={staticVisible}
        className={className}
        gradientId="tablet-tech"
      />
    )
  },
)

export default TabletTechStackConnector
