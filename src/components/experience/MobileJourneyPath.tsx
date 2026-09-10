import { forwardRef } from 'react'
import {
  buildJourneyPath,
  JOURNEY_PATH_POINTS_MOBILE,
  JOURNEY_MILESTONES,
  JOURNEY_STROKE,
  JOURNEY_NODE,
} from './journey-config'

interface MobileJourneyPathProps {
  staticVisible?: boolean
}

const MobileJourneyPath = forwardRef<SVGSVGElement, MobileJourneyPathProps>(
  function MobileJourneyPath({ staticVisible = false }, ref) {
    const pathD = buildJourneyPath(JOURNEY_PATH_POINTS_MOBILE)

    return (
      <svg
        ref={ref}
        className="pointer-events-none absolute inset-0 z-10 h-full w-full"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        aria-hidden
      >
        <defs>
          <linearGradient id="mobile-journey-gradient" x1="100%" y1="90%" x2="0%" y2="10%">
            <stop offset="0%" stopColor="#67e8f9" />
            <stop offset="40%" stopColor="#00B8FF" />
            <stop offset="75%" stopColor="#818cf8" />
            <stop offset="100%" stopColor="#f472b6" />
          </linearGradient>
          <filter id="mobile-journey-glow" x="-20%" y="-80%" width="140%" height="260%">
            <feGaussianBlur stdDeviation="0.65" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <filter id="mobile-node-glow" x="-80%" y="-80%" width="260%" height="260%">
            <feGaussianBlur stdDeviation="0.5" result="blur" />
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
          stroke="url(#mobile-journey-gradient)"
          strokeWidth={JOURNEY_STROKE.active}
          strokeLinecap="round"
          strokeLinejoin="round"
          filter="url(#mobile-journey-glow)"
          vectorEffect="non-scaling-stroke"
          style={{ opacity: staticVisible ? 0.9 : 1 }}
        />

        {JOURNEY_MILESTONES.map((_milestone, i) => {
          const wp = JOURNEY_PATH_POINTS_MOBILE[i + 1]
          return (
            <g key={`mobile-journey-node-${i}`}>
              <circle
                data-journey-node={i}
                cx={wp.x}
                cy={wp.y}
                r={JOURNEY_NODE.ring}
                fill="rgb(var(--cyber-bg-node))"
                stroke="rgba(0, 184, 255, 0.45)"
                strokeWidth={JOURNEY_NODE.stroke}
                filter="url(#mobile-node-glow)"
                style={{ opacity: staticVisible ? 1 : 0.5 }}
              />
              <circle
                data-journey-node-dot={i}
                cx={wp.x}
                cy={wp.y}
                r={JOURNEY_NODE.dot}
                fill="rgba(0, 184, 255, 0.7)"
                style={{ opacity: staticVisible ? 1 : 0 }}
              />
            </g>
          )
        })}
      </svg>
    )
  },
)

export default MobileJourneyPath
