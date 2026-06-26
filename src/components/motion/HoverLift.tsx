import { type ReactNode } from 'react'
import { motion } from 'motion/react'
import { cn } from '@/lib/utils'
import { hoverLift } from '@/lib/motion'

interface HoverLiftProps {
  children: ReactNode
  className?: string
}

export default function HoverLift({ children, className }: HoverLiftProps) {
  return (
    <motion.div
      className={cn(className)}
      initial="rest"
      whileHover="hover"
      variants={hoverLift}
    >
      {children}
    </motion.div>
  )
}
