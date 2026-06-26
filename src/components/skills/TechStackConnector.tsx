import { forwardRef } from 'react'
import { cn } from '@/lib/utils'
import { getRouteForLayout } from './tech-stack-config'
import { buildCircuitPath } from './tech-stack-path'

interface TechStackConnectorProps {
  isMobile: boolean
  staticVisible?: boolean
  className?: string
}

const TechStackConnector = forwardRef<SVGSVGElement, TechStackConnectorProps>(
  function TechStackConnector({ isMobile, staticVisible = false, className }, ref) {
    const route = getRouteForLayout(isMobile)
    const pathD = buildCircuitPath(route.hub, route.nodes)

    return (
      <svg
        ref={ref}
        className={cn('pointer-events-none absolute inset-0 z-10 h-full w-full', className)}
        viewBox="0 0 100 100"
        preserveAspectRatio="xMidYMid meet"
        aria-hidden
      >
        <defs>
          <linearGradient id="tech-path-active-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#67e8f9" />
            <stop offset="35%" stopColor="#00B8FF" />
            <stop offset="65%" stopColor="#818cf8" />
            <stop offset="100%" stopColor="#f472b6" />
          </linearGradient>

          <filter id="tech-path-active-glow" x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur stdDeviation="1.2" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          <filter id="tech-path-tip-glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="0.8" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Idle track */}
        <path
          data-tech-path-bg
          d={pathD}
          fill="none"
          stroke="rgba(0, 184, 255, 0.1)"
          strokeWidth="0.28"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Anchor nodes — subtle when idle */}
        {route.nodes.map((node, i) => (
          <circle
            key={`anchor-${i}`}
            data-tech-anchor={i}
            cx={node.x}
            cy={node.y}
            r="0.65"
            fill="rgba(0, 184, 255, 0.15)"
            stroke="rgba(0, 184, 255, 0.25)"
            strokeWidth="0.15"
            style={{ opacity: staticVisible ? 0.6 : 0.2 }}
          />
        ))}

        {/* Hub */}
        <circle
          data-tech-hub
          cx={route.hub.x}
          cy={route.hub.y}
          r="0.9"
          fill="rgba(0, 184, 255, 0.35)"
          stroke="rgba(103, 232, 249, 0.5)"
          strokeWidth="0.2"
          filter="url(#tech-path-tip-glow)"
          style={{ opacity: staticVisible ? 0.8 : 0 }}
        />

        {/* Active drawing stroke */}
        <path
          data-tech-path
          d={pathD}
          fill="none"
          stroke="url(#tech-path-active-gradient)"
          strokeWidth="0.42"
          strokeLinecap="round"
          strokeLinejoin="round"
          filter="url(#tech-path-active-glow)"
          style={{
            opacity: staticVisible ? 0.9 : 0.95,
            strokeDashoffset: staticVisible ? 0 : undefined,
          }}
        />

        {/* Drawing tip */}
        <circle
          data-tech-path-tip
          r="0.85"
          fill="#67e8f9"
          filter="url(#tech-path-tip-glow)"
          style={{ opacity: staticVisible ? 0 : 0 }}
        />
      </svg>
    )
  },
)

export default TechStackConnector
