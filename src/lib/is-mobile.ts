import { useState, useEffect } from 'react'

const MOBILE_BREAKPOINT = 768

export function useIsMobile(breakpoint = MOBILE_BREAKPOINT) {
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    // Check if window is defined to avoid SSR issues
    if (window === undefined) {
      return
    }

    const checkIsMobile = () => {
      setIsMobile(window.innerWidth < breakpoint)
    }

    checkIsMobile()

    window.addEventListener('resize', checkIsMobile)
    return () => {
      window.removeEventListener('resize', checkIsMobile)
    }
  }, [breakpoint])

  return isMobile
}
