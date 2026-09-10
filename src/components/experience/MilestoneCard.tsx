import { forwardRef } from 'react'
import { cn } from '@/lib/utils'
import type { JourneyMilestone } from './journey-config'

export type MilestoneCardSize = 'desktop' | 'tablet' | 'mobile'

interface MilestoneCardProps {
  milestone: JourneyMilestone
  index: number
  staticVisible?: boolean
  className?: string
  size?: MilestoneCardSize
}

const sizeStyles: Record<
  MilestoneCardSize,
  {
    pad: string
    year: string
    index: string
    title: string
    company: string
    desc: string
    tags: string
    tag: string
  }
> = {
  desktop: {
    pad: 'flex h-full min-h-0 flex-col px-6 py-4 lg:px-8 lg:py-5',
    year: 'text-sm sm:text-[0.95rem]',
    index: 'text-sm',
    title: 'text-xl leading-tight sm:text-2xl lg:text-[1.85rem]',
    company: 'text-sm sm:text-base',
    desc: 'mt-2 shrink-0 line-clamp-2 text-sm leading-relaxed sm:text-base lg:line-clamp-3',
    tags: 'mt-auto gap-2 pt-3',
    tag: 'px-2.5 py-1 text-xs sm:text-[13px]',
  },
  tablet: {
    pad: 'flex h-full min-h-0 flex-col px-5 py-3.5',
    year: 'text-xs sm:text-sm',
    index: 'text-xs',
    title: 'text-lg leading-snug',
    company: 'text-sm',
    desc: 'mt-1.5 shrink-0 line-clamp-2 text-sm leading-relaxed',
    tags: 'mt-auto gap-1.5 pt-2.5',
    tag: 'px-2 py-0.5 text-[11px]',
  },
  mobile: {
    pad: 'flex h-full min-h-0 flex-col p-3.5',
    year: 'text-xs',
    index: 'text-[11px]',
    title: 'text-[1.05rem] leading-snug',
    company: 'text-[13px]',
    desc: 'mt-1.5 shrink-0 line-clamp-2 text-[13px] leading-relaxed',
    tags: 'mt-auto gap-1.5 pt-2',
    tag: 'px-2 py-0.5 text-[11px]',
  },
}

const MilestoneCard = forwardRef<HTMLDivElement, MilestoneCardProps>(
  function MilestoneCard({
    milestone,
    index,
    staticVisible = false,
    className,
    size = 'desktop',
  }, ref) {
    const styles = sizeStyles[size]

    return (
      <div
        ref={ref}
        className={cn(
          'experience-card relative z-20 min-h-0 w-full flex-1',
          className,
        )}
        style={staticVisible ? { opacity: 1 } : undefined}
        data-milestone={milestone.id}
        data-milestone-index={index}
      >
        <div
          data-milestone-glow
          className={cn(
            'pointer-events-none absolute -inset-px rounded-2xl',
            staticVisible ? 'opacity-70' : 'opacity-0',
          )}
          style={{
            background:
              'conic-gradient(from 180deg, #67e8f9, #00B8FF, #818cf8, #c084fc, #67e8f9)',
          }}
          aria-hidden
        />

        <div
          data-milestone-card
          className="relative z-[1] flex h-full min-h-0 flex-col overflow-hidden rounded-2xl border border-cyber-fg/10 bg-cyber-bg-card/95"
          style={{
            boxShadow: staticVisible
              ? '0 0 0 1px rgba(0,184,255,0.3), 0 0 28px rgba(0,184,255,0.18)'
              : '0 0 0 1px rgba(var(--cyber-fg),0.02), 0 8px 28px rgba(var(--cyber-card-shadow-rgb),0.2)',
          }}
        >
          <div className={cn('relative', styles.pad)}>
            <div className="mb-1.5 flex shrink-0 items-center justify-between gap-3 sm:mb-2">
              <span
                data-milestone-year
                className={cn(
                  'font-mono font-semibold tracking-[0.16em]',
                  styles.year,
                  staticVisible ? 'text-cyber-blue' : 'text-cyber-blue/70',
                )}
              >
                {milestone.year}
              </span>
              <span
                data-milestone-index-label
                className={cn('font-mono text-cyber-fg/40', styles.index)}
              >
                0{index + 1}
              </span>
            </div>

            <h3
              data-milestone-title
              className={cn(
                'shrink-0 font-display font-semibold tracking-tight text-cyber-fg',
                styles.title,
                staticVisible ? 'opacity-100' : 'opacity-90',
              )}
            >
              {milestone.title}
            </h3>

            <p
              data-milestone-company
              className={cn(
                'mt-1.5 shrink-0 text-cyber-fg-muted',
                styles.company,
                staticVisible ? 'opacity-80' : 'opacity-70',
              )}
            >
              {milestone.company}
            </p>

            <p
              data-milestone-desc
              className={cn(
                'text-cyber-fg-muted/95',
                styles.desc,
                staticVisible ? 'opacity-90' : 'opacity-80',
              )}
            >
              {milestone.description}
            </p>

            <div data-milestone-tags className={cn('flex flex-wrap', styles.tags)}>
              {milestone.tags.map((tag) => (
                <span
                  key={tag}
                  data-milestone-tag
                  className={cn(
                    'rounded-md border border-cyber-blue/25 bg-cyber-blue/10 font-mono text-cyber-blue',
                    styles.tag,
                    staticVisible ? 'opacity-90' : 'opacity-70',
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
