import { forwardRef } from 'react'
import {
  buildJourneyPath,
  JOURNEY_PATH_POINTS_MOBILE,
  JOURNEY_MILESTONES,
} from './journey-config'

interface MobileJourneyPathProps {
  staticVisible?: boolean
}

/**
 * Mobile journey path — horizontal SVG with tighter zig-zag anchors.
 * All 4 nodes fit within 0..100 viewBox so cards can sit on top/bottom
 * rows and still be visible together in the viewport.
 */
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
          <linearGradient id="mobile-journey-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#67e8f9" />
            <stop offset="40%" stopColor="#00B8FF" />
            <stop offset="75%" stopColor="#818cf8" />
            <stop offset="100%" stopColor="#f472b6" />
          </linearGradient>
          <filter id="mobile-journey-glow" x="-10%" y="-50%" width="120%" height="200%">
            <feGaussianBlur stdDeviation="0.4" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <filter id="mobile-node-glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="0.35" result="blur" />
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
          strokeWidth="0.4"
          strokeLinecap="round"
          strokeLinejoin="round"
          vectorEffect="non-scaling-stroke"
        />

        {/* Active drawn path */}
        <path
          data-journey-path
          d={pathD}
          fill="none"
          stroke="url(#mobile-journey-gradient)"
          strokeWidth="0.55"
          strokeLinecap="round"
          strokeLinejoin="round"
          filter="url(#mobile-journey-glow)"
          vectorEffect="non-scaling-stroke"
          style={{ opacity: staticVisible ? 0.9 : 1 }}
        />

        {/* Milestone nodes */}
        {JOURNEY_MILESTONES.map((_milestone, i) => {
          const wp = JOURNEY_PATH_POINTS_MOBILE[i + 1]
          return (
            <g key={`mobile-journey-node-${i}`}>
              <circle
                data-journey-node={i}
                cx={wp.x}
                cy={wp.y}
                r="1"
                fill="rgba(5, 5, 5, 0.95)"
                stroke="rgba(0, 184, 255, 0.3)"
                strokeWidth="0.22"
                filter="url(#mobile-node-glow)"
                style={{ opacity: staticVisible ? 1 : 0.5 }}
              />
              <circle
                data-journey-node-dot={i}
                cx={wp.x}
                cy={wp.y}
                r="0.4"
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

export default MobileJourneyPath
