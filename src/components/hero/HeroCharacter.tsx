import { motion, type MotionValue } from 'motion/react'
import { useAppReady } from '@/contexts/AppReadyContext'
import type { HeroLayout } from '@/hooks/use-hero-layout'
import { HERO_EASE } from '@/components/hero/hero-motion'

interface HeroCharacterProps {
  springX: MotionValue<number>
  springY: MotionValue<number>
  layout: HeroLayout
  parallax?: boolean
}

const DESKTOP_PARTICLES = [
  { x: '18%', y: '32%', size: 3, color: 'blue', delay: 0 },
  { x: '28%', y: '48%', size: 2, color: 'yellow', delay: 0.4 },
  { x: '12%', y: '62%', size: 4, color: 'blue', delay: 0.8 },
  { x: '35%', y: '28%', size: 2, color: 'yellow', delay: 1.1 },
  { x: '22%', y: '72%', size: 3, color: 'blue', delay: 0.2 },
  { x: '38%', y: '55%', size: 2, color: 'yellow', delay: 1.6 },
  { x: '8%', y: '44%', size: 2, color: 'blue', delay: 0.6 },
  { x: '32%', y: '38%', size: 3, color: 'yellow', delay: 1.3 },
] as const

const TABLET_PARTICLES = [
  { x: '10%', y: '20%', size: 3, color: 'blue', delay: 0 },
  { x: '86%', y: '24%', size: 2, color: 'yellow', delay: 0.45 },
  { x: '16%', y: '54%', size: 3, color: 'blue', delay: 0.85 },
  { x: '90%', y: '48%', size: 2, color: 'yellow', delay: 1.15 },
  { x: '44%', y: '8%', size: 2, color: 'blue', delay: 0.25 },
  { x: '52%', y: '64%', size: 3, color: 'yellow', delay: 1.4 },
  { x: '72%', y: '18%', size: 2, color: 'blue', delay: 0.65 },
] as const

const MOBILE_PARTICLES = [
  { x: '12%', y: '22%', size: 3, color: 'blue', delay: 0 },
  { x: '84%', y: '26%', size: 2, color: 'yellow', delay: 0.5 },
  { x: '20%', y: '58%', size: 2, color: 'blue', delay: 0.9 },
  { x: '88%', y: '52%', size: 3, color: 'yellow', delay: 1.2 },
  { x: '46%', y: '10%', size: 2, color: 'blue', delay: 0.3 },
  { x: '58%', y: '68%', size: 2, color: 'yellow', delay: 1.5 },
] as const

