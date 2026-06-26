import { useEffect, useState } from 'react'
import { Menu, X } from 'lucide-react'
import { navLinks } from '@/data/portfolio'
import { cn, scrollToSection, scrollToTop } from '@/lib/utils'

const SECTION_IDS = navLinks.map((link) => link.href.slice(1))

export default function Navigation() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [activeSection, setActiveSection] = useState('')

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

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault()
    scrollToSection(href.slice(1))
    setIsMobileMenuOpen(false)
  }

  useEffect(() => {
    document.body.style.overflow = isMobileMenuOpen ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [isMobileMenuOpen])

  return (
    <>
      <header
        className={cn(
          'sticky top-0 z-[100] transition-all duration-500',
          isScrolled
            ? 'border-b border-cyber-blue/15 bg-cyber-black/90 shadow-glow-blue backdrop-blur-md'
            : 'border-b border-transparent bg-cyber-black/40 backdrop-blur-sm',
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
            <span className="glow-box-blue flex h-9 w-9 items-center justify-center border border-cyber-blue/50 bg-cyber-blue/10 font-mono text-sm font-bold text-cyber-blue transition-all duration-300 group-hover:border-cyber-yellow group-hover:text-cyber-yellow group-hover:shadow-glow-yellow">
              MF
            </span>
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
                  className={cn(
                    'relative text-sm font-medium transition-all duration-300',
                    isActive
                      ? 'text-cyber-blue glow-text-blue'
                      : 'text-white/60 hover:text-white hover:glow-text-blue-soft',
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

          <button
            type="button"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="glow-box-blue rounded-sm p-2 text-white transition-colors hover:text-cyber-blue lg:hidden"
            aria-expanded={isMobileMenuOpen}
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </nav>
      </header>

      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 z-[90] bg-cyber-black/95 backdrop-blur-sm lg:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
          role="presentation"
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
                className="glow-text-blue text-2xl font-semibold text-white transition-colors hover:text-cyber-blue"
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
          </div>
        </div>
      )}
    </>
  )
}
