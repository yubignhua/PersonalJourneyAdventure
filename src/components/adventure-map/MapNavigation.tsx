'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { MapControls, MapViewport, ProjectIsland } from '@/types/adventure-map'

interface MapNavigationProps {
  controls: MapControls
  viewport: MapViewport
  islands: ProjectIsland[]
  selectedIsland?: ProjectIsland | null
  className?: string
}

export const MapNavigation: React.FC<MapNavigationProps> = ({
  controls,
  viewport,
  islands,
  selectedIsland,
  className = ''
}) => {
  const zoomPercentage = Math.round(viewport.zoom * 100)
  
  const handleZoomIn = () => {
    controls.zoom(1.2)
  }
  
  const handleZoomOut = () => {
    controls.zoom(0.8)
  }
  
  const handleReset = () => {
    controls.resetView()
  }
  
  const handleFitToContent = () => {
    controls.fitToContent()
  }
  
  const handleIslandSelect = (island: ProjectIsland) => {
    controls.zoomToIsland(island)
  }

  return (
    <div className={`flex flex-col gap-2 ${className}`}>
      {/* Zoom Controls */}
      <motion.div 
        className="bg-white/90 backdrop-blur-sm rounded-lg p-2 shadow-lg"
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="flex flex-col gap-1">
          <button
            onClick={handleZoomIn}
            className="w-10 h-10 flex items-center justify-center bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors"
            title="Zoom In"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
          </button>
          
          <div className="px-2 py-1 text-xs text-center text-gray-700 font-medium">
            {zoomPercentage}%
          </div>
          
          <button
            onClick={handleZoomOut}
            className="w-10 h-10 flex items-center justify-center bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors"
            title="Zoom Out"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 12H6" />
            </svg>
          </button>
        </div>
      </motion.div>
      
      {/* View Controls */}
      <motion.div 
        className="bg-white/90 backdrop-blur-sm rounded-lg p-2 shadow-lg"
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.3, delay: 0.1 }}
      >
        <div className="flex flex-col gap-1">
          <button
            onClick={handleFitToContent}
            className="w-10 h-10 flex items-center justify-center bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors"
            title="Fit to Content"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
            </svg>
          </button>
          
          <button
            onClick={handleReset}
            className="w-10 h-10 flex items-center justify-center bg-gray-500 hover:bg-gray-600 text-white rounded-lg transition-colors"
            title="Reset View"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
            </svg>
          </button>
        </div>
      </motion.div>
      
      {/* Island Quick Navigation */}
      {islands.length > 0 && (
        <motion.div 
          className="bg-white/90 backdrop-blur-sm rounded-lg p-3 shadow-lg max-w-xs"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
        >
          <h3 className="text-sm font-semibold text-gray-800 mb-2">Quick Navigation</h3>
          <div className="max-h-48 overflow-y-auto">
            {islands
              .filter(island => island.featured)
              .concat(islands.filter(island => !island.featured))
              .map((island) => (
                <button
                  key={island.id}
                  onClick={() => handleIslandSelect(island)}
                  className={`w-full text-left p-2 rounded-lg text-xs transition-colors mb-1 ${
                    selectedIsland?.id === island.id
                      ? 'bg-blue-100 text-blue-800'
                      : 'hover:bg-gray-100 text-gray-700'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    {island.featured && (
                      <span className="text-yellow-500">⭐</span>
                    )}
                    <span className="font-medium truncate">{island.name}</span>
                  </div>
                  <div className="flex items-center gap-1 mt-1">
                    <span 
                      className={`w-2 h-2 rounded-full ${
                        island.status === 'completed' ? 'bg-green-500' :
                        island.status === 'in-development' ? 'bg-yellow-500' :
                        island.status === 'maintained' ? 'bg-blue-500' :
                        'bg-gray-400'
                      }`}
                    />
                    <span className="text-gray-500 capitalize">{island.status}</span>
                  </div>
                </button>
              ))}
          </div>
        </motion.div>
      )}
      
      {/* Legend */}
      <motion.div 
        className="bg-white/90 backdrop-blur-sm rounded-lg p-3 shadow-lg"
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.3, delay: 0.3 }}
      >
        <h3 className="text-sm font-semibold text-gray-800 mb-2">Legend</h3>
        <div className="space-y-1 text-xs">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-green-500"></div>
            <span className="text-gray-700">Completed</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
            <span className="text-gray-700">In Development</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-blue-500"></div>
            <span className="text-gray-700">Maintained</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-yellow-500">⭐</span>
            <span className="text-gray-700">Featured Project</span>
          </div>
        </div>
      </motion.div>
      
      {/* Keyboard Shortcuts */}
      <motion.div 
        className="bg-white/90 backdrop-blur-sm rounded-lg p-3 shadow-lg"
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.3, delay: 0.4 }}
      >
        <h3 className="text-sm font-semibold text-gray-800 mb-2">Controls</h3>
        <div className="space-y-1 text-xs text-gray-600">
          <div>🖱️ Drag to pan</div>
          <div>🔍 Scroll to zoom</div>
          <div>🖱️ Click island to select</div>
          <div>👆 Hover for details</div>
        </div>
      </motion.div>
    </div>
  )
}