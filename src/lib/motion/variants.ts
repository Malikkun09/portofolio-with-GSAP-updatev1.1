import type { Variants, Transition } from 'motion/react'

export const EASE_OUT_EXPO: [number, number, number, number] = [0.16, 1, 0.3, 1]
export const EASE_IN_OUT: [number, number, number, number] = [0.65, 0, 0.35, 1]

export const defaultTransition: Transition = {
  duration: 0.7,
  ease: EASE_OUT_EXPO,
}

export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 28 },
  visible: {
    opacity: 1,
    y: 0,
    transition: defaultTransition,
  },
}

export const fadeUpBlur: Variants = {
  hidden: { opacity: 0, y: 24, filter: 'blur(8px)' },
  visible: {
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: { ...defaultTransition, duration: 0.85 },
  },
}

export const scaleReveal: Variants = {
  hidden: { opacity: 0, scale: 0.94 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: defaultTransition,
  },
}

export const slideLeft: Variants = {
  hidden: { opacity: 0, x: -32 },
  visible: {
    opacity: 1,
    x: 0,
    transition: defaultTransition,
  },
}

export const slideRight: Variants = {
  hidden: { opacity: 0, x: 32 },
  visible: {
    opacity: 1,
    x: 0,
    transition: defaultTransition,
  },
}

export const sectionReveal: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08, delayChildren: 0.05 },
  },
}

export const staggerItem: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: EASE_OUT_EXPO },
  },
}

export const hoverLift = {
  rest: { y: 0, scale: 1 },
  hover: {
    y: -4,
    scale: 1.01,
    transition: { duration: 0.35, ease: EASE_OUT_EXPO },
  },
}

export type RevealVariant = 'fade-up' | 'fade-up-blur' | 'scale' | 'slide-left' | 'slide-right'

export const revealVariants: Record<RevealVariant, Variants> = {
  'fade-up': fadeUp,
  'fade-up-blur': fadeUpBlur,
  scale: scaleReveal,
  'slide-left': slideLeft,
  'slide-right': slideRight,
}
