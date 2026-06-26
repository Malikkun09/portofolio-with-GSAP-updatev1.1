import { useEffect, useState } from 'react'

export type HeroLayout = 'mobile' | 'tablet' | 'desktop'

function resolveHeroLayout(width: number): HeroLayout {
  if (width < 768) return 'mobile'
  if (width < 1024) return 'tablet'
  return 'desktop'
}

export function useHeroLayout(): HeroLayout {
  const [layout, setLayout] = useState<HeroLayout>(() =>
    typeof window !== 'undefined' ? resolveHeroLayout(window.innerWidth) : 'desktop',
  )

  useEffect(() => {
    const update = () => setLayout(resolveHeroLayout(window.innerWidth))
    update()
    window.addEventListener('resize', update)
    return () => window.removeEventListener('resize', update)
  }, [])

  return layout
}
