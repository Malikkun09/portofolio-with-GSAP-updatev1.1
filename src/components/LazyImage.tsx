import { useRef, useState, type ImgHTMLAttributes } from 'react'
import { motion, useInView } from 'motion/react'
import { cn } from '@/lib/utils'
import { Skeleton } from './Skeleton'
import { EASE_OUT_EXPO } from '@/lib/motion'

interface LazyImageProps extends ImgHTMLAttributes<HTMLImageElement> {
  skeletonClassName?: string
  reveal?: boolean
}

export default function LazyImage({
  src,
  alt,
  className,
  skeletonClassName,
  loading = 'lazy',
  reveal = true,
  ...props
}: LazyImageProps) {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, amount: 0.12 })
  const [loaded, setLoaded] = useState(false)

  return (
    <motion.div
      ref={ref}
      className="relative h-full w-full overflow-hidden"
      initial={reveal ? { opacity: 0, scale: 0.97 } : false}
      animate={
        reveal && inView && loaded
          ? { opacity: 1, scale: 1 }
          : reveal && inView
            ? { opacity: 1, scale: 0.99 }
            : undefined
      }
      transition={{ duration: 0.55, ease: EASE_OUT_EXPO }}
    >
      {!loaded && (
        <Skeleton className={cn('absolute inset-0', skeletonClassName)} />
      )}
      <img
        src={src}
        alt={alt}
        loading={loading}
        decoding="async"
        onLoad={() => setLoaded(true)}
        className={cn(
          className,
          'transition-[opacity,transform] duration-500 ease-out',
          loaded ? 'scale-100 opacity-100' : 'scale-[1.02] opacity-0',
        )}
        {...props}
      />
    </motion.div>
  )
}
