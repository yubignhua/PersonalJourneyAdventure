import { useState, useEffect } from 'react'

interface ResponsiveNavigationState {
  isMobile: boolean
  isTablet: boolean
  isDesktop: boolean
  screenWidth: number
}

export function useResponsiveNavigation(): ResponsiveNavigationState {
  const [state, setState] = useState<ResponsiveNavigationState>({
    isMobile: false,
    isTablet: false,
    isDesktop: true,
    screenWidth: 1024,
  })

  useEffect(() => {
    const updateScreenSize = () => {
      const width = window.innerWidth
      setState({
        isMobile: width < 768,
        isTablet: width >= 768 && width < 1024,
        isDesktop: width >= 1024,
        screenWidth: width,
      })
    }

    // Initial check
    updateScreenSize()

    // Add event listener
    window.addEventListener('resize', updateScreenSize)

    // Cleanup
    return () => window.removeEventListener('resize', updateScreenSize)
  }, [])

  return state
}