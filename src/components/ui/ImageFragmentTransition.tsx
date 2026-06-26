import { useEffect, useState } from 'react'
import { motion } from 'motion/react'
import { cn } from '@/lib/utils'
import {
  useFragmentTransition,
  type RevealMode,
} from './fragment-transition/useFragmentTransition'

export type { RevealMode }

export interface ImageFragmentTransitionProps {
  images: string[]
  alt: string
  tileSize?: number
  animationDuration?: number
  revealMode?: RevealMode
  resetIndexOnLeave?: boolean
  className?: string
  containerClassName?: string
  hint?: string
  badgeLabels?: string[]
}

export default function ImageFragmentTransition({
  images,
  alt,
  tileSize = 16,
  animationDuration = 0.9,
  revealMode = 'gallery',
  resetIndexOnLeave = false,
  className,
  containerClassName,
  hint,
  badgeLabels,
}: ImageFragmentTransitionProps) {
  const [reducedMotion, setReducedMotion] = useState(false)
  const [isTouch, setIsTouch] = useState(false)

  useEffect(() => {
    const motionMq = window.matchMedia('(prefers-reduced-motion: reduce)')
    const touchMq = window.matchMedia('(hover: none), (pointer: coarse)')
    const update = () => {
      setReducedMotion(motionMq.matches)
      setIsTouch(touchMq.matches)
    }
    update()
    motionMq.addEventListener('change', update)
    touchMq.addEventListener('change', update)
    return () => {
      motionMq.removeEventListener('change', update)
      touchMq.removeEventListener('change', update)
    }
  }, [])

  const {
    containerRef,
    canvasRef,
    baseCanvasRef,
    currentIndex,
    galleryState,
    isReady,
    isAnimating,
    isPointerInside,
    handlePointerEnter,
    handlePointerLeave,
    handleClick,
    handleTouchAdvance,
  } = useFragmentTransition({
    images,
    tileSize,
    animationDuration,
    revealMode,
    resetIndexOnLeave,
    reducedMotion,
  })

  const isInteractive = isPointerInside || galleryState === 'hover-preview'
  const isLocked = galleryState === 'locked-anime'

  const badge =
    badgeLabels?.[currentIndex] ??
    (currentIndex === 0 ? 'Student' : currentIndex === 1 ? 'Profile' : 'Anime')

  return (
    <div className={cn('relative w-full', className)}>
      <motion.div
        ref={containerRef}
        className={cn(
          'gallery-image relative aspect-square overflow-hidden bg-cyber-card',
          !isTouch && 'cursor-pointer select-none',
          isInteractive && 'gallery-image--active',
          isLocked && 'gallery-image--locked',
          containerClassName,
        )}
        onPointerEnter={!isTouch ? handlePointerEnter : undefined}
        onPointerLeave={!isTouch ? handlePointerLeave : undefined}
        onClick={isTouch ? handleTouchAdvance : handleClick}
        animate={{
          scale: isInteractive || isLocked ? 1.02 : 1,
        }}
        transition={{ type: 'spring', stiffness: 320, damping: 28 }}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault()
            if (isTouch) handleTouchAdvance()
            else handleClick()
          }
        }}
        role="button"
        tabIndex={0}
        aria-label={alt}
        aria-busy={isAnimating}
        data-gallery-state={galleryState}
      >
        <canvas
          ref={baseCanvasRef}
          className="absolute inset-0 h-full w-full"
          aria-hidden
        />
        <canvas
          ref={canvasRef}
          className="pointer-events-none absolute inset-0 z-10 h-full w-full"
          aria-hidden
        />

        {!isReady && (
          <img
            src={images[0]}
            alt={alt}
            width={600}
            height={600}
            className="absolute inset-0 h-full w-full object-cover"
            loading="eager"
            decoding="async"
            draggable={false}
          />
        )}

        <div className="pointer-events-none absolute inset-0 z-20 bg-gradient-to-t from-cyber-black/55 via-transparent to-transparent" />
      </motion.div>

      {badgeLabels && (
        <div
          className={cn(
            'pointer-events-none absolute -bottom-3 -right-3 z-30 border bg-cyber-black px-4 py-2 transition-all duration-300',
            isLocked
              ? 'border-cyber-yellow/60 shadow-glow-yellow'
              : 'border-cyber-yellow/35',
          )}
        >
          <span className="font-mono text-xs font-semibold text-cyber-yellow">{badge}</span>
        </div>
      )}

      {hint && (
        <p className="mt-3 text-center font-mono text-[10px] uppercase tracking-widest text-white/30 lg:text-left">
          {isTouch ? 'Tap to explore' : hint}
        </p>
      )}
    </div>
  )
}
