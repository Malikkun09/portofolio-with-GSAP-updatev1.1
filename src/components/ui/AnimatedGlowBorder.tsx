import { useEffect, useRef, useState, type ComponentPropsWithoutRef, type ElementType, type ReactNode } from 'react'
import { cn } from '@/lib/utils'

type RoundedSize = 'none' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl'
type Palette = 'default' | 'google'

type AnimatedGlowBorderOwnProps = {
  children: ReactNode
  className?: string
  innerClassName?: string
  hoverEnhance?: boolean
  rounded?: RoundedSize
  intensity?: 'subtle' | 'default' | 'strong'
  palette?: Palette
  /** Pause expensive border animations when scrolled out of view */
  pauseOffscreen?: boolean
}

type AnimatedGlowBorderProps<T extends ElementType = 'div'> = AnimatedGlowBorderOwnProps & {
  as?: T
} & Omit<ComponentPropsWithoutRef<T>, keyof AnimatedGlowBorderOwnProps | 'as'>

const roundedMap: Record<RoundedSize, string> = {
  none: 'rounded-none',
  sm: 'rounded-sm',
  md: 'rounded-md',
  lg: 'rounded-lg',
  xl: 'rounded-xl',
  '2xl': 'rounded-2xl',
  '3xl': 'rounded-3xl',
}

export default function AnimatedGlowBorder<T extends ElementType = 'div'>({
  children,
  className,
  innerClassName,
  as,
  hoverEnhance = true,
  rounded = 'none',
  intensity = 'subtle',
  palette = 'default',
  pauseOffscreen = true,
  ...rest
}: AnimatedGlowBorderProps<T>) {
  const Component = as || 'div'
  const rootRef = useRef<HTMLDivElement>(null)
  const [inView, setInView] = useState(false)

  useEffect(() => {
    if (!pauseOffscreen) return undefined

    const element = rootRef.current
    if (!element) return undefined

    const observer = new IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting),
      { rootMargin: '64px', threshold: 0.02 },
    )

    observer.observe(element)
    return () => observer.disconnect()
  }, [pauseOffscreen])

  return (
    <Component
      ref={rootRef}
      className={cn(
        'animated-glow-border group relative isolate',
        roundedMap[rounded],
        hoverEnhance && 'animated-glow-border--hover',
        intensity === 'subtle' && 'animated-glow-border--subtle',
        intensity === 'strong' && 'animated-glow-border--strong',
        palette === 'google' && 'animated-glow-border--google',
        pauseOffscreen && !inView && 'animated-glow-border--offscreen',
        className,
      )}
      {...rest}
    >
      <div className="animated-glow-border__glow" aria-hidden />
      <div className="animated-glow-border__ring" aria-hidden />
      <div className={cn('animated-glow-border__content relative z-[1]', innerClassName)}>
        {children}
      </div>
    </Component>
  )
}
