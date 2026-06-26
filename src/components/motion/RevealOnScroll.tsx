import { type ReactNode, useRef } from 'react'
import { motion, useInView } from 'motion/react'
import { cn } from '@/lib/utils'
import { EASE_OUT_EXPO } from '@/lib/motion'

interface RevealOnScrollProps {
  children: ReactNode
  className?: string
  delay?: number
  amount?: number
  y?: number
  scale?: number
}

export default function RevealOnScroll({
  children,
  className,
  delay = 0,
  amount = 0.15,
  y = 24,
  scale = 0.98,
}: RevealOnScrollProps) {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, amount })

  return (
    <motion.div
      ref={ref}
      className={cn(className)}
      initial={{ opacity: 0, y, scale }}
      animate={inView ? { opacity: 1, y: 0, scale: 1 } : { opacity: 0, y, scale }}
      transition={{ duration: 0.65, ease: EASE_OUT_EXPO, delay }}
    >
      {children}
    </motion.div>
  )
}
