'use client'

import React, { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Mesh, Material, BufferGeometry } from 'three'
import { performanceMonitor } from '@/lib/performance'

export interface OptimizedMeshProps {
  geometry: BufferGeometry
  material: Material | Material[]
  position?: [number, number, number]
  rotation?: [number, number, number]
  scale?: [number, number, number] | number
  castShadow?: boolean
  receiveShadow?: boolean
  frustumCulled?: boolean
  renderOrder?: number
  onUpdate?: (mesh: Mesh) => void
  children?: React.ReactNode
}

// Performance-optimized mesh component with automatic culling and LOD
const OptimizedMesh = React.memo<OptimizedMeshProps>(({
  geometry,
  material,
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  scale = 1,
  castShadow = true,
  receiveShadow = true,
  frustumCulled = true,
  renderOrder = 0,
  onUpdate,
  children,
}) => {
  const meshRef = useRef<Mesh>(null)
  
  // Performance-based shadow settings
  const shadowSettings = useMemo(() => {
    const level = performanceMonitor.getPerformanceLevel()
    return {
      castShadow: castShadow && level !== 'low',
      receiveShadow: receiveShadow && level !== 'low',
    }
  }, [castShadow, receiveShadow])

  // Optimized scale based on performance
  const optimizedScale = useMemo(() => {
    const level = performanceMonitor.getPerformanceLevel()
    const scaleMultiplier = level === 'low' ? 0.8 : 1.0
    
    if (typeof scale === 'number') {
      return scale * scaleMultiplier
    }
    return scale.map(s => s * scaleMultiplier) as [number, number, number]
  }, [scale])

  // Frame update with performance considerations
  useFrame((state, delta) => {
    if (!meshRef.current) return
    
    // Call custom update function if provided
    if (onUpdate) {
      onUpdate(meshRef.current)
    }
    
    // Performance-based update frequency
    const level = performanceMonitor.getPerformanceLevel()
    const shouldUpdate = level === 'high' || state.clock.elapsedTime % (level === 'medium' ? 2 : 4) < delta
    
    if (!shouldUpdate) return
    
    // Update mesh properties if needed
    const mesh = meshRef.current
    if (mesh.material !== material) {
      mesh.material = material
    }
  })

  return (
    <mesh
      ref={meshRef}
      geometry={geometry}
      material={material}
      position={position}
      rotation={rotation}
      scale={optimizedScale}
      castShadow={shadowSettings.castShadow}
      receiveShadow={shadowSettings.receiveShadow}
      frustumCulled={frustumCulled}
      renderOrder={renderOrder}
    >
      {children}
    </mesh>
  )
}, (prevProps, nextProps) => {
  // Custom comparison for React.memo optimization
  return (
    prevProps.geometry === nextProps.geometry &&
    prevProps.material === nextProps.material &&
    JSON.stringify(prevProps.position) === JSON.stringify(nextProps.position) &&
    JSON.stringify(prevProps.rotation) === JSON.stringify(nextProps.rotation) &&
    JSON.stringify(prevProps.scale) === JSON.stringify(nextProps.scale) &&
    prevProps.castShadow === nextProps.castShadow &&
    prevProps.receiveShadow === nextProps.receiveShadow &&
    prevProps.frustumCulled === nextProps.frustumCulled &&
    prevProps.renderOrder === nextProps.renderOrder
  )
})

OptimizedMesh.displayName = 'OptimizedMesh'

export default OptimizedMesh