import { forwardRef } from 'react'
import { cn } from '@/lib/utils'
import { TECH_ROUTE_TABLET } from './tech-stack-config'

interface TabletTechStackConnectorProps {
  staticVisible?: boolean
  className?: string
}

/**
 * Cross-hub SVG connector for tablet layout.
 * Path: hub → Frontend (top) → Backend (right) → Security (bottom) → Design (left)
 * Drawn as engineered orthogonal segments, not random curves.
 */
const TabletTechStackConnector = forwardRef<SVGSVGElement, TabletTechStackConnectorProps>(
  function TabletTechStackConnector({ staticVisible = false, className }, ref) {
    const { hub, nodes } = TECH_ROUTE_TABLET
    // Build orthogonal path: M hub → L node0 → M hub → L node1 → M hub → L node2 → M hub → L node3
    const segments = nodes
      .map((node) => `M ${hub.x} ${hub.y} L ${node.x} ${node.y}`)
      .join(' ')

    return (
      <svg
        ref={ref}
        className={cn('pointer-events-none absolute inset-0 z-10 h-full w-full', className)}
        viewBox="0 0 100 100"
        preserveAspectRatio="xMidYMid meet"
        aria-hidden
      >
        <defs>
          <linearGradient id="tablet-path-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#67e8f9" />
            <stop offset="35%" stopColor="#00B8FF" />
            <stop offset="65%" stopColor="#818cf8" />
            <stop offset="100%" stopColor="#f472b6" />
          </linearGradient>
          <filter id="tablet-path-glow" x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur stdDeviation="1" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <filter id="tablet-tip-glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="0.7" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Idle track */}
        <path
          data-tech-path-bg
          d={segments}
          fill="none"
          stroke="rgba(0, 184, 255, 0.1)"
          strokeWidth="0.3"
          strokeLinecap="round"
        />

        {/* Anchor nodes at card endpoints */}
        {nodes.map((node, i) => (
          <circle
            key={`tablet-anchor-${i}`}
            data-tech-anchor={i}
            cx={node.x}
            cy={node.y}
            r="0.7"
            fill="rgba(0, 184, 255, 0.15)"
            stroke="rgba(0, 184, 255, 0.25)"
            strokeWidth="0.15"
            style={{ opacity: staticVisible ? 0.6 : 0.2 }}
          />
        ))}

        {/* Hub */}
        <circle
          data-tech-hub
          cx={hub.x}
          cy={hub.y}
          r="1"
          fill="rgba(0, 184, 255, 0.4)"
          stroke="rgba(103, 232, 249, 0.5)"
          strokeWidth="0.2"
          filter="url(#tablet-tip-glow)"
          style={{ opacity: staticVisible ? 0.85 : 0 }}
        />

        {/* Active drawing stroke */}
        <path
          data-tech-path
          d={segments}
          fill="none"
          stroke="url(#tablet-path-gradient)"
          strokeWidth="0.45"
          strokeLinecap="round"
          filter="url(#tablet-path-glow)"
          style={{
            opacity: staticVisible ? 0.9 : 0.95,
            strokeDashoffset: staticVisible ? 0 : undefined,
          }}
        />

        {/* Drawing tip */}
        <circle
          data-tech-path-tip
          r="0.8"
          fill="#67e8f9"
          filter="url(#tablet-tip-glow)"
          style={{ opacity: 0 }}
        />
      </svg>
    )
  },
)

export default TabletTechStackConnector
