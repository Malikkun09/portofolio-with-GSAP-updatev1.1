import { useEffect, useRef, useState, type RefObject } from 'react'

interface UseInViewOptions {
  threshold?: number
  rootMargin?: string
  triggerOnce?: boolean
}

export function useInView<T extends Element = HTMLDivElement>(
  options: UseInViewOptions = {},
): { ref: RefObject<T | null>; inView: boolean } {
  const { threshold = 0, rootMargin = '120px', triggerOnce = true } = options
  const ref = useRef<T | null>(null)
  const [inView, setInView] = useState(false)

  useEffect(() => {
    const element = ref.current
    if (!element) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true)
          if (triggerOnce) observer.unobserve(element)
        } else if (!triggerOnce) {
          setInView(false)
        }
      },
      { threshold, rootMargin },
    )

    observer.observe(element)
    return () => observer.disconnect()
  }, [threshold, rootMargin, triggerOnce])

  return { ref, inView }
}
