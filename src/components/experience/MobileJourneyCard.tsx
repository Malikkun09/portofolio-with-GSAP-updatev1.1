import { forwardRef } from 'react'
import { cn } from '@/lib/utils'
import type { JourneyMilestone } from './journey-config'

interface MobileJourneyCardProps {
  milestone: JourneyMilestone
  index: number
  staticVisible?: boolean
  className?: string
}

function stepLabel(index: number) {
  return String(index + 1).padStart(2, '0')
}

/**
 * Full-width mobile milestone — designed to be read one at a time.
 * Shared data-* hooks keep the GSAP cascade identical to desktop.
 */
const MobileJourneyCard = forwardRef<HTMLDivElement, MobileJourneyCardProps>(
  function MobileJourneyCard({ milestone, index, staticVisible = false, className }, ref) {
    return (
      <article
        ref={ref}
        className={cn('experience-card-mobile relative isolate w-full', className)}
        data-milestone={milestone.id}
        data-milestone-index={index}
      >
        <div
          data-milestone-glow
          className={cn(
            'pointer-events-none absolute -inset-[2px] -z-10 rounded-[1.15rem]',
            staticVisible ? 'opacity-80' : 'opacity-0',
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
          className="relative z-[1] overflow-hidden rounded-2xl border border-cyber-fg/10 bg-cyber-bg-card"
          style={{
            boxShadow: staticVisible
              ? 'var(--milestone-active-shadow)'
              : '0 0 0 1px rgb(var(--cyber-fg) / 0.04), 0 12px 36px rgb(var(--cyber-card-shadow-rgb) / 0.2)',
          }}
        >
          <div className="relative px-5 py-5">
            <div className="mb-3 flex items-center justify-between gap-3">
              <span
                data-milestone-year
                className="font-mono text-[13px] font-semibold tracking-[0.16em] text-cyber-blue"
              >
                {milestone.year}
              </span>
              <span
                data-milestone-index-label
                className={cn(
                  'font-mono text-[12px] tracking-widest text-cyber-fg/35',
                  staticVisible ? 'opacity-100' : 'opacity-40',
                )}
              >
                {stepLabel(index)}
              </span>
            </div>

            <h3
              data-milestone-title
              className={cn(
                'text-[1.35rem] font-bold leading-snug text-cyber-fg',
                staticVisible ? 'opacity-100' : 'opacity-70',
              )}
            >
              {milestone.title}
            </h3>

            <p
              data-milestone-company
              className={cn(
                'mt-2 text-sm leading-relaxed text-cyber-fg-muted',
                staticVisible ? 'opacity-80' : 'opacity-50',
              )}
            >
              {milestone.company}
            </p>

            <p
              data-milestone-desc
              className={cn(
                'mt-4 text-[15px] leading-relaxed text-cyber-fg-muted/90',
                staticVisible ? 'opacity-90' : 'opacity-40',
              )}
            >
              {milestone.description}
            </p>

            <div data-milestone-tags className="mt-5 flex flex-wrap gap-2">
              {milestone.tags.map((tag) => (
                <span
                  key={tag}
                  data-milestone-tag
                  className={cn(
                    'rounded-md border border-cyber-blue/20 bg-cyber-blue/5 px-2 py-1 font-mono text-[11px] text-cyber-blue',
                    staticVisible ? 'opacity-90' : 'opacity-30',
                  )}
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>
      </article>
    )
  },
)

export default MobileJourneyCard
