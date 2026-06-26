const MAX_CONCURRENT = 2

let activeLoads = 0
const waitQueue: Array<() => void> = []

function drainQueue() {
  while (activeLoads < MAX_CONCURRENT && waitQueue.length > 0) {
    const run = waitQueue.shift()!
    run()
  }
}

export function requestImageLoadSlot(): Promise<() => void> {
  return new Promise((resolve) => {
    const run = () => {
      activeLoads++
      resolve(() => {
        activeLoads = Math.max(0, activeLoads - 1)
        drainQueue()
      })
    }

    if (activeLoads < MAX_CONCURRENT) {
      run()
    } else {
      waitQueue.push(run)
    }
  })
}
