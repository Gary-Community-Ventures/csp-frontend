import { useEffect, useRef } from 'react'

/**
 * Hook to auto-reload the page when a new service worker takes control.
 * This ensures users always get the latest version after a SW update.
 */
export function useServiceWorkerUpdate() {
  const refreshingRef = useRef(false)

  useEffect(() => {
    if (!('serviceWorker' in navigator)) return

    const handleControllerChange = () => {
      if (refreshingRef.current) return
      refreshingRef.current = true
      window.location.reload()
    }

    navigator.serviceWorker.addEventListener(
      'controllerchange',
      handleControllerChange
    )

    return () => {
      navigator.serviceWorker.removeEventListener(
        'controllerchange',
        handleControllerChange
      )
    }
  }, [])
}
