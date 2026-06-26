import { about, aboutCards } from '@/data/portfolio'
import AboutProfileImage from '@/components/about/AboutProfileImage'
import Reveal from '@/components/motion/Reveal'
import HoverLift from '@/components/motion/HoverLift'
import StaggerChildren, { StaggerItem } from '@/components/motion/StaggerChildren'
import SectionHeading from '@/components/SectionHeading'
import AnimatedGlowBorder from '@/components/ui/AnimatedGlowBorder'
import { PremiumLinkCTA } from '@/components/ui/PremiumCTA'
import { useInView } from '@/hooks/use-in-view'
import { cn, scrollToSection } from '@/lib/utils'
import { motion } from 'motion/react'

export default function About() {
  const { ref, inView } = useInView<HTMLElement>({ threshold: 0.15 })

  return (
    <section
      id="about"
      ref={ref}
      className="relative py-24 lg:py-32"
    >
      <div className="pointer-events-none absolute left-0 top-1/2 h-px w-24 bg-cyber-blue/20" aria-hidden />

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-12">
        <div className="grid items-center gap-12 lg:grid-cols-[1fr_1.1fr] lg:gap-20">
          <Reveal variant="slide-left" className="order-2 lg:order-1">
            <SectionHeading label="About" title="Who I Am" className="mb-6" />
            <h3 className="mb-6 text-2xl font-bold text-white sm:text-3xl lg:mb-8">{about.headline}</h3>

            <StaggerChildren className="mb-8 grid gap-4 sm:grid-cols-2">
              {aboutCards.map((card) => (
                <StaggerItem key={card.label}>
                  <HoverLift>
                    <AnimatedGlowBorder
                    intensity="subtle"
                    innerClassName="border border-white/5 bg-cyber-surface p-4 transition-colors duration-300 hover:bg-cyber-card"
                  >
                    <p className="font-mono text-[10px] uppercase tracking-widest text-cyber-blue">
                      {card.label}
                    </p>
                    <p className="mt-1 font-semibold text-white">{card.value}</p>
                    <p className="mt-1 text-xs text-cyber-muted">{card.detail}</p>
                  </AnimatedGlowBorder>
                  </HoverLift>
                </StaggerItem>
              ))}
            </StaggerChildren>

            <div className="mb-8 flex flex-wrap gap-3">
              {about.interests.map((item) => (
                <motion.span
                  key={item}
                  whileHover={{ y: -2, scale: 1.03 }}
                  transition={{ duration: 0.25 }}
                  className="border border-white/10 px-3 py-1.5 font-mono text-xs text-white/70 transition-colors hover:border-cyber-yellow/30 hover:text-cyber-yellow"
                >
                  {item}
                </motion.span>
              ))}
            </div>

            <PremiumLinkCTA
              href="#contact"
              onClick={(e) => {
                e.preventDefault()
                scrollToSection('contact')
              }}
            >
              Got a project in mind? Let&apos;s talk!
            </PremiumLinkCTA>
          </Reveal>

          <Reveal variant="slide-right" delay={0.1} className="order-1 lg:order-2">
            <AboutProfileImage className="lg:ml-auto" />

            <div
              className={cn(
                'mt-8 space-y-4 text-sm leading-relaxed text-cyber-muted sm:text-base lg:mt-10 lg:max-w-lg lg:ml-auto',
                inView ? 'opacity-100' : 'opacity-0',
              )}
            >
              {about.paragraphs.map((paragraph) => (
                <p key={paragraph.slice(0, 24)}>{paragraph}</p>
              ))}
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  )
}
