import { ExternalLink, Github } from 'lucide-react'
import type { CSSProperties } from 'react'
import { projects } from '@/data/portfolio'
import LazyImage from '@/components/LazyImage'
import FeaturedProjectCard from '@/components/projects/FeaturedProjectCard'
import RevealOnScroll from '@/components/motion/RevealOnScroll'
import SectionHeading from '@/components/SectionHeading'
import { useInView } from '@/hooks/use-in-view'
import { cn } from '@/lib/utils'

const featuredProjects = projects.filter((p) => p.featured)
const otherProjects = projects.filter((p) => !p.featured)

function ProjectCard({
  project,
  compact = false,
}: {
  project: (typeof projects)[number]
  compact?: boolean
}) {
  return (
    <article className="project-card-static group overflow-hidden rounded-xl border border-white/10 bg-cyber-surface">
      <div className="relative aspect-video overflow-hidden">
        <LazyImage
          src={project.image}
          alt={project.title}
          className="h-full w-full object-cover"
        />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-cyber-black/70 via-transparent to-transparent" />
      </div>
      <div className="p-5">
        <ProjectContent project={project} compact={compact} />
      </div>
    </article>
  )
}

function ProjectContent({
  project,
  compact = false,
}: {
  project: (typeof projects)[number]
  compact?: boolean
}) {
  return (
    <>
      <span className="section-label mb-2 block">Project</span>
      <h3 className={cn('font-bold text-white', compact ? 'mb-2 text-lg' : 'mb-3 text-2xl sm:text-3xl')}>
        {project.title}
      </h3>
      <p
        className={cn(
          'leading-relaxed text-cyber-muted',
          compact ? 'mb-4 line-clamp-2 text-sm' : 'mb-6 max-w-lg text-sm sm:text-base',
        )}
      >
        {project.description}
      </p>
      <div className={cn('flex flex-wrap gap-2', compact ? 'mb-4' : 'mb-8')}>
        {project.tags.map((tag) => (
          <span
            key={tag}
            className="border border-cyber-blue/20 bg-cyber-blue/5 px-2.5 py-1 font-mono text-[11px] text-cyber-blue"
          >
            {tag}
          </span>
        ))}
      </div>
      <div className="flex flex-wrap gap-3">
        <a
          href={project.live}
          className="btn-primary py-2.5 text-xs"
          target="_blank"
          rel="noopener noreferrer"
        >
          <ExternalLink size={16} />
          Live Demo
        </a>
        <a
          href={project.github}
          className="btn-outline py-2.5 text-xs"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Github size={16} />
          GitHub
        </a>
      </div>
    </>
  )
}

export default function Projects() {
  const { ref, inView } = useInView<HTMLElement>({ rootMargin: '120px', threshold: 0.05 })

  return (
    <section
      id="projects"
      ref={ref}
      className={cn(
        'relative overflow-hidden border-t border-white/5 bg-cyber-black py-24 lg:py-32',
        inView && 'projects-section--visible',
      )}
    >
      <div
        className="pointer-events-none absolute inset-0 projects-showcase-bg"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute left-1/2 top-0 h-[520px] w-[min(100%,960px)] -translate-x-1/2 bg-[radial-gradient(ellipse_at_50%_0%,rgba(66,133,244,0.14)_0%,transparent_62%)]"
        aria-hidden
      />

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-12">
        <div className="projects-section-heading">
          <SectionHeading
            label="Projects"
            title="Featured Work"
            description="Selected projects from hackathons, school work, and personal builds."
          />
        </div>

        <div className="flex flex-col gap-12 lg:gap-16">
          {featuredProjects.map((project, index) => (
            <div
              key={project.title}
              className="projects-featured-reveal"
              style={{ '--project-i': index } as CSSProperties}
            >
              <FeaturedProjectCard
                project={project}
                index={index}
                flip={index % 2 === 1}
              />
            </div>
          ))}
        </div>

        {otherProjects.length > 0 && (
          <div className="mt-20 lg:mt-24">
            <h3 className="projects-section-heading mb-8 font-mono text-xs uppercase tracking-[0.2em] text-cyber-yellow">
              More Projects
            </h3>
            <div className="projects-more-grid grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {otherProjects.map((project, index) => (
                <RevealOnScroll key={project.title} delay={index * 0.05}>
                  <ProjectCard project={project} compact />
                </RevealOnScroll>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  )
}
