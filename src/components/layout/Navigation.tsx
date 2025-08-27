'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigationStore } from '@/store'
import { useResponsiveNavigation } from '@/hooks/useResponsiveNavigation'
import PortalNavigation from './PortalNavigation'

const navigationItems = [
  { id: 'home', label: 'Home', icon: '🏠', description: 'Return to homepage' },
  { id: 'about', label: 'Personal Universe', icon: '🪐', description: 'Explore skills galaxy' },
  { id: 'lab', label: 'Interactive Lab', icon: '🧪', description: 'Explore 3D experiments' },
  { id: 'adventure', label: 'Adventure Map', icon: '🗺️', description: 'Discover project islands' },
  { id: 'blog', label: 'Tech Blog', icon: '📚', description: 'Read articles and tutorials' },
  { id: 'timeline', label: 'Time Machine', icon: '⏰', description: 'Browse blog timeline' },
  { id: 'contact', label: 'Contact Portal', icon: '🚀', description: 'Get in touch' },
]

export default function Navigation() {
  const [isOpen, setIsOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const [focusedIndex, setFocusedIndex] = useState(-1)
  const { currentSection, setCurrentSection, isPortalUnlocked } = useNavigationStore()
  const { isMobile, isTablet } = useResponsiveNavigation()
  const navRef = useRef<HTMLElement>(null)
  const mobileMenuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isOpen) {
        setIsOpen(false)
        setFocusedIndex(-1)
      }
    }

    const handleClickOutside = (event: MouseEvent) => {
      if (mobileMenuRef.current && !mobileMenuRef.current.contains(event.target as Node)) {
        setIsOpen(false)
        setFocusedIndex(-1)
      }
    }

    window.addEventListener('scroll', handleScroll)
    document.addEventListener('keydown', handleKeyDown)
    document.addEventListener('mousedown', handleClickOutside)

    return () => {
      window.removeEventListener('scroll', handleScroll)
      document.removeEventListener('keydown', handleKeyDown)
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isOpen])

  const handleNavigation = (sectionId: string) => {
    setCurrentSection(sectionId)
    setIsOpen(false)
    setFocusedIndex(-1)

    // Handle special navigation cases
    if (sectionId === 'blog' || sectionId === 'timeline') {
      // Navigate to blog page
      window.location.href = '/blog'
      return
    }

    if (sectionId === 'home') {
      // Navigate to home page
      window.location.href = '/'
      return
    }

    if (sectionId === 'about') {
      // Navigate to about page
      window.location.href = '/about'
      return
    }

    if (sectionId === 'adventure') {
      // Navigate to projects page
      window.location.href = '/projects'
      return
    }

    // Smooth scroll to section for same-page navigation
    const element = document.getElementById(sectionId)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
      // Focus the section for screen readers
      element.focus()
    }
  }

  const handleKeyNavigation = (event: React.KeyboardEvent, index: number) => {
    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault()
        setFocusedIndex(Math.min(index + 1, navigationItems.length - 1))
        break
      case 'ArrowUp':
        event.preventDefault()
        setFocusedIndex(Math.max(index - 1, 0))
        break
      case 'Enter':
      case ' ':
        event.preventDefault()
        handleNavigation(navigationItems[index].id)
        break
    }
  }

  return (
    <>
      {/* Main Navigation Bar */}
      <motion.nav
        ref={navRef}
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled
          ? 'bg-black/20 backdrop-blur-md border-b border-white/10'
          : 'bg-transparent'
          }`}
        role="navigation"
        aria-label="Main navigation"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="flex items-center space-x-2"
            >
              <div className="w-8 h-8 bg-gradient-to-r from-cyber-blue to-cyber-purple rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-sm">TJ</span>
              </div>
              <span className="text-white font-semibold hidden sm:block">
                Tech Journey
              </span>
            </motion.div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8" role="menubar">
              {navigationItems.map((item, index) => (
                <motion.button
                  key={item.id}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleNavigation(item.id)}
                  onKeyDown={(e) => handleKeyNavigation(e, index)}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-cyber-blue focus:ring-offset-2 focus:ring-offset-transparent ${currentSection === item.id
                    ? 'bg-cyber-blue/20 text-cyber-blue'
                    : 'text-white/80 hover:text-white hover:bg-white/10'
                    }`}
                  aria-label={`Navigate to ${item.label}: ${item.description}`}
                  aria-current={currentSection === item.id ? 'page' : undefined}
                  role="menuitem"
                  tabIndex={0}
                >
                  <span role="img" aria-hidden="true">{item.icon}</span>
                  <span className="text-sm font-medium">{item.label}</span>
                </motion.button>
              ))}
            </div>

            {/* Mobile Menu Button */}
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsOpen(!isOpen)}
              className="md:hidden p-2 rounded-lg bg-white/10 text-white focus:outline-none focus:ring-2 focus:ring-cyber-blue focus:ring-offset-2 focus:ring-offset-transparent"
              aria-label="Toggle navigation menu"
              aria-expanded={isOpen}
              aria-controls="mobile-menu"
            >
              <div className="w-6 h-6 flex flex-col justify-center items-center">
                <motion.span
                  animate={isOpen ? { rotate: 45, y: 6 } : { rotate: 0, y: 0 }}
                  className="w-6 h-0.5 bg-current mb-1.5 origin-center transition-all"
                />
                <motion.span
                  animate={isOpen ? { opacity: 0 } : { opacity: 1 }}
                  className="w-6 h-0.5 bg-current mb-1.5 transition-all"
                />
                <motion.span
                  animate={isOpen ? { rotate: -45, y: -6 } : { rotate: 0, y: 0 }}
                  className="w-6 h-0.5 bg-current origin-center transition-all"
                />
              </div>
            </motion.button>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              ref={mobileMenuRef}
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden bg-black/30 backdrop-blur-md border-t border-white/10"
              id="mobile-menu"
              role="menu"
              aria-orientation="vertical"
            >
              <div className="px-4 py-4 space-y-2">
                {navigationItems.map((item, index) => (
                  <motion.button
                    key={item.id}
                    whileHover={{ x: 10 }}
                    onClick={() => handleNavigation(item.id)}
                    onKeyDown={(e) => handleKeyNavigation(e, index)}
                    className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-cyber-blue focus:ring-offset-2 focus:ring-offset-transparent ${currentSection === item.id
                      ? 'bg-cyber-blue/20 text-cyber-blue'
                      : 'text-white/80 hover:text-white hover:bg-white/10'
                      } ${focusedIndex === index ? 'ring-2 ring-cyber-blue' : ''}`}
                    role="menuitem"
                    tabIndex={0}
                    aria-current={currentSection === item.id ? 'page' : undefined}
                    aria-label={`Navigate to ${item.label}: ${item.description}`}
                  >
                    <span className="text-xl" role="img" aria-hidden="true">{item.icon}</span>
                    <span className="font-medium">{item.label}</span>
                  </motion.button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>

      {/* Portal Navigation (unlocked after interaction) */}
      {isPortalUnlocked && <PortalNavigation />}
    </>
  )
}