function CharacterEffects({ layout, ready }: { layout: HeroLayout; ready: boolean }) {
  const isDesktop = layout === 'desktop'
  const particles =
    layout === 'desktop'
      ? DESKTOP_PARTICLES
      : layout === 'tablet'
        ? TABLET_PARTICLES
        : MOBILE_PARTICLES

  return (
    <div
      className={`pointer-events-none absolute ${isDesktop ? 'inset-0' : 'inset-x-0 bottom-0 top-0'}`}
      aria-hidden
    >
      <motion.div
        className={`hero-glow-blue absolute rounded-full ${
          isDesktop
            ? 'bottom-[4%] left-[2%] h-[92%] w-[62%]'
            : 'bottom-[2%] left-1/2 h-[95%] w-[min(100%,82vw)] -translate-x-1/2 hero-glow-blue-mobile md:w-[74vw]'
        }`}
        initial={{ opacity: 0, scale: 0.92 }}
        animate={ready ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.92 }}
        transition={{ duration: 1.1, ease: HERO_EASE, delay: ready ? 0.15 : 0 }}
      />
      <motion.div
        className={`hero-glow-yellow absolute rounded-full ${
          isDesktop
            ? 'bottom-[6%] left-[24%] h-[88%] w-[56%]'
            : 'bottom-[4%] left-1/2 h-[90%] w-[min(100%,78vw)] -translate-x-1/2 hero-glow-yellow-mobile md:w-[70vw]'
        }`}
        initial={{ opacity: 0, scale: 0.9 }}
        animate={ready ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.9 }}
        transition={{ duration: 1.15, ease: HERO_EASE, delay: ready ? 0.28 : 0 }}
      />
      <div
        className={`hero-glow-bloom absolute ${
          isDesktop
            ? 'bottom-[2%] left-[12%] h-[62%] w-[76%]'
            : 'bottom-0 left-1/2 h-[82%] w-[min(100%,92vw)] -translate-x-1/2 hero-glow-bloom-mobile md:w-[84vw]'
        }`}
      />
      <div
        className={`hero-ground-pulse absolute h-px ${
          isDesktop ? 'bottom-[2%] left-[8%] w-[82%]' : 'bottom-[2%] left-[8%] w-[84%]'
        }`}
      />

      {particles.map((p, i) => (
        <motion.span
          key={i}
          className={`hero-spark absolute rounded-full ${
            p.color === 'blue' ? 'bg-cyber-blue' : 'bg-cyber-yellow'
          }`}
          style={{
            left: p.x,
            top: p.y,
            width: p.size,
            height: p.size,
            animationDelay: `${p.delay}s`,
          }}
          initial={{ opacity: 0, scale: 0 }}
          animate={ready ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0 }}
          transition={{ duration: 0.5, ease: HERO_EASE, delay: ready ? 0.4 + p.delay * 0.15 : 0 }}
        />
      ))}

      {isDesktop ? (
        <>
          <motion.div
            className="absolute bottom-[22%] left-[4%] h-28 w-28 border border-cyber-blue/20"
            initial={{ opacity: 0, rotate: -8, scale: 0.9 }}
            animate={ready ? { opacity: 1, rotate: 0, scale: 1 } : { opacity: 0, rotate: -8, scale: 0.9 }}
            transition={{ duration: 0.9, ease: HERO_EASE, delay: ready ? 0.55 : 0 }}
          />
          <motion.div
            className="absolute bottom-[36%] left-[10%] h-px w-20 bg-cyber-blue/30"
            initial={{ scaleX: 0, opacity: 0 }}
            animate={ready ? { scaleX: 1, opacity: 1 } : { scaleX: 0, opacity: 0 }}
            transition={{ duration: 0.7, ease: HERO_EASE, delay: ready ? 0.7 : 0 }}
            style={{ transformOrigin: 'left' }}
          />
          <motion.div
            className="absolute bottom-[32%] left-[10%] h-12 w-px bg-cyber-yellow/25"
            initial={{ scaleY: 0, opacity: 0 }}
            animate={ready ? { scaleY: 1, opacity: 1 } : { scaleY: 0, opacity: 0 }}
            transition={{ duration: 0.7, ease: HERO_EASE, delay: ready ? 0.78 : 0 }}
            style={{ transformOrigin: 'top' }}
          />
        </>
      ) : (
        <>
          <motion.div
            className="absolute bottom-[24%] left-1/2 h-10 w-10 -translate-x-[5rem] border border-cyber-blue/15 sm:-translate-x-[5.5rem] md:bottom-[28%] md:h-12 md:w-12 md:-translate-x-[7rem]"
            initial={{ opacity: 0, scale: 0.85 }}
            animate={ready ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.85 }}
            transition={{ duration: 0.75, ease: HERO_EASE, delay: ready ? 0.65 : 0 }}
          />
          <motion.div
            className="absolute bottom-[36%] left-1/2 w-12 translate-x-9 bg-cyber-yellow/25 sm:translate-x-10 md:bottom-[40%] md:w-16 md:translate-x-14"
            initial={{ scaleX: 0, opacity: 0 }}
            animate={ready ? { scaleX: 1, opacity: 1 } : { scaleX: 0, opacity: 0 }}
            transition={{ duration: 0.65, ease: HERO_EASE, delay: ready ? 0.75 : 0 }}
            style={{ transformOrigin: 'left' }}
          />
        </>
      )}
    </div>
  )
}

