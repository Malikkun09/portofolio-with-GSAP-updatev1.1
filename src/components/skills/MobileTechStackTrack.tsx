import { forwardRef } from 'react'
import { cn } from '@/lib/utils'

interface MobileTechStackTrackProps {
  staticVisible?: boolean
  className?: string
}

/** Vertical track: idle line + active drawn line + tip node + endpoint nodes */
const MobileTechStackTrack = forwardRef<HTMLDivElement, MobileTechStackTrackProps>(
  function MobileTechStackTrack({ staticVisible = false, className }, ref) {
    return (
      <div
        ref={ref}
        className={cn(
          'absolute left-[18px] top-0 z-[1] h-full -translate-x-1/2',
          className,
        )}
        aria-hidden
      >
        {/* Idle track */}
        <div
          data-mobile-track-bg
          className="absolute left-1/2 top-0 h-full w-px -translate-x-1/2 bg-cyber-blue/10"
          style={{ opacity: staticVisible ? 0.5 : 0.4 }}
        />

        {/* Active drawn line */}
        <div
          data-mobile-track-active
          className="absolute left-1/2 top-0 w-px -translate-x-1/2 origin-top"
          style={{
            height: '100%',
            background:
              'linear-gradient(180deg, rgba(103,232,249,0.95) 0%, rgba(0,184,255,0.9) 35%, rgba(129,140,248,0.85) 65%, rgba(244,114,182,0.8) 100%)',
            transform: staticVisible ? 'scaleY(1)' : 'scaleY(0)',
            boxShadow: '0 0 8px rgba(0,184,255,0.35)',
          }}
        />
        {/* Drawing tip */}
        <div
          data-mobile-track-tip
          className="absolute left-1/2 top-0 h-2 w-2 -translate-x-1/2 rounded-full"
          style={{
            opacity: staticVisible ? 0 : 0,
            background: '#67e8f9',
            boxShadow: '0 0 12px rgba(103,232,249,0.8), 0 0 24px rgba(0,184,255,0.4)',
          }}
        />
      </div>
    )
  },
)

export default MobileTechStackTrack
