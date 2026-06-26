import { ArrowUpRight, Mail } from 'lucide-react'
import { contactLinks } from '@/data/portfolio'
import Reveal from '@/components/motion/Reveal'
import StaggerChildren, { StaggerItem } from '@/components/motion/StaggerChildren'
import HoverLift from '@/components/motion/HoverLift'
import SectionHeading from '@/components/SectionHeading'
import AnimatedGlowBorder from '@/components/ui/AnimatedGlowBorder'
import PremiumCTA from '@/components/ui/PremiumCTA'
import { useInView } from '@/hooks/use-in-view'
import {
  buildPersonalMailto,
  buildSchoolMailto,
  buildWhatsAppLink,
} from '@/lib/secure-contact'
import { cn } from '@/lib/utils'

function resolveContactHref(link: (typeof contactLinks)[number]): string {
  if ('href' in link && typeof link.href === 'string') return link.href
  if ('kind' in link) {
    if (link.kind === 'email-school') return buildSchoolMailto()
    if (link.kind === 'email-personal') return buildPersonalMailto()
    if (link.kind === 'whatsapp') return buildWhatsAppLink()
  }
  return '#contact'
}

function isEmailLink(link: (typeof contactLinks)[number]): boolean {
  return 'kind' in link && (link.kind === 'email-school' || link.kind === 'email-personal')
}

const accentStyles = {
  blue: {
    label: 'text-cyber-blue',
    hoverBorder: 'hover:border-cyber-blue/30',
    icon: 'group-hover:text-cyber-blue',
  },
  yellow: {
    label: 'text-cyber-yellow',
    hoverBorder: 'hover:border-cyber-yellow/30',
    icon: 'group-hover:text-cyber-yellow',
  },
  purple: {
    label: 'text-cyber-purple',
    hoverBorder: 'hover:border-cyber-purple/35',
    icon: 'group-hover:text-cyber-purple',
  },
} as const

export default function Contact() {
  const { ref, inView } = useInView<HTMLElement>({ threshold: 0.15 })

  return (
    <section
      id="contact"
      ref={ref}
      className="relative border-t border-white/5 py-24 lg:py-32"
    >
      <div
        className="pointer-events-none absolute left-1/2 top-0 h-px w-1/2 -translate-x-1/2 bg-gradient-to-r from-transparent via-cyber-blue/20 to-transparent"
        aria-hidden
      />

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-12">
        <Reveal variant="fade-up-blur">
          <SectionHeading
            label="Contact"
            title="Let's Connect"
            description="Open to collaborations, projects, and conversations about security and development."
            align="center"
          />
        </Reveal>

        <StaggerChildren className="mx-auto grid max-w-4xl gap-4 sm:grid-cols-2">
          {contactLinks.map((link) => {
            const accent = accentStyles[link.accent]

            return (
            <StaggerItem key={link.id}>
              <HoverLift>
                <AnimatedGlowBorder
                  intensity="subtle"
                  as="a"
                  href={resolveContactHref(link)}
                  target={isEmailLink(link) ? undefined : '_blank'}
                  rel={isEmailLink(link) ? undefined : 'noopener noreferrer'}
                  className="block"
                  innerClassName={cn(
                    'flex items-center justify-between border border-white/10 bg-cyber-surface p-6 transition-colors duration-300',
                    accent.hoverBorder,
                  )}
                >
                  <div>
                    <p
                      className={cn(
                        'mb-1 font-mono text-[10px] uppercase tracking-widest',
                        accent.label,
                      )}
                    >
                      {link.label}
                    </p>
                    <p
                      className={cn(
                        'text-sm font-medium',
                        link.accent === 'purple' ? 'text-cyber-purple/90' : 'text-white',
                      )}
                    >
                      {link.value}
                    </p>
                  </div>
                  {isEmailLink(link) ? (
                    <Mail
                      size={20}
                      className={cn('text-white/30 transition-colors', accent.icon)}
                    />
                  ) : (
                    <ArrowUpRight
                      size={20}
                      className={cn('text-white/30 transition-colors', accent.icon)}
                    />
                  )}
                </AnimatedGlowBorder>
              </HoverLift>
            </StaggerItem>
            )
          })}
        </StaggerChildren>

        <PremiumCTA inView={inView} className="mt-12" />
      </div>
    </section>
  )
}
