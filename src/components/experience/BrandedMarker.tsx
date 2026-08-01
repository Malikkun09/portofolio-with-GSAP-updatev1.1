import { forwardRef } from 'react'
import { cn } from '@/lib/utils'

interface BrandedMarkerProps {
  className?: string
  staticVisible?: boolean
}

/**
 * Brand journey token — logo-mf.png travels across the experience path.
 * Marker is a rounded glowing badge with the MF logo inside.
 */
const BrandedMarker = forwardRef<HTMLDivElement, BrandedMarkerProps>(
  function BrandedMarker({ className, staticVisible = false }, ref) {
    return (
      <div
        ref={ref}
        className={cn(
          'experience-marker pointer-events-none absolute left-0 top-0 z-30',
          className,
        )}
        style={{
          transform: 'translate(-50%, -50%)',
          opacity: staticVisible ? 1 : 0,
        }}
        data-journey-marker
        aria-hidden
      >
        {/* Outer glow ring */}
        <div
          data-marker-glow
          className="absolute -inset-3 rounded-full"
          style={{
            background:
              'radial-gradient(circle, rgba(0,184,255,0.35) 0%, rgba(0,184,255,0.08) 55%, transparent 75%)',
            opacity: staticVisible ? 1 : 0,
          }}
        />

        {/* Rotating dashed orbit */}
        <div
          data-marker-orbit
          className="absolute -inset-1.5 rounded-full border border-dashed border-cyber-blue/30"
          style={{ opacity: staticVisible ? 0.7 : 0 }}
        />

        {/* Token body */}
        <div
          data-marker-body
          className="relative flex h-12 w-12 items-center justify-center rounded-full border border-cyber-blue/50 bg-cyber-bg/90 backdrop-blur-sm"
          style={{
            boxShadow:
              '0 0 0 1px rgba(0,184,255,0.25), 0 0 24px rgba(0,184,255,0.4), 0 0 48px rgba(0,184,255,0.15)',
          }}
        >
          <img
            src="/images/logo-mf.png"
            alt=""
            className="h-7 w-7 select-none rounded-full object-cover"
            draggable={false}
            decoding="async"
          />
        </div>

        {/* Forward-facing indicator (small chevron pointing right) */}
        <div
          data-marker-compass
          className="absolute -right-1 top-1/2 h-2 w-2 -translate-y-1/2 rounded-full bg-cyber-cyan"
          style={{
            boxShadow: '0 0 8px rgba(103,232,249,0.9)',
            opacity: staticVisible ? 1 : 0,
          }}
        />
      </div>
    )
  },
)

export default BrandedMarker
