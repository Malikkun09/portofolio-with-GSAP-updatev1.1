import { memo, useCallback, useEffect, useRef, useState, type CSSProperties, type SyntheticEvent } from 'react'
import { ChevronLeft, ChevronRight, X } from 'lucide-react'
import { certificates, certificatesSection } from '@/data/portfolio'
import CertificateThumbnail from '@/components/CertificateThumbnail'
import CertificateImageQueueProvider from '@/components/CertificateImageQueueProvider'
import HoverLift from '@/components/motion/HoverLift'
import RevealOnScroll from '@/components/motion/RevealOnScroll'
import SectionHeading from '@/components/SectionHeading'
import { useInView } from '@/hooks/use-in-view'
import { requestImageLoadSlot } from '@/hooks/use-image-load-queue'
import { Skeleton } from '@/components/Skeleton'
import { useScrollLock } from '@/providers/SmoothScrollProvider'
import { cn } from '@/lib/utils'

interface CertificateCardProps {
  index: number
  title: string
  description: string
  thumbnail: string
  pageCount: number
  onOpen: (index: number) => void
}

const CertificateCard = memo(function CertificateCard({
  index,
  title,
  description,
  thumbnail,
  pageCount,
  onOpen,
}: CertificateCardProps) {
  const handleClick = useCallback(() => onOpen(index), [index, onOpen])

  return (
    <RevealOnScroll delay={index * 0.04} y={16}>
    <HoverLift>
    <article
      onClick={handleClick}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          handleClick()
        }
      }}
      role="button"
      tabIndex={0}
      style={{ '--cert-i': index } as CSSProperties}
      className="cert-card-reveal cyber-card group cursor-pointer overflow-hidden transition-[border-color] duration-300 ease-out hover:border-cyber-blue/40"
    >
      <div className="relative isolate aspect-[3/2] overflow-hidden bg-cyber-black">
        <CertificateThumbnail
          index={index}
          src={thumbnail}
          alt={title}
          className="cert-thumbnail-image h-full w-full object-cover"
        />
        {pageCount > 1 && (
          <div className="pointer-events-none absolute bottom-2 right-2 rounded-sm bg-cyber-bg/80 px-2 py-1 font-mono text-[10px] text-cyber-yellow glow-box-yellow">
            {pageCount} pages
          </div>
        )}
      </div>
      <div className="p-4">
        <h3 className="mb-2 line-clamp-2 text-sm font-semibold text-cyber-fg transition-colors group-hover:text-cyber-blue">
          {title}
        </h3>
        <p className="line-clamp-2 text-xs leading-relaxed text-cyber-fg-muted">
          {description}
        </p>
      </div>
    </article>
    </HoverLift>
    </RevealOnScroll>
  )
})

interface CertificateModalProps {
  certIndex: number
  currentPage: number
  onClose: () => void
  onPrev: () => void
  onNext: () => void
  onSelectPage: (page: number) => void
}

function ModalImage({ src, alt }: { src: string; alt: string }) {
  const [imageSrc, setImageSrc] = useState<string | null>(null)
  const [visible, setVisible] = useState(false)
  const releaseRef = useRef<(() => void) | null>(null)

  useEffect(() => {
    let cancelled = false

    setImageSrc(null)
    setVisible(false)
    releaseRef.current?.()
    releaseRef.current = null

    requestImageLoadSlot().then((rel) => {
      if (cancelled) {
        rel()
        return
      }
      releaseRef.current = rel
      setImageSrc(src)
    })

    return () => {
      cancelled = true
      releaseRef.current?.()
      releaseRef.current = null
    }
  }, [src])

  const handleLoad = useCallback(async (event: SyntheticEvent<HTMLImageElement>) => {
    const img = event.currentTarget
    try {
      if (typeof img.decode === 'function') {
        await img.decode()
      }
    } catch {
      // Show bitmap even if decode fails.
    }
    setVisible(true)
    releaseRef.current?.()
    releaseRef.current = null
  }, [])

  return (
    <div className="relative flex min-h-[40vh] w-full items-center justify-center">
      {!visible && <Skeleton className="absolute inset-0 animate-none" />}
      {imageSrc && (
        <img
          src={imageSrc}
          alt={alt}
          decoding="async"
          onLoad={handleLoad}
          onError={handleLoad}
          className={cn(
            'max-h-[80vh] w-full rounded-sm object-contain transition-opacity duration-300',
            visible ? 'opacity-100' : 'opacity-0',
          )}
        />
      )}
    </div>
  )
}

