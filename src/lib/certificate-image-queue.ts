export type CertificateLoadPhase = 'idle' | 'loading' | 'loaded' | 'error'

const MAX_CONCURRENT = 1

type Listener = () => void

class CertificateImageQueue {
  private phases: CertificateLoadPhase[] = []

  private count = 0

  private active = false

  private paused = false

  private nextIndex = 0

  private inFlight = 0

  private indexListeners = new Map<number, Set<Listener>>()

  reset(count: number) {
    this.count = count
    this.phases = Array.from({ length: count }, () => 'idle')
    this.active = false
    this.paused = false
    this.nextIndex = 0
    this.inFlight = 0
    this.notifyAll()
  }

  activate() {
    if (this.active) return
    this.active = true
    this.scheduleDrain()
  }

  pause() {
    this.paused = true
  }

  resume() {
    if (!this.active) return
    this.paused = false
    this.scheduleDrain()
  }

  getPhase(index: number): CertificateLoadPhase {
    return this.phases[index] ?? 'idle'
  }

  shouldLoad(index: number): boolean {
    return this.phases[index] === 'loading'
  }

  complete(index: number, error = false) {
    if (this.phases[index] !== 'loading') return

    this.phases[index] = error ? 'error' : 'loaded'
    this.inFlight = Math.max(0, this.inFlight - 1)
    this.notifyIndex(index)
    this.scheduleDrain()
  }

  subscribeIndex(index: number, listener: Listener): () => void {
    let listeners = this.indexListeners.get(index)
    if (!listeners) {
      listeners = new Set()
      this.indexListeners.set(index, listeners)
    }
    listeners.add(listener)
    return () => listeners?.delete(listener)
  }

  private scheduleDrain() {
    const run = () => this.drain()

    if (typeof requestIdleCallback !== 'undefined') {
      requestIdleCallback(run, { timeout: 120 })
      return
    }

    requestAnimationFrame(() => {
      setTimeout(run, 0)
    })
  }

  private drain() {
    if (!this.active || this.paused) return

    while (this.inFlight < MAX_CONCURRENT && this.nextIndex < this.count) {
      const index = this.nextIndex
      this.nextIndex += 1
      this.phases[index] = 'loading'
      this.inFlight += 1
      this.notifyIndex(index)
    }
  }

  private notifyIndex(index: number) {
    this.indexListeners.get(index)?.forEach((listener) => listener())
  }

  private notifyAll() {
    for (let index = 0; index < this.count; index += 1) {
      this.notifyIndex(index)
    }
  }
}

export const certificateImageQueue = new CertificateImageQueue()
