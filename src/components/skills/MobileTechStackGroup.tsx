import { forwardRef, type CSSProperties } from 'react'
import { cn } from '@/lib/utils'
import type { TechGroupLayout } from './tech-stack-config'

interface MobileTechStackGroupProps {
  group: TechGroupLayout
  className?: string
  style?: CSSProperties
  staticVisible?: boolean
}

const AI_GRADIENT_BORDERS = [
  'conic-gradient(from 180deg, #67e8f9, #00B8FF, #818cf8, #c084fc, #67e8f9)',
  'conic-gradient(from 200deg, #818cf8, #6366f1, #00B8FF, #a78bfa, #818cf8)',
  'conic-gradient(from 160deg, #f472b6, #ec4899, #a855f7, #818cf8, #f472b6)',
  'conic-gradient(from 220deg, #fde047, #86efac, #00B8FF, #fbbf24, #fde047)',
]

const MobileTechStackGroup = forwardRef<HTMLDivElement, MobileTechStackGroupProps>(
  function MobileTechStackGroup({ group, className, style, staticVisible = false }, ref) {
    const { theme } = group
    const gradientBorder = AI_GRADIENT_BORDERS[group.index] ?? AI_GRADIENT_BORDERS[0]

    return (
      <div
        ref={ref}
        className={cn(
          'tech-stack-group-mobile relative pl-12',
          staticVisible && 'tech-stack-group-mobile--active',
          className,
        )}
        style={style}
        data-group={group.id}
        data-group-index={group.index}
      >
        {/* Node on the track */}
        <span
          data-mobile-node
          className={cn(
            'absolute left-[18px] top-7 z-20 h-3 w-3 -translate-x-1/2 rounded-full border bg-cyber-black',
            staticVisible ? 'border-cyber-blue/60 bg-cyber-blue/20' : 'border-cyber-blue/30',
          )}
          aria-hidden
        />

        {/* AI gradient glow ring */}
        <div
          data-glow-border
          className={cn(
            'pointer-events-none absolute -inset-px z-0 rounded-xl',
            staticVisible ? 'opacity-70' : 'opacity-0',
          )}
          style={{ background: gradientBorder, filter: 'blur(0.5px)' }}
          aria-hidden
        />

        <div
          data-group-card
          className="tech-stack-group__card relative z-[1] overflow-hidden rounded-xl border backdrop-blur-md"
          style={{
            borderColor: theme.borderColor,
            background: staticVisible ? theme.activeGradient : theme.gradient,
            boxShadow: staticVisible
              ? theme.activeGlow
              : `0 0 0 1px rgba(255,255,255,0.02), 0 8px 28px rgba(0,0,0,0.4)`,
          }}
        >
          <div className="relative p-4">
            <div className="mb-3 flex items-center justify-between gap-3">
              <h3 className="text-base font-bold text-cyber-fg">{group.title}</h3>
              <span
                data-group-label
                className={cn(
                  'font-mono text-[10px] font-medium tracking-widest',
                  staticVisible ? 'opacity-100' : 'opacity-50',
                )}
                style={{ color: theme.labelColor }}
              >
                0{group.index + 1}
              </span>
            </div>

            <div className="flex flex-wrap gap-1.5">
              {group.skills.map((skill) => (
                <span
                  key={skill}
                  data-tech-chip
                  className={cn(
                    'tech-stack-chip rounded-md border px-2 py-1 font-mono text-[10px] text-cyber-fg/80',
                    staticVisible && 'opacity-100',
                  )}
                  style={{
                    borderColor: theme.chipBorder,
                    backgroundColor: theme.chipBg,
                  }}
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  },
)

export default MobileTechStackGroup