function CertificateModal({
  certIndex,
  currentPage,
  onClose,
  onPrev,
  onNext,
  onSelectPage,
}: CertificateModalProps) {
  const cert = certificates[certIndex]
  const pageCount = cert.pages.length

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
      if (e.key === 'ArrowLeft') onPrev()
      if (e.key === 'ArrowRight') onNext()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose, onPrev, onNext])

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-cyber-bg/95 p-4"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={`Certificate preview: ${cert.title}`}
    >
      <button
        type="button"
        onClick={onClose}
        className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center border border-cyber-fg/10 text-cyber-fg transition-colors hover:border-cyber-blue hover:text-cyber-blue"
        aria-label="Close certificate preview"
      >
        <X size={20} />
      </button>

      <div className="relative mx-4 w-full max-w-4xl" onClick={(e) => e.stopPropagation()}>
        <ModalImage
          key={`${certIndex}-${currentPage}`}
          src={cert.pages[currentPage]}
          alt={`${cert.title} — page ${currentPage + 1}`}
        />

        {pageCount > 1 && (
          <>
            <button
              type="button"
              onClick={onPrev}
              disabled={currentPage === 0}
              className={`absolute left-0 top-1/2 flex h-10 w-10 -translate-x-2 -translate-y-1/2 items-center justify-center border border-cyber-fg/10 bg-cyber-bg-surface transition-colors ${
                currentPage === 0
                  ? 'cursor-not-allowed opacity-30'
                  : 'hover:border-cyber-blue'
              }`}
              aria-label="Previous page"
            >
              <ChevronLeft size={20} />
            </button>
            <button
              type="button"
              onClick={onNext}
              disabled={currentPage === pageCount - 1}
              className={`absolute right-0 top-1/2 flex h-10 w-10 -translate-y-1/2 translate-x-2 items-center justify-center border border-cyber-fg/10 bg-cyber-bg-surface transition-colors ${
                currentPage === pageCount - 1
                  ? 'cursor-not-allowed opacity-30'
                  : 'hover:border-cyber-blue'
              }`}
              aria-label="Next page"
            >
              <ChevronRight size={20} />
            </button>

            <div className="mt-4 flex justify-center gap-2">
              {cert.pages.map((_, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => onSelectPage(i)}
                  className={`h-1.5 rounded-full transition-[width,background-color] duration-200 ${
                    i === currentPage
                      ? 'w-6 bg-cyber-blue'
                      : 'w-1.5 bg-cyber-fg/20 hover:bg-cyber-fg/40'
                  }`}
                  aria-label={`Go to page ${i + 1}`}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  )
}

export default function Certificates() {
  const { ref: sectionRef, inView } = useInView<HTMLElement>({
    threshold: 0.08,
    rootMargin: '0px',
    triggerOnce: false,
  })
  const [selectedCert, setSelectedCert] = useState<number | null>(null)
  const [currentPage, setCurrentPage] = useState(0)
  useScrollLock(selectedCert !== null)

  const openModal = useCallback((index: number) => {
    setSelectedCert(index)
    setCurrentPage(0)
  }, [])

  const closeModal = useCallback(() => {
    setSelectedCert(null)
    setCurrentPage(0)
  }, [])

  const handleModalPrev = useCallback(() => {
    setCurrentPage((prev) => Math.max(0, prev - 1))
  }, [])

  const handleModalNext = useCallback(() => {
    setCurrentPage((prev) => {
      if (selectedCert === null) return prev
      return Math.min(certificates[selectedCert].pages.length - 1, prev + 1)
    })
  }, [selectedCert])

  const handleSelectPage = useCallback((page: number) => {
    setCurrentPage(page)
  }, [])

  return (
    <section
      id="certificates"
      ref={sectionRef}
      className={cn(
        'relative border-t border-cyber-fg/5 py-24 lg:py-32',
        inView && 'certificates-section--visible',
      )}
    >
      <CertificateImageQueueProvider count={certificates.length} active={inView}>
        <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-12">
          <div
            className={cn(
              'mb-12 transition-[opacity,transform] duration-700',
              inView ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0',
            )}
          >
            <SectionHeading
              label="Certificates"
              title={certificatesSection.title}
              description={certificatesSection.description}
              align="center"
            />
          </div>

          <div className="certificates-grid grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {certificates.map((cert, index) => (
              <CertificateCard
                key={cert.title}
                index={index}
                title={cert.title}
                description={cert.description}
                thumbnail={cert.pages[0]}
                pageCount={cert.pages.length}
                onOpen={openModal}
              />
            ))}
          </div>
        </div>
      </CertificateImageQueueProvider>

      {selectedCert !== null && (
        <CertificateModal
          certIndex={selectedCert}
          currentPage={currentPage}
          onClose={closeModal}
          onPrev={handleModalPrev}
          onNext={handleModalNext}
          onSelectPage={handleSelectPage}
        />
      )}
    </section>
  )
}
