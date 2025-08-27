'use client'

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ProjectDetailModalProps, DemoInteractionResult } from '@/types/adventure-map'
import { InteractiveDemo } from './InteractiveDemo'
import { useAdventureMapStore } from '@/store/adventure-map'

export const ProjectDetailModal: React.FC<ProjectDetailModalProps> = ({
  island,
  isOpen,
  onClose,
  onDemoLaunch,
  onGithubClick,
  onLiveUrlClick
}) => {
  const [showInteractiveDemo, setShowInteractiveDemo] = useState(false)
  const { visitIsland } = useAdventureMapStore()

  // Track island visit when modal opens
  React.useEffect(() => {
    if (isOpen && island) {
      visitIsland(island.id)
    }
  }, [isOpen, island, visitIsland])

  if (!island) return null

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose()
    }
  }

  const getStatusColor = () => {
    switch (island.status) {
      case 'completed': return 'bg-green-500'
      case 'in-development': return 'bg-yellow-500'
      case 'planning': return 'bg-gray-500'
      case 'maintained': return 'bg-blue-500'
      case 'archived': return 'bg-gray-400'
      default: return 'bg-gray-500'
    }
  }

  const getStatusText = () => {
    switch (island.status) {
      case 'completed': return 'Completed'
      case 'in-development': return 'In Development'
      case 'planning': return 'Planning'
      case 'maintained': return 'Maintained'
      case 'archived': return 'Archived'
      default: return 'Unknown'
    }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={handleBackdropClick}
        >
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
          
          {/* Modal Content */}
          <motion.div
            className="relative bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden"
            initial={{ scale: 0.8, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.8, opacity: 0, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          >
            {/* Header */}
            <div className="relative bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6">
              <button
                onClick={onClose}
                className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full bg-white/20 hover:bg-white/30 transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
              
              <div className="flex items-start gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h2 className="text-3xl font-bold">{island.name}</h2>
                    {island.featured && (
                      <span className="text-yellow-300 text-2xl">⭐</span>
                    )}
                  </div>
                  
                  <div className="flex items-center gap-2 mb-3">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor()} text-white`}>
                      {getStatusText()}
                    </span>
                    <span className="px-3 py-1 rounded-full text-sm font-medium bg-white/20 text-white">
                      {island.category}
                    </span>
                  </div>
                  
                  <p className="text-white/90 text-lg leading-relaxed">
                    {island.description}
                  </p>
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="p-6 overflow-y-auto max-h-[60vh]">
              {/* Tech Stack */}
              <div className="mb-8">
                <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
                  <span className="text-2xl">🛠️</span>
                  Technology Stack
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                  {island.techStack.map((tech) => (
                    <motion.div
                      key={tech.name}
                      className="bg-gray-50 rounded-lg p-3 text-center border border-gray-200 hover:border-blue-300 transition-colors"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <div 
                        className="w-4 h-4 rounded-full mx-auto mb-2"
                        style={{ backgroundColor: tech.color || '#6B7280' }}
                      />
                      <div className="font-medium text-gray-800 text-sm">{tech.name}</div>
                      <div className="text-xs text-gray-500 capitalize">{tech.category}</div>
                      <div className="text-xs text-gray-400 capitalize">{tech.proficiency}</div>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Project Metrics */}
              {island.metrics && (
                <div className="mb-8">
                  <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
                    <span className="text-2xl">📊</span>
                    Project Metrics
                  </h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="bg-blue-50 rounded-lg p-4 text-center">
                      <div className="text-2xl font-bold text-blue-600">{island.metrics.githubStars}</div>
                      <div className="text-sm text-gray-600">GitHub Stars</div>
                    </div>
                    <div className="bg-green-50 rounded-lg p-4 text-center">
                      <div className="text-2xl font-bold text-green-600">{island.metrics.githubForks}</div>
                      <div className="text-sm text-gray-600">Forks</div>
                    </div>
                    <div className="bg-purple-50 rounded-lg p-4 text-center">
                      <div className="text-2xl font-bold text-purple-600">{island.metrics.commits}</div>
                      <div className="text-sm text-gray-600">Commits</div>
                    </div>
                    <div className="bg-orange-50 rounded-lg p-4 text-center">
                      <div className="text-2xl font-bold text-orange-600">{island.metrics.performanceScore}</div>
                      <div className="text-sm text-gray-600">Performance</div>
                    </div>
                  </div>
                </div>
              )}

              {/* Achievements */}
              {island.achievements && island.achievements.length > 0 && (
                <div className="mb-8">
                  <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
                    <span className="text-2xl">🏆</span>
                    Achievements
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {island.achievements.map((achievement) => (
                      <motion.div
                        key={achievement.id}
                        className={`p-4 rounded-lg border-2 ${
                          achievement.unlocked 
                            ? 'bg-yellow-50 border-yellow-300' 
                            : 'bg-gray-50 border-gray-200'
                        }`}
                        whileHover={{ scale: 1.02 }}
                      >
                        <div className="flex items-center gap-3">
                          <span className="text-2xl">{achievement.icon}</span>
                          <div className="flex-1">
                            <div className="font-medium text-gray-800">{achievement.name}</div>
                            <div className="text-sm text-gray-600">{achievement.description}</div>
                            <div className="text-xs text-gray-500 mt-1">
                              {achievement.points} points • {achievement.rarity}
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Footer Actions */}
            <div className="border-t border-gray-200 p-6 bg-gray-50">
              <div className="flex flex-wrap gap-3 justify-center">
                {island.githubUrl && (
                  <motion.button
                    onClick={() => onGithubClick?.(island)}
                    className="px-6 py-3 bg-gray-800 hover:bg-gray-900 text-white rounded-lg font-medium transition-colors flex items-center gap-2"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                    </svg>
                    View Code
                  </motion.button>
                )}
                
                {island.liveUrl && (
                  <motion.button
                    onClick={() => onLiveUrlClick?.(island)}
                    className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors flex items-center gap-2"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                    Live Demo
                  </motion.button>
                )}
                
                {island.demoConfig && (
                  <motion.button
                    onClick={() => {
                      setShowInteractiveDemo(true)
                      onDemoLaunch?.(island)
                    }}
                    className="px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors flex items-center gap-2"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1m4 0h1m-6 4h8m-9-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Interactive Demo
                  </motion.button>
                )}
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}

      {/* Interactive Demo Modal */}
      <AnimatePresence>
        {showInteractiveDemo && island && (
          <InteractiveDemo
            island={island}
            onClose={() => setShowInteractiveDemo(false)}
            onComplete={(result: DemoInteractionResult) => {
              console.log('Demo completed:', result)
              setShowInteractiveDemo(false)
            }}
          />
        )}
      </AnimatePresence>
    </AnimatePresence>
  )
}