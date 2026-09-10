import { useEffect, useState, type MouseEvent } from 'react'
import { Menu, X } from 'lucide-react'
import { navLinks } from '@/data/portfolio'
import ThemeToggle from '@/components/ThemeToggle'
import { useScrollLock } from '@/providers/SmoothScrollProvider'
import { cn, scrollToSection, scrollToTop } from '@/lib/utils'

const SECTION_IDS = navLinks.map((link) => link.href.slice(1))
const MOBILE_NAV_ID = 'mobile-navigation'

export default function Navigation() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [activeSection, setActiveSection] = useState('')

  useScrollLock(isMobileMenuOpen)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 24)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll()
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)

        if (visible[0]?.target.id) {
          setActiveSection(visible[0].target.id)
        }
      },
      {
        rootMargin: '-72px 0px -55% 0px',
        threshold: [0, 0.15, 0.35, 0.55],
      },
    )

    SECTION_IDS.forEach((id) => {
      const section = document.getElementById(id)
      if (section) observer.observe(section)
    })

    return () => observer.disconnect()
  }, [])

  const handleNavClick = (e: MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault()
    scrollToSection(href.slice(1))
    setIsMobileMenuOpen(false)
  }

  useEffect(() => {
    if (!isMobileMenuOpen) return undefined
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setIsMobileMenuOpen(false)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [isMobileMenuOpen])

  return (
    <>
      <a
        href="#hero"
        onClick={(e) => {
          e.preventDefault()
          scrollToTop()
        }}
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[200] focus:bg-cyber-bg focus:px-4 focus:py-2 focus:text-sm focus:text-cyber-fg focus:outline-none focus-visible:ring-2 focus-visible:ring-cyber-blue/50"
      >
        Skip to content
      </a>
      <header
        className={cn(
          'sticky top-0 z-[100] transition-all duration-500',
          isScrolled
            ? 'border-b border-cyber-blue/15 bg-cyber-bg/90 shadow-glow-blue backdrop-blur-md'
            : 'border-b border-transparent bg-cyber-bg/40 backdrop-blur-sm',
        )}
      >
        <nav
          className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:h-[4.5rem] lg:px-12"
          aria-label="Main navigation"
        >
          <a
            href="#hero"
            onClick={(e) => {
              e.preventDefault()
              scrollToTop()
            }}
            className="group flex items-center gap-2"
            aria-label="Malik Fajar home"
          >
            <img
              src="/images/logo-mf.png"
              alt="MF Logo"
              className="h-12 w-12 object-contain transition-all duration-300 drop-shadow-[0_0_10px_rgba(0,184,255,0.7)] group-hover:drop-shadow-[0_0_16px_rgba(255,212,0,0.9)] group-hover:scale-105"
            />
          </a>

          <div className="hidden items-center gap-8 lg:flex">
            {navLinks.map((link) => {
              const id = link.href.slice(1)
              const isActive = activeSection === id

              return (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={(e) => handleNavClick(e, link.href)}
                  aria-current={isActive ? 'page' : undefined}
                  className={cn(
                    'relative text-sm font-medium transition-all duration-300',
                    isActive
                      ? 'text-cyber-blue glow-text-blue'
                      : 'text-cyber-fg/60 hover:text-cyber-fg hover:glow-text-blue-soft',
                  )}
                >
                  {link.label}
                  {isActive && (
                    <span
                      className="absolute -bottom-1 left-0 right-0 h-px bg-cyber-blue shadow-glow-blue"
                      aria-hidden
                    />
                  )}
                </a>
              )
            })}
          </div>

          <a
            href="#contact"
            onClick={(e) => handleNavClick(e, '#contact')}
            className="btn-primary hidden px-5 py-2.5 text-xs lg:inline-flex"
          >
            Contact Me
          </a>

          <ThemeToggle className="hidden lg:flex" />

          <button
            type="button"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="glow-box-blue rounded-sm p-2 text-cyber-fg transition-colors hover:text-cyber-blue lg:hidden"
            aria-expanded={isMobileMenuOpen}
            aria-controls={MOBILE_NAV_ID}
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </nav>
      </header>

      {isMobileMenuOpen && (
        <div
          id={MOBILE_NAV_ID}
          className="fixed inset-0 z-[90] bg-cyber-bg/95 backdrop-blur-sm lg:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
          role="dialog"
          aria-modal="true"
          aria-label="Mobile navigation"
        >
          <div
            className="flex h-full flex-col items-center justify-center gap-8"
            onClick={(e) => e.stopPropagation()}
          >
            {navLinks.map((link, index) => (
              <a
                key={link.href}
                href={link.href}
                onClick={(e) => handleNavClick(e, link.href)}
                className="glow-text-blue text-2xl font-semibold text-cyber-fg transition-colors hover:text-cyber-blue"
                style={{ animation: `fade-up 0.45s ease ${index * 0.08}s both` }}
              >
                {link.label}
              </a>
            ))}
            <a
              href="#contact"
              onClick={(e) => handleNavClick(e, '#contact')}
              className="btn-primary mt-2"
              style={{
                animation: `fade-up 0.45s ease ${navLinks.length * 0.08 + 0.1}s both`,
              }}
            >
              Contact Me
            </a>

            <div
              className="mt-4"
              style={{
                animation: `fade-up 0.45s ease ${navLinks.length * 0.08 + 0.2}s both`,
              }}
            >
              <ThemeToggle />
            </div>
          </div>
        </div>
      )}
    </>
  )
}
