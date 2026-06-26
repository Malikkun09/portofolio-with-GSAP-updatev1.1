import { memo, useCallback, useEffect, useRef, useState } from 'react'
import { certificateImageQueue } from '@/lib/certificate-image-queue'
import { useCertificateImagePhase } from '@/hooks/use-certificate-image-phase'
import { Skeleton } from '@/components/Skeleton'
import { cn } from '@/lib/utils'

interface CertificateThumbnailProps {
  index: number
  src: string
  alt: string
  className?: string
}

async function decodeImage(img: HTMLImageElement) {
  if (typeof img.decode === 'function') {
    await img.decode()
  }
}

const CertificateThumbnail = memo(function CertificateThumbnail({
  index,
  src,
  alt,
  className,
}: CertificateThumbnailProps) {
  const phase = useCertificateImagePhase(index)
  const imgRef = useRef<HTMLImageElement>(null)
  const [visible, setVisible] = useState(false)
  const finishedRef = useRef(false)

  const shouldMountImage = phase === 'loading' || phase === 'loaded' || visible

  useEffect(() => {
    if (phase === 'loading') {
      finishedRef.current = false
      setVisible(false)
    }
  }, [phase, src])

  const finish = useCallback(
    async (error = false) => {
      if (finishedRef.current) return
      finishedRef.current = true

      if (!error) {
        const img = imgRef.current
        if (img) {
          try {
            await decodeImage(img)
          } catch {
            // Decoding failed — still show the loaded bitmap.
          }
        }
        setVisible(true)
      }

      certificateImageQueue.complete(index, error)
    },
    [index],
  )

  const handleLoad = useCallback(() => {
    void finish(false)
  }, [finish])

  const handleError = useCallback(() => {
    void finish(true)
  }, [finish])

  const showSkeleton = !visible

  return (
    <div className="relative h-full min-h-[120px] w-full bg-cyber-black">
      {showSkeleton && (
        <Skeleton
          className="absolute inset-0 animate-none"
          aria-hidden={visible}
        />
      )}
      {shouldMountImage && (
        <img
          ref={imgRef}
          src={src}
          alt={alt}
          loading="lazy"
          decoding="async"
          fetchPriority="low"
          onLoad={handleLoad}
          onError={handleError}
          className={cn(
            className,
            'transition-opacity duration-300',
            visible ? 'opacity-100' : 'opacity-0',
          )}
        />
      )}
      {phase === 'error' && (
        <div className="absolute inset-0 flex items-center justify-center bg-cyber-black/80 px-3 text-center font-mono text-[10px] uppercase tracking-wider text-cyber-muted">
          Preview unavailable
        </div>
      )}
    </div>
  )
})

export default CertificateThumbnail
