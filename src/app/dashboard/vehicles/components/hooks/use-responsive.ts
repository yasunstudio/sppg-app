'use client'

import { useState, useEffect } from 'react'

export const useResponsive = () => {
  const [windowSize, setWindowSize] = useState({
    width: undefined as number | undefined,
    height: undefined as number | undefined,
  })

  useEffect(() => {
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      })
    }

    // Set initial size
    handleResize()

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const isMobile = (windowSize.width ?? 0) < 768
  const isTablet = (windowSize.width ?? 0) >= 768 && (windowSize.width ?? 0) < 1024
  const isDesktop = (windowSize.width ?? 0) >= 1024

  return {
    windowSize,
    isMobile,
    isTablet,
    isDesktop,
  }
}
