import { forwardRef } from 'react'
import { cn } from '@/lib/utils'
import { buildJourneyPath, JOURNEY_PATH_POINTS } from './journey-config'

interface JourneyRailPathProps {
  points: { x: number; y: number }[]
  idPrefix: string
  staticVisible?: boolean
  className?: string
}

/** Vertical timeline rail + milestone nodes (viewBox 0–100). */
export const JourneyRailPath = forwardRef<SVGSVGElement, JourneyRailPathProps>(
  function JourneyRailPath({ points, idPrefix, staticVisible = false, className }, ref) {
    const pathD = buildJourneyPath(points)
    const gradientId = `${idPrefix}-gradient`
    const glowId = `${idPrefix}-glow`

    return (
      <svg
        ref={ref}
        className={cn('pointer-events-none absolute inset-0 z-10 h-full w-full', className)}
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        aria-hidden
      >
        <defs>
          <linearGradient id={gradientId} x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#67e8f9" />
            <stop offset="40%" stopColor="#00B8FF" />
            <stop offset="75%" stopColor="#818cf8" />
            <stop offset="100%" stopColor="#f472b6" />
          </linearGradient>
          <filter id={glowId} x="-80%" y="-8%" width="260%" height="116%">
            <feGaussianBlur stdDeviation="0.45" result="blur" />
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
          stroke="rgba(0, 184, 255, 0.22)"
          strokeWidth="2.4"
          strokeLinecap="round"
          strokeLinejoin="round"
          vectorEffect="non-scaling-stroke"
        />

        <path
          data-journey-path
          d={pathD}
          fill="none"
          stroke={`url(#${gradientId})`}
          strokeWidth="2.8"
          strokeLinecap="round"
          strokeLinejoin="round"
          filter={`url(#${glowId})`}
          vectorEffect="non-scaling-stroke"
          style={{
            opacity: staticVisible ? 0.9 : 1,
            strokeDashoffset: staticVisible ? 0 : undefined,
          }}
        />
      </svg>
    )
  },
)

interface JourneyPathProps {
  staticVisible?: boolean
  className?: string
}

const JourneyPath = forwardRef<SVGSVGElement, JourneyPathProps>(
  function JourneyPath({ staticVisible = false, className }, ref) {
    return (
      <JourneyRailPath
        ref={ref}
        points={JOURNEY_PATH_POINTS}
        idPrefix="journey-path"
        staticVisible={staticVisible}
        className={className}
      />
    )
  },
)

export default JourneyPath
