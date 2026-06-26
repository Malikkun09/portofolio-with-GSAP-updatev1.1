import { type ReactNode } from 'react'
import { motion, useInView } from 'motion/react'
import { useRef } from 'react'
import { cn } from '@/lib/utils'
import { sectionReveal, staggerItem } from '@/lib/motion'

interface StaggerChildrenProps {
  children: ReactNode
  className?: string
  once?: boolean
  amount?: number
}

export default function StaggerChildren({
  children,
  className,
  once = true,
  amount = 0.12,
}: StaggerChildrenProps) {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once, amount })

  return (
    <motion.div
      ref={ref}
      className={cn(className)}
      initial="hidden"
      animate={inView ? 'visible' : 'hidden'}
      variants={sectionReveal}
    >
      {children}
    </motion.div>
  )
}

export function StaggerItem({
  children,
  className,
}: {
  children: ReactNode
  className?: string
}) {
  return (
    <motion.div className={cn(className)} variants={staggerItem}>
      {children}
    </motion.div>
  )
}
