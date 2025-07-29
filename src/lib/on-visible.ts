import { useCallback, useEffect, useState } from 'react'

function createObserver(callback: () => void) {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        callback()
      }
    })
  })

  return observer
}

export function useOnVisible(callback: () => void) {
  const [observer, setObserver] = useState<IntersectionObserver | null>(null)

  useEffect(() => {
    const newObserver = createObserver(callback)
    setObserver(newObserver)

    return () => {
      newObserver.disconnect()
    }
  }, [callback])

  const callbackRef = useCallback(
    (element: HTMLElement | null) => {
      if (observer === null || element === null) {
        return
      }

      observer.observe(element)

      return () => {
        observer.unobserve(element)
      }
    },
    [observer]
  )

  return callbackRef
}
