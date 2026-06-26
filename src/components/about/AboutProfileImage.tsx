import { useEffect, useRef } from 'react'
import { motion, useMotionValue, useSpring, useTransform } from 'motion/react'
import { about } from '@/data/portfolio'
import AnimatedGlowBorder from '@/components/ui/AnimatedGlowBorder'
import ImageFragmentTransition from '@/components/ui/ImageFragmentTransition'
import { cn } from '@/lib/utils'

interface AboutProfileImageProps {
  className?: string
}

function CornerMarker({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        'pointer-events-none absolute z-20 h-5 w-5 border-cyber-blue/50',
        className,
      )}
      aria-hidden
    />
  )
}

export default function AboutProfileImage({ className }: AboutProfileImageProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)
  const springX = useSpring(mouseX, { stiffness: 120, damping: 20 })
  const springY = useSpring(mouseY, { stiffness: 120, damping: 20 })

  const floatX = useTransform(springX, [-1, 1], [-8, 8])
  const floatY = useTransform(springY, [-1, 1], [-6, 6])
  const photoX = useTransform(springX, [-1, 1], [-4, 4])
  const photoY = useTransform(springY, [-1, 1], [-3, 3])
  const accentX = useTransform(springX, [-1, 1], [6, -6])
  const accentY = useTransform(springY, [-1, 1], [4, -4])
  const labelX = useTransform(springX, [-1, 1], [10, -10])

  useEffect(() => {
    const el = containerRef.current
    if (!el) return undefined

    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReduced) return undefined

    const onMove = (e: PointerEvent) => {
      const rect = el.getBoundingClientRect()
      const nx = ((e.clientX - rect.left) / rect.width - 0.5) * 2
      const ny = ((e.clientY - rect.top) / rect.height - 0.5) * 2
      mouseX.set(Math.max(-1, Math.min(1, nx)))
      mouseY.set(Math.max(-1, Math.min(1, ny)))
    }

    const onLeave = () => {
      mouseX.set(0)
      mouseY.set(0)
    }

    el.addEventListener('pointermove', onMove)
    el.addEventListener('pointerleave', onLeave)
    return () => {
      el.removeEventListener('pointermove', onMove)
      el.removeEventListener('pointerleave', onLeave)
    }
  }, [mouseX, mouseY])

  return (
    <div
      ref={containerRef}
      className={cn(
        'relative mx-auto w-full max-w-md sm:max-w-lg lg:mx-0 lg:max-w-xl',
        className,
      )}
    >
      {/* Floating accents */}
      <motion.div
        style={{ x: floatX, y: floatY }}
        className="pointer-events-none absolute -left-6 top-8 z-0 h-20 w-20 rounded-full bg-cyber-blue/8 blur-2xl"
        aria-hidden
      />
      <motion.div
        style={{ x: accentX, y: accentY }}
        className="pointer-events-none absolute -right-4 bottom-16 z-0 h-16 w-16 rounded-full bg-indigo-500/10 blur-2xl"
        aria-hidden
      />

      <CornerMarker className="left-0 top-0 border-l-2 border-t-2" />
      <CornerMarker className="right-0 top-0 border-r-2 border-t-2" />
      <CornerMarker className="bottom-8 left-0 border-b-2 border-l-2" />
      <CornerMarker className="bottom-8 right-0 border-b-2 border-r-2" />

      <motion.div style={{ x: photoX, y: photoY }} className="relative z-10">
        <AnimatedGlowBorder intensity="strong" className="w-full">
          <ImageFragmentTransition
            images={[about.profileImage, about.profileImageHover, about.profileImageLongPress]}
            alt={about.headline}
            tileSize={14}
            animationDuration={0.85}
            revealMode="gallery"
            badgeLabels={['Student', 'Profile', 'Anime Mode']}
          />
        </AnimatedGlowBorder>
      </motion.div>

      <motion.div
        style={{ x: labelX }}
        className="pointer-events-none absolute -right-2 top-1/4 z-20 hidden font-mono text-[10px] uppercase tracking-[0.3em] text-cyber-blue/40 lg:block"
        aria-hidden
      >
        MF / 2026
      </motion.div>
    </div>
  )
}
