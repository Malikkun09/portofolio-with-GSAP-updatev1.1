import { forwardRef, type CSSProperties } from 'react'
import { cn } from '@/lib/utils'
import { AI_GRADIENT_BORDERS, type TechGroupLayout } from './tech-stack-config'

interface TabletTechStackGroupProps {
  group: TechGroupLayout
  className?: string
  style?: CSSProperties
  staticVisible?: boolean
}

/** Maps group index → grid cell (TL, TR, BL, BR) */
const GRID_CELLS = [
  'col-start-1 row-start-1',
  'col-start-2 row-start-1',
  'col-start-1 row-start-2',
  'col-start-2 row-start-2',
] as const

const TabletTechStackGroup = forwardRef<HTMLDivElement, TabletTechStackGroupProps>(
  function TabletTechStackGroup({ group, className, style, staticVisible = false }, ref) {
    const { theme } = group
    const gradientBorder = AI_GRADIENT_BORDERS[group.index] ?? AI_GRADIENT_BORDERS[0]
    const cell = GRID_CELLS[group.index] ?? GRID_CELLS[0]

    return (
      <div
        ref={ref}
        className={cn(
          'tech-stack-group-tablet relative flex items-center justify-center',
          cell,
          staticVisible && 'tech-stack-group-tablet--active',
          className,
        )}
        style={style}
        data-group={group.id}
        data-group-index={group.index}
      >
        {/* AI gradient glow ring */}
        <div
          data-glow-border
          className={cn(
            'pointer-events-none absolute inset-2 rounded-xl',
            staticVisible ? 'opacity-70' : 'opacity-0',
          )}
            style={{ background: gradientBorder }}
          aria-hidden
        />

        <div
          data-group-card
          className="tech-stack-group__card relative z-[1] h-[210px] w-full max-w-[340px] overflow-hidden rounded-xl border"
          style={{
            borderColor: theme.borderColor,
            background: staticVisible ? theme.activeGradient : theme.gradient,
            boxShadow: staticVisible
              ? theme.activeGlow
              : `0 0 0 1px rgba(255,255,255,0.02), 0 8px 32px rgba(0,0,0,0.4)`,
          }}
        >
          <div className="relative flex h-full flex-col p-5">
            <div className="mb-3 flex items-center justify-between gap-3">
              <h3 className="font-display text-xl font-semibold tracking-tight text-cyber-fg">{group.title}</h3>
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

            <div className="flex flex-1 flex-wrap content-start gap-2">
              {group.skills.map((skill) => (
                <span
                  key={skill}
                  data-tech-chip
                  className={cn(
                    'tech-stack-chip rounded-md border px-2.5 py-1.5 font-mono text-[11px] text-cyber-fg/80',
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

export default TabletTechStackGroup
