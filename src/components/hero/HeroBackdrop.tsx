import { motion, type MotionValue } from 'framer-motion'
import { HERO_EASE } from '@/components/hero/hero-motion'
import { useAppReady } from '@/contexts/AppReadyContext'

interface HeroBackdropProps {
  bgX: MotionValue<number>
  bgY: MotionValue<number>
}

const FLOATING_ACCENTS = [
  { top: '12%', left: '8%', color: 'blue', size: 6, delay: 0 },
  { top: '22%', left: '18%', color: 'yellow', size: 4, delay: 1.2 },
  { top: '68%', left: '6%', color: 'blue', size: 5, delay: 0.6 },
  { top: '78%', left: '42%', color: 'yellow', size: 3, delay: 2 },
  { top: '15%', right: '12%', color: 'yellow', size: 5, delay: 0.8 },
  { top: '55%', right: '8%', color: 'blue', size: 4, delay: 1.5 },
  { top: '85%', right: '22%', color: 'yellow', size: 6, delay: 0.3 },
] as const

export default function HeroBackdrop({ bgX, bgY }: HeroBackdropProps) {
  const appReady = useAppReady()

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
      <motion.div
        className="absolute inset-0 cyber-grid-bg opacity-50"
        style={{ x: bgX, y: bgY }}
        initial={{ opacity: 0 }}
        animate={appReady ? { opacity: 0.5 } : { opacity: 0 }}
        transition={{ duration: 1.2, ease: HERO_EASE }}
      />

      <div className="absolute inset-0 bg-gradient-to-r from-cyber-black via-transparent to-cyber-black/80" />
      <div className="absolute inset-0 bg-gradient-to-t from-cyber-black via-transparent to-cyber-black/40" />

      <motion.div
        className="glow-line-blue absolute left-6 top-28 h-px w-32 bg-gradient-to-r from-cyber-blue/60 to-transparent lg:left-10 lg:w-48"
        style={{ x: bgX, y: bgY }}
        initial={{ scaleX: 0, opacity: 0 }}
        animate={appReady ? { scaleX: 1, opacity: 1 } : { scaleX: 0, opacity: 0 }}
        transition={{ duration: 0.9, ease: HERO_EASE, delay: appReady ? 0.35 : 0 }}
      />
      <motion.div
        className="glow-line-blue absolute left-6 top-28 h-20 w-px bg-gradient-to-b from-cyber-blue/50 to-transparent lg:left-10"
        style={{ x: bgX, y: bgY }}
        initial={{ scaleY: 0, opacity: 0 }}
        animate={appReady ? { scaleY: 1, opacity: 1 } : { scaleY: 0, opacity: 0 }}
        transition={{ duration: 0.9, ease: HERO_EASE, delay: appReady ? 0.45 : 0 }}
      />
      <motion.div
        className="glow-line-yellow absolute right-0 top-20 hidden h-32 w-1.5 bg-cyber-yellow/80 lg:block"
        initial={{ scaleY: 0, opacity: 0 }}
        animate={appReady ? { scaleY: 1, opacity: 1 } : { scaleY: 0, opacity: 0 }}
        transition={{ duration: 0.85, ease: HERO_EASE, delay: appReady ? 0.5 : 0 }}
        style={{ transformOrigin: 'top' }}
      />
      <motion.div
        className="glow-line-blue absolute left-0 top-1/3 hidden h-24 w-1 bg-cyber-blue/50 lg:block"
        initial={{ scaleY: 0, opacity: 0 }}
        animate={appReady ? { scaleY: 1, opacity: 1 } : { scaleY: 0, opacity: 0 }}
        transition={{ duration: 0.85, ease: HERO_EASE, delay: appReady ? 0.55 : 0 }}
        style={{ transformOrigin: 'top' }}
      />

      <motion.div
        className="glow-box-blue absolute left-[4%] top-[18%] h-8 w-8 border border-cyber-blue/25 sm:h-10 sm:w-10 lg:left-[4%]"
        initial={{ opacity: 0, scale: 0.8, rotate: -12 }}
        animate={appReady ? { opacity: 1, scale: 1, rotate: 0 } : { opacity: 0, scale: 0.8, rotate: -12 }}
        transition={{ duration: 0.75, ease: HERO_EASE, delay: appReady ? 0.4 : 0 }}
      />
      <motion.div
        className="glow-box-yellow absolute right-[6%] top-[30%] hidden h-6 w-16 border border-cyber-yellow/20 sm:block"
        initial={{ opacity: 0, x: 16 }}
        animate={appReady ? { opacity: 1, x: 0 } : { opacity: 0, x: 16 }}
        transition={{ duration: 0.7, ease: HERO_EASE, delay: appReady ? 0.52 : 0 }}
      />
      <motion.div
        className="glow-line-blue absolute bottom-[22%] left-[38%] hidden h-px w-24 bg-cyber-blue/20 lg:block"
        initial={{ scaleX: 0, opacity: 0 }}
        animate={appReady ? { scaleX: 1, opacity: 1 } : { scaleX: 0, opacity: 0 }}
        transition={{ duration: 0.65, ease: HERO_EASE, delay: appReady ? 0.62 : 0 }}
        style={{ transformOrigin: 'left' }}
      />

      <motion.div
        className="glow-box-blue absolute right-[8%] top-[22%] hidden h-8 w-8 border-r border-t border-cyber-blue/30 lg:block"
        initial={{ opacity: 0, scale: 0.85 }}
        animate={appReady ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.85 }}
        transition={{ duration: 0.7, ease: HERO_EASE, delay: appReady ? 0.58 : 0 }}
      />
      <motion.div
        className="glow-box-yellow absolute bottom-[18%] right-[12%] hidden h-6 w-6 border-b border-r border-cyber-yellow/25 lg:block"
        initial={{ opacity: 0, scale: 0.85 }}
        animate={appReady ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.85 }}
        transition={{ duration: 0.7, ease: HERO_EASE, delay: appReady ? 0.66 : 0 }}
      />

      {FLOATING_ACCENTS.map((accent, i) => (
        <motion.span
          key={i}
          className={`hero-float-particle absolute rounded-sm ${
            accent.color === 'blue' ? 'bg-cyber-blue/70' : 'bg-cyber-yellow/70'
          }`}
          style={{
            top: accent.top,
            left: 'left' in accent ? accent.left : undefined,
            right: 'right' in accent ? accent.right : undefined,
            width: accent.size,
            height: accent.size,
            animationDelay: `${accent.delay}s`,
          }}
          initial={{ opacity: 0, scale: 0 }}
          animate={appReady ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0 }}
          transition={{ duration: 0.45, ease: HERO_EASE, delay: appReady ? 0.3 + i * 0.06 : 0 }}
        />
      ))}

      <div className="hero-scanline absolute inset-0 opacity-[0.03]" />
    </div>
  )
}
