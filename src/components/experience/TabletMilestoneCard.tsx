import { forwardRef } from 'react'
import { cn } from '@/lib/utils'
import { JOURNEY_MILESTONES } from './journey-config'

interface TabletMilestoneCardProps {
  milestone: (typeof JOURNEY_MILESTONES)[number]
  position: { left: string; top: string; bottom: string; translateX: string }
  index: number
  staticVisible?: boolean
}

/** Tablet milestone card — slightly smaller than desktop, same editorial style */
const TabletMilestoneCard = forwardRef<HTMLDivElement, TabletMilestoneCardProps>(
  function TabletMilestoneCard({ milestone, position, index, staticVisible = false }, ref) {
    const isTop = milestone.row === 'top'

    return (
      <div
        ref={ref}
        className={cn('experience-card-tablet absolute z-20 w-[32vw] max-w-[260px]')}
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
        <div
          data-milestone-glow
          className={cn(
            'pointer-events-none absolute -inset-px rounded-xl',
            staticVisible ? 'opacity-70' : 'opacity-0',
          )}
          style={{
            background:
              'conic-gradient(from 180deg, #67e8f9, #00B8FF, #818cf8, #c084fc, #67e8f9)',
            filter: 'blur(1px)',
          }}
          aria-hidden
        />

        <div
          data-milestone-card
          className="relative z-[1] overflow-hidden rounded-xl border border-cyber-fg/10 bg-cyber-bg-card/90 backdrop-blur-md"
          style={{
            boxShadow: staticVisible
              ? 'var(--milestone-active-shadow)'
              : '0 0 0 1px rgb(var(--cyber-fg) / 0.04), 0 12px 36px rgb(var(--cyber-card-shadow-rgb) / 0.22)',
          }}
        >
          <div className="relative p-4 sm:p-5">
            <div className="mb-2.5 flex items-center justify-between gap-2">
              <span
                data-milestone-year
                className={cn(
                  'font-mono text-[11px] font-semibold tracking-widest',
                  staticVisible ? 'text-cyber-blue' : 'text-cyber-blue/60',
                )}
              >
                {milestone.year}
              </span>
              <span className="font-mono text-[10px] text-cyber-fg/30">0{index + 1}</span>
            </div>
            <h3
              data-milestone-title
              className={cn(
                'text-sm font-bold leading-snug text-cyber-fg',
                staticVisible ? 'opacity-100' : 'opacity-70',
              )}
            >
              {milestone.title}
            </h3>
            <p
              data-milestone-company
              className={cn(
                'mt-1 text-[11px] text-cyber-fg-muted',
                staticVisible ? 'opacity-80' : 'opacity-50',
              )}
            >
              {milestone.company}
            </p>
            <p
              data-milestone-desc
              className={cn(
                'mt-3 text-[11px] leading-relaxed text-cyber-fg-muted/90',
                staticVisible ? 'opacity-90' : 'opacity-40',
              )}
            >
              {milestone.description}
            </p>
            <div data-milestone-tags className="mt-3 flex flex-wrap gap-1.5">
              {milestone.tags.map((tag) => (
                <span
                  key={tag}
                  data-milestone-tag
                  className={cn(
                    'rounded border border-cyber-blue/20 bg-cyber-blue/5 px-1.5 py-0.5 font-mono text-[10px] text-cyber-blue',
                    staticVisible ? 'opacity-90' : 'opacity-30',
                  )}
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Connector leg */}
        <div
          className={cn(
            'absolute left-1/2 w-px -translate-x-1/2',
            isTop
              ? 'bottom-0 top-full bg-gradient-to-b from-cyber-blue/30 to-transparent'
              : 'bottom-full top-0 bg-gradient-to-t from-transparent to-cyber-blue/30',
          )}
          style={{ height: '22px', opacity: staticVisible ? 0.7 : 0.3 }}
          aria-hidden
        />
      </div>
    )
  },
)

export default TabletMilestoneCard
