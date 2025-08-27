'use client'

import React, { useState, useRef, useCallback, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ProjectIsland, MapViewport, MapControls, AdventureMapProps } from '@/types/adventure-map'
import { ProjectIslandComponent } from './ProjectIslandComponent'
import { MapNavigation } from './MapNavigation'
import { useAdventureMapStore } from '@/store/adventure-map'

const INITIAL_VIEWPORT: MapViewport = {
  x: 0,
  y: 0,
  zoom: 1,
  width: 1200,
  height: 800
}

const MIN_ZOOM = 0.5
const MAX_ZOOM = 3

export const AdventureMap: React.FC<AdventureMapProps> = ({
  islands,
  onIslandClick,
  onIslandHover,
  selectedIsland,
  className = ''
}) => {
  const [viewport, setViewport] = useState<MapViewport>(INITIAL_VIEWPORT)
  const [isDragging, setIsDragging] = useState(false)
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 })
  const [hoveredIsland, setHoveredIsland] = useState<ProjectIsland | null>(null)
  
  const mapRef = useRef<SVGSVGElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  
  const { setSelectedIsland, setHoveredIsland: setStoreHoveredIsland } = useAdventureMapStore()

  // Update container size on mount and resize
  useEffect(() => {
    const updateSize = () => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect()
        setViewport(prev => ({
          ...prev,
          width: rect.width,
          height: rect.height
        }))
      }
    }

    updateSize()
    window.addEventListener('resize', updateSize)
    return () => window.removeEventListener('resize', updateSize)
  }, [])

  // Map controls
  const mapControls: MapControls = {
    pan: useCallback((deltaX: number, deltaY: number) => {
      setViewport(prev => ({
        ...prev,
        x: prev.x + deltaX,
        y: prev.y + deltaY
      }))
    }, []),

    zoom: useCallback((factor: number, centerX?: number, centerY?: number) => {
      setViewport(prev => {
        const newZoom = Math.max(MIN_ZOOM, Math.min(MAX_ZOOM, prev.zoom * factor))
        
        if (centerX !== undefined && centerY !== undefined) {
          // Zoom towards a specific point
          const zoomFactor = newZoom / prev.zoom
          const newX = centerX - (centerX - prev.x) * zoomFactor
          const newY = centerY - (centerY - prev.y) * zoomFactor
          
          return {
            ...prev,
            x: newX,
            y: newY,
            zoom: newZoom
          }
        }
        
        return { ...prev, zoom: newZoom }
      })
    }, []),

    zoomToIsland: useCallback((island: ProjectIsland) => {
      const targetX = -island.position.x * 100 + viewport.width / 2
      const targetY = -island.position.y * 100 + viewport.height / 2
      const targetZoom = island.position.size === 'large' ? 1.5 : island.position.size === 'medium' ? 1.8 : 2.2
      
      setViewport(prev => ({
        ...prev,
        x: targetX,
        y: targetY,
        zoom: targetZoom
      }))
    }, [viewport.width, viewport.height]),

    resetView: useCallback(() => {
      setViewport(INITIAL_VIEWPORT)
    }, []),

    fitToContent: useCallback(() => {
      if (islands.length === 0) return
      
      const padding = 100
      const minX = Math.min(...islands.map(i => i.position.x)) * 100 - padding
      const maxX = Math.max(...islands.map(i => i.position.x)) * 100 + padding
      const minY = Math.min(...islands.map(i => i.position.y)) * 100 - padding
      const maxY = Math.max(...islands.map(i => i.position.y)) * 100 + padding
      
      const contentWidth = maxX - minX
      const contentHeight = maxY - minY
      
      const scaleX = viewport.width / contentWidth
      const scaleY = viewport.height / contentHeight
      const scale = Math.min(scaleX, scaleY, MAX_ZOOM)
      
      const centerX = (minX + maxX) / 2
      const centerY = (minY + maxY) / 2
      
      setViewport(prev => ({
        ...prev,
        x: viewport.width / 2 - centerX * scale,
        y: viewport.height / 2 - centerY * scale,
        zoom: scale
      }))
    }, [islands, viewport.width, viewport.height])
  }

  // Mouse event handlers
  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (e.button === 0) { // Left mouse button
      setIsDragging(true)
      setDragStart({ x: e.clientX - viewport.x, y: e.clientY - viewport.y })
    }
  }, [viewport.x, viewport.y])

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (isDragging) {
      const newX = e.clientX - dragStart.x
      const newY = e.clientY - dragStart.y
      setViewport(prev => ({ ...prev, x: newX, y: newY }))
    }
  }, [isDragging, dragStart])

  const handleMouseUp = useCallback(() => {
    setIsDragging(false)
  }, [])

  const handleWheel = useCallback((e: React.WheelEvent) => {
    e.preventDefault()
    const rect = containerRef.current?.getBoundingClientRect()
    if (!rect) return
    
    const centerX = e.clientX - rect.left
    const centerY = e.clientY - rect.top
    const factor = e.deltaY > 0 ? 0.9 : 1.1
    
    mapControls.zoom(factor, centerX, centerY)
  }, [mapControls])

  // Island interaction handlers
  const handleIslandClick = useCallback((island: ProjectIsland) => {
    setSelectedIsland(island)
    onIslandClick(island)
    mapControls.zoomToIsland(island)
  }, [onIslandClick, mapControls, setSelectedIsland])

  const handleIslandHover = useCallback((island: ProjectIsland | null) => {
    setHoveredIsland(island)
    setStoreHoveredIsland(island)
    onIslandHover(island)
  }, [onIslandHover, setStoreHoveredIsland])

  // Generate ocean background pattern
  const oceanPattern = (
    <defs>
      <pattern id="ocean-waves" x="0" y="0" width="100" height="100" patternUnits="userSpaceOnUse">
        <rect width="100" height="100" fill="#0066cc" />
        <path
          d="M0,50 Q25,30 50,50 T100,50 V100 H0 Z"
          fill="#004499"
          opacity="0.3"
        />
        <path
          d="M0,60 Q25,40 50,60 T100,60 V100 H0 Z"
          fill="#0055aa"
          opacity="0.2"
        />
      </pattern>
      
      <filter id="island-glow">
        <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
        <feMerge> 
          <feMergeNode in="coloredBlur"/>
          <feMergeNode in="SourceGraphic"/>
        </feMerge>
      </filter>
    </defs>
  )

  return (
    <div 
      ref={containerRef}
      className={`relative w-full h-full overflow-hidden bg-gradient-to-b from-sky-200 to-blue-400 ${className}`}
      style={{ cursor: isDragging ? 'grabbing' : 'grab' }}
    >
      {/* Map Navigation Controls */}
      <MapNavigation 
        controls={mapControls}
        viewport={viewport}
        islands={islands}
        selectedIsland={selectedIsland}
        className="absolute top-4 right-4 z-10"
      />
      
      {/* SVG Map */}
      <motion.svg
        ref={mapRef}
        width={viewport.width}
        height={viewport.height}
        className="absolute inset-0"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onWheel={handleWheel}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        {oceanPattern}
        
        {/* Ocean Background */}
        <rect 
          width="100%" 
          height="100%" 
          fill="url(#ocean-waves)"
        />
        
        {/* Map Content Group */}
        <g
          transform={`translate(${viewport.x}, ${viewport.y}) scale(${viewport.zoom})`}
        >
          {/* Islands */}
          <AnimatePresence>
            {islands.map((island) => (
              <ProjectIslandComponent
                key={island.id}
                island={island}
                onClick={handleIslandClick}
                onHover={handleIslandHover}
                isSelected={selectedIsland?.id === island.id}
                isHovered={hoveredIsland?.id === island.id}
                scale={viewport.zoom}
              />
            ))}
          </AnimatePresence>
          
          {/* Connection lines between related projects */}
          {islands.map((island) => {
            const relatedIslands = islands.filter(other => 
              other.id !== island.id && 
              island.techStack.some(tech => 
                other.techStack.some(otherTech => otherTech.name === tech.name)
              )
            )
            
            return relatedIslands.map((related) => (
              <motion.line
                key={`${island.id}-${related.id}`}
                x1={island.position.x * 100}
                y1={island.position.y * 100}
                x2={related.position.x * 100}
                y2={related.position.y * 100}
                stroke="#ffffff"
                strokeWidth="1"
                strokeOpacity="0.2"
                strokeDasharray="5,5"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 2, delay: Math.random() * 2 }}
              />
            ))
          })}
        </g>
      </motion.svg>
      
      {/* Floating Island Info */}
      <AnimatePresence>
        {hoveredIsland && (
          <motion.div
            className="absolute pointer-events-none z-20 bg-white/90 backdrop-blur-sm rounded-lg p-4 shadow-lg max-w-xs"
            style={{
              left: hoveredIsland.position.x * 100 * viewport.zoom + viewport.x + 50,
              top: hoveredIsland.position.y * 100 * viewport.zoom + viewport.y - 50
            }}
            initial={{ opacity: 0, scale: 0.8, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 10 }}
            transition={{ duration: 0.2 }}
          >
            <h3 className="font-bold text-gray-800 mb-1">{hoveredIsland.name}</h3>
            <p className="text-sm text-gray-600 mb-2">{hoveredIsland.shortDescription || hoveredIsland.description}</p>
            <div className="flex flex-wrap gap-1">
              {hoveredIsland.techStack.slice(0, 3).map((tech) => (
                <span
                  key={tech.name}
                  className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded"
                >
                  {tech.name}
                </span>
              ))}
              {hoveredIsland.techStack.length > 3 && (
                <span className="px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded">
                  +{hoveredIsland.techStack.length - 3} more
                </span>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}