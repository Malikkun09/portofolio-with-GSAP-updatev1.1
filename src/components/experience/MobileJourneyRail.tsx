import { cn } from '@/lib/utils'
import { JOURNEY_MILESTONES } from './journey-config'

interface MobileJourneyRailProps {
  staticVisible?: boolean
}

function nodeTopPercent(index: number, count: number) {
  if (count <= 1) return 50
  const inset = 8
  return inset + (index / (count - 1)) * (100 - inset * 2)
}

/**
 * Vertical journey rail for the mobile one-active-card scene.
 * Marker Y is driven by GSAP; nodes light when each milestone activates.
 */
export default function MobileJourneyRail({ staticVisible = false }: MobileJourneyRailProps) {
  const count = JOURNEY_MILESTONES.length

  return (
    <div
      className="pointer-events-none absolute inset-0 z-[1] w-px"
      aria-hidden
    >
      <div
        data-mobile-track-bg
        className="absolute inset-0 bg-cyber-blue/15"
        style={{ opacity: staticVisible ? 0.55 : 0.4 }}
      />
      <div
        data-mobile-track-active
        className="absolute inset-x-0 top-0 origin-top"
        style={{
          height: '100%',
          background:
            'linear-gradient(180deg, rgba(103,232,249,0.95) 0%, rgba(0,184,255,0.9) 35%, rgba(129,140,248,0.85) 65%, rgba(244,114,182,0.8) 100%)',
          transform: staticVisible ? 'scaleY(1)' : 'scaleY(0)',
          boxShadow: '0 0 8px rgba(0,184,255,0.35)',
        }}
      />

      {JOURNEY_MILESTONES.map((milestone, index) => (
        <span
          key={milestone.id}
          data-mobile-node
          data-mobile-node-index={index}
          className={cn(
            'absolute left-1/2 z-10 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full border bg-cyber-bg',
            staticVisible ? 'border-cyber-blue/70 bg-cyber-blue/25' : 'border-cyber-blue/35',
          )}
          style={{ top: `${nodeTopPercent(index, count)}%` }}
        />
      ))}
    </div>
  )
}

export { nodeTopPercent }
