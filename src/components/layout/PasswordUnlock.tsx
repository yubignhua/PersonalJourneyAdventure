'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigationStore } from '@/store'
import { useFocusTrap } from '@/hooks/useFocusTrap'

const skillKeywords = [
  'react', 'typescript', 'nextjs', 'threejs', 'webgl',
  'nodejs', 'express', 'mongodb', 'redis', 'websocket',
  'framer-motion', 'd3js', 'tailwind', 'zustand'
]

interface PasswordUnlockProps {
  onUnlock: () => void
  isVisible: boolean
}

export default function PasswordUnlock({ onUnlock, isVisible }: PasswordUnlockProps) {
  const [input, setInput] = useState('')
  const [attempts, setAttempts] = useState(0)
  const [isUnlocked, setIsUnlocked] = useState(false)
  const [hint, setHint] = useState('')
  const { unlockPortal } = useNavigationStore()
  const focusTrapRef = useFocusTrap({ 
    isActive: isVisible && !isUnlocked,
    initialFocus: '#password-input'
  })

  useEffect(() => {
    if (attempts > 0 && attempts % 3 === 0) {
      const randomHint = skillKeywords[Math.floor(Math.random() * skillKeywords.length)]
      setHint(`Hint: Try "${randomHint}"`)
    }
  }, [attempts])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    const normalizedInput = input.toLowerCase().trim()
    
    if (skillKeywords.includes(normalizedInput)) {
      setIsUnlocked(true)
      unlockPortal()
      setTimeout(() => {
        onUnlock()
      }, 1500)
    } else {
      setAttempts(prev => prev + 1)
      setInput('')
      
      // Shake animation for wrong password
      const inputElement = document.getElementById('password-input')
      if (inputElement) {
        inputElement.classList.add('animate-shake')
        setTimeout(() => {
          inputElement.classList.remove('animate-shake')
        }, 500)
      }
    }
  }

  if (!isVisible) return null

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      >
        <motion.div
          ref={focusTrapRef}
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.8, opacity: 0 }}
          className="bg-gradient-to-br from-gray-900/90 to-purple-900/90 backdrop-blur-md border border-white/20 rounded-2xl p-8 max-w-md w-full"
          role="dialog"
          aria-modal="true"
          aria-labelledby="unlock-title"
          aria-describedby="unlock-description"
        >
          {!isUnlocked ? (
            <>
              <div className="text-center mb-6">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                  className="text-6xl mb-4"
                >
                  🔐
                </motion.div>
                <h2 id="unlock-title" className="text-2xl font-bold text-white mb-2">
                  Access Portal
                </h2>
                <p id="unlock-description" className="text-gray-300 text-sm">
                  Enter a skill keyword to unlock the navigation portal
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label htmlFor="password-input" className="sr-only">
                    Enter skill keyword
                  </label>
                  <input
                    id="password-input"
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Enter a tech skill..."
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyber-blue focus:border-transparent"
                    autoComplete="off"
                    autoFocus
                  />
                </div>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  className="w-full py-3 bg-gradient-to-r from-cyber-blue to-cyber-purple text-white font-semibold rounded-lg hover:shadow-lg hover:shadow-cyber-blue/25 transition-all duration-300"
                >
                  Unlock Portal
                </motion.button>
              </form>

              {attempts > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-4 text-center"
                >
                  <p className="text-red-400 text-sm">
                    Access denied. Attempts: {attempts}
                  </p>
                  {hint && (
                    <p className="text-yellow-400 text-sm mt-1">
                      {hint}
                    </p>
                  )}
                </motion.div>
              )}

              <div className="mt-6 text-center">
                <p className="text-gray-400 text-xs">
                  Hint: Think about modern web technologies
                </p>
              </div>
            </>
          ) : (
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              className="text-center"
            >
              <motion.div
                animate={{ 
                  scale: [1, 1.2, 1],
                  rotate: [0, 360, 0]
                }}
                transition={{ duration: 1.5 }}
                className="text-6xl mb-4"
              >
                🌀
              </motion.div>
              <h2 className="text-2xl font-bold text-green-400 mb-2">
                Portal Unlocked!
              </h2>
              <p className="text-gray-300">
                Welcome to the navigation portal
              </p>
              
              {/* Success particles */}
              <div className="absolute inset-0 overflow-hidden pointer-events-none">
                {Array.from({ length: 20 }).map((_, i) => (
                  <motion.div
                    key={i}
                    initial={{ 
                      x: '50%', 
                      y: '50%', 
                      scale: 0,
                      opacity: 1 
                    }}
                    animate={{ 
                      x: `${Math.random() * 100}%`,
                      y: `${Math.random() * 100}%`,
                      scale: [0, 1, 0],
                      opacity: [1, 1, 0]
                    }}
                    transition={{ 
                      duration: 2,
                      delay: i * 0.1,
                      ease: 'easeOut'
                    }}
                    className="absolute w-2 h-2 bg-cyber-blue rounded-full"
                  />
                ))}
              </div>
            </motion.div>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}