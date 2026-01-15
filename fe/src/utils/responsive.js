// Breakpoint values
export const breakpoints = {
  xs: 475,
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  '2xl': 1536,
}

// Get current breakpoint
export const getCurrentBreakpoint = () => {
  const width = window.innerWidth
  
  if (width < breakpoints.xs) return 'mobile'
  if (width < breakpoints.sm) return 'xs'
  if (width < breakpoints.md) return 'sm'
  if (width < breakpoints.lg) return 'md'
  if (width < breakpoints.xl) return 'lg'
  if (width < breakpoints['2xl']) return 'xl'
  return '2xl'
}

// Check if mobile
export const isMobile = () => {
  return window.innerWidth < breakpoints.md
}

// Check if tablet
export const isTablet = () => {
  const width = window.innerWidth
  return width >= breakpoints.md && width < breakpoints.lg
}

// Check if desktop
export const isDesktop = () => {
  return window.innerWidth >= breakpoints.lg
}
