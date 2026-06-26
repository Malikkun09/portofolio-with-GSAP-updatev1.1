import { useSyncExternalStore } from 'react'
import {
  certificateImageQueue,
  type CertificateLoadPhase,
} from '@/lib/certificate-image-queue'

export function useCertificateImagePhase(index: number): CertificateLoadPhase {
  return useSyncExternalStore(
    (onStoreChange) => certificateImageQueue.subscribeIndex(index, onStoreChange),
    () => certificateImageQueue.getPhase(index),
    () => 'idle' satisfies CertificateLoadPhase,
  )
}