export default function HeroCharacter({
  springX,
  springY,
  layout,
  parallax = false,
}: HeroCharacterProps) {
  const appReady = useAppReady()
  const isDesktop = layout === 'desktop'
  const src = isDesktop ? '/images/malik-desktop.png' : '/images/malik-mobile.png'

  const characterDelay = isDesktop ? 0.12 : layout === 'tablet' ? 0.35 : 0.42

  const compactEnter = {
    hidden: { opacity: 0, y: 48 },
    visible: { opacity: 1, y: 0 },
  }

  const desktopEnter = {
    hidden: { opacity: 0, x: -32, scale: 0.98 },
    visible: { opacity: 1, x: 0, scale: 1 },
  }

  if (!isDesktop) {
    return (
      <motion.div
        className="relative flex h-full w-full items-end justify-center overflow-x-clip overflow-y-visible"
        initial="hidden"
        animate={appReady ? 'visible' : 'hidden'}
        variants={compactEnter}
        transition={{ duration: 0.95, ease: HERO_EASE, delay: characterDelay }}
      >
        <div className="relative flex h-full w-full max-w-[100vw] items-end justify-center">
          <CharacterEffects layout={layout} ready={appReady} />
          <div className="absolute bottom-0 left-1/2 z-20 w-[min(100vw,820px)] max-w-none -translate-x-1/2 translate-y-[14%] sm:w-[min(100vw,760px)] sm:translate-y-[12%] md:w-[min(100vw,880px)] md:translate-y-[10%]">
            <motion.img
              src={src}
              alt="Malik Fajar — cybersecurity learner and developer"
              className="hero-character-img block h-[122%] w-full object-cover object-[50%_14%] sm:h-[124%] md:h-[126%] md:object-[50%_16%]"
              width={480}
              height={560}
              fetchPriority="high"
              loading="eager"
              draggable={false}
              onDragStart={(e) => e.preventDefault()}
              initial={{ opacity: 0, y: 24 }}
              animate={appReady ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
              transition={{ duration: 1.05, ease: HERO_EASE, delay: characterDelay + 0.1 }}
            />
          </div>
        </div>
      </motion.div>
    )
  }

  return (
    <motion.div
      className="relative flex h-full w-full items-end justify-start"
      style={parallax ? { x: springX, y: springY } : undefined}
      initial="hidden"
      animate={appReady ? 'visible' : 'hidden'}
      variants={desktopEnter}
      transition={{ duration: 1, ease: HERO_EASE, delay: characterDelay }}
    >
      <div className="relative h-full w-full overflow-hidden">
        <CharacterEffects layout={layout} ready={appReady} />
        <motion.img
          src={src}
          alt="Malik Fajar — cybersecurity learner and developer"
          className="hero-character-img relative z-20 h-full w-[118%] max-w-none -translate-x-[9%] object-cover object-[50%_100%]"
          width={1920}
          height={1080}
          fetchPriority="high"
          loading="eager"
          draggable={false}
          onDragStart={(e) => e.preventDefault()}
          initial={{ opacity: 0, scale: 1.03 }}
          animate={appReady ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 1.03 }}
          transition={{ duration: 1.1, ease: HERO_EASE, delay: characterDelay + 0.12 }}
        />
        <motion.p
          className="absolute bottom-[4%] left-[2%] z-30 font-mono text-[11px] uppercase tracking-[0.28em] text-cyber-yellow/80"
          aria-hidden
          initial={{ opacity: 0, x: -12 }}
          animate={appReady ? { opacity: 1, x: 0 } : { opacity: 0, x: -12 }}
          transition={{ duration: 0.8, ease: HERO_EASE, delay: 0.85 }}
        >
          // SECURE BY DESIGN
        </motion.p>
      </div>
    </motion.div>
  )
}
