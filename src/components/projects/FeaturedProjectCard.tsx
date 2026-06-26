import { ExternalLink, Github } from 'lucide-react'
import LazyImage from '@/components/LazyImage'
import AnimatedGlowBorder from '@/components/ui/AnimatedGlowBorder'
import { cn } from '@/lib/utils'
import type { projects } from '@/data/portfolio'

type Project = (typeof projects)[number]

interface FeaturedProjectCardProps {
  project: Project
  flip?: boolean
  index: number
}

export default function FeaturedProjectCard({
  project,
  flip = false,
  index,
}: FeaturedProjectCardProps) {
  const status =
    'status' in project && typeof project.status === 'string' ? project.status : null

  return (
    <AnimatedGlowBorder
      palette="google"
      rounded="3xl"
      intensity="subtle"
      hoverEnhance
      className="featured-project-card"
      innerClassName={cn(
        'overflow-hidden rounded-3xl border border-white/[0.08]',
        'bg-gradient-to-br from-cyber-surface via-cyber-surface to-cyber-card/90',
        'shadow-[inset_0_1px_0_rgba(255,255,255,0.06)]',
        'grid lg:grid-cols-2',
      )}
    >
      <div
        className={cn(
          'featured-project-image-glow group relative min-h-[220px] overflow-hidden sm:min-h-[260px] lg:min-h-[320px]',
          flip && 'lg:order-2',
        )}
      >
        <LazyImage
          src={project.image}
          alt={project.title}
          className="h-full w-full object-cover"
        />
        <div
          className="pointer-events-none absolute inset-0 bg-gradient-to-t from-cyber-black/75 via-cyber-black/10 to-transparent"
          aria-hidden
        />
        <div
          className="pointer-events-none absolute inset-0 bg-gradient-to-br from-cyber-blue/[0.08] via-transparent to-cyber-yellow/[0.04] opacity-40"
          aria-hidden
        />
        <span
          className="absolute bottom-4 left-4 font-mono text-[10px] tracking-widest text-white/40"
          aria-hidden
        >
          0{index + 1}
        </span>
      </div>

      <div
        className={cn(
          'flex flex-col justify-center px-6 py-8 sm:px-8 sm:py-10 lg:px-10 lg:py-12',
          flip && 'lg:order-1',
        )}
      >
        <div className="mb-5 flex flex-wrap items-center gap-3">
          <span className="section-label">Project</span>
          {status && (
            <span className="featured-project-status rounded-full px-3 py-1 font-mono text-[10px] font-medium uppercase tracking-[0.14em] text-white/75">
              {status}
            </span>
          )}
        </div>

        <h3 className="featured-project-title mb-4 text-2xl font-bold tracking-tight text-white sm:text-3xl lg:text-[2rem] lg:leading-tight">
          {project.title}
        </h3>

        <p className="mb-7 max-w-lg text-sm leading-relaxed text-cyber-muted sm:text-base">
          {project.description}
        </p>

        <div className="mb-8 flex flex-wrap gap-2">
          {project.tags.map((tag) => (
            <span
              key={tag}
              className="featured-project-tag rounded-full border border-white/10 bg-white/[0.03] px-3 py-1 font-mono text-[11px] text-white/70"
            >
              {tag}
            </span>
          ))}
        </div>

        <div className="flex flex-wrap gap-3">
          <a
            href={project.live}
            className="btn-primary rounded-full px-6 py-2.5 text-xs sm:text-sm"
            target="_blank"
            rel="noopener noreferrer"
          >
            <ExternalLink size={16} />
            Live Demo
          </a>
          <a
            href={project.github}
            className="btn-outline rounded-full border-white/15 bg-white/[0.02] px-6 py-2.5 text-xs text-white/80 sm:text-sm"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Github size={16} />
            GitHub
          </a>
        </div>
      </div>
    </AnimatedGlowBorder>
  )
}
