'use client'

import React, { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

interface SurfaceConnectionLineProps {
  start: [number, number, number]
  end: [number, number, number]
  color: string
  opacity: number
  animated?: boolean
  sphereRadius?: number
}

const SurfaceConnectionLine: React.FC<SurfaceConnectionLineProps> = ({
  start,
  end,
  color,
  opacity,
  animated = true,
  sphereRadius = 2
}) => {
  const lineRef = useRef<THREE.Line>(null)
  const particlesRef = useRef<THREE.Points>(null)
  
  // Create enhanced arc path along sphere surface
  const arcGeometry = useMemo(() => {
    const startPoint = new THREE.Vector3(...start)
    const endPoint = new THREE.Vector3(...end)
    
    // Normalize to sphere surface
    startPoint.normalize().multiplyScalar(sphereRadius)
    endPoint.normalize().multiplyScalar(sphereRadius)
    
    // Calculate the angle between points
    const angle = startPoint.angleTo(endPoint)
    
    // Create arc along sphere surface with gap effects
    const segments = 48 // Higher resolution for smoother curves
    const points = []
    
    for (let i = 0; i <= segments; i++) {
      const t = i / segments
      
      // Spherical interpolation
      const point = startPoint.clone().slerp(endPoint, t)
      point.normalize().multiplyScalar(sphereRadius)
      
      // Add dynamic elevation with gap simulation
      const elevation = Math.sin(t * Math.PI) * 0.03 // Reduced elevation for tighter fit
      
      // Add slight waviness for more organic connection
      const waviness = Math.sin(t * Math.PI * 4) * 0.005
      
      point.normalize().multiplyScalar(sphereRadius + elevation + waviness)
      
      points.push(point)
    }
    
    return new THREE.BufferGeometry().setFromPoints(points)
  }, [start, end, sphereRadius])
  
  // Particle system for connection effect
  const particleGeometry = useMemo(() => {
    const geometry = new THREE.BufferGeometry()
    const particleCount = 15
    const positions = new Float32Array(particleCount * 3)
    
    for (let i = 0; i < particleCount; i++) {
      positions[i * 3] = 0
      positions[i * 3 + 1] = 0
      positions[i * 3 + 2] = 0
    }
    
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    return geometry
  }, [])
  
  // Enhanced line material with gap effects
  const lineMaterial = useMemo(() => {
    return new THREE.LineBasicMaterial({
      color: new THREE.Color(color),
      transparent: true,
      opacity: opacity * 0.7,
      linewidth: 2,
      linecap: 'round',
      linejoin: 'round'
    })
  }, [color, opacity])
  
  // Enhanced particle material
  const particleMaterial = useMemo(() => {
    return new THREE.PointsMaterial({
      color: new THREE.Color(color),
      size: 0.012, // Smaller particles for tighter connection
      transparent: true,
      opacity: opacity * 0.8,
      blending: THREE.AdditiveBlending,
      sizeAttenuation: true
    })
  }, [color, opacity])
  
  // Gap effect material
  const gapMaterial = useMemo(() => {
    return new THREE.LineBasicMaterial({
      color: new THREE.Color(color).multiplyScalar(0.6),
      transparent: true,
      opacity: opacity * 0.4,
      linewidth: 1,
      dashSize: 0.02,
      gapSize: 0.01
    })
  }, [color, opacity])
  
  // Enhanced animation with gap effects
  useFrame((state) => {
    if (!animated || !lineRef.current || !particlesRef.current) return
    
    // Animate line opacity with breathing effect
    const pulseOpacity = opacity * (0.4 + Math.sin(state.clock.elapsedTime * 1.5) * 0.3)
    if (Array.isArray(lineMaterial)) {
      lineMaterial.forEach(mat => mat.opacity = pulseOpacity)
    } else {
      lineMaterial.opacity = pulseOpacity
    }
    
    // Animate particles along the arc with gap simulation
    if (particlesRef.current && particlesRef.current.geometry) {
      const positions = particlesRef.current.geometry.attributes.position.array
      const startPoint = new THREE.Vector3(...start).normalize().multiplyScalar(sphereRadius)
      const endPoint = new THREE.Vector3(...end).normalize().multiplyScalar(sphereRadius)
      
      for (let i = 0; i < 12; i++) { // Reduced particle count for tighter fit
        const t = ((state.clock.elapsedTime * 0.4 + i * 0.08) % 1)
        
        // Spherical interpolation along arc with gap variation
        const point = startPoint.clone().slerp(endPoint, t)
        
        // Add gap effect by varying particle distance from surface
        const gapVariation = Math.sin(t * Math.PI * 2 + state.clock.elapsedTime) * 0.008
        point.normalize().multiplyScalar(sphereRadius + 0.015 + gapVariation)
        
        positions[i * 3] = point.x
        positions[i * 3 + 1] = point.y
        positions[i * 3 + 2] = point.z
      }
      
      particlesRef.current.geometry.attributes.position.needsUpdate = true
      
      if (Array.isArray(particleMaterial)) {
        particleMaterial.forEach(mat => mat.opacity = pulseOpacity * 1.1)
      } else {
        particleMaterial.opacity = pulseOpacity * 1.1
      }
    }
  })
  
  return (
    <group>
      {/* Main arc connection line */}
      <primitive object={new THREE.Line(arcGeometry, lineMaterial)} ref={lineRef} />
      
      {/* Animated particles */}
      <primitive object={new THREE.Points(particleGeometry, particleMaterial)} ref={particlesRef} />
      
      {/* Enhanced connection nodes on sphere surface */}
      <group position={start}>
        <mesh>
          <sphereGeometry args={[0.015, 12, 12]} />
          <meshBasicMaterial color={color} transparent opacity={opacity * 0.8} />
        </mesh>
        <mesh>
          <sphereGeometry args={[0.008, 8, 8]} />
          <meshBasicMaterial color="#ffffff" transparent opacity={opacity * 0.6} />
        </mesh>
      </group>
      
      <group position={end}>
        <mesh>
          <sphereGeometry args={[0.015, 12, 12]} />
          <meshBasicMaterial color={color} transparent opacity={opacity * 0.8} />
        </mesh>
        <mesh>
          <sphereGeometry args={[0.008, 8, 8]} />
          <meshBasicMaterial color="#ffffff" transparent opacity={opacity * 0.6} />
        </mesh>
      </group>
    </group>
  )
}

export default SurfaceConnectionLine