import { useEffect } from 'react'
import { toast } from 'sonner'

export function useServiceWorkerUpdate() {
  useEffect(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.addEventListener('controllerchange', () => {
        // Service worker was updated and is now controlling the page
        toast.success('App updated! Refreshing...', {
          duration: 2000,
        })
        
        // Give user time to see the message, then reload
        setTimeout(() => {
          window.location.reload()
        }, 2000)
      })

      // Listen for waiting service worker (update available but waiting)
      navigator.serviceWorker.addEventListener('message', (event) => {
        if (event.data?.type === 'SW_UPDATE_AVAILABLE') {
          toast.info('App update available! Click to refresh.', {
            duration: 10000,
            action: {
              label: 'Refresh',
              onClick: () => {
                // Tell the service worker to skip waiting and take control
                navigator.serviceWorker.controller?.postMessage({ type: 'SKIP_WAITING' })
              },
            },
          })
        }
      })
    }
  }, [])
}