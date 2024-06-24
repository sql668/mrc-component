import ResizeObserver from 'resize-observer-polyfill'
import { BasicTarget, getTargetElement } from 'ahooks/lib/utils/domTarget'
import { useRef } from 'react'
import { useEffectWithTarget } from '../utils'

// interface UseResizeObserverOptions {
//   window?: Window
//   box?: ResizeObserverBoxOptions
// }

interface UseResizeObserverReturn {
  stop: () => void
}

function useResizeObserver(
  target: BasicTarget,
  callback: ResizeObserverCallback,
  //options: UseResizeObserverOptions = {},
): UseResizeObserverReturn {
  //const { window = defaultWindow, ...observerOptions } = options
  let observer: ResizeObserver | undefined
  const enable = useRef(true)

  const cleanup = () => {
    if (observer) {
      observer.disconnect()
      observer = undefined
    }
  }

  useEffectWithTarget(
    () => {
      debugger
      if (!enable.current) {
        return
      }

      cleanup()
      const el = getTargetElement(target)

      if (!el) {
        return
      }
      observer = new ResizeObserver(callback)
      observer.observe(el)
      return () => {
        cleanup()
      }
    },
    [callback],
    target,
  )

  const stop = () => {
    cleanup()
    enable.current = false
  }

  return { stop }
}

export default useResizeObserver
