import { forwardRef } from 'react'
import { cn } from '@/lib/utils'

interface MobileBrandedMarkerProps {
  staticVisible?: boolean
  className?: string
  /**
   * When 'path' mode, marker uses left/top percentages driven by GSAP
   * along the horizontal SVG path (matching desktop/tablet behavior).
   * When 'rail' mode, marker is pinned to the left rail and GSAP
   * animates its Y transform.
   */
  mode?: 'path' | 'rail'
}

/**
 * Mobile brand journey token.
 * - `path` mode: travels along horizontal SVG path (left/top animated)
 * - `rail` mode: pinned to left vertical rail (Y animated)
 */
const MobileBrandedMarker = forwardRef<HTMLDivElement, MobileBrandedMarkerProps>(
  function MobileBrandedMarker({ staticVisible = false, className, mode = 'path' }, ref) {
    const positionClass =
      mode === 'rail'
        ? 'absolute left-1/2 top-0'
        : 'absolute left-0 top-0'

    return (
      <div
        ref={ref}
        className={cn(
          'experience-marker pointer-events-none z-30',
          positionClass,
          className,
        )}
        style={{
          transform: 'translate(-50%, -50%)',
          opacity: staticVisible ? 1 : 0,
        }}
        data-journey-marker
        aria-hidden
      >
        <div
          data-marker-glow
          className="absolute -inset-3 rounded-full"
          style={{
            background:
              'radial-gradient(circle, rgba(0,184,255,0.35) 0%, rgba(0,184,255,0.08) 55%, transparent 75%)',
            opacity: staticVisible ? 1 : 0,
          }}
        />
        <div
          data-marker-orbit
          className="absolute -inset-1 rounded-full border border-dashed border-cyber-blue/30"
          style={{ opacity: staticVisible ? 0.7 : 0 }}
        />
        <div
          data-marker-body
          className={cn(
            'relative flex items-center justify-center rounded-full border border-cyber-blue/50 bg-cyber-bg backdrop-blur-sm',
            mode === 'rail' ? 'h-8 w-8' : 'h-11 w-11',
          )}
          style={{
            boxShadow:
              '0 0 0 1px rgba(0,184,255,0.25), 0 0 18px rgba(0,184,255,0.4), 0 0 36px rgba(0,184,255,0.15)',
          }}
        >
          <img
            src="/images/logo-mf.png"
            alt=""
            className="select-none rounded-full object-cover"
            draggable={false}
            decoding="async"
            style={{
              width: mode === 'rail' ? '1.05rem' : '1.5rem',
              height: mode === 'rail' ? '1.05rem' : '1.5rem',
            }}
          />
        </div>
        <div
          data-marker-compass
          className={cn(
            'absolute h-2 w-2 rounded-full bg-cyber-cyan',
            mode === 'rail'
              ? '-bottom-1 left-1/2 -translate-x-1/2'
              : '-left-1 top-1/2 -translate-y-1/2',
          )}
          style={{
            boxShadow: '0 0 6px rgba(103,232,249,0.9)',
            opacity: staticVisible ? 1 : 0,
          }}
        />
      </div>
    )
  },
)

export default MobileBrandedMarker
