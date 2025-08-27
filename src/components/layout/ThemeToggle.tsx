'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useThemeStore } from '@/store'

interface Particle {
  id: number
  x: number
  y: number
  vx: number
  vy: number
  color: string
  size: number
}

export default function ThemeToggle() {
  const { theme, toggleTheme } = useThemeStore()
  const [particles, setParticles] = useState<Particle[]>([])
  const [isAnimating, setIsAnimating] = useState(false)

  const createParticleExplosion = (event: React.MouseEvent) => {
    const rect = event.currentTarget.getBoundingClientRect()
    const centerX = rect.left + rect.width / 2
    const centerY = rect.top + rect.height / 2

    const newParticles: Particle[] = Array.from({ length: 20 }, (_, i) => ({
      id: Date.now() + i,
      x: centerX,
      y: centerY,
      vx: (Math.random() - 0.5) * 400,
      vy: (Math.random() - 0.5) * 400,
      color: theme === 'dark' ? '#fbbf24' : '#6366f1',
      size: Math.random() * 4 + 2,
    }))

    setParticles(newParticles)
    setIsAnimating(true)

    // Clear particles after animation
    setTimeout(() => {
      setParticles([])
      setIsAnimating(false)
    }, 1000)
  }

  const handleToggle = (event: React.MouseEvent) => {
    createParticleExplosion(event)
    setTimeout(() => {
      toggleTheme()
    }, 150)
  }

  return (
    <>
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={handleToggle}
        className={`fixed top-4 right-4 z-50 p-3 rounded-full backdrop-blur-md border transition-all duration-300 ${
          theme === 'dark'
            ? 'bg-white/10 border-white/20 text-yellow-400 hover:bg-white/20'
            : 'bg-black/10 border-black/20 text-purple-600 hover:bg-black/20'
        }`}
        aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} theme`}
        role="switch"
        aria-checked={theme === 'dark'}
      >
        <motion.div
          animate={{ rotate: theme === 'dark' ? 0 : 180 }}
          transition={{ duration: 0.5, ease: 'easeInOut' }}
          className="w-6 h-6 flex items-center justify-center"
        >
          {theme === 'dark' ? (
            <svg
              className="w-5 h-5"
              fill="currentColor"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z"
                clipRule="evenodd"
              />
            </svg>
          ) : (
            <svg
              className="w-5 h-5"
              fill="currentColor"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
            </svg>
          )}
        </motion.div>
      </motion.button>

      {/* Particle explosion effect */}
      <AnimatePresence>
        {isAnimating && (
          <div className="fixed inset-0 pointer-events-none z-40">
            {particles.map((particle) => (
              <motion.div
                key={particle.id}
                initial={{
                  x: particle.x,
                  y: particle.y,
                  scale: 1,
                  opacity: 1,
                }}
                animate={{
                  x: particle.x + particle.vx,
                  y: particle.y + particle.vy,
                  scale: 0,
                  opacity: 0,
                }}
                transition={{
                  duration: 1,
                  ease: 'easeOut',
                }}
                className="absolute rounded-full"
                style={{
                  width: particle.size,
                  height: particle.size,
                  backgroundColor: particle.color,
                  boxShadow: `0 0 ${particle.size * 2}px ${particle.color}`,
                }}
              />
            ))}
          </div>
        )}
      </AnimatePresence>
    </>
  )
}