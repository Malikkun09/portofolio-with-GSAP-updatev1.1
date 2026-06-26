/** Critical above-the-fold images — preloaded during splash screen */
export const CRITICAL_ASSETS = [
  '/images/malik-desktop.png',
  '/images/malik-mobile.png',
  '/images/profile.jpg',
  '/images/logo-mf.png',
  '/images/project-eduverse.png',
  '/images/project-court.jpg',
  '/images/project-skillmatch.jpg',
] as const

function preloadImage(src: string): Promise<void> {
  return new Promise((resolve) => {
    const img = new Image()
    img.decoding = 'async'
    img.onload = () => resolve()
    img.onerror = () => resolve()
    img.src = src
  })
}

export async function preloadCriticalAssets(
  onProgress?: (loaded: number, total: number) => void,
): Promise<void> {
  const total = CRITICAL_ASSETS.length
  let loaded = 0

  await Promise.all(
    CRITICAL_ASSETS.map((src) =>
      preloadImage(src).then(() => {
        loaded += 1
        onProgress?.(loaded, total)
      }),
    ),
  )
}

export async function waitForFonts(): Promise<void> {
  if (document.fonts?.ready) {
    await document.fonts.ready
  }
}
