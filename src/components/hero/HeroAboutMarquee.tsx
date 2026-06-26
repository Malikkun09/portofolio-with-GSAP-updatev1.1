import { ChevronDown } from 'lucide-react'
import { heroMarqueeTags } from '@/data/portfolio'
import RevealOnScroll from '@/components/motion/RevealOnScroll'
import { cn, scrollToSection } from '@/lib/utils'

const MARQUEE_COPIES = 4

function MarqueeSequence() {
  return (
    <>
      {heroMarqueeTags.map((tag, index) => (
        <span key={tag} className="inline-flex items-center">
          <span
            className={cn(
              index % 2 === 0 ? 'hero-marquee-text-blue' : 'hero-marquee-text-yellow',
            )}
          >
            {tag}
          </span>
          <span className="hero-marquee-bullet" aria-hidden>
            {' '}
            &bull;{' '}
          </span>
        </span>
      ))}
    </>
  )
}

export default function HeroAboutMarquee() {
  return (
    <RevealOnScroll y={12} scale={1}>
    <div
      className="relative z-30 border-t border-white/5 bg-cyber-black"
      aria-label="Skills and focus areas"
    >
      <div
        className="pointer-events-none absolute inset-0 bg-gradient-to-r from-cyber-blue/[0.06] via-transparent to-cyber-yellow/[0.06]"
        aria-hidden
      />

      <button
        type="button"
        onClick={() => scrollToSection('about')}
        className="hero-marquee-scroll-btn group absolute left-1/2 top-0 z-10 -translate-x-1/2 -translate-y-1/2"
        aria-label="Scroll to about section"
      >
        <ChevronDown
          size={18}
          className="text-cyber-muted transition-colors group-hover:text-cyber-blue"
        />
      </button>

      <div className="hero-marquee-container py-3.5 sm:py-4">
        <div className="hero-marquee-track">
          {Array.from({ length: MARQUEE_COPIES }, (_, copyIndex) => (
            <span
              key={copyIndex}
              className="hero-marquee-segment"
              aria-hidden={copyIndex > 0}
            >
              <MarqueeSequence />
            </span>
          ))}
        </div>
      </div>
    </div>
    </RevealOnScroll>
  )
}
