'use client'

import React, { useMemo, useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { Vector3, Group } from 'three'
import { performanceMonitor } from '@/lib/performance'

export interface LODLevel {
  distance: number
  component: React.ReactNode
}

export interface LODComponentProps {
  levels: LODLevel[]
  position?: [number, number, number]
  children?: React.ReactNode
}

// Level of Detail component for performance optimization
const LODComponent = React.memo<LODComponentProps>(({
  levels,
  position = [0, 0, 0],
  children,
}) => {
  const meshRef = useRef<Group>(null)
  const { camera } = useThree()
  const [currentLevel, setCurrentLevel] = React.useState(0)
  
  const meshPosition = useMemo(() => new Vector3(...position), [position])
  
  // Performance-based LOD adjustment
  const performanceMultiplier = useMemo(() => {
    const level = performanceMonitor.getPerformanceLevel()
    switch (level) {
      case 'low': return 0.5 // Show lower detail at closer distances
      case 'medium': return 0.75
      case 'high': return 1.0
      default: return 1.0
    }
  }, [])

  useFrame(() => {
    if (!meshRef.current || !camera) return

    // Calculate distance from camera to object
    const distance = camera.position.distanceTo(meshPosition)
    
    // Adjust distances based on performance
    const adjustedLevels = levels.map(level => ({
      ...level,
      distance: level.distance * performanceMultiplier
    }))
    
    // Find appropriate LOD level
    let newLevel = adjustedLevels.length - 1
    for (let i = 0; i < adjustedLevels.length; i++) {
      if (distance <= adjustedLevels[i].distance) {
        newLevel = i
        break
      }
    }
    
    if (newLevel !== currentLevel) {
      setCurrentLevel(newLevel)
    }
  })

  // Render current LOD level
  const currentComponent = levels[currentLevel]?.component || children

  return (
    <group ref={meshRef} position={position}>
      {currentComponent}
    </group>
  )
})

LODComponent.displayName = 'LODComponent'

export default LODComponent