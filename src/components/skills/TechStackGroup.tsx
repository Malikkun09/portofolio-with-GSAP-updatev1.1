import { forwardRef, type CSSProperties } from 'react'
import { cn } from '@/lib/utils'
import type { TechGroupLayout } from './tech-stack-config'

interface TechStackGroupProps {
  group: TechGroupLayout
  isMobile: boolean
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

const TechStackGroup = forwardRef<HTMLDivElement, TechStackGroupProps>(
  function TechStackGroup({ group, isMobile, className, style, staticVisible = false }, ref) {
    const pos = isMobile ? group.mobile : group.desktop
    const { theme } = group
    const gradientBorder = AI_GRADIENT_BORDERS[group.index] ?? AI_GRADIENT_BORDERS[0]

    return (
      <div
        ref={ref}
        className={cn(
          'tech-stack-group pointer-events-none absolute z-20 w-[min(86vw,268px)] sm:w-[min(38vw,300px)]',
          staticVisible && 'tech-stack-group--active',
          className,
        )}
        style={{
          top: pos.top,
          left: pos.left,
          transform: `translate(${pos.translate})`,
          ...(staticVisible ? { opacity: 1, visibility: 'visible' as const } : {}),
          ...style,
        }}
        data-group={group.id}
        data-group-index={group.index}
      >
        {/* Anchor connector dot */}
        <span
          data-group-anchor
          className="absolute left-1/2 top-1/2 z-0 h-1.5 w-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-cyber-blue/30"
          aria-hidden
        />

        {/* AI-mode gradient glow ring */}
        <div
          data-glow-border
          className={cn(
            'pointer-events-none absolute -inset-px z-0 rounded-xl',
            staticVisible ? 'opacity-80' : 'opacity-0',
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
              : 'var(--tech-card-idle-shadow)',
          }}
        >
          <div
            data-group-card-bg
            className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300"
            style={{ background: theme.activeGradient }}
            aria-hidden
          />

          <div className="relative p-4 sm:p-5">
            <div className="mb-3 flex items-center justify-between gap-3">
              <h3 className="text-base font-bold text-cyber-fg sm:text-lg">{group.title}</h3>
              <span
                data-group-label
                className="font-mono text-[10px] font-medium tracking-widest opacity-60"
                style={{ color: theme.labelColor }}
              >
                0{group.index + 1}
              </span>
            </div>

            <div className="flex flex-wrap gap-1.5 sm:gap-2">
              {group.skills.map((skill) => (
                <span
                  key={skill}
                  data-tech-chip
                  className={cn(
                    'tech-stack-chip rounded-md border px-2 py-1 font-mono text-[10px] text-cyber-fg/75 sm:px-2.5 sm:py-1.5 sm:text-[11px]',
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

export default TechStackGroup
