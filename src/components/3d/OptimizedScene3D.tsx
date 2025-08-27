'use client'

import React, { useCallback, useMemo } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { performanceMonitor } from '@/lib/performance'

export interface OptimizedScene3DProps {
  children: React.ReactNode
  enableLOD?: boolean
  maxDistance?: number
  className?: string
}

// Performance-optimized wrapper for 3D scenes
const OptimizedScene3D = React.memo<OptimizedScene3DProps>(({
  children,
  enableLOD = true,
  maxDistance = 100,
  className = '',
}) => {
  const { camera, gl } = useThree()
  
  // Memoized performance settings
  const performanceSettings = useMemo(() => {
    const level = performanceMonitor.getPerformanceLevel()
    const isMobile = performanceMonitor.isMobile()
    
    return {
      shadowMapSize: level === 'high' ? 2048 : level === 'medium' ? 1024 : 512,
      antialias: level === 'high' && !isMobile,
      pixelRatio: isMobile ? 1 : Math.min(window.devicePixelRatio, level === 'high' ? 2 : 1),
      maxLights: level === 'high' ? 8 : level === 'medium' ? 4 : 2,
      enableShadows: level !== 'low',
    }
  }, [])

  // Apply performance settings to renderer
  React.useEffect(() => {
    if (gl) {
      gl.setPixelRatio(performanceSettings.pixelRatio)
      gl.shadowMap.enabled = performanceSettings.enableShadows
      if (gl.shadowMap.enabled) {
        gl.shadowMap.type = performanceSettings.antialias ? 2 : 0 // PCFSoftShadowMap : BasicShadowMap
      }
    }
  }, [gl, performanceSettings])

  // Frame-based performance monitoring
  useFrame(useCallback((state, delta) => {
    // Adaptive quality based on frame time
    if (delta > 0.033) { // If frame time > 33ms (< 30fps)
      // Reduce quality dynamically if needed
      const currentLevel = performanceMonitor.getPerformanceLevel()
      if (currentLevel === 'low' && gl.shadowMap.enabled) {
        gl.shadowMap.enabled = false
        console.warn('Disabled shadows due to low performance')
      }
    }
  }, [gl]))

  return (
    <group>
      {/* Ambient lighting optimized for performance */}
      <ambientLight 
        intensity={performanceSettings.enableShadows ? 0.4 : 0.6} 
        color="#ffffff" 
      />
      
      {/* Directional light with conditional shadows */}
      <directionalLight
        position={[10, 10, 5]}
        intensity={0.8}
        castShadow={performanceSettings.enableShadows}
        shadow-mapSize-width={performanceSettings.shadowMapSize}
        shadow-mapSize-height={performanceSettings.shadowMapSize}
        shadow-camera-far={50}
        shadow-camera-left={-10}
        shadow-camera-right={10}
        shadow-camera-top={10}
        shadow-camera-bottom={-10}
      />
      
      {children}
    </group>
  )
})

OptimizedScene3D.displayName = 'OptimizedScene3D'

export default OptimizedScene3D