import { githubProfiles, site } from '@/data/portfolio'
import RevealOnScroll from '@/components/motion/RevealOnScroll'
import { scrollToTop } from '@/lib/utils'

export default function Footer() {
  const year = new Date().getFullYear()
  const primaryGithub = githubProfiles[0]

  return (
    <footer className="border-t border-cyber-blue/10 py-10 shadow-glow-blue">
      <RevealOnScroll className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-4 sm:flex-row sm:px-6 lg:px-12">
        <div className="flex items-center gap-3">
          <span className="glow-box-blue flex h-8 w-8 items-center justify-center border border-cyber-blue/40 font-mono text-xs font-bold text-cyber-blue">
            MF
          </span>
          <a
            href={site.website}
            target="_blank"
            rel="noopener noreferrer"
            className="glow-text-purple-soft font-mono text-xs text-cyber-muted transition-colors hover:text-cyber-purple hover:glow-text-purple"
          >
            {site.domain}
          </a>
        </div>

        <p className="text-center text-sm text-cyber-muted">
          &copy; {year} {site.name}. Built with React &amp; Vite.
        </p>

        <div className="flex items-center gap-4">
          <a
            href={primaryGithub.href}
            target="_blank"
            rel="noopener noreferrer"
            className="font-mono text-xs text-cyber-muted transition-colors hover:text-cyber-blue hover:glow-text-blue-soft"
          >
            GitHub
          </a>
          <a
            href="#hero"
            onClick={(e) => {
              e.preventDefault()
              scrollToTop()
            }}
            className="glow-text-blue font-mono text-xs text-cyber-blue transition-colors hover:text-cyber-yellow hover:glow-text-yellow"
          >
            Back to top
          </a>
        </div>
      </RevealOnScroll>
    </footer>
  )
}
