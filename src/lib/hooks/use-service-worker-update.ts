import { useEffect } from 'react'
import { toast } from 'sonner'

/*

  Hook to manage service worker updates and notify users
  
  Listens for service worker update events and prompts the user to refresh the page
  when a new version is available. Automatically reloads the page after the user
  confirms the update.

  We do not currently use this but leaving it around in case we ever do.

*/

export function useServiceWorkerUpdate() {
  useEffect(() => {
    if ('serviceWorker' in navigator) {
      const handleControllerChange = () => {
        // Service worker was updated and is now controlling the page
        toast.success('App updated! Refreshing...', {
          duration: 2000,
        })

        // Give user time to see the message, then reload
        setTimeout(() => {
          window.location.reload()
        }, 2000)
      }

      const handleMessage = (event: MessageEvent) => {
        if (event.data?.type === 'SW_UPDATE_AVAILABLE') {
          toast.info('App update available! Click to refresh.', {
            duration: 10000,
            action: {
              label: 'Refresh',
              onClick: () => {
                // Tell the service worker to skip waiting and take control
                navigator.serviceWorker.controller?.postMessage({
                  type: 'SKIP_WAITING',
                })
              },
            },
          })
        }
      }

      // Add event listeners
      navigator.serviceWorker.addEventListener(
        'controllerchange',
        handleControllerChange
      )
      navigator.serviceWorker.addEventListener('message', handleMessage)

      // Cleanup function to remove event listeners
      return () => {
        navigator.serviceWorker.removeEventListener(
          'controllerchange',
          handleControllerChange
        )
        navigator.serviceWorker.removeEventListener('message', handleMessage)
      }
    }
  }, [])
}
