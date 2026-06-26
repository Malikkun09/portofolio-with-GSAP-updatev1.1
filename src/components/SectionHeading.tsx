import { cn } from '@/lib/utils'

interface SectionHeadingProps {
  label: string
  title: string
  description?: string
  className?: string
  align?: 'left' | 'center'
}

export default function SectionHeading({
  label,
  title,
  description,
  className,
  align = 'left',
}: SectionHeadingProps) {
  return (
    <div
      className={cn(
        'mb-12 lg:mb-16',
        align === 'center' && 'text-center',
        className,
      )}
    >
      <div className={cn('mb-4 flex items-center gap-3', align === 'center' && 'justify-center')}>
        <span className="glow-line-blue h-px w-8 bg-cyber-blue" aria-hidden />
        <span className="section-label">{label}</span>
        <span className="glow-line-yellow h-px w-8 bg-cyber-yellow" aria-hidden />
      </div>
      <h2 className="glow-text-blue-soft text-3xl font-bold tracking-tight text-white sm:text-4xl lg:text-5xl">
        {title}
      </h2>
      {description && (
        <p
          className={cn(
            'mt-4 max-w-2xl text-base leading-relaxed text-cyber-muted',
            align === 'center' && 'mx-auto',
          )}
        >
          {description}
        </p>
      )}
    </div>
  )
}
