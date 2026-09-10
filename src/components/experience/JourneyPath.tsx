import { forwardRef } from 'react'
import { cn } from '@/lib/utils'
import {
  buildJourneyPath,
  JOURNEY_PATH_POINTS,
  JOURNEY_MILESTONES,
  JOURNEY_STROKE,
  JOURNEY_NODE,
} from './journey-config'

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
          <linearGradient id="journey-path-gradient" x1="100%" y1="90%" x2="0%" y2="10%">
            <stop offset="0%" stopColor="#67e8f9" />
            <stop offset="40%" stopColor="#00B8FF" />
            <stop offset="75%" stopColor="#818cf8" />
            <stop offset="100%" stopColor="#f472b6" />
          </linearGradient>

          <filter id="journey-path-glow" x="-20%" y="-80%" width="140%" height="260%">
            <feGaussianBlur stdDeviation="0.7" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          <filter id="journey-node-glow" x="-80%" y="-80%" width="260%" height="260%">
            <feGaussianBlur stdDeviation="0.55" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        <path
          data-journey-path-bg
          d={pathD}
          fill="none"
          stroke="rgba(0, 184, 255, 0.16)"
          strokeWidth={JOURNEY_STROKE.bg}
          strokeLinecap="round"
          strokeLinejoin="round"
          vectorEffect="non-scaling-stroke"
        />

        <path
          data-journey-path
          d={pathD}
          fill="none"
          stroke="url(#journey-path-gradient)"
          strokeWidth={JOURNEY_STROKE.active}
          strokeLinecap="round"
          strokeLinejoin="round"
          filter="url(#journey-path-glow)"
          vectorEffect="non-scaling-stroke"
          style={{
            opacity: staticVisible ? 0.9 : 1,
            strokeDashoffset: staticVisible ? 0 : undefined,
          }}
        />

        {JOURNEY_MILESTONES.map((milestone, i) => (
          <g key={`journey-node-${i}`}>
            <circle
              data-journey-node={i}
              cx={milestone.x}
              cy={milestone.y}
              r={JOURNEY_NODE.ring}
              fill="rgb(var(--cyber-bg-node))"
              stroke="rgba(0, 184, 255, 0.45)"
              strokeWidth={JOURNEY_NODE.stroke}
              filter="url(#journey-node-glow)"
              style={{ opacity: staticVisible ? 1 : 0.5 }}
            />
            <circle
              data-journey-node-dot={i}
              cx={milestone.x}
              cy={milestone.y}
              r={JOURNEY_NODE.dot}
              fill="rgba(0, 184, 255, 0.7)"
              style={{ opacity: staticVisible ? 1 : 0 }}
            />
          </g>
        ))}
      </svg>
    )
  },
)

export default JourneyPath
