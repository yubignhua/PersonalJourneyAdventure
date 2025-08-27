'use client'

import { useCallback, useEffect, useState } from 'react'
import { useThree } from '@react-three/fiber'
import { performanceMonitor } from '@/lib/performance'

export interface Scene3DState {
    isLoaded: boolean
    performanceLevel: 'low' | 'medium' | 'high'
    hasError: boolean
    metrics: {
        fps: number
        frameTime: number
        memoryUsage: number
    }
}

export interface Scene3DControls {
    resetError: () => void
    forceQualityLevel: (level: 'low' | 'medium' | 'high') => void
    enablePerformanceMode: () => void
    disablePerformanceMode: () => void
}

export function useScene3D(): [Scene3DState, Scene3DControls] {
    const { gl, scene, camera } = useThree()

    const [state, setState] = useState<Scene3DState>({
        isLoaded: false,
        performanceLevel: 'high',
        hasError: false,
        metrics: {
            fps: 60,
            frameTime: 16.67,
            memoryUsage: 0,
        },
    })

    // Initialize performance monitoring
    useEffect(() => {
        if (gl) {
            performanceMonitor.setThreeRenderer(gl)
            performanceMonitor.startMonitoring()

            setState(prev => ({ ...prev, isLoaded: true }))
        }

        return () => {
            performanceMonitor.stopMonitoring()
        }
    }, [gl])

    // Update performance metrics
    useEffect(() => {
        const updateMetrics = () => {
            const metrics = performanceMonitor.getPerformanceMetrics()
            const level = performanceMonitor.getPerformanceLevel()

            setState(prev => ({
                ...prev,
                performanceLevel: level,
                metrics: {
                    fps: metrics.fps,
                    frameTime: metrics.frameTime,
                    memoryUsage: metrics.memoryUsage,
                },
            }))
        }

        const interval = setInterval(updateMetrics, 1000)
        return () => clearInterval(interval)
    }, [])

    // Controls
    const resetError = useCallback(() => {
        setState(prev => ({ ...prev, hasError: false }))
    }, [])

    const forceQualityLevel = useCallback((level: 'low' | 'medium' | 'high') => {
        setState(prev => ({ ...prev, performanceLevel: level }))

        // Apply quality settings to renderer
        if (gl) {
            switch (level) {
                case 'low':
                    gl.setPixelRatio(1)
                    gl.shadowMap.enabled = false
                    break
                case 'medium':
                    gl.setPixelRatio(Math.min(window.devicePixelRatio, 1.5))
                    gl.shadowMap.enabled = true
                    break
                case 'high':
                    gl.setPixelRatio(Math.min(window.devicePixelRatio, 2))
                    gl.shadowMap.enabled = true
                    break
            }
        }
    }, [gl])

    const enablePerformanceMode = useCallback(() => {
        if (gl) {
            gl.setPixelRatio(1)
            gl.shadowMap.enabled = false
            // Note: antialias is set during renderer creation, cannot be changed at runtime
        }
        setState(prev => ({ ...prev, performanceLevel: 'low' }))
    }, [gl])

    const disablePerformanceMode = useCallback(() => {
        const level = performanceMonitor.getPerformanceLevel()
        forceQualityLevel(level)
    }, [forceQualityLevel])

    // Error handling
    useEffect(() => {
        const handleError = (event: ErrorEvent) => {
            if (event.message.includes('WebGL') || event.message.includes('Three')) {
                setState(prev => ({ ...prev, hasError: true }))
            }
        }

        window.addEventListener('error', handleError)
        return () => window.removeEventListener('error', handleError)
    }, [])

    const controls: Scene3DControls = {
        resetError,
        forceQualityLevel,
        enablePerformanceMode,
        disablePerformanceMode,
    }

    return [state, controls]
}