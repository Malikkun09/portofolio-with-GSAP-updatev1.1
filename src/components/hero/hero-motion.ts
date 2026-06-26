import type { HeroLayout } from '@/hooks/use-hero-layout'

export const HERO_EASE = [0.16, 1, 0.3, 1] as const

export const heroMotionByLayout = {
  mobile: {
    titleDelay: 0.22,
    bioDelay: 0.36,
    ctaDelay: 0.48,
    characterDelay: 0.58,
    characterY: 44,
    titleBlur: 10,
  },
  tablet: {
    titleDelay: 0.18,
    bioDelay: 0.32,
    ctaDelay: 0.44,
    characterDelay: 0.5,
    characterY: 32,
    titleBlur: 8,
  },
  desktop: {
    titleDelay: 0.28,
    bioDelay: 0.4,
    ctaDelay: 0.5,
    characterDelay: 0.08,
    characterY: 0,
    titleBlur: 6,
  },
} as const satisfies Record<
  HeroLayout,
  {
    titleDelay: number
    bioDelay: number
    ctaDelay: number
    characterDelay: number
    characterY: number
    titleBlur: number
  }
>
