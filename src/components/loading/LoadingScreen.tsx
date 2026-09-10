import { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { site } from '@/data/portfolio'

const STATUS_MESSAGES = [
  'Initializing',
  'Loading assets',
  'Securing connection',
  'Compiling modules',
  'Finalizing',
] as const

const MASK_COLORS = [
  '#FF3366',
  '#00E5A0',
  '#FF6B35',
  '#7C3AED',
  '#06B6D4',
  '#F43F5E',
  '#22D3EE',
  '#84CC16',
  '#F59E0B',
  '#00B8FF',
  '#FFD400',
  '#A855F7',
]

function getRandomColors(count: number) {
  const pool = [...MASK_COLORS].sort(() => Math.random() - 0.5)
  return pool.slice(0, count)
}

interface LoadingScreenProps {
  progress: number
  statusLabel?: string
  isExiting?: boolean
  onExitComplete?: () => void
}

export default function LoadingScreen({
  progress,
  statusLabel,
  isExiting = false,
  onExitComplete,
}: LoadingScreenProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const panelsRef = useRef<(HTMLDivElement | null)[]>([])
  const contentRef = useRef<HTMLDivElement>(null)
  const [panelColors] = useState(() => getRandomColors(5))
  const onExitCompleteRef = useRef(onExitComplete)
  onExitCompleteRef.current = onExitComplete

  useEffect(() => {
    if (!isExiting || !containerRef.current) return undefined

    let timeoutId: ReturnType<typeof setTimeout> | undefined

    const ctx = gsap.context(() => {
      const panels = panelsRef.current.filter(Boolean) as HTMLDivElement[]

      const tl = gsap.timeline({
        defaults: { ease: 'power3.inOut' },
        onComplete: () => {
          timeoutId = window.setTimeout(() => onExitCompleteRef.current?.(), 120)
        },
      })

      tl.to(contentRef.current, {
        opacity: 0,
        scale: 0.96,
        duration: 0.25,
        ease: 'power2.out',
      })
        .to(
          panels,
          {
            xPercent: 100,
            duration: 0.75,
            stagger: {
              each: 0.07,
              from: 'start',
            },
            ease: 'power4.inOut',
          },
          '-=0.08',
        )
        .to(
          containerRef.current,
          {
            opacity: 0,
            duration: 0.2,
            ease: 'power2.out',
          },
          '-=0.15',
        )
    }, containerRef)

    return () => {
      if (timeoutId !== undefined) window.clearTimeout(timeoutId)
      ctx.revert()
    }
  }, [isExiting])

  const statusIndex = Math.min(
    Math.floor((progress / 100) * STATUS_MESSAGES.length),
    STATUS_MESSAGES.length - 1
  )
  const status = statusLabel ?? STATUS_MESSAGES[statusIndex]

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-[9999] overflow-hidden bg-cyber-bg"
      aria-label="Loading portfolio"
      aria-valuenow={progress}
      aria-valuemin={0}
      aria-valuemax={100}
      role="progressbar"
    >
      <p className="sr-only" aria-live="polite" aria-atomic="true">
        {status} {progress}%
      </p>
      <div className="pointer-events-none absolute inset-0 cyber-grid-bg opacity-30" aria-hidden />

      <div
        className="pointer-events-none absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage:
            'linear-gradient(rgba(0,184,255,0.8) 1px, transparent 1px), linear-gradient(90deg, rgba(0,184,255,0.8) 1px, transparent 1px)',
          backgroundSize: '40px 40px',
        }}
        aria-hidden
      />

      <div
        ref={contentRef}
        className="absolute inset-0 flex flex-col"
      >
        <div className="flex items-center justify-between px-6 pt-7 md:px-10 md:pt-8">
          <div className="font-mono text-[11px] font-medium uppercase tracking-[0.35em] text-cyber-fg/80 md:text-xs">
            MF
          </div>
          <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-cyber-fg/35 md:text-[11px]">
            {site.domain}
          </div>
        </div>

        <div className="flex flex-1 items-center justify-center">
          <div className="flex items-baseline">
            <div
              className="select-none font-semibold leading-none tabular-nums text-cyber-fg"
              style={{
                fontSize: 'clamp(96px, 22vw, 320px)',
                fontFeatureSettings: '"tnum" 1',
              }}
            >
              {String(progress).padStart(2, '0')}
            </div>

            <div className="ml-2 flex items-baseline md:ml-3">
              <span
                className="font-semibold leading-none text-cyber-fg/80"
                style={{ fontSize: 'clamp(36px, 8vw, 120px)' }}
              >
                %
              </span>

              <span
                className="ml-3 inline-block w-[4px] animate-pulse rounded-full md:ml-5 md:w-[5px]"
                style={{
                  height: 'clamp(48px, 10vw, 140px)',
                  backgroundColor: '#00B8FF',
                  boxShadow:
                    '0 0 12px #00B8FF, 0 0 28px rgba(0, 184, 255, 0.5), 0 0 48px rgba(255, 212, 0, 0.15)',
                  transformOrigin: 'center',
                }}
                aria-hidden
              />
            </div>
          </div>
        </div>

        <div className="px-6 pb-7 md:px-10 md:pb-9">
          <div className="mb-3 flex items-end justify-between">
            <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-cyber-fg/40 md:text-[11px]">
              {status}
              <span className="ml-3 text-cyber-fg/15">/</span>
              <span className="ml-3 text-cyber-yellow/60">SECURE</span>
            </div>
            <div
              className="font-mono text-[10px] tabular-nums uppercase tracking-[0.3em] text-cyber-blue md:text-[11px]"
              style={{ textShadow: '0 0 8px rgba(0, 184, 255, 0.45)' }}
            >
              {String(progress).padStart(3, '0')}%
            </div>
          </div>

          <div className="relative h-px w-full overflow-visible bg-cyber-fg/10">
            <div
              className="absolute left-0 top-0 h-full bg-cyber-blue transition-[width] duration-150 ease-out"
              style={{
                width: `${progress}%`,
                boxShadow: '0 0 6px #00B8FF, 0 0 12px rgba(0, 184, 255, 0.5)',
              }}
            />
            {[25, 50, 75].map((tick) => (
              <div
                key={tick}
                className="absolute top-1/2 h-2 w-px -translate-y-1/2 bg-cyber-fg/15"
                style={{ left: `${tick}%` }}
                aria-hidden
              />
            ))}
          </div>
        </div>
      </div>

      {panelColors.map((color, index) => (
        <div
          key={index}
          ref={(el) => {
            panelsRef.current[index] = el
          }}
          className="pointer-events-none absolute left-0 z-20 w-full"
          style={{
            backgroundColor: color,
            transform: 'translateX(-100%)',
            top: `${index * 20}%`,
            height: '20%',
            boxShadow: `0 0 40px ${color}40`,
          }}
          aria-hidden
        />
      ))}
    </div>
  )
}
