import { forwardRef } from 'react'
import { cn } from '@/lib/utils'
import type { JourneyMilestone } from './journey-config'

interface MobileHorizontalMilestoneCardProps {
  milestone: JourneyMilestone
  position: { left: string; top: string; bottom: string; translateX: string }
  index: number
  staticVisible?: boolean
}

/**
 * Compact milestone card for mobile horizontal journey.
 * Narrower width + smaller padding so all 4 cards fit in one viewport.
 */
const MobileHorizontalMilestoneCard = forwardRef<
  HTMLDivElement,
  MobileHorizontalMilestoneCardProps
>(function MobileHorizontalMilestoneCard(
  { milestone, position, index, staticVisible = false },
  ref,
) {
  const isTop = milestone.row === 'top'

  return (
    <div
      ref={ref}
      className="experience-card-mobile-h absolute z-20 w-[34%] min-w-[118px] max-w-[150px]"
      style={{
        left: position.left,
        top: position.top !== 'auto' ? position.top : undefined,
        bottom: position.bottom !== 'auto' ? position.bottom : undefined,
        transform: `translateX(${position.translateX})`,
        ...(staticVisible ? { opacity: 1 } : {}),
      }}
      data-milestone={milestone.id}
      data-milestone-index={index}
    >
      {/* AI gradient glow ring */}
      <div
        data-milestone-glow
        className={cn(
          'pointer-events-none absolute -inset-px rounded-lg',
          staticVisible ? 'opacity-70' : 'opacity-0',
        )}
        style={{
          background:
            'conic-gradient(from 180deg, #67e8f9, #00B8FF, #818cf8, #c084fc, #67e8f9)',
          filter: 'blur(0.5px)',
        }}
        aria-hidden
      />

      <div
        data-milestone-card
        className="relative z-[1] overflow-hidden rounded-lg border border-white/10 bg-cyber-card/90 backdrop-blur-md"
        style={{
          boxShadow: staticVisible
            ? '0 0 0 1px rgba(0,184,255,0.4), 0 0 20px rgba(0,184,255,0.25), 0 0 40px rgba(0,184,255,0.12)'
            : '0 0 0 1px rgba(255,255,255,0.02), 0 6px 20px rgba(0,0,0,0.4)',
        }}
      >
        <div className="relative p-2.5">
          <div className="mb-1.5 flex items-center justify-between gap-2">
            <span
              data-milestone-year
              className={cn(
                'font-mono text-[9px] font-semibold tracking-wider',
                staticVisible ? 'text-cyber-blue' : 'text-cyber-blue/60',
              )}
            >
              {milestone.year}
            </span>
            <span className="font-mono text-[8px] text-white/30">0{index + 1}</span>
          </div>

          <h3
            data-milestone-title
            className={cn(
              'text-[11px] font-bold leading-tight text-white',
              staticVisible ? 'opacity-100' : 'opacity-70',
            )}
          >
            {milestone.title}
          </h3>

          <p
            data-milestone-company
            className={cn(
              'mt-1 text-[9px] leading-tight text-cyber-muted',
              staticVisible ? 'opacity-80' : 'opacity-50',
            )}
          >
            {milestone.company}
          </p>

          <p
            data-milestone-desc
            className={cn(
              'mt-2 text-[9px] leading-snug text-cyber-muted/90',
              staticVisible ? 'opacity-90' : 'opacity-40',
            )}
            style={{
              display: '-webkit-box',
              WebkitLineClamp: 3,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
            }}
          >
            {milestone.description}
          </p>

          <div data-milestone-tags className="mt-2 flex flex-wrap gap-1">
            {milestone.tags.slice(0, 4).map((tag) => (
              <span
                key={tag}
                data-milestone-tag
                className={cn(
                  'rounded border border-cyber-blue/20 bg-cyber-blue/5 px-1 py-0.5 font-mono text-[8px] text-cyber-blue',
                  staticVisible ? 'opacity-90' : 'opacity-30',
                )}
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Connector leg from card to path node */}
      <div
        data-milestone-leg
        className={cn(
          'absolute left-1/2 w-px -translate-x-1/2',
          isTop
            ? 'bottom-0 top-full bg-gradient-to-b from-cyber-blue/30 to-transparent'
            : 'bottom-full top-0 bg-gradient-to-t from-transparent to-cyber-blue/30',
        )}
        style={{ height: '14px', opacity: staticVisible ? 0.7 : 0.3 }}
        aria-hidden
      />
    </div>
  )
})

export default MobileHorizontalMilestoneCard
