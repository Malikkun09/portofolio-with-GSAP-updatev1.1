import { cn } from '@/lib/utils'

interface SectionHeadingProps {
  label: string
  title: string
  description?: string
  className?: string
  align?: 'left' | 'center'
  compact?: boolean
}

export default function SectionHeading({
  label,
  title,
  description,
  className,
  align = 'left',
  compact = false,
}: SectionHeadingProps) {
  return (
    <div
      className={cn(
        compact ? 'mb-4' : 'mb-12 lg:mb-16',
        align === 'center' && 'text-center',
        className,
      )}
    >
      <div className={cn('flex items-center gap-3', compact ? 'mb-2' : 'mb-4', align === 'center' && 'justify-center')}>
        <span className="glow-line-blue h-px w-8 bg-cyber-blue" aria-hidden />
        <span className="section-label">{label}</span>
        <span className="glow-line-yellow h-px w-8 bg-cyber-yellow" aria-hidden />
      </div>
      <h2
        className={cn(
          'glow-text-blue-soft font-display font-semibold tracking-tight text-cyber-fg',
          compact
            ? 'text-2xl leading-tight lg:text-[2.45rem] lg:leading-[1.12]'
            : 'text-3xl sm:text-4xl lg:text-[3.25rem] lg:leading-[1.08]',
        )}
      >
        {title}
      </h2>
      {description && (
        <p
          className={cn(
            'max-w-2xl font-light leading-relaxed text-cyber-fg-muted',
            compact ? 'mt-1.5 text-sm' : 'mt-4 text-[0.98rem]',
            align === 'center' && 'mx-auto',
          )}
        >
          {description}
        </p>
      )}
    </div>
  )
}
