import { forwardRef } from 'react'
import { cn } from '@/lib/utils'
import type { RouteNode } from './tech-stack-config'
import { TECH_ROUTE_DESKTOP } from './tech-stack-config'
import { buildSpokePath, buildSpokeTrack } from './tech-stack-path'

interface TechStackConnectorProps {
  route?: { hub: RouteNode; nodes: RouteNode[] }
  /** @deprecated unused — desktop always uses the constellation route */
  isMobile?: boolean
  staticVisible?: boolean
  className?: string
  gradientId?: string
}

const TechStackConnector = forwardRef<SVGSVGElement, TechStackConnectorProps>(
  function TechStackConnector({
    route = TECH_ROUTE_DESKTOP,
    staticVisible = false,
    className,
    gradientId = 'tech-path',
  }, ref) {
    const trackD = buildSpokeTrack(route.hub, route.nodes)
    const strokeGrad = `${gradientId}-active-gradient`
    const pathGlow = `${gradientId}-active-glow`
    const tipGlow = `${gradientId}-tip-glow`

    return (
      <svg
        ref={ref}
        className={cn('pointer-events-none absolute inset-0 z-10 h-full w-full', className)}
        viewBox="0 0 100 100"
        preserveAspectRatio="xMidYMid meet"
        aria-hidden
      >
        <defs>
          <linearGradient id={strokeGrad} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#67e8f9" />
            <stop offset="40%" stopColor="#00B8FF" />
            <stop offset="70%" stopColor="#818cf8" />
            <stop offset="100%" stopColor="#f472b6" />
          </linearGradient>

          <filter id={pathGlow} x="-40%" y="-40%" width="180%" height="180%">
            <feGaussianBlur stdDeviation="0.9" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          <filter id={tipGlow} x="-80%" y="-80%" width="260%" height="260%">
            <feGaussianBlur stdDeviation="0.7" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        <path
          data-tech-path-bg
          d={trackD}
          fill="none"
          stroke="rgba(0, 184, 255, 0.12)"
          strokeWidth="0.28"
          strokeLinecap="round"
        />

        {route.nodes.map((node, i) => (
          <circle
            key={`anchor-${i}`}
            data-tech-anchor={i}
            cx={node.x}
            cy={node.y}
            r="0.7"
            fill="rgba(0, 184, 255, 0.16)"
            stroke="rgba(0, 184, 255, 0.28)"
            strokeWidth="0.16"
            style={{ opacity: staticVisible ? 0.7 : 0.2 }}
          />
        ))}

        <circle
          data-tech-hub-ring
          cx={route.hub.x}
          cy={route.hub.y}
          r="3.4"
          fill="none"
          stroke="rgba(0, 184, 255, 0.22)"
          strokeWidth="0.18"
          style={{ opacity: staticVisible ? 0.7 : 0 }}
        />
        <circle
          data-tech-hub-ring
          cx={route.hub.x}
          cy={route.hub.y}
          r="5.2"
          fill="none"
          stroke="rgba(0, 184, 255, 0.1)"
          strokeWidth="0.12"
          strokeDasharray="1.2 1.6"
          style={{ opacity: staticVisible ? 0.55 : 0 }}
        />

        <circle
          data-tech-hub
          cx={route.hub.x}
          cy={route.hub.y}
          r="1.35"
          fill="rgba(0, 184, 255, 0.42)"
          stroke="rgba(103, 232, 249, 0.7)"
          strokeWidth="0.28"
          filter={`url(#${tipGlow})`}
          style={{ opacity: staticVisible ? 0.95 : 0 }}
        />

        {route.nodes.map((node, i) => (
          <path
            key={`spoke-${i}`}
            data-tech-spoke={i}
            d={buildSpokePath(route.hub, node)}
            fill="none"
            stroke={`url(#${strokeGrad})`}
            strokeWidth="0.46"
            strokeLinecap="round"
            filter={`url(#${pathGlow})`}
            style={{
              opacity: staticVisible ? 0.92 : 0.96,
              strokeDashoffset: staticVisible ? 0 : undefined,
            }}
          />
        ))}

        <circle
          data-tech-path-tip
          r="0.9"
          fill="#67e8f9"
          filter={`url(#${tipGlow})`}
          style={{ opacity: 0 }}
        />
      </svg>
    )
  },
)

export default TechStackConnector
