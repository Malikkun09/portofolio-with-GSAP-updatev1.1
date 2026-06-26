'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const EASE_OUT_EXPO = [0.16, 1, 0.3, 1] as const
const EASE_IN_OUT_QUINT = [0.83, 0, 0.17, 1] as const

type Phase = 'loading' | 'exiting' | 'done'

const STATUS_MESSAGES = [
  'Initializing',
  'Loading assets',
  'Compiling network',
  'Syncing data layer',
  'Finalizing',
]

export default function Home() {
  const [progress, setProgress] = useState(0)
  const [phase, setPhase] = useState<Phase>('loading')
  const rafRef = useRef<number | null>(null)

  useEffect(() => {
    const duration = 4000
    const startTime = performance.now()

    const tick = (now: number) => {
      const elapsed = now - startTime
      const t = Math.min(elapsed / duration, 1)
      // easeOutQuart for premium decelerating feel
      const eased = 1 - Math.pow(1 - t, 4)
      setProgress(Math.floor(eased * 100))

      if (t < 1) {
        rafRef.current = requestAnimationFrame(tick)
      } else {
        setProgress(100)
        window.setTimeout(() => setPhase('exiting'), 450)
        window.setTimeout(() => setPhase('done'), 450 + 1500)
      }
    }

    rafRef.current = requestAnimationFrame(tick)
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
    }
  }, [])

  const statusIndex = Math.min(
    Math.floor((progress / 100) * STATUS_MESSAGES.length),
    STATUS_MESSAGES.length - 1
  )

  return (
    <main className="relative h-screen w-screen overflow-hidden bg-white">
      {/* ===== Revealed page (underneath) — minimal NewForm wordmark ===== */}
      <motion.div
        className="absolute inset-0 flex flex-col items-center justify-center"
        initial={{ opacity: 0, y: 8 }}
        animate={
          phase === 'exiting' || phase === 'done'
            ? { opacity: 1, y: 0 }
            : { opacity: 0, y: 8 }
        }
        transition={{ duration: 1.1, ease: EASE_OUT_EXPO, delay: 0.1 }}
      >
        <div className="flex flex-col items-center gap-3">
          <div className="text-neutral-950 text-3xl md:text-4xl font-semibold tracking-[-0.02em]">
            NewForm
          </div>
          <div className="text-neutral-400 text-[10px] tracking-[0.35em] uppercase">
            Advancing the Economic Networks of the Future
          </div>
        </div>
      </motion.div>

      {/* ===== Loading overlay (wipes right when done) ===== */}
      <AnimatePresence>
        {phase !== 'done' && (
          <motion.div
            className="absolute inset-0 z-50"
            initial={{ x: 0 }}
            animate={phase === 'exiting' ? { x: '100vw' } : { x: 0 }}
            transition={{ duration: 1.5, ease: EASE_IN_OUT_QUINT }}
            style={{ willChange: 'transform' }}
          >
            {/* Organic blob SVG with wavy LEFT edge — the edge that sweeps
                across the screen as the overlay slides to the right. */}
            <svg
              className="absolute inset-0 h-full w-full"
              preserveAspectRatio="none"
              viewBox="0 0 100 100"
              aria-hidden
            >
              <path
                d="M0,0
                   C 14,10 -5,22 10,34
                   C 22,46 -7,58 12,70
                   C 20,80 -5,92 0,100
                   L 100,100
                   L 100,0
                   Z"
                fill="#000000"
              />
            </svg>

            {/* Subtle vignette + grain for premium depth */}
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                background:
                  'radial-gradient(ellipse at center, rgba(255,255,255,0.04) 0%, rgba(0,0,0,0) 55%, rgba(0,0,0,0.6) 100%)',
              }}
            />

            {/* ===== Loading content ===== */}
            <motion.div
              className="absolute inset-0 flex flex-col"
              initial={{ opacity: 1 }}
              animate={phase === 'exiting' ? { opacity: 0 } : { opacity: 1 }}
              transition={{ duration: 0.35, ease: 'easeOut' }}
            >
              {/* Top bar */}
              <div className="flex items-center justify-between px-6 md:px-10 pt-7 md:pt-8">
                <motion.div
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, ease: EASE_OUT_EXPO, delay: 0.1 }}
                  className="text-white/85 text-[11px] md:text-xs tracking-[0.35em] uppercase font-medium"
                >
                  NewForm
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, ease: EASE_OUT_EXPO, delay: 0.18 }}
                  className="text-white/35 text-[10px] md:text-[11px] tracking-[0.3em] uppercase"
                >
                  Loading Experience
                </motion.div>
              </div>

              {/* Center: huge counter with neon green cursor */}
              <div className="flex flex-1 items-center justify-center">
                <div className="flex items-baseline">
                  <motion.div
                    initial={{ opacity: 0, letterSpacing: '0.05em' }}
                    animate={{ opacity: 1, letterSpacing: '-0.04em' }}
                    transition={{ duration: 1, ease: EASE_OUT_EXPO, delay: 0.15 }}
                    className="text-white font-semibold leading-none tabular-nums select-none"
                    style={{
                      fontSize: 'clamp(96px, 22vw, 360px)',
                      fontFeatureSettings: '"tnum" 1',
                    }}
                  >
                    {String(progress).padStart(2, '0')}
                  </motion.div>

                  <div className="flex items-baseline ml-2 md:ml-3">
                    <motion.span
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.8, ease: EASE_OUT_EXPO, delay: 0.25 }}
                      className="text-white/80 font-semibold leading-none"
                      style={{ fontSize: 'clamp(36px, 8vw, 132px)' }}
                    >
                      %
                    </motion.span>

                    {/* Neon green cursor — small vertical bar that blinks */}
                    <motion.span
                      initial={{ opacity: 0 }}
                      animate={{
                        opacity: [0, 1, 1, 0, 1],
                        scaleY: [1, 1.04, 1, 1.02, 1],
                      }}
                      transition={{
                        duration: 1.6,
                        repeat: Infinity,
                        ease: 'easeInOut',
                        delay: 0.3,
                      }}
                      className="ml-3 md:ml-5 inline-block w-[4px] md:w-[5px] rounded-full"
                      style={{
                        height: 'clamp(48px, 10vw, 160px)',
                        backgroundColor: '#00FF85',
                        boxShadow:
                          '0 0 12px #00FF85, 0 0 28px rgba(0, 255, 133, 0.55), 0 0 60px rgba(0, 255, 133, 0.25)',
                        transformOrigin: 'center',
                      }}
                    />
                  </div>
                </div>
              </div>

              {/* Bottom: status + thin progress bar */}
              <div className="px-6 md:px-10 pb-7 md:pb-9">
                <div className="flex items-end justify-between mb-3">
                  <motion.div
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: EASE_OUT_EXPO, delay: 0.22 }}
                    className="text-white/40 text-[10px] md:text-[11px] tracking-[0.3em] uppercase"
                  >
                    {STATUS_MESSAGES[statusIndex]}
                    <span className="ml-3 text-white/15">/</span>
                    <span className="ml-3 text-white/25">v1.0</span>
                  </motion.div>
                  <motion.div
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: EASE_OUT_EXPO, delay: 0.28 }}
                    className="text-[#00FF85] text-[10px] md:text-[11px] tracking-[0.3em] uppercase tabular-nums"
                    style={{ textShadow: '0 0 8px rgba(0, 255, 133, 0.5)' }}
                  >
                    {String(progress).padStart(3, '0')}%
                  </motion.div>
                </div>

                {/* Track */}
                <div className="relative h-px w-full bg-white/10 overflow-visible">
                  <motion.div
                    className="absolute left-0 top-0 h-full bg-[#00FF85]"
                    style={{
                      width: `${progress}%`,
                      boxShadow:
                        '0 0 6px #00FF85, 0 0 12px rgba(0, 255, 133, 0.6)',
                    }}
                  />
                  {/* Tick marks at 25 / 50 / 75 */}
                  {[25, 50, 75].map((tick) => (
                    <div
                      key={tick}
                      className="absolute top-1/2 -translate-y-1/2 h-2 w-px bg-white/15"
                      style={{ left: `${tick}%` }}
                    />
                  ))}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  )
}
