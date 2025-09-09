'use client'

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { AdventureMap } from './adventure-map/AdventureMap'
import { ProjectDetailModal } from './adventure-map/ProjectDetailModal'
import { AchievementSystem } from './adventure-map/AchievementSystem'
import { useAdventureMapStore } from '@/store/adventure-map'
import { ProjectIsland } from '@/types/adventure-map'
import NavigationBar from './layout/NavigationBar'
import { useAuth } from '@/lib/auth-context'
import { LoginModal } from './auth/LoginModal'

const ProjectsPage: React.FC = () => {
  const [showModal, setShowModal] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [showLoginModal, setShowLoginModal] = useState(false)
  
  const { isAuthenticated, user, logout } = useAuth()

  const {
    islands,
    selectedIsland,
    hoveredIsland,
    isLoading: storeLoading,
    error,
    setSelectedIsland,
    setHoveredIsland,
    fetchIslands
  } = useAdventureMapStore()

  const handleLogin = () => setShowLoginModal(true)
  const handleRegister = () => setShowLoginModal(true)

  // Initialize data on component mount
  useEffect(() => {
    const initializeData = async () => {
      try {
        await fetchIslands()
      } catch (error) {
        console.error('Failed to fetch islands:', error)
      } finally {
        setIsLoading(false)
      }
    }

    initializeData()
  }, [fetchIslands])

  const handleIslandClick = (island: ProjectIsland) => {
    setSelectedIsland(island)
    setShowModal(true)
  }

  const handleIslandHover = (island: ProjectIsland | null) => {
    setHoveredIsland(island)
  }

  const handleCloseModal = () => {
    setShowModal(false)
    setSelectedIsland(null)
  }

  const handleDemoLaunch = (island: ProjectIsland) => {
    console.log('Launching demo for:', island.name)
    // Demo launch is handled by the modal itself
  }

  const handleGithubClick = (island: ProjectIsland) => {
    if (island.githubUrl) {
      window.open(island.githubUrl, '_blank')
    }
  }

  const handleLiveUrlClick = (island: ProjectIsland) => {
    if (island.liveUrl) {
      window.open(island.liveUrl, '_blank')
    }
  }

  if (isLoading || storeLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-900 via-purple-900 to-black flex items-center justify-center">
        <div className="text-center">
          <motion.div
            className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full mx-auto mb-4"
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          />
          <motion.p
            className="text-white text-lg"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            Loading Adventure Map...
          </motion.p>
          <motion.p
            className="text-purple-300 text-sm mt-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
          >
            Preparing interactive project showcase
          </motion.p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-red-900 via-purple-900 to-black flex items-center justify-center">
        <div className="text-center max-w-md">
          <div className="text-6xl mb-4">🚨</div>
          <h2 className="text-white text-2xl font-bold mb-2">Oops! Something went wrong</h2>
          <p className="text-red-300 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="relative min-h-screen bg-gradient-to-b from-blue-900 via-purple-900 to-black overflow-hidden">
      {/* Navigation Bar */}
      <NavigationBar
        isAuthenticated={isAuthenticated}
        user={user}
        onLogin={handleLogin}
        onRegister={handleRegister}
        onLogout={logout}
      />

      {/* Page Header */}
      <motion.div
        className="relative z-10 bg-black/10 backdrop-blur-sm border-b border-white/5"
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.2 }}
      >
        <div className="container mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-white mb-2 flex items-center gap-3">
                🗺️ Adventure Map
                <span className="text-2xl text-purple-400 font-normal">Explore My Projects</span>
              </h1>
              <p className="text-purple-300 text-lg">
                Navigate through interactive islands showcasing my development journey
              </p>
            </div>

            <div className="flex items-center space-x-6">
              <div className="text-right">
                <div className="text-white font-bold text-xl">
                  {islands.length} Projects
                </div>
                <div className="text-purple-300 text-sm">
                  {islands.filter(i => i.featured).length} Featured
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Instructions Panel */}
      {/* <motion.div
        className="absolute top-32 left-6 z-10 bg-gradient-to-br from-purple-900/40 via-blue-900/40 to-black/40 backdrop-blur-md rounded-xl p-5 max-w-xs border border-purple-500/20 shadow-2xl shadow-purple-500/10"
        initial={{ x: -300, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.3 }}
      >
        <h3 className="text-white font-bold mb-3 flex items-center gap-2 text-lg">
          <span className="text-2xl">🧭</span>
          Navigation Guide
        </h3>
        <div className="space-y-3 text-sm text-gray-200">
          <div className="flex items-center gap-3 p-2 bg-blue-500/10 rounded-lg">
            <span className="text-blue-400 text-lg">🖱️</span>
            <span className="font-medium">Click islands to explore</span>
          </div>
          <div className="flex items-center gap-3 p-2 bg-green-500/10 rounded-lg">
            <span className="text-green-400 text-lg">🎮</span>
            <span className="font-medium">Try interactive demos</span>
          </div>
          <div className="flex items-center gap-3 p-2 bg-yellow-500/10 rounded-lg">
            <span className="text-yellow-400 text-lg">🏆</span>
            <span className="font-medium">Unlock achievements</span>
          </div>
          <div className="flex items-center gap-3 p-2 bg-purple-500/10 rounded-lg">
            <span className="text-purple-400 text-lg">🔍</span>
            <span className="font-medium">Drag to pan, scroll to zoom</span>
          </div>
        </div>
      </motion.div> */}

      {/* Adventure Map */}
      <motion.div
        className="absolute inset-0 pt-32"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1, delay: 0.5 }}
      >
        <AdventureMap
          islands={islands}
          onIslandClick={handleIslandClick}
          onIslandHover={handleIslandHover}
          selectedIsland={selectedIsland}
          className="w-full h-full"
        />
      </motion.div>

      {/* Project Detail Modal */}
      <ProjectDetailModal
        island={selectedIsland}
        isOpen={showModal}
        onClose={handleCloseModal}
        onDemoLaunch={handleDemoLaunch}
        onGithubClick={handleGithubClick}
        onLiveUrlClick={handleLiveUrlClick}
      />

      {/* Achievement System */}
      <AchievementSystem />

      {/* Login Modal */}
      <LoginModal
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
      />

      {/* Stats Panel */}
      <motion.div
        className="absolute bottom-6 left-6 z-10 bg-gradient-to-br from-purple-900/40 via-blue-900/40 to-black/40 backdrop-blur-md rounded-xl p-5 border border-purple-500/20 shadow-2xl shadow-purple-500/10"
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.7 }}
      >
        <h3 className="text-white font-bold mb-3 flex items-center gap-2 text-lg">
          <span className="text-2xl">📊</span>
          Portfolio Stats
        </h3>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="text-center p-3 bg-blue-500/10 rounded-lg border border-blue-500/20">
            <div className="text-2xl font-bold text-blue-400">
              {islands.length}
            </div>
            <div className="text-gray-200 font-medium">Projects</div>
          </div>
          <div className="text-center p-3 bg-green-500/10 rounded-lg border border-green-500/20">
            <div className="text-2xl font-bold text-green-400">
              {islands.filter(i => i.status === 'completed').length}
            </div>
            <div className="text-gray-200 font-medium">Completed</div>
          </div>
          <div className="text-center p-3 bg-purple-500/10 rounded-lg border border-purple-500/20">
            <div className="text-2xl font-bold text-purple-400">
              {new Set(islands.flatMap(i => i.techStack.map(t => t.name))).size}
            </div>
            <div className="text-gray-200 font-medium">Technologies</div>
          </div>
          <div className="text-center p-3 bg-yellow-500/10 rounded-lg border border-yellow-500/20">
            <div className="text-2xl font-bold text-yellow-400">
              {islands.filter(i => i.demoConfig).length}
            </div>
            <div className="text-gray-200 font-medium">Demos</div>
          </div>
        </div>
      </motion.div>

      {/* Floating particles background effect */}
      <div className="absolute inset-0 pointer-events-none">
        {Array.from({ length: 20 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-white/20 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -20, 0],
              opacity: [0.2, 0.8, 0.2],
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>
    </div>
  )
}

export default ProjectsPage