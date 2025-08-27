'use client'

import React, { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { AdventureMap } from '@/components/adventure-map'
import { ProjectDetailModal } from '@/components/adventure-map/ProjectDetailModal'
import { useAdventureMapStore } from '@/store/adventure-map'
import { ProjectIsland } from '@/types/adventure-map'

export default function ProjectsPage() {
  const {
    islands,
    selectedIsland,
    isLoading,
    error,
    fetchIslands,
    setSelectedIsland,
    visitIsland,
    incrementInteraction
  } = useAdventureMapStore()
  
  const [isModalOpen, setIsModalOpen] = useState(false)

  // Fetch islands on component mount
  useEffect(() => {
    fetchIslands()
  }, [fetchIslands])

  // Handle island selection
  const handleIslandClick = (island: ProjectIsland) => {
    setSelectedIsland(island)
    setIsModalOpen(true)
    visitIsland(island.id)
    incrementInteraction()
  }

  const handleIslandHover = (island: ProjectIsland | null) => {
    // Hover logic is handled in the store via setHoveredIsland
    if (island) {
      incrementInteraction()
    }
  }

  const handleModalClose = () => {
    setIsModalOpen(false)
    // Keep the island selected for visual feedback
  }

  const handleDemoLaunch = (island: ProjectIsland) => {
    // This will be implemented in the next subtask
    console.log('Demo launch for:', island.name)
  }

  const handleGithubClick = (island: ProjectIsland) => {
    if (island.githubUrl) {
      window.open(island.githubUrl, '_blank')
      incrementInteraction()
    }
  }

  const handleLiveUrlClick = (island: ProjectIsland) => {
    if (island.liveUrl) {
      window.open(island.liveUrl, '_blank')
      incrementInteraction()
    }
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-sky-200 to-blue-400">
        <motion.div
          className="bg-white/90 backdrop-blur-sm rounded-lg p-8 shadow-lg max-w-md text-center"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
        >
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Oops! Navigation Error</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={() => fetchIslands()}
            className="px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors"
          >
            Try Again
          </button>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-200 to-blue-400">
      {/* Page Header */}
      <motion.div
        className="relative z-10 p-6"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">
            🗺️ Adventure Map
          </h1>
          <p className="text-xl text-white/90 mb-2">
            Explore my projects as islands in a vast digital ocean
          </p>
          <p className="text-lg text-white/80">
            Click on islands to discover interactive demos and technical details
          </p>
        </div>
      </motion.div>

      {/* Loading State */}
      <AnimatePresence>
        {isLoading && (
          <motion.div
            className="absolute inset-0 z-20 flex items-center justify-center bg-black/20"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-white/90 backdrop-blur-sm rounded-lg p-8 shadow-lg text-center"
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.8 }}
            >
              <div className="animate-spin text-4xl mb-4">🧭</div>
              <p className="text-gray-700 font-medium">Charting the digital seas...</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Adventure Map */}
      <div className="relative h-[calc(100vh-200px)]">
        <AdventureMap
          islands={islands}
          onIslandClick={handleIslandClick}
          onIslandHover={handleIslandHover}
          selectedIsland={selectedIsland}
          className="w-full h-full"
        />
      </div>

      {/* Project Detail Modal */}
      <ProjectDetailModal
        island={selectedIsland}
        isOpen={isModalOpen}
        onClose={handleModalClose}
        onDemoLaunch={handleDemoLaunch}
        onGithubClick={handleGithubClick}
        onLiveUrlClick={handleLiveUrlClick}
      />

      {/* Stats Footer */}
      <motion.div
        className="relative z-10 p-4 bg-black/20 backdrop-blur-sm"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <div className="max-w-4xl mx-auto flex justify-center gap-8 text-white/90">
          <div className="text-center">
            <div className="text-2xl font-bold">{islands.length}</div>
            <div className="text-sm">Islands Discovered</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold">
              {islands.filter(i => i.featured).length}
            </div>
            <div className="text-sm">Featured Projects</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold">
              {islands.filter(i => i.status === 'completed').length}
            </div>
            <div className="text-sm">Completed</div>
          </div>
        </div>
      </motion.div>
    </div>
  )
}