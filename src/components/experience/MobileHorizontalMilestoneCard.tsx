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
      className="experience-card-mobile-h absolute z-20 w-[38%] min-w-[132px] max-w-[168px]"
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
        className="relative z-[1] overflow-hidden rounded-lg border border-cyber-fg/10 bg-cyber-bg-card/90 backdrop-blur-md"
        style={{
          boxShadow: staticVisible
            ? 'var(--milestone-active-shadow)'
            : '0 0 0 1px rgb(var(--cyber-fg) / 0.04), 0 8px 24px rgb(var(--cyber-card-shadow-rgb) / 0.2)',
        }}
      >
        <div className="relative p-3">
          <div className="mb-1.5 flex items-center justify-between gap-2">
            <span
              data-milestone-year
              className={cn(
                'font-mono text-[10px] font-semibold tracking-wider',
                staticVisible ? 'text-cyber-blue' : 'text-cyber-blue/60',
              )}
            >
              {milestone.year}
            </span>
            <span className="font-mono text-[9px] text-cyber-fg/30">0{index + 1}</span>
          </div>

          <h3
            data-milestone-title
            className={cn(
              'text-xs font-bold leading-tight text-cyber-fg',
              staticVisible ? 'opacity-100' : 'opacity-70',
            )}
          >
            {milestone.title}
          </h3>

          <p
            data-milestone-company
            className={cn(
              'mt-1 text-[10px] leading-tight text-cyber-fg-muted',
              staticVisible ? 'opacity-80' : 'opacity-50',
            )}
          >
            {milestone.company}
          </p>

          <p
            data-milestone-desc
            className={cn(
              'mt-2 text-[10px] leading-snug text-cyber-fg-muted/90',
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
                  'rounded border border-cyber-blue/20 bg-cyber-blue/5 px-1 py-0.5 font-mono text-[9px] text-cyber-blue',
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
        style={{ height: '18px', opacity: staticVisible ? 0.7 : 0.3 }}
        aria-hidden
      />
    </div>
  )
})

export default MobileHorizontalMilestoneCard
