import { ArrowRight, Mail } from 'lucide-react'
import { motion } from 'motion/react'
import AnimatedGlowBorder from '@/components/ui/AnimatedGlowBorder'
import Magnetic from '@/components/ui/Magnetic'
import { buildPersonalMailto, buildSchoolMailto } from '@/lib/secure-contact'
import { cn } from '@/lib/utils'

interface PremiumCTAProps {
  title?: string
  className?: string
  inView?: boolean
}

export default function PremiumCTA({
  title = 'Ready to build something secure?',
  className,
  inView = true,
}: PremiumCTAProps) {
  return (
    <AnimatedGlowBorder
      intensity="default"
      hoverEnhance
      className={cn(
        'mx-auto max-w-2xl transition-all duration-700',
        inView ? 'translate-y-0 opacity-100' : 'translate-y-6 opacity-0',
        className,
      )}
      innerClassName="bg-cyber-bg-surface/80 p-8 text-center backdrop-blur-sm sm:p-10"
    >
      <p className="mb-6 text-lg font-semibold text-cyber-fg sm:text-xl">{title}</p>

      <div className="flex flex-col items-center justify-center gap-3 sm:flex-row">
        <Magnetic strength={0.22}>
          <motion.a
            href={buildSchoolMailto()}
            className="group relative inline-flex items-center gap-3 overflow-hidden rounded-sm border border-cyber-blue/40 bg-cyber-blue px-7 py-3.5 text-sm font-semibold text-cyber-black transition-colors duration-300 hover:bg-transparent hover:text-cyber-blue"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <span className="absolute inset-0 bg-gradient-to-r from-cyber-blue/0 via-white/20 to-cyber-blue/0 opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
            <Mail size={18} className="relative z-[1]" />
            <span className="relative z-[1]">Email me</span>
            <motion.span
              className="relative z-[1] flex items-center"
              initial={{ x: 0 }}
              whileHover={{ x: 4 }}
              transition={{ type: 'spring', stiffness: 400, damping: 24 }}
            >
              <ArrowRight size={18} />
            </motion.span>
          </motion.a>
        </Magnetic>

        <Magnetic strength={0.2}>
          <motion.a
            href={buildPersonalMailto()}
            className="group relative inline-flex items-center gap-3 overflow-hidden rounded-sm border border-cyber-yellow/35 bg-cyber-yellow/10 px-7 py-3.5 text-sm font-semibold text-cyber-yellow transition-colors duration-300 hover:bg-cyber-yellow hover:text-cyber-black"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Mail size={18} />
            <span>Personal email</span>
            <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
          </motion.a>
        </Magnetic>
      </div>
    </AnimatedGlowBorder>
  )
}

interface PremiumLinkCTAProps {
  href: string
  children: React.ReactNode
  onClick?: (e: React.MouseEvent<HTMLAnchorElement>) => void
  className?: string
}

export function PremiumLinkCTA({ href, children, onClick, className }: PremiumLinkCTAProps) {
  return (
    <Magnetic strength={0.18}>
      <motion.a
        href={href}
        onClick={onClick}
        className={cn(
          'group relative inline-flex items-center gap-2 font-semibold text-cyber-fg transition-colors hover:text-cyber-blue',
          className,
        )}
      >
        <span className="relative pb-1">
          {children}
          <span className="absolute bottom-0 left-0 h-px w-full origin-left scale-x-0 bg-cyber-blue transition-transform duration-500 ease-out group-hover:scale-x-100" />
        </span>
        <motion.span
          animate={{ x: [0, 0] }}
          whileHover={{ x: 5 }}
          transition={{ type: 'spring', stiffness: 380, damping: 22 }}
        >
          <ArrowRight size={18} />
        </motion.span>
      </motion.a>
    </Magnetic>
  )
}
