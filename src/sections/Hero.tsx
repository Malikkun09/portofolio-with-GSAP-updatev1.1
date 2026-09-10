import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import HeroBackdrop from '@/components/hero/HeroBackdrop'
import HeroCharacter from '@/components/hero/HeroCharacter'
import HeroCtaButton from '@/components/hero/HeroCtaButton'
import { heroMotionByLayout, HERO_EASE } from '@/components/hero/hero-motion'
import { useAppReady } from '@/contexts/AppReadyContext'
import { useHeroLayout } from '@/hooks/use-hero-layout'
import { useHeroParallax } from '@/hooks/use-hero-parallax'
import { scrollToSection } from '@/lib/utils'

const META = [
  { label: 'Student', value: 'SMK Informatika Fithrah Insani' },
  { label: 'Focus', value: 'Cybersecurity & Pentesting' },
  { label: 'Building', value: 'Full-stack projects' },
] as const

const BIO_TEXT = (
  <>
    A cybersecurity learner focused on{' '}
    <span className="font-medium text-cyber-yellow">pentesting</span> and{' '}
    <span className="font-medium text-cyber-blue">secure web development</span>, while exploring{' '}
    <span className="font-medium text-cyber-yellow">3D web experiences</span> and{' '}
    <span className="font-medium text-cyber-blue">modern UI</span>.
  </>
)

function BioCorner({ position, ready }: { position: 'tl' | 'tr' | 'bl' | 'br'; ready: boolean }) {
  const classes = {
    tl: '-left-px -top-px border-l border-t border-cyber-blue/70',
    tr: '-right-px -top-px border-r border-t border-cyber-yellow/70',
    bl: '-bottom-px -left-px border-b border-l border-cyber-blue/50',
    br: '-bottom-px -right-px border-b border-r border-cyber-yellow/50',
  }[position]

  const delay = { tl: 0.5, tr: 0.56, bl: 0.62, br: 0.68 }[position]

  return (
    <motion.div
      className={`pointer-events-none absolute h-3 w-3 ${classes}`}
      aria-hidden
      initial={{ opacity: 0, scale: 0.5 }}
      animate={ready ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.5 }}
      transition={{ duration: 0.45, delay: ready ? delay : 0, ease: HERO_EASE }}
    />
  )
}

