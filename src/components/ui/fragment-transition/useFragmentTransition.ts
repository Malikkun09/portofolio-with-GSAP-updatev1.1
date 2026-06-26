import { useCallback, useEffect, useRef, useState } from 'react'
import {
  createTiles,
  drawCoverImage,
  drawTiles,
  getCanvasDimensions,
  loadImage,
  type FragmentTile,
} from './canvasUtils'
import {
  type GalleryState,
  type GalleryEvent,
  GALLERY_INDEX,
  indexToGalleryState,
  resolveGalleryAction,
  resolveVisualIndex,
} from './galleryStateMachine'
import { buildFragmentTimeline, killTimeline } from './transitionTimeline'

export type RevealMode = 'hover' | 'click' | 'hover-click' | 'gallery'

interface UseFragmentTransitionOptions {
  images: string[]
  tileSize?: number
  animationDuration?: number
  revealMode?: RevealMode
  resetIndexOnLeave?: boolean
  reducedMotion?: boolean
}

interface ActiveTransition {
  fromIndex: number
  toIndex: number
  nextState: GalleryState
}

export function useFragmentTransition({
  images,
  tileSize = 16,
  animationDuration = 0.9,
  revealMode = 'gallery',
  resetIndexOnLeave = false,
  reducedMotion = false,
}: UseFragmentTransitionOptions) {
  const containerRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const baseCanvasRef = useRef<HTMLCanvasElement>(null)

  const [currentIndex, setCurrentIndex] = useState(0)
  const [galleryState, setGalleryState] = useState<GalleryState>('default')
  const [isReady, setIsReady] = useState(false)
  const [isAnimating, setIsAnimating] = useState(false)
  const [isPointerInside, setIsPointerInside] = useState(false)

  const currentIndexRef = useRef(0)
  const galleryStateRef = useRef<GalleryState>('default')
  const isAnimatingRef = useRef(false)
  const pointerInsideRef = useRef(false)
  const timelineRef = useRef<gsap.core.Timeline | null>(null)
  const tilesRef = useRef<FragmentTile[]>([])
  const loadedImagesRef = useRef<HTMLImageElement[]>([])
  const dimensionsRef = useRef({ width: 0, height: 0, dpr: 1 })
  const activeTransitionRef = useRef<ActiveTransition | null>(null)
  const dispatchGalleryRef = useRef<(event: GalleryEvent) => void>(() => undefined)

  const syncGalleryState = useCallback((state: GalleryState) => {
    galleryStateRef.current = state
    setGalleryState(state)
  }, [])

  const clearOverlay = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    const { width, height } = dimensionsRef.current
    ctx.clearRect(0, 0, width, height)
    tilesRef.current = []
  }, [])

  const syncBaseCanvas = useCallback((index: number) => {
    const baseCanvas = baseCanvasRef.current
    const image = loadedImagesRef.current[index]
    if (!baseCanvas || !image) return

    const ctx = baseCanvas.getContext('2d')
    if (!ctx) return

    const { width, height } = dimensionsRef.current
    drawCoverImage(ctx, image, width, height)
  }, [])

  const renderOverlay = useCallback((fromIndex: number) => {
    const canvas = canvasRef.current
    const fromImage = loadedImagesRef.current[fromIndex]
    if (!canvas || !fromImage) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const { width, height } = dimensionsRef.current
    drawTiles(ctx, tilesRef.current, fromImage, width, height)
  }, [])

  const commitIndex = useCallback(
    (index: number, state?: GalleryState) => {
      currentIndexRef.current = index
      setCurrentIndex(index)
      syncBaseCanvas(index)
      const nextState = state ?? indexToGalleryState(index)
      if (nextState !== 'transitioning') {
        syncGalleryState(nextState)
      }
    },
    [syncBaseCanvas, syncGalleryState],
  )

  const abortTransition = useCallback(() => {
    if (!isAnimatingRef.current || !activeTransitionRef.current) {
      return currentIndexRef.current
    }

    const { fromIndex, toIndex } = activeTransitionRef.current
    killTimeline(timelineRef.current)
    timelineRef.current = null

    const resolved = resolveVisualIndex(fromIndex, toIndex, tilesRef.current)
    commitIndex(resolved)
    clearOverlay()

    isAnimatingRef.current = false
    setIsAnimating(false)
    activeTransitionRef.current = null

    return resolved
  }, [clearOverlay, commitIndex])

  const resizeCanvases = useCallback(() => {
    const container = containerRef.current
    const canvas = canvasRef.current
    const baseCanvas = baseCanvasRef.current
    if (!container || !canvas || !baseCanvas) return

    const rect = container.getBoundingClientRect()
    if (rect.width <= 0 || rect.height <= 0) return

    const { width, height, dpr } = getCanvasDimensions(rect.width, rect.height)
    dimensionsRef.current = { width, height, dpr }

    for (const node of [canvas, baseCanvas]) {
      node.width = width
      node.height = height
      node.style.width = `${rect.width}px`
      node.style.height = `${rect.height}px`
    }

    syncBaseCanvas(currentIndexRef.current)
    if (tilesRef.current.length > 0 && isAnimatingRef.current && activeTransitionRef.current) {
      renderOverlay(activeTransitionRef.current.fromIndex)
    } else {
      clearOverlay()
    }
  }, [clearOverlay, renderOverlay, syncBaseCanvas])

  useEffect(() => {
    let cancelled = false

    Promise.all(images.map((src) => loadImage(src)))
      .then((loaded) => {
        if (cancelled) return
        loadedImagesRef.current = loaded
        setIsReady(true)
        resizeCanvases()
      })
      .catch(() => {
        if (!cancelled) setIsReady(true)
      })

    return () => {
      cancelled = true
    }
  }, [images, resizeCanvases])

  useEffect(() => {
    const container = containerRef.current
    if (!container) return undefined

    const observer = new ResizeObserver(() => resizeCanvases())
    observer.observe(container)
    return () => observer.disconnect()
  }, [resizeCanvases])

  useEffect(() => {
    return () => {
      killTimeline(timelineRef.current)
      timelineRef.current = null
    }
  }, [])

  useEffect(() => {
    if (!isReady) return
    syncBaseCanvas(currentIndexRef.current)
  }, [isReady, syncBaseCanvas])

  const runFragmentTransition = useCallback(
    (targetIndex: number, nextState: GalleryState) => {
      if (!isReady || targetIndex < 0 || targetIndex >= images.length) return false

      const fromIndex = abortTransition()
      if (fromIndex === targetIndex) {
        commitIndex(targetIndex, nextState)
        return true
      }

      const fromImage = loadedImagesRef.current[fromIndex]
      const toImage = loadedImagesRef.current[targetIndex]
      const baseCanvas = baseCanvasRef.current
      const canvas = canvasRef.current

      if (!fromImage || !toImage || !baseCanvas || !canvas) return false

      const { width, height } = dimensionsRef.current
      if (width <= 0 || height <= 0) return false

      if (reducedMotion) {
        commitIndex(targetIndex, nextState)
        clearOverlay()
        return true
      }

      killTimeline(timelineRef.current)
      isAnimatingRef.current = true
      setIsAnimating(true)
      syncGalleryState('transitioning')

      activeTransitionRef.current = { fromIndex, toIndex: targetIndex, nextState }

      tilesRef.current = createTiles(width, height, tileSize)

      const overlayCtx = canvas.getContext('2d')
      if (overlayCtx) {
        drawCoverImage(overlayCtx, fromImage, width, height)
      }

      syncBaseCanvas(targetIndex)

      const runComplete = () => {
        const unlockedFromAnime =
          activeTransitionRef.current?.fromIndex === GALLERY_INDEX.anime &&
          targetIndex === GALLERY_INDEX.default

        commitIndex(targetIndex, nextState)
        clearOverlay()
        isAnimatingRef.current = false
        setIsAnimating(false)
        timelineRef.current = null
        activeTransitionRef.current = null

        if (
          revealMode === 'gallery' &&
          unlockedFromAnime &&
          pointerInsideRef.current
        ) {
          requestAnimationFrame(() => {
            if (pointerInsideRef.current) {
              dispatchGalleryRef.current('pointer-enter')
            }
          })
        }
      }

      timelineRef.current = buildFragmentTimeline({
        tiles: tilesRef.current,
        duration: animationDuration,
        onUpdate: () => renderOverlay(fromIndex),
        onComplete: runComplete,
      })

      return true
    },
    [
      abortTransition,
      animationDuration,
      clearOverlay,
      commitIndex,
      images.length,
      isReady,
      reducedMotion,
      renderOverlay,
      syncBaseCanvas,
      syncGalleryState,
      revealMode,
      tileSize,
    ],
  )

  const dispatchGallery = useCallback(
    (event: GalleryEvent) => {
      if (revealMode !== 'gallery') return

      const animatingTo = activeTransitionRef.current?.toIndex ?? null
      const action = resolveGalleryAction(
        event,
        currentIndexRef.current,
        galleryStateRef.current,
        pointerInsideRef.current,
        isAnimatingRef.current,
        animatingTo,
      )

      if (!action) return

      if (isAnimatingRef.current) {
        abortTransition()
      }

      runFragmentTransition(action.targetIndex, action.nextState)
    },
    [abortTransition, revealMode, runFragmentTransition],
  )

  dispatchGalleryRef.current = dispatchGallery

  const transitionTo = useCallback(
    (targetIndex: number) => {
      if (
        !isReady ||
        targetIndex === currentIndexRef.current ||
        targetIndex < 0 ||
        targetIndex >= images.length
      ) {
        return false
      }

      return runFragmentTransition(targetIndex, indexToGalleryState(targetIndex))
    },
    [images.length, isReady, runFragmentTransition],
  )

  const handlePointerEnter = useCallback(() => {
    pointerInsideRef.current = true
    setIsPointerInside(true)

    if (revealMode === 'gallery') {
      dispatchGallery('pointer-enter')
      return
    }

    if (revealMode === 'click') return

    if (revealMode === 'hover' && currentIndexRef.current < images.length - 1) {
      runFragmentTransition(currentIndexRef.current + 1, 'hover-preview')
      return
    }

    if (revealMode === 'hover-click' && currentIndexRef.current === 0) {
      runFragmentTransition(1, 'hover-preview')
    }
  }, [dispatchGallery, images.length, revealMode, runFragmentTransition])

  const handlePointerLeave = useCallback(() => {
    pointerInsideRef.current = false
    setIsPointerInside(false)

    if (revealMode === 'gallery') {
      dispatchGallery('pointer-leave')
      return
    }

    if (!resetIndexOnLeave || currentIndexRef.current === 0) return
    runFragmentTransition(0, 'default')
  }, [dispatchGallery, resetIndexOnLeave, revealMode, runFragmentTransition])

  const handleClick = useCallback(() => {
    if (revealMode === 'gallery') {
      dispatchGallery('click')
      return
    }

    if (revealMode === 'hover') return

    if (revealMode === 'click') {
      const next = (currentIndexRef.current + 1) % images.length
      runFragmentTransition(next, indexToGalleryState(next))
      return
    }

    if (revealMode === 'hover-click' && currentIndexRef.current === 1) {
      runFragmentTransition(2, 'locked-anime')
    }
  }, [dispatchGallery, images.length, revealMode, runFragmentTransition])

  const handleTouchAdvance = useCallback(() => {
    if (revealMode === 'gallery') {
      dispatchGallery('tap')
      return
    }

    if (revealMode === 'hover-click') {
      if (currentIndexRef.current === 0) {
        runFragmentTransition(1, 'hover-preview')
      } else if (currentIndexRef.current === 1) {
        runFragmentTransition(2, 'locked-anime')
      } else {
        runFragmentTransition(0, 'default')
      }
      return
    }

    const next = (currentIndexRef.current + 1) % images.length
    runFragmentTransition(next, indexToGalleryState(next))
  }, [dispatchGallery, images.length, revealMode, runFragmentTransition])

  return {
    containerRef,
    canvasRef,
    baseCanvasRef,
    currentIndex,
    galleryState,
    isReady,
    isAnimating,
    isPointerInside,
    transitionTo,
    handlePointerEnter,
    handlePointerLeave,
    handleClick,
    handleTouchAdvance,
  }
}
