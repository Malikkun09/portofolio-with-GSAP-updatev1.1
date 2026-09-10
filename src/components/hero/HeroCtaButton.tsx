import { type ReactNode } from 'react'
import { motion } from 'motion/react'
import { cn } from '@/lib/utils'
import { HERO_EASE } from '@/components/hero/hero-motion'

interface HeroCtaButtonProps {
  children: ReactNode
  onClick: () => void
  variant?: 'primary' | 'outline'
  className?: string
}

export default function HeroCtaButton({
  children,
  onClick,
  variant = 'primary',
  className,
}: HeroCtaButtonProps) {
  return (
    <motion.button
      type="button"
      onClick={onClick}
      className={cn(variant === 'primary' ? 'btn-primary group' : 'btn-outline', className)}
      whileHover={{ y: -2, scale: 1.02 }}
      whileTap={{ scale: 0.97 }}
      transition={{ duration: 0.28, ease: HERO_EASE }}
    >
      {children}
    </motion.button>
  )
}
