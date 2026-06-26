import { motion } from 'framer-motion'
import { site } from '@/data/portfolio'

const EASE_OUT_EXPO = [0.16, 1, 0.3, 1] as const
const EASE_IN_OUT_QUINT = [0.83, 0, 0.17, 1] as const

const STATUS_MESSAGES = [
  'Initializing',
  'Loading assets',
  'Securing connection',
  'Compiling modules',
  'Finalizing',
] as const

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
  const statusIndex = Math.min(
    Math.floor((progress / 100) * STATUS_MESSAGES.length),
    STATUS_MESSAGES.length - 1,
  )
  const status = statusLabel ?? STATUS_MESSAGES[statusIndex]

  return (
    <motion.div
      className="fixed inset-0 z-[9999] overflow-hidden bg-cyber-black"
      initial={false}
      animate={{ opacity: isExiting ? 0 : 1, x: isExiting ? '100%' : 0 }}
      transition={{
        opacity: { duration: 0.45, ease: EASE_OUT_EXPO },
        x: { duration: 1, ease: EASE_IN_OUT_QUINT },
      }}
      onAnimationComplete={() => {
        if (isExiting) onExitComplete?.()
      }}
      style={{ pointerEvents: isExiting ? 'none' : 'auto' }}
      aria-hidden={isExiting}
      aria-label="Loading portfolio"
      aria-valuenow={progress}
      aria-valuemin={0}
      aria-valuemax={100}
      role="progressbar"
    >
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

      <motion.div
        className="absolute inset-0 flex flex-col"
        animate={{ opacity: isExiting ? 0 : 1 }}
        transition={{ duration: 0.25, ease: 'easeOut' }}
      >
        <div className="flex items-center justify-between px-6 pt-7 md:px-10 md:pt-8">
          <div className="font-mono text-[11px] font-medium uppercase tracking-[0.35em] text-white/80 md:text-xs">
            MF
          </div>
          <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-white/35 md:text-[11px]">
            {site.domain}
          </div>
        </div>

        <div className="flex flex-1 items-center justify-center">
          <div className="flex items-baseline">
            <div
              className="select-none font-semibold leading-none tabular-nums text-white"
              style={{
                fontSize: 'clamp(96px, 22vw, 320px)',
                fontFeatureSettings: '"tnum" 1',
              }}
            >
              {String(progress).padStart(2, '0')}
            </div>

            <div className="ml-2 flex items-baseline md:ml-3">
              <span
                className="font-semibold leading-none text-white/80"
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
            <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-white/40 md:text-[11px]">
              {status}
              <span className="ml-3 text-white/15">/</span>
              <span className="ml-3 text-cyber-yellow/60">SECURE</span>
            </div>
            <div
              className="font-mono text-[10px] tabular-nums uppercase tracking-[0.3em] text-cyber-blue md:text-[11px]"
              style={{ textShadow: '0 0 8px rgba(0, 184, 255, 0.45)' }}
            >
              {String(progress).padStart(3, '0')}%
            </div>
          </div>

          <div className="relative h-px w-full overflow-visible bg-white/10">
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
                className="absolute top-1/2 h-2 w-px -translate-y-1/2 bg-white/15"
                style={{ left: `${tick}%` }}
                aria-hidden
              />
            ))}
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}
