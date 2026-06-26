import { forwardRef, type CSSProperties } from 'react'
import { cn } from '@/lib/utils'
import type { JourneyMilestone } from './journey-config'

interface MilestoneCardProps {
  milestone: JourneyMilestone
  position: { left: string; top: string; bottom: string; translateX: string }
  index: number
  staticVisible?: boolean
  className?: string
  style?: CSSProperties
}

const MilestoneCard = forwardRef<HTMLDivElement, MilestoneCardProps>(
  function MilestoneCard({ milestone, position, index, staticVisible = false, className, style }, ref) {
    const isTop = milestone.row === 'top'

    return (
      <div
        ref={ref}
        className={cn(
          'experience-card absolute z-20 w-[min(22vw,260px)]',
          className,
        )}
        style={{
          left: position.left,
          top: position.top !== 'auto' ? position.top : undefined,
          bottom: position.bottom !== 'auto' ? position.bottom : undefined,
          transform: `translateX(${position.translateX})`,
          ...(staticVisible ? { opacity: 1 } : {}),
          ...style,
        }}
        data-milestone={milestone.id}
        data-milestone-index={index}
      >
        {/* Connector leg from card to path node */}
        <div
          data-milestone-leg
          className={cn(
            'absolute left-1/2 w-px -translate-x-1/2',
            isTop
              ? 'bottom-0 top-full bg-gradient-to-b from-cyber-blue/30 to-transparent'
              : 'bottom-full top-0 bg-gradient-to-t from-transparent to-cyber-blue/30',
          )}
          style={{ height: '24px', opacity: staticVisible ? 0.7 : 0.3 }}
          aria-hidden
        />

        {/* AI gradient glow ring */}
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
          className="relative z-[1] overflow-hidden rounded-xl border border-white/10 bg-cyber-card/90 backdrop-blur-md"
          style={{
            boxShadow: staticVisible
              ? '0 0 0 1px rgba(0,184,255,0.3), 0 0 28px rgba(0,184,255,0.18)'
              : '0 0 0 1px rgba(255,255,255,0.02), 0 8px 28px rgba(0,0,0,0.4)',
          }}
        >
          <div className="relative p-4 sm:p-5">
            <div className="mb-2 flex items-center justify-between gap-3">
              <span
                data-milestone-year
                className={cn(
                  'font-mono text-[11px] font-semibold tracking-widest',
                  staticVisible ? 'text-cyber-blue' : 'text-cyber-blue/60',
                )}
              >
                {milestone.year}
              </span>
              <span
                data-milestone-index-label
                className="font-mono text-[10px] text-white/30"
              >
                0{index + 1}
              </span>
            </div>

            <h3
              data-milestone-title
              className={cn(
                'text-sm font-bold leading-snug text-white sm:text-base',
                staticVisible ? 'opacity-100' : 'opacity-70',
              )}
            >
              {milestone.title}
            </h3>

            <p
              data-milestone-company
              className={cn(
                'mt-1 text-[11px] text-cyber-muted sm:text-xs',
                staticVisible ? 'opacity-80' : 'opacity-50',
              )}
            >
              {milestone.company}
            </p>

            <p
              data-milestone-desc
              className={cn(
                'mt-3 text-[11px] leading-relaxed text-cyber-muted/90 sm:text-xs',
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
      </div>
    )
  },
)

export default MilestoneCard
