import { useEffect, useState, type ReactNode } from 'react'
import LoadingScreen from './LoadingScreen'
import { AppReadyProvider } from '@/contexts/AppReadyContext'
import { preloadCriticalAssets, waitForFonts } from '@/lib/preload-assets'
import { cn } from '@/lib/utils'

const MIN_LOADING_MS = 2200

interface AppLoaderProps {
  children: ReactNode
}

export default function AppLoader({ children }: AppLoaderProps) {
  const [phase, setPhase] = useState<'loading' | 'exiting' | 'done'>('loading')
  const [progress, setProgress] = useState(0)
  const [statusLabel, setStatusLabel] = useState('Initializing')

  useEffect(() => {
    const start = Date.now()
    let assetRatio = 0
    let assetsDone = false
    let fontsDone = false
    let rafId = 0
    let cancelled = false

    setStatusLabel('Loading assets')

    preloadCriticalAssets((loaded, total) => {
      if (cancelled) return
      assetRatio = loaded / total
      setStatusLabel(`Loading assets (${loaded}/${total})`)
    })
      .then(() => {
        assetsDone = true
        if (!cancelled) setStatusLabel('Finalizing')
      })
      .catch(() => {
        assetsDone = true
      })

    waitForFonts()
      .then(() => {
        fontsDone = true
      })
      .catch(() => {
        fontsDone = true
      })

    const tick = () => {
      if (cancelled) return

      const elapsed = Date.now() - start
      const timeRatio = Math.min(1, elapsed / MIN_LOADING_MS)
      const timeEased = 1 - Math.pow(1 - timeRatio, 4)

      const target = Math.min(
        100,
        Math.floor(Math.max(timeEased * 40, assetRatio * 85 + timeEased * 15)),
      )

      setProgress((prev) => {
        if (prev >= 100) return 100
        const next = prev + (target - prev) * 0.18
        return next >= 99.5 ? 100 : Math.floor(next)
      })

      const minTimeMet = elapsed >= MIN_LOADING_MS
      const allReady = assetsDone && fontsDone && minTimeMet

      if (allReady) {
        setProgress(100)
        setStatusLabel('Ready')
        setPhase('exiting')
        return
      }

      rafId = requestAnimationFrame(tick)
    }

    rafId = requestAnimationFrame(tick)

    return () => {
      cancelled = true
      cancelAnimationFrame(rafId)
    }
  }, [])

  const showLoader = phase !== 'done'

  return (
    <AppReadyProvider ready={phase === 'done'}>
      <div
        className={cn(showLoader && 'pointer-events-none select-none opacity-0')}
        aria-hidden={showLoader}
      >
        {children}
      </div>

      {showLoader && (
        <LoadingScreen
          progress={progress}
          statusLabel={statusLabel}
          isExiting={phase === 'exiting'}
          onExitComplete={() => setPhase('done')}
        />
      )}
    </AppReadyProvider>
  )
}
