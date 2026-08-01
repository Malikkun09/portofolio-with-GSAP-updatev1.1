import { forwardRef } from 'react'
import { buildJourneyPath, JOURNEY_PATH_POINTS_TABLET, JOURNEY_MILESTONES } from './journey-config'

interface TabletJourneyPathProps {
  staticVisible?: boolean
}

/** Tablet journey path — horizontal SVG with tablet anchors */
const TabletJourneyPath = forwardRef<SVGSVGElement, TabletJourneyPathProps>(
  function TabletJourneyPath({ staticVisible = false }, ref) {
    const pathD = buildJourneyPath(JOURNEY_PATH_POINTS_TABLET)

    return (
      <svg
        ref={ref}
        className="pointer-events-none absolute inset-0 z-10 h-full w-full"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        aria-hidden
      >
        <defs>
          <linearGradient id="tablet-journey-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#67e8f9" />
            <stop offset="40%" stopColor="#00B8FF" />
            <stop offset="75%" stopColor="#818cf8" />
            <stop offset="100%" stopColor="#f472b6" />
          </linearGradient>
          <filter id="tablet-journey-glow" x="-10%" y="-50%" width="120%" height="200%">
            <feGaussianBlur stdDeviation="0.45" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <filter id="tablet-node-glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="0.4" result="blur" />
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
          stroke="rgba(0, 184, 255, 0.1)"
          strokeWidth="0.35"
          strokeLinecap="round"
          strokeLinejoin="round"
          vectorEffect="non-scaling-stroke"
        />
        <path
          data-journey-path
          d={pathD}
          fill="none"
          stroke="url(#tablet-journey-gradient)"
          strokeWidth="0.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          filter="url(#tablet-journey-glow)"
          vectorEffect="non-scaling-stroke"
          style={{ opacity: staticVisible ? 0.9 : 1 }}
        />

        {JOURNEY_MILESTONES.map((_milestone, i) => {
          const wp = JOURNEY_PATH_POINTS_TABLET[i + 1]
          return (
            <g key={`tablet-node-${i}`}>
              <circle
                data-journey-node={i}
                cx={wp.x}
                cy={wp.y}
                r="0.9"
                fill="var(--cyber-bg-node, rgb(5, 5, 5))"
                stroke="rgba(0, 184, 255, 0.3)"
                strokeWidth="0.2"
                filter="url(#tablet-node-glow)"
                style={{ opacity: staticVisible ? 1 : 0.5 }}
              />
              <circle
                data-journey-node-dot={i}
                cx={wp.x}
                cy={wp.y}
                r="0.35"
                fill="rgba(0, 184, 255, 0.5)"
                style={{ opacity: staticVisible ? 1 : 0 }}
              />
            </g>
          )
        })}
      </svg>
    )
  },
)

export default TabletJourneyPath
