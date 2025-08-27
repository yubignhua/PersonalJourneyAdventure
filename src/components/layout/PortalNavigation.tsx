'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigationStore } from '@/store'

interface PortalItem {
  id: string
  label: string
  icon: string
  description: string
  unlocked: boolean
  requiredSkills?: string[]
}

const portalItems: PortalItem[] = [
  {
    id: 'universe',
    label: 'Personal Universe',
    icon: '🌌',
    description: 'Explore the galaxy of skills and experience',
    unlocked: true,
  },
  {
    id: 'lab',
    label: 'Interactive Lab',
    icon: '🧪',
    description: 'Experiment with 3D interactions and animations',
    unlocked: true,
  },
  {
    id: 'codex',
    label: 'Developer Codex',
    icon: '📚',
    description: 'Advanced technical documentation and guides',
    unlocked: false,
    requiredSkills: ['react', 'typescript', 'threejs'],
  },
  {
    id: 'quantum',
    label: 'Quantum Workshop',
    icon: '⚛️',
    description: 'Experimental features and cutting-edge demos',
    unlocked: false,
    requiredSkills: ['webgl', 'shaders', 'performance'],
  },
]

export default function PortalNavigation() {
  const [isOpen, setIsOpen] = useState(false)
  const [hoveredItem, setHoveredItem] = useState<string | null>(null)
  const { setCurrentSection } = useNavigationStore()

  const handlePortalNavigation = (itemId: string, unlocked: boolean) => {
    if (!unlocked) {
      // Show unlock hint
      return
    }
    
    setCurrentSection(itemId)
    setIsOpen(false)
    
    // Navigate to section with portal effect
    const element = document.getElementById(itemId)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <>
      {/* Portal Activation Button */}
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-8 right-8 z-50 w-16 h-16 bg-gradient-to-r from-cyber-blue to-cyber-purple rounded-full flex items-center justify-center shadow-lg shadow-cyber-blue/25"
        aria-label="Open portal navigation"
      >
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.3 }}
          className="text-2xl"
        >
          🌀
        </motion.div>
        
        {/* Pulsing ring effect */}
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.5, 0, 0.5],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          className="absolute inset-0 rounded-full border-2 border-cyber-blue"
        />
      </motion.button>

      {/* Portal Navigation Menu */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
            />

            {/* Portal Grid */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ type: 'spring', damping: 20, stiffness: 300 }}
              className="fixed inset-0 flex items-center justify-center z-50 p-8"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl w-full">
                {portalItems.map((item, index) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    onHoverStart={() => setHoveredItem(item.id)}
                    onHoverEnd={() => setHoveredItem(null)}
                    onClick={() => handlePortalNavigation(item.id, item.unlocked)}
                    className={`relative p-6 rounded-2xl border backdrop-blur-md cursor-pointer transition-all duration-300 ${
                      item.unlocked
                        ? 'bg-white/10 border-white/20 hover:bg-white/20 hover:border-cyber-blue/50'
                        : 'bg-gray-500/10 border-gray-500/20 cursor-not-allowed opacity-60'
                    }`}
                    role="button"
                    tabIndex={0}
                    aria-label={`Navigate to ${item.label}${!item.unlocked ? ' (locked)' : ''}`}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        handlePortalNavigation(item.id, item.unlocked)
                      }
                    }}
                  >
                    {/* Portal effect background */}
                    <AnimatePresence>
                      {hoveredItem === item.id && item.unlocked && (
                        <motion.div
                          initial={{ opacity: 0, scale: 0 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0 }}
                          className="absolute inset-0 bg-gradient-to-r from-cyber-blue/20 to-cyber-purple/20 rounded-2xl"
                        />
                      )}
                    </AnimatePresence>

                    <div className="relative z-10">
                      {/* Icon and lock indicator */}
                      <div className="flex items-center justify-between mb-4">
                        <motion.div
                          animate={{
                            rotate: hoveredItem === item.id ? 360 : 0,
                          }}
                          transition={{ duration: 0.5 }}
                          className="text-4xl"
                        >
                          {item.icon}
                        </motion.div>
                        
                        {!item.unlocked && (
                          <div className="text-gray-400">
                            🔒
                          </div>
                        )}
                      </div>

                      {/* Content */}
                      <h3 className="text-xl font-bold text-white mb-2">
                        {item.label}
                      </h3>
                      <p className="text-gray-300 text-sm mb-4">
                        {item.description}
                      </p>

                      {/* Required skills for locked items */}
                      {!item.unlocked && item.requiredSkills && (
                        <div className="mt-4">
                          <p className="text-xs text-gray-400 mb-2">
                            Required skills to unlock:
                          </p>
                          <div className="flex flex-wrap gap-1">
                            {item.requiredSkills.map((skill) => (
                              <span
                                key={skill}
                                className="px-2 py-1 bg-gray-600/30 text-gray-300 text-xs rounded-full"
                              >
                                {skill}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Portal energy effect for unlocked items */}
                      {item.unlocked && (
                        <motion.div
                          animate={{
                            opacity: [0.3, 0.7, 0.3],
                          }}
                          transition={{
                            duration: 2,
                            repeat: Infinity,
                            ease: 'easeInOut',
                          }}
                          className="absolute bottom-2 right-2 w-3 h-3 bg-cyber-blue rounded-full shadow-lg shadow-cyber-blue/50"
                        />
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}