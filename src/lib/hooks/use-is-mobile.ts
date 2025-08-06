import { useState, useEffect } from 'react'

const MOBILE_BREAKPOINT = 768

export function useIsMobile(breakpoint = MOBILE_BREAKPOINT) {
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkIsMobile = () => {
      if (typeof window !== 'undefined') {
        setIsMobile(window.innerWidth < breakpoint)
      }
    }

    checkIsMobile()

    if (typeof window !== 'undefined') {
      window.addEventListener('resize', checkIsMobile)
      return () => {
        window.removeEventListener('resize', checkIsMobile)
      }
    }
  }, [breakpoint])

  return isMobile
}
