import { useState, useEffect } from 'react'
import { getCurrentBreakpoint, isMobile, isTablet, isDesktop } from '@/utils/responsive'

export const useResponsive = () => {
  const [breakpoint, setBreakpoint] = useState(getCurrentBreakpoint())
  const [mobile, setMobile] = useState(isMobile())
  const [tablet, setTablet] = useState(isTablet())
  const [desktop, setDesktop] = useState(isDesktop())

  useEffect(() => {
    const handleResize = () => {
      setBreakpoint(getCurrentBreakpoint())
      setMobile(isMobile())
      setTablet(isTablet())
      setDesktop(isDesktop())
    }

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  return {
    breakpoint,
    isMobile: mobile,
    isTablet: tablet,
    isDesktop: desktop,
    isSmallScreen: mobile || tablet,
  }
}
