import * as React from "react"

const MOBILE_BREAKPOINT = 768

export function useIsMobile() {
  const [isMobile, setIsMobile] = React.useState<boolean | undefined>(undefined)

  React.useEffect(() => {
    const checkMobile = () => {
      // Check for iOS devices specifically
      const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent)
      const isAndroid = /Android/.test(navigator.userAgent)
      const isMobileDevice = isIOS || isAndroid
      
      // Use touch capability as backup
      const hasTouchScreen = 'ontouchstart' in window || navigator.maxTouchPoints > 0
      
      // Combine width check with device detection
      const isSmallScreen = window.innerWidth < MOBILE_BREAKPOINT
      
      return isMobileDevice || hasTouchScreen || isSmallScreen
    }
    
    const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`)
    const onChange = () => {
      setIsMobile(checkMobile())
    }
    
    mql.addEventListener("change", onChange)
    setIsMobile(checkMobile())
    return () => mql.removeEventListener("change", onChange)
  }, [])

  return !!isMobile
}