export default function Hero() {
  const sectionRef = useRef<HTMLElement>(null)
  const layout = useHeroLayout()
  const motionConfig = heroMotionByLayout[layout]
  const appReady = useAppReady()
  const { springX, springY, bgX, bgY } = useHeroParallax(sectionRef)

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end start'],
  })
  const contentY = useTransform(scrollYProgress, [0, 1], [0, 32])
  const mobileScrollY = useTransform(scrollYProgress, [0, 1], [0, 28])
  const compactScrollY = useTransform(scrollYProgress, [0, 1], [0, -12])

  const compactLayout = layout === 'desktop' ? 'mobile' : layout

  return (
    <section
      ref={sectionRef}
      id="hero"
      className="relative min-h-[100svh] overflow-hidden lg:min-h-[100svh]"
      aria-label="Introduction"
    >
      <HeroBackdrop bgX={bgX} bgY={bgY} />

      <div
        className="pointer-events-none absolute bottom-0 left-0 hidden h-[78%] w-[62%] bg-gradient-to-r from-cyber-blue/[0.05] via-transparent to-transparent lg:block"
        aria-hidden
      />

      <div
        className="pointer-events-none absolute bottom-0 left-0 right-0 h-[45%] bg-gradient-to-t from-cyber-blue/[0.06] via-transparent to-transparent lg:hidden"
        aria-hidden
      />

      {/* Mobile + tablet layout */}
      <motion.div
        className="pointer-events-none absolute inset-x-0 bottom-0 top-[58%] z-10 flex justify-center sm:top-[56%] md:top-[52%] lg:hidden"
        style={{ y: mobileScrollY }}
      >
        <div
          className="pointer-events-none absolute inset-x-0 top-0 z-20 h-12 bg-gradient-to-b from-cyber-bg/80 to-transparent sm:h-14 md:h-16"
          aria-hidden
        />
        <div className="relative h-full w-full max-w-[100vw]">
          <HeroCharacter
            springX={springX}
            springY={springY}
            layout={compactLayout}
            parallax={false}
          />
        </div>
      </motion.div>

      <motion.div
        className="relative z-20 flex flex-col items-center px-5 pb-3 pt-[4.5rem] text-center sm:px-7 lg:hidden"
        style={{ y: compactScrollY }}
      >
        <motion.h1
          className="font-display w-full text-[clamp(3.35rem,16vw,5.15rem)] font-semibold leading-[0.92] tracking-tight"
          initial={{ opacity: 0 }}
          animate={appReady ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          <motion.span
            className="block font-display italic font-medium text-cyber-fg"
            initial={{ opacity: 0, y: 22, filter: `blur(${motionConfig.titleBlur}px)` }}
            animate={
              appReady
                ? { opacity: 1, y: 0, filter: 'blur(0px)' }
                : { opacity: 0, y: 22, filter: `blur(${motionConfig.titleBlur}px)` }
            }
            transition={{ duration: 0.8, ease: HERO_EASE, delay: appReady ? motionConfig.titleDelay : 0 }}
          >
            Hey! I&apos;m
          </motion.span>
          <motion.span
            className="hero-title-pulse block font-display font-semibold text-cyber-yellow glow-text-yellow"
            initial={{ opacity: 0, y: 26, filter: `blur(${motionConfig.titleBlur + 2}px)` }}
            animate={
              appReady
                ? { opacity: 1, y: 0, filter: 'blur(0px)' }
                : { opacity: 0, y: 26, filter: `blur(${motionConfig.titleBlur + 2}px)` }
            }
            transition={{
              duration: 0.85,
              delay: appReady ? motionConfig.titleDelay + 0.1 : 0,
            }}
          >
            Malik!
          </motion.span>
        </motion.h1>

        <motion.div
          className="relative mx-auto mt-5 w-full max-w-[min(100%,22rem)] border border-cyber-fg/20 px-4 py-3.5 text-center sm:max-w-sm sm:px-5 sm:py-4 md:max-w-md"
          initial={{ opacity: 0, y: 20, filter: 'blur(6px)' }}
          animate={
            appReady
              ? { opacity: 1, y: 0, filter: 'blur(0px)' }
              : { opacity: 0, y: 20, filter: 'blur(6px)' }
          }
          transition={{ duration: 0.75, delay: appReady ? motionConfig.bioDelay : 0 }}
        >
          <BioCorner position="tl" ready={appReady} />
          <BioCorner position="tr" ready={appReady} />
          <BioCorner position="bl" ready={appReady} />
          <BioCorner position="br" ready={appReady} />
          <p className="text-[0.9rem] leading-relaxed text-cyber-fg/85 sm:text-[0.95rem] md:text-base">
            {BIO_TEXT}
          </p>
        </motion.div>

        <motion.div
          className="relative z-30 mt-5 flex flex-wrap justify-center gap-3"
          initial={{ opacity: 0, y: 16 }}
          animate={appReady ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
          transition={{ duration: 0.75, delay: appReady ? motionConfig.ctaDelay : 0 }}
        >
          <HeroCtaButton onClick={() => scrollToSection('projects')}>
            View Projects
            <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
          </HeroCtaButton>
          <HeroCtaButton variant="outline" onClick={() => scrollToSection('contact')}>
            Contact Me
          </HeroCtaButton>
        </motion.div>
      </motion.div>

      {/* Desktop layout */}
      <div className="relative z-20 mx-auto hidden min-h-[100svh] w-full max-w-[1560px] flex-col justify-center px-8 pb-10 pt-[5.25rem] lg:flex">
        <div className="grid w-full min-h-[min(88svh,980px)] grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)] items-center gap-6 xl:gap-10">
          <div className="relative h-[min(88svh,980px)] overflow-hidden">
            <HeroCharacter
              springX={springX}
              springY={springY}
              layout="desktop"
              parallax
            />
          </div>

          <motion.div
            className="relative z-20 flex flex-col justify-center justify-self-center pl-2 xl:pl-0"
            style={{ y: contentY }}
          >
            <motion.div
              className="relative w-full max-w-xl border border-cyber-fg/[0.06] bg-cyber-bg/45 p-9 pl-11 backdrop-blur-[2px] glow-panel lg:border-l-cyber-blue/25 xl:max-w-2xl xl:p-10 xl:pl-12"
              initial={{ opacity: 0, x: 28, filter: 'blur(8px)' }}
              animate={
                appReady
                  ? { opacity: 1, x: 0, filter: 'blur(0px)' }
                  : { opacity: 0, x: 28, filter: 'blur(8px)' }
              }
              transition={{ duration: 0.85, delay: appReady ? 0.15 : 0 }}
            >
              <div
                className="glow-line-blue pointer-events-none absolute -left-px top-6 hidden h-16 w-1 bg-cyber-blue lg:block"
                aria-hidden
              />
              <div
                className="glow-box-yellow pointer-events-none absolute -right-2 -top-2 hidden h-4 w-4 border-r border-t border-cyber-yellow/50 lg:block"
                aria-hidden
              />

              <motion.p
                className="section-label mb-4"
                initial={{ opacity: 0, y: 16 }}
                animate={appReady ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
                transition={{
                  duration: 0.7,
                  delay: appReady ? motionConfig.titleDelay - 0.08 : 0,
                }}
              >
                Cybersecurity &amp; Full Stack
              </motion.p>

              <motion.h1
                className="mb-6 font-display text-[clamp(3.4rem,7.8vw,6.85rem)] font-semibold leading-[0.92] tracking-tight"
                initial={{ opacity: 0 }}
                animate={appReady ? { opacity: 1 } : { opacity: 0 }}
              >
                <motion.span
                  className="block font-display italic font-medium text-cyber-fg"
                  initial={{ opacity: 0, y: 24, filter: 'blur(6px)' }}
                  animate={
                    appReady
                      ? { opacity: 1, y: 0, filter: 'blur(0px)' }
                      : { opacity: 0, y: 24, filter: 'blur(6px)' }
                  }
                  transition={{
                    duration: 0.85,
                    delay: appReady ? motionConfig.titleDelay : 0,
                  }}
                >
                  Hey! I&apos;m
                </motion.span>
                <motion.span
                  className="hero-title-pulse block font-display font-semibold bg-gradient-to-r from-cyber-blue to-cyber-blue bg-clip-text text-transparent glow-text-blue"
                  initial={{ opacity: 0, y: 28, filter: 'blur(8px)' }}
                  animate={
                    appReady
                      ? { opacity: 1, y: 0, filter: 'blur(0px)' }
                      : { opacity: 0, y: 28, filter: 'blur(8px)' }
                  }
                  transition={{
                    duration: 0.9,
                    delay: appReady ? motionConfig.titleDelay + 0.1 : 0,
                  }}
                >
                  Malik!
                </motion.span>
              </motion.h1>

              <motion.p
                className="mb-9 max-w-2xl text-[1.125rem] leading-relaxed text-cyber-fg/75 xl:text-xl"
                initial={{ opacity: 0, y: 20 }}
                animate={appReady ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                transition={{ duration: 0.8, delay: appReady ? motionConfig.bioDelay : 0 }}
              >
                {BIO_TEXT}
              </motion.p>

              <motion.div
                className="flex flex-wrap gap-4"
                initial={{ opacity: 0, y: 16 }}
                animate={appReady ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
                transition={{ duration: 0.8, delay: appReady ? motionConfig.ctaDelay : 0 }}
              >
                <HeroCtaButton onClick={() => scrollToSection('projects')}>
                  View Projects
                  <ArrowRight
                    size={18}
                    className="transition-transform group-hover:translate-x-1"
                  />
                </HeroCtaButton>
                <HeroCtaButton variant="outline" onClick={() => scrollToSection('contact')}>
                  Contact Me
                </HeroCtaButton>
              </motion.div>

              <motion.div
                className="mt-8 hidden gap-5 border-t border-cyber-fg/10 pt-8 lg:grid lg:grid-cols-3"
                initial="hidden"
                animate={appReady ? 'visible' : 'hidden'}
                variants={{
                  hidden: { opacity: 0 },
                  visible: {
                    opacity: 1,
                    transition: { staggerChildren: 0.1, delayChildren: 0.72 },
                  },
                }}
              >
                {META.map((item) => (
                  <motion.div
                    key={item.label}
                    variants={{
                      hidden: { opacity: 0, y: 12 },
                      visible: { opacity: 1, y: 0, transition: { duration: 0.55 } },
                    }}
                  >
                    <p className="font-mono text-[10px] uppercase tracking-widest text-cyber-blue">
                      {item.label}
                    </p>
                    <p className="mt-1.5 text-xs leading-snug text-cyber-fg/55">{item.value}</p>
                  </motion.div>
                ))}
              </motion.div>
            </motion.div>

            <motion.p
              className="mt-4 text-left font-mono text-[10px] uppercase tracking-[0.2em] text-cyber-fg/25"
              initial={{ opacity: 0 }}
              animate={appReady ? { opacity: 1 } : { opacity: 0 }}
              transition={{ duration: 0.7, delay: appReady ? 0.95 : 0 }}
            >
              Cybersecurity learner · Builder · Future developer
            </motion.p>
          </motion.div>
        </div>
      </div>

      <div
        className="pointer-events-none absolute bottom-0 left-0 right-0 z-20 h-16 bg-gradient-to-t from-cyber-bg to-transparent lg:h-28"
        aria-hidden
      />
    </section>
  )
}
