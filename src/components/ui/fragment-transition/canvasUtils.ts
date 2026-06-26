export interface FragmentTile {
  x: number
  y: number
  w: number
  h: number
  driftX: number
  driftY: number
  progress: number
}

export interface CanvasDimensions {
  width: number
  height: number
  dpr: number
}

interface CoverMetrics {
  drawWidth: number
  drawHeight: number
  offsetX: number
  offsetY: number
}

export function getCanvasDimensions(
  containerWidth: number,
  containerHeight: number,
): CanvasDimensions {
  const dpr = Math.min(window.devicePixelRatio || 1, 2)
  return {
    width: Math.max(1, Math.floor(containerWidth * dpr)),
    height: Math.max(1, Math.floor(containerHeight * dpr)),
    dpr,
  }
}

export function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.decoding = 'async'
    img.onload = () => resolve(img)
    img.onerror = () => reject(new Error(`Failed to load image: ${src}`))
    img.src = src
  })
}

function getCoverMetrics(
  image: HTMLImageElement,
  canvasWidth: number,
  canvasHeight: number,
): CoverMetrics {
  const scale = Math.max(canvasWidth / image.naturalWidth, canvasHeight / image.naturalHeight)
  const drawWidth = image.naturalWidth * scale
  const drawHeight = image.naturalHeight * scale
  return {
    drawWidth,
    drawHeight,
    offsetX: (canvasWidth - drawWidth) / 2,
    offsetY: (canvasHeight - drawHeight) / 2,
  }
}

export function createTiles(
  canvasWidth: number,
  canvasHeight: number,
  tileSize: number,
): FragmentTile[] {
  const cols = Math.ceil(canvasWidth / tileSize)
  const rows = Math.ceil(canvasHeight / tileSize)
  const tiles: FragmentTile[] = []

  for (let row = 0; row < rows; row += 1) {
    for (let col = 0; col < cols; col += 1) {
      const x = col * tileSize
      const y = row * tileSize
      const w = Math.min(tileSize, canvasWidth - x)
      const h = Math.min(tileSize, canvasHeight - y)

      tiles.push({
        x,
        y,
        w,
        h,
        driftX: (Math.random() - 0.5) * tileSize * 0.4,
        driftY: (Math.random() - 0.5) * tileSize * 0.4,
        progress: 0,
      })
    }
  }

  return tiles
}

export function drawTiles(
  ctx: CanvasRenderingContext2D,
  tiles: FragmentTile[],
  fromImage: HTMLImageElement,
  canvasWidth: number,
  canvasHeight: number,
) {
  ctx.clearRect(0, 0, canvasWidth, canvasHeight)

  const cover = getCoverMetrics(fromImage, canvasWidth, canvasHeight)

  for (const tile of tiles) {
    if (tile.progress >= 1) continue

    const darkenPhase = 0.4
    const darken = Math.min(tile.progress / darkenPhase, 1)
    const fade =
      tile.progress <= darkenPhase ? 0 : (tile.progress - darkenPhase) / (1 - darkenPhase)
    const scaleTile = 1 - fade * 0.24
    const alpha = 1 - fade

    const relX = (tile.x - cover.offsetX) / cover.drawWidth
    const relY = (tile.y - cover.offsetY) / cover.drawHeight
    const relW = tile.w / cover.drawWidth
    const relH = tile.h / cover.drawHeight

    if (relX + relW <= 0 || relY + relH <= 0 || relX >= 1 || relY >= 1) continue

    const sx = Math.max(0, relX * fromImage.naturalWidth)
    const sy = Math.max(0, relY * fromImage.naturalHeight)
    const sw = Math.min(fromImage.naturalWidth - sx, relW * fromImage.naturalWidth)
    const sh = Math.min(fromImage.naturalHeight - sy, relH * fromImage.naturalHeight)

    const cx = tile.x + tile.w / 2 + tile.driftX * fade
    const cy = tile.y + tile.h / 2 + tile.driftY * fade

    ctx.save()
    ctx.translate(cx, cy)
    ctx.scale(scaleTile, scaleTile)
    ctx.translate(-tile.w / 2, -tile.h / 2)

    if (darken < 1 && alpha > 0) {
      ctx.globalAlpha = alpha * (1 - darken * 0.12)
      ctx.drawImage(fromImage, sx, sy, sw, sh, 0, 0, tile.w, tile.h)
    }

    if (darken > 0 && alpha > 0) {
      ctx.globalAlpha = alpha * Math.min(darken * 1.12, 1)
      ctx.fillStyle = '#050505'
      ctx.fillRect(0, 0, tile.w, tile.h)
    }

    ctx.restore()
  }
}

export function drawCoverImage(
  ctx: CanvasRenderingContext2D,
  image: HTMLImageElement,
  canvasWidth: number,
  canvasHeight: number,
) {
  const cover = getCoverMetrics(image, canvasWidth, canvasHeight)
  ctx.clearRect(0, 0, canvasWidth, canvasHeight)
  ctx.drawImage(
    image,
    cover.offsetX,
    cover.offsetY,
    cover.drawWidth,
    cover.drawHeight,
  )
}
