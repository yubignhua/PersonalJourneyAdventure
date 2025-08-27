'use client'

import React, { Suspense, useCallback, useEffect, useMemo, useState } from 'react'
import { Canvas } from '@react-three/fiber'
import { ErrorBoundary } from 'react-error-boundary'
import { performanceMonitor } from '@/lib/performance'
import { Scene3DErrorBoundary } from './Scene3DErrorBoundary'
import { Scene3DFallback } from './Scene3DFallback'
import { LoadingSpinner } from './LoadingSpinner'

export interface Scene3DManagerProps {
  children: React.ReactNode
  fallbackComponent?: React.ComponentType<any>
  enablePerformanceMonitoring?: boolean
  adaptiveQuality?: boolean
  className?: string
}

export interface SceneConfig {
  antialias: boolean
  shadows: boolean
  toneMapping: boolean
  pixelRatio: number
  powerPreference: 'default' | 'high-performance' | 'low-power'
}

const Scene3DManager = React.memo<Scene3DManagerProps>(({
  children,
  fallbackComponent: CustomFallback,
  enablePerformanceMonitoring = true,
  adaptiveQuality = true,
  className = '',
}) => {
  const [sceneConfig, setSceneConfig] = useState<SceneConfig>({
    antialias: true,
    shadows: true,
    toneMapping: true,
    pixelRatio: Math.min(window.devicePixelRatio, 2),
    powerPreference: 'high-performance',
  })
  
  const [performanceLevel, setPerformanceLevel] = useState<'low' | 'medium' | 'high'>('high')
  const [isWebGLSupported, setIsWebGLSupported] = useState(true)
  const [hasError, setHasError] = useState(false)

  // Check device capabilities on mount
  useEffect(() => {
    const capabilities = performanceMonitor.getDeviceCapabilities()
    
    setIsWebGLSupported(capabilities.hasWebGL)
    setPerformanceLevel(capabilities.performanceLevel)

    // Start performance monitoring if enabled
    if (enablePerformanceMonitoring) {
      performanceMonitor.startMonitoring()
    }

    return () => {
      if (enablePerformanceMonitoring) {
        performanceMonitor.stopMonitoring()
      }
    }
  }, [enablePerformanceMonitoring])

  // Adaptive quality adjustment based on performance
  useEffect(() => {
    if (!adaptiveQuality) return

    const updateQuality = () => {
      const currentLevel = performanceMonitor.getPerformanceLevel()
      const isMobile = performanceMonitor.isMobile()
      
      setPerformanceLevel(currentLevel)
      
      setSceneConfig(prev => ({
        ...prev,
        antialias: currentLevel === 'high' && !isMobile,
        shadows: currentLevel !== 'low',
        toneMapping: currentLevel === 'high',
        pixelRatio: isMobile ? 1 : Math.min(window.devicePixelRatio, currentLevel === 'high' ? 2 : 1),
        powerPreference: currentLevel === 'low' ? 'low-power' : 'high-performance',
      }))
    }

    // Update quality every 5 seconds during performance monitoring
    const interval = setInterval(updateQuality, 5000)
    
    return () => clearInterval(interval)
  }, [adaptiveQuality])

  // Canvas configuration based on performance level
  const canvasConfig = useMemo(() => ({
    gl: {
      antialias: sceneConfig.antialias,
      powerPreference: sceneConfig.powerPreference,
      alpha: true,
      stencil: false,
      depth: true,
    },
    shadows: sceneConfig.shadows,
    dpr: sceneConfig.pixelRatio,
    performance: {
      min: 0.2,
      max: 1,
      debounce: 200,
    },
    frameloop: 'demand' as const,
  }), [sceneConfig])

  // Error recovery callback
  const handleError = useCallback((error: Error, errorInfo: any) => {
    console.error('3D Scene Error:', error, errorInfo)
    setHasError(true)
    
    // Report error to performance monitor
    if (enablePerformanceMonitoring) {
      console.warn('Falling back to 2D mode due to 3D rendering error')
    }
  }, [enablePerformanceMonitoring])

  // Reset error state
  const resetError = useCallback(() => {
    setHasError(false)
  }, [])

  // If WebGL is not supported or there's an error, show fallback
  if (!isWebGLSupported || hasError) {
    const FallbackComponent = CustomFallback || Scene3DFallback
    return (
      <div className={`scene-3d-fallback ${className}`}>
        <FallbackComponent 
          reason={!isWebGLSupported ? 'webgl-not-supported' : 'rendering-error'}
          onRetry={resetError}
        />
      </div>
    )
  }

  return (
    <ErrorBoundary
      FallbackComponent={Scene3DErrorBoundary}
      onError={handleError}
      onReset={resetError}
    >
      <div className={`scene-3d-container ${className}`}>
        <Suspense fallback={<LoadingSpinner />}>
          <Canvas {...canvasConfig}>
            {children}
          </Canvas>
        </Suspense>
        
        {/* Performance indicator for development */}
        {process.env.NODE_ENV === 'development' && enablePerformanceMonitoring && (
          <div className="fixed top-4 right-4 bg-black/50 text-white p-2 rounded text-xs">
            FPS: {performanceMonitor.getFPS()} | Level: {performanceLevel}
          </div>
        )}
      </div>
    </ErrorBoundary>
  )
})

Scene3DManager.displayName = 'Scene3DManager'

export default Scene3DManager