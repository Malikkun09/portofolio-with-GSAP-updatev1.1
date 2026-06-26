export type GalleryState = 'default' | 'hover-preview' | 'locked-anime' | 'transitioning'

export const GALLERY_INDEX = {
  default: 0,
  preview: 1,
  anime: 2,
} as const

export function indexToGalleryState(index: number): GalleryState {
  if (index === 0) return 'default'
  if (index === 1) return 'hover-preview'
  if (index === 2) return 'locked-anime'
  return 'default'
}

export type GalleryEvent = 'pointer-enter' | 'pointer-leave' | 'click' | 'tap'

export interface GalleryTransitionTarget {
  targetIndex: number
  nextState: GalleryState
}

/**
 * Resolves which image index is visually dominant from partial tile progress.
 */
export function resolveVisualIndex(
  fromIndex: number,
  toIndex: number,
  tiles: { progress: number }[],
): number {
  if (tiles.length === 0) return fromIndex
  const avg = tiles.reduce((sum, tile) => sum + tile.progress, 0) / tiles.length
  return avg >= 0.5 ? toIndex : fromIndex
}

export function resolveGalleryAction(
  event: GalleryEvent,
  currentIndex: number,
  galleryState: GalleryState,
  _isPointerInside: boolean,
  isAnimating: boolean,
  animatingToIndex: number | null,
): GalleryTransitionTarget | null {
  if (event === 'tap') {
    if (currentIndex === 0) {
      return { targetIndex: GALLERY_INDEX.preview, nextState: 'hover-preview' }
    }
    if (currentIndex === 1) {
      return { targetIndex: GALLERY_INDEX.anime, nextState: 'locked-anime' }
    }
    if (currentIndex === 2) {
      return { targetIndex: GALLERY_INDEX.default, nextState: 'default' }
    }
    return null
  }

  if (event === 'click') {
    if (galleryState === 'hover-preview' || currentIndex === 1) {
      return { targetIndex: GALLERY_INDEX.anime, nextState: 'locked-anime' }
    }
    if (galleryState === 'locked-anime' || currentIndex === 2) {
      return { targetIndex: GALLERY_INDEX.default, nextState: 'default' }
    }
    return null
  }

  if (event === 'pointer-enter') {
    if (galleryState === 'locked-anime' || currentIndex === 2) return null
    if (isAnimating && animatingToIndex === GALLERY_INDEX.preview) return null
    if (isAnimating && animatingToIndex === GALLERY_INDEX.anime) return null

    if (isAnimating && animatingToIndex === GALLERY_INDEX.default) {
      return { targetIndex: GALLERY_INDEX.preview, nextState: 'hover-preview' }
    }

    if (currentIndex === 0) {
      return { targetIndex: GALLERY_INDEX.preview, nextState: 'hover-preview' }
    }

    return null
  }

  if (event === 'pointer-leave') {
    if (galleryState === 'locked-anime' || currentIndex === 2) return null
    if (isAnimating && animatingToIndex === GALLERY_INDEX.default) return null

    if (isAnimating && animatingToIndex === GALLERY_INDEX.preview) {
      return { targetIndex: GALLERY_INDEX.default, nextState: 'default' }
    }

    if (currentIndex === 1 || galleryState === 'hover-preview') {
      return { targetIndex: GALLERY_INDEX.default, nextState: 'default' }
    }

    return null
  }

  return null
}
