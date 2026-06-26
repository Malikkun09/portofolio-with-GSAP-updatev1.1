import { useEffect, type ReactNode } from 'react'
import { certificateImageQueue } from '@/lib/certificate-image-queue'

interface CertificateImageQueueProviderProps {
  count: number
  active: boolean
  children: ReactNode
}

export default function CertificateImageQueueProvider({
  count,
  active,
  children,
}: CertificateImageQueueProviderProps) {
  useEffect(() => {
    certificateImageQueue.reset(count)
  }, [count])

  useEffect(() => {
    if (!active) {
      certificateImageQueue.pause()
      return undefined
    }

    certificateImageQueue.activate()
    certificateImageQueue.resume()

    return () => {
      certificateImageQueue.pause()
    }
  }, [active])

  return children
}
