import { useEffect, useRef } from 'react'

/**
 * 监听容器是否滚动到底部
 * @param container 需要监听滚动的dom元素
 * @param callback 监听滚动到底部后回调的方法
 * @param offset 如果你需要在离底部一定距离时就触发触底事件，你需要在这里设置相关的偏移量
 */
export default function useScrollToBottomAction(container: any, callback: () => void, offset = 0) {
  const callbackRef = useRef(callback)

  useEffect(() => {
    callbackRef.current = callback
  }, [callback])

  useEffect(() => {
    const handleScroll = () => {
      const scrollContainer = container === document ? document.scrollingElement : container
      if (
        scrollContainer.scrollTop + scrollContainer.clientHeight >=
        scrollContainer.scrollHeight - offset
      ) {
        callbackRef.current()
      }
    }

    container.addEventListener('scroll', handleScroll, { passive: true })

    return () => {
      container.removeEventListener('scroll', handleScroll)
    }
  }, [container, offset])
}
