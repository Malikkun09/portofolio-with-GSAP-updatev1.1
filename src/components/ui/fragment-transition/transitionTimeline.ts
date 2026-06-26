import gsap from 'gsap'
import type { FragmentTile } from './canvasUtils'

interface BuildTimelineOptions {
  tiles: FragmentTile[]
  duration: number
  onUpdate: () => void
  onComplete: () => void
}

export function buildFragmentTimeline({
  tiles,
  duration,
  onUpdate,
  onComplete,
}: BuildTimelineOptions) {
  tiles.forEach((tile) => {
    tile.progress = 0
  })

  const shuffled = gsap.utils.shuffle([...tiles])
  const tl = gsap.timeline({
    onUpdate,
    onComplete,
  })

  shuffled.forEach((tile) => {
    const start = gsap.utils.random(0, duration * 0.5)
    const tileDuration = gsap.utils.random(0.32, 0.58)

    tl.to(
      tile,
      {
        progress: 1,
        duration: tileDuration,
        ease: 'power3.inOut',
      },
      start,
    )
  })

  return tl
}

export function killTimeline(timeline: gsap.core.Timeline | null) {
  if (!timeline) return
  timeline.kill()
  timeline.clear()
}
