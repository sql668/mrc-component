
import { useLatest } from "ahooks"
import { BasicTarget, getTargetElement } from "ahooks/lib/utils/domTarget"
import useMergedState from "./useMergedState"
import { useEffectWithTarget } from "../utils"
type noop = (...p: any) => void

export type Target = BasicTarget<HTMLElement | Element | Window | Document>

type Options<T extends Target = Target> = {
  target?: T
  capture?: boolean
  once?: boolean
  passive?: boolean
  enable?: boolean
}

interface UseEventListenerReturn {
  stop: () => void
}

function useEventListener<K extends keyof HTMLElementEventMap>(
  eventName: K,
  handler: (ev: HTMLElementEventMap[K]) => void,
  options?: Options<HTMLElement>,
): UseEventListenerReturn
function useEventListener<K extends keyof ElementEventMap>(
  eventName: K,
  handler: (ev: ElementEventMap[K]) => void,
  options?: Options<Element>,
): UseEventListenerReturn
function useEventListener<K extends keyof DocumentEventMap>(
  eventName: K,
  handler: (ev: DocumentEventMap[K]) => void,
  options?: Options<Document>,
): UseEventListenerReturn
function useEventListener<K extends keyof WindowEventMap>(
  eventName: K,
  handler: (ev: WindowEventMap[K]) => void,
  options?: Options<Window>,
): UseEventListenerReturn
function useEventListener(
  eventName: string,
  handler: (event: Event) => void,
  options?: Options<Window>,
): UseEventListenerReturn
function useEventListener(
  eventName: string,
  handler: noop,
  options: Options,
): UseEventListenerReturn

function useEventListener(eventName: string, handler: noop, options: Options = {}) {
  const { enable } = options
  const [mergeEnable, setMergeEnable] = useMergedState(true, {
    defaultValue:enable
  })

  const handlerRef = useLatest(handler)

  const eventListener = (event: Event) => {
    return handlerRef.current(event)
  }

  const cleanup = () => {
    const targetElement = getTargetElement(options.target, window)
    if (!targetElement?.removeEventListener) {
      return
    }
    targetElement.removeEventListener(eventName, eventListener, {
      capture: options.capture,
    })
  }


  useEffectWithTarget(
    () => {
      debugger
      if (!mergeEnable) {
        return
      }

      const targetElement = getTargetElement(options.target, window)
      if (!targetElement?.addEventListener) {
        return
      }

      targetElement.addEventListener(eventName, eventListener, {
        capture: options.capture,
        once: options.once,
        passive: options.passive,
      })

      return () => {
        targetElement.removeEventListener(eventName, eventListener, {
          capture: options.capture,
        })
      }
    },
    [eventName, options.capture, options.once, options.passive, mergeEnable],
    options.target,
  )

  const stop = () => {
    cleanup()
    setMergeEnable(false)
  }

  return {stop}
}

export default useEventListener
