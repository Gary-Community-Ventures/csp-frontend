import { useEffect } from 'react'

export function useBackgroundColor(color: string) {
  useEffect(() => {
    document.documentElement.style.setProperty('--body-background', color)

    return () => {
      document.documentElement.style.setProperty(
        '--body-background',
        'var(--background)'
      )
    }
  }, [color])
}
