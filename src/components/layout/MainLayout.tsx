'use client'

import { useEffect, useState } from 'react'
import { useThemeStore, usePerformanceStore, useNavigationStore } from '@/store'
import { performanceMonitor } from '@/lib/performance'
import Navigation from './Navigation'
import ThemeToggle from './ThemeToggle'
import PasswordUnlock from './PasswordUnlock'
import SkipNavigation from './SkipNavigation'
import AccessibilityAnnouncer from './AccessibilityAnnouncer'

interface MainLayoutProps {
  children: React.ReactNode
}

export default function MainLayout({ children }: MainLayoutProps) {
  const { theme } = useThemeStore()
  const { setPerformanceLevel, toggle3D } = usePerformanceStore()
  const { isPortalUnlocked } = useNavigationStore()
  const [showPasswordUnlock, setShowPasswordUnlock] = useState(false)
  const [hasInteracted, setHasInteracted] = useState(false)

  useEffect(() => {
    // Initialize performance monitoring
    performanceMonitor.startMonitoring()
    
    // Check device capabilities and adjust settings
    const capabilities = performanceMonitor.getDeviceCapabilities()
    
    if (capabilities.isMobile || !capabilities.hasWebGL) {
      toggle3D()
      setPerformanceLevel('low')
    } else if (capabilities.performanceLevel === 'low') {
      setPerformanceLevel('low')
    }

    // Apply theme to document
    document.documentElement.classList.toggle('dark', theme === 'dark')
    
    // Show password unlock after user interaction
    const handleFirstInteraction = () => {
      if (!hasInteracted && !isPortalUnlocked) {
        setHasInteracted(true)
        setTimeout(() => {
          setShowPasswordUnlock(true)
        }, 2000) // Show after 2 seconds of first interaction
      }
    }

    // Listen for various interaction events
    const events = ['click', 'scroll', 'keydown', 'mousemove']
    events.forEach(event => {
      document.addEventListener(event, handleFirstInteraction, { once: true })
    })
    
    return () => {
      performanceMonitor.stopMonitoring()
      events.forEach(event => {
        document.removeEventListener(event, handleFirstInteraction)
      })
    }
  }, [theme, setPerformanceLevel, toggle3D, hasInteracted, isPortalUnlocked])

  const handleUnlockComplete = () => {
    setShowPasswordUnlock(false)
  }

  return (
    <div className={`min-h-screen transition-colors duration-300 ${
      theme === 'dark' 
        ? 'bg-gradient-to-br from-gray-900 via-purple-900 to-violet-900' 
        : 'bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50'
    }`}>
      <SkipNavigation />
      <AccessibilityAnnouncer />
      <Navigation />
      <ThemeToggle />
      <main id="main-content" className="relative z-10" tabIndex={-1}>
        {children}
      </main>
      
      {/* Background particles effect */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-t from-transparent via-transparent to-black/5" />
        {Array.from({ length: 50 }).map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-cyber-blue rounded-full animate-particle-float opacity-20"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 6}s`,
              animationDuration: `${4 + Math.random() * 4}s`,
            }}
          />
        ))}
      </div>

      {/* Password Unlock Modal */}
      <PasswordUnlock 
        isVisible={showPasswordUnlock && !isPortalUnlocked}
        onUnlock={handleUnlockComplete}
      />
    </div>
  )
}