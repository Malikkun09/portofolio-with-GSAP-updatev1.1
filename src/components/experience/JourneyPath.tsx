import { forwardRef } from 'react'
import { cn } from '@/lib/utils'
import { buildJourneyPath, JOURNEY_PATH_POINTS, JOURNEY_MILESTONES } from './journey-config'

interface JourneyPathProps {
  staticVisible?: boolean
  className?: string
}

const JourneyPath = forwardRef<SVGSVGElement, JourneyPathProps>(
  function JourneyPath({ staticVisible = false, className }, ref) {
    const pathD = buildJourneyPath(JOURNEY_PATH_POINTS)

    return (
      <svg
        ref={ref}
        className={cn('pointer-events-none absolute inset-0 z-10 h-full w-full', className)}
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        aria-hidden
      >
        <defs>
          <linearGradient id="journey-path-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#67e8f9" />
            <stop offset="40%" stopColor="#00B8FF" />
            <stop offset="75%" stopColor="#818cf8" />
            <stop offset="100%" stopColor="#f472b6" />
          </linearGradient>

          <filter id="journey-path-glow" x="-10%" y="-50%" width="120%" height="200%">
            <feGaussianBlur stdDeviation="0.45" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          <filter id="journey-node-glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="0.4" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Idle track */}
        <path
          data-journey-path-bg
          d={pathD}
          fill="none"
          stroke="rgba(0, 184, 255, 0.1)"
          strokeWidth="0.35"
          strokeLinecap="round"
          strokeLinejoin="round"
          vectorEffect="non-scaling-stroke"
        />

        {/* Active drawn path */}
        <path
          data-journey-path
          d={pathD}
          fill="none"
          stroke="url(#journey-path-gradient)"
          strokeWidth="0.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          filter="url(#journey-path-glow)"
          vectorEffect="non-scaling-stroke"
          style={{
            opacity: staticVisible ? 0.9 : 1,
            strokeDashoffset: staticVisible ? 0 : undefined,
          }}
        />

        {/* Milestone nodes */}
        {JOURNEY_MILESTONES.map((milestone, i) => (
          <g key={`journey-node-${i}`}>
            <circle
              data-journey-node={i}
              cx={milestone.x}
              cy={milestone.y}
              r="0.9"
              fill="var(--cyber-bg-node, rgb(5, 5, 5))"
              stroke="rgba(0, 184, 255, 0.3)"
              strokeWidth="0.2"
              filter="url(#journey-node-glow)"
              style={{ opacity: staticVisible ? 1 : 0.5 }}
            />
            <circle
              data-journey-node-dot={i}
              cx={milestone.x}
              cy={milestone.y}
              r="0.35"
              fill="rgba(0, 184, 255, 0.5)"
              style={{ opacity: staticVisible ? 1 : 0 }}
            />
          </g>
        ))}
      </svg>
    )
  },
)

export default JourneyPath
