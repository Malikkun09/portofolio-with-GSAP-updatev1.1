import { type ReactNode, useRef } from 'react'
import { motion, useInView } from 'motion/react'
import { cn } from '@/lib/utils'
import { revealVariants, type RevealVariant } from '@/lib/motion'

interface RevealProps {
  children: ReactNode
  className?: string
  variant?: RevealVariant
  delay?: number
  once?: boolean
  amount?: number
}

export default function Reveal({
  children,
  className,
  variant = 'fade-up',
  delay = 0,
  once = true,
  amount = 0.15,
}: RevealProps) {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once, amount })
  const variants = revealVariants[variant]

  return (
    <motion.div
      ref={ref}
      className={cn(className)}
      initial="hidden"
      animate={inView ? 'visible' : 'hidden'}
      variants={{
        hidden: variants.hidden,
        visible: {
          ...variants.visible,
          transition: {
            ...(typeof variants.visible === 'object' && 'transition' in variants.visible
              ? variants.visible.transition
              : {}),
            delay,
          },
        },
      }}
    >
      {children}
    </motion.div>
  )
}
