import { createContext, useContext, useEffect, useRef, useState, type ReactNode } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Lenis from 'lenis'
import { registerLenisInstance } from '@/lib/utils'

gsap.registerPlugin(ScrollTrigger)

interface SmoothScrollContextValue {
  lenis: Lenis | null
  scrollToTarget: (target: string | number | HTMLElement, options?: ScrollToOptions) => void
}

const SmoothScrollContext = createContext<SmoothScrollContextValue>({
  lenis: null,
  scrollToTarget: () => {},
})

interface ScrollToOptions {
  offset?: number
  immediate?: boolean
  duration?: number
}

export function useSmoothScroll() {
  return useContext(SmoothScrollContext)
}

interface SmoothScrollProviderProps {
  children: ReactNode
}

export default function SmoothScrollProvider({ children }: SmoothScrollProviderProps) {
  const lenisRef = useRef<Lenis | null>(null)
  const [lenis, setLenis] = useState<Lenis | null>(null)

  useEffect(() => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReduced) {
      setLenis(null)
      return undefined
    }

    const lenisInstance = new Lenis({
      duration: 0.78,
      easing: (t) => 1 - (1 - t) ** 3,
      smoothWheel: true,
      touchMultiplier: 1.15,
    })

    lenisRef.current = lenisInstance
    setLenis(lenisInstance)
    registerLenisInstance(lenisInstance)

    lenisInstance.on('scroll', ScrollTrigger.update)

    const ticker = (time: number) => {
      lenisInstance.raf(time * 1000)
    }
    gsap.ticker.add(ticker)
    gsap.ticker.lagSmoothing(0)

    return () => {
      gsap.ticker.remove(ticker)
      registerLenisInstance(null)
      lenisInstance.destroy()
      lenisRef.current = null
      setLenis(null)
    }
  }, [])

  const scrollToTarget = (
    target: string | number | HTMLElement,
    options: ScrollToOptions = {},
  ) => {
    const inst = lenisRef.current
    if (!inst) {
      // Reduced motion fallback — native jump, no smooth conflict
      if (typeof target === 'string') {
        const el = document.getElementById(target)
        if (el) el.scrollIntoView()
      } else if (typeof target === 'number') {
        window.scrollTo(0, target)
      } else {
        target.scrollIntoView()
      }
      return
    }

    inst.scrollTo(target, {
      offset: options.offset ?? -80,
      immediate: options.immediate ?? false,
      duration: options.duration ?? 0.9,
    })
  }

  return (
    <SmoothScrollContext.Provider value={{ lenis, scrollToTarget }}>
      {children}
    </SmoothScrollContext.Provider>
  )
}
