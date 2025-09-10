import { useState, useEffect } from 'react'

interface UseResponsiveReturn {
  isMobile: boolean
  isTablet: boolean
  isDesktop: boolean
  screenWidth: number
}

export function useResponsive(): UseResponsiveReturn {
  const [screenWidth, setScreenWidth] = useState(0)

  useEffect(() => {
    function handleResize() {
      setScreenWidth(window.innerWidth)
    }

    // Set initial width
    handleResize()

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const isMobile = screenWidth < 768
  const isTablet = screenWidth >= 768 && screenWidth < 1024
  const isDesktop = screenWidth >= 1024

  return {
    isMobile,
    isTablet,
    isDesktop,
    screenWidth,
  }
}
