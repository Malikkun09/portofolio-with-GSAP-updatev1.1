import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react'
import Lenis from 'lenis'
import { gsap, ScrollTrigger } from '@/lib/gsap'
import { registerLenisInstance } from '@/lib/utils'

interface SmoothScrollContextValue {
  lenis: Lenis | null
  scrollToTarget: (target: string | number | HTMLElement, options?: ScrollToOptions) => void
  setScrollLocked: (locked: boolean) => void
}

const SmoothScrollContext = createContext<SmoothScrollContextValue>({
  lenis: null,
  scrollToTarget: () => {},
  setScrollLocked: () => {},
})

interface ScrollToOptions {
  offset?: number
  immediate?: boolean
  duration?: number
}

export function useSmoothScroll() {
  return useContext(SmoothScrollContext)
}

/** Pause Lenis + native overflow while overlays (mobile nav, dialogs) are open. */
export function useScrollLock(locked: boolean) {
  const { setScrollLocked } = useSmoothScroll()

  useEffect(() => {
    if (!locked) return undefined
    setScrollLocked(true)
    return () => setScrollLocked(false)
  }, [locked, setScrollLocked])
}

const GSAP_LAG_SMOOTHING_THRESHOLD = 500
const GSAP_LAG_SMOOTHING_ADJUSTED = 33

interface SmoothScrollProviderProps {
  children: ReactNode
}

export default function SmoothScrollProvider({ children }: SmoothScrollProviderProps) {
  const lenisRef = useRef<Lenis | null>(null)
  const lockCountRef = useRef(0)
  const [lenis, setLenis] = useState<Lenis | null>(null)

  const applyLockState = useCallback(() => {
    const shouldLock = lockCountRef.current > 0
    document.body.style.overflow = shouldLock ? 'hidden' : ''
    const inst = lenisRef.current
    if (!inst) return
    if (shouldLock) inst.stop()
    else inst.start()
  }, [])

  const setScrollLocked = useCallback(
    (locked: boolean) => {
      lockCountRef.current = Math.max(0, lockCountRef.current + (locked ? 1 : -1))
      applyLockState()
    },
    [applyLockState],
  )

  useEffect(() => {
    const motionMq = window.matchMedia('(prefers-reduced-motion: reduce)')
    let instance: Lenis | null = null

    const ticker = (time: number) => {
      instance?.raf(time * 1000)
    }

    const destroyLenis = () => {
      if (!instance) return
      gsap.ticker.remove(ticker)
      gsap.ticker.lagSmoothing(GSAP_LAG_SMOOTHING_THRESHOLD, GSAP_LAG_SMOOTHING_ADJUSTED)
      instance.off('scroll', ScrollTrigger.update)
      registerLenisInstance(null)
      instance.destroy()
      instance = null
      lenisRef.current = null
      setLenis(null)
    }

    const createLenis = () => {
      if (instance) return

      instance = new Lenis({
        duration: 1.1,
        easing: (t) => Math.min(1, 1.001 - 2 ** (-10 * t)),
        smoothWheel: true,
        touchMultiplier: 1.2,
      })

      lenisRef.current = instance
      setLenis(instance)
      registerLenisInstance(instance)
      instance.on('scroll', ScrollTrigger.update)
      gsap.ticker.add(ticker)
      gsap.ticker.lagSmoothing(0)
      applyLockState()
    }

    const sync = () => {
      if (motionMq.matches) destroyLenis()
      else createLenis()
    }

    sync()
    motionMq.addEventListener('change', sync)

    return () => {
      motionMq.removeEventListener('change', sync)
      destroyLenis()
      document.body.style.overflow = ''
    }
  }, [applyLockState])

  const scrollToTarget = useCallback(
    (target: string | number | HTMLElement, options: ScrollToOptions = {}) => {
      const inst = lenisRef.current
      if (!inst) {
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
        duration: options.duration ?? 1.4,
      })
    },
    [],
  )

  const value = useMemo(
    () => ({ lenis, scrollToTarget, setScrollLocked }),
    [lenis, scrollToTarget, setScrollLocked],
  )

  return (
    <SmoothScrollContext.Provider value={value}>{children}</SmoothScrollContext.Provider>
  )
}
