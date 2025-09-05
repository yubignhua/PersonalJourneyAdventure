'use client'

import React, { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { ConnectionLineProps } from '@/types/3d'

const ConnectionLine: React.FC<ConnectionLineProps> = ({
  start,
  end,
  color = '#ffffff',
  opacity = 1,
  animated = true
}) => {
  const lineRef = useRef<THREE.Line>(null)
  const particlesRef = useRef<THREE.Points>(null)
  
  // Create curved path between points
  const curveGeometry = useMemo(() => {
    const startPoint = new THREE.Vector3(...start)
    const endPoint = new THREE.Vector3(...end)
    
    // Create curved path
    const midPoint = startPoint.clone().add(endPoint).multiplyScalar(0.5)
    const distance = startPoint.distanceTo(endPoint)
    midPoint.y += distance * 0.3 // Add curve height
    
    const curve = new THREE.QuadraticBezierCurve3(startPoint, midPoint, endPoint)
    const points = curve.getPoints(32)
    
    return new THREE.BufferGeometry().setFromPoints(points)
  }, [start, end])
  
  // Particle system for connection effect
  const particleGeometry = useMemo(() => {
    const geometry = new THREE.BufferGeometry()
    const particleCount = 20
    const positions = new Float32Array(particleCount * 3)
    
    for (let i = 0; i < particleCount; i++) {
      positions[i * 3] = 0
      positions[i * 3 + 1] = 0
      positions[i * 3 + 2] = 0
    }
    
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    return geometry
  }, [])
  
  // Line material
  const lineMaterial = useMemo(() => {
    return new THREE.LineBasicMaterial({
      color: new THREE.Color(color),
      transparent: true,
      opacity: (opacity || 1) * 0.6,
      linewidth: 2
    })
  }, [color, opacity])
  
  // Particle material
  const particleMaterial = useMemo(() => {
    return new THREE.PointsMaterial({
      color: new THREE.Color(color),
      size: 0.02,
      transparent: true,
      opacity: (opacity || 1) * 0.8,
      blending: THREE.AdditiveBlending
    })
  }, [color, opacity])
  
  // Animation
  useFrame((state) => {
    if (!animated || !lineRef.current || !particlesRef.current) return
    
    // Animate line opacity
    const pulseOpacity = (opacity || 1) * (0.4 + Math.sin(state.clock.elapsedTime * 2) * 0.2)
    lineMaterial.opacity = pulseOpacity
    
    // Animate particles along the line
    if (particlesRef.current && particlesRef.current.geometry) {
      const positions = particlesRef.current.geometry.attributes.position.array
      const curve = new THREE.QuadraticBezierCurve3(
        new THREE.Vector3(...start),
        new THREE.Vector3(
          (start[0] + end[0]) / 2,
          (start[1] + end[1]) / 2 + new THREE.Vector3(...start).distanceTo(new THREE.Vector3(...end)) * 0.3,
          (start[2] + end[2]) / 2
        ),
        new THREE.Vector3(...end)
      )
      
      for (let i = 0; i < 20; i++) {
        const t = ((state.clock.elapsedTime * 0.5 + i * 0.05) % 1)
        const point = curve.getPoint(t)
        
        positions[i * 3] = point.x
        positions[i * 3 + 1] = point.y
        positions[i * 3 + 2] = point.z
      }
      
      particlesRef.current.geometry.attributes.position.needsUpdate = true
      if (Array.isArray(particleMaterial)) {
        particleMaterial.forEach(mat => mat.opacity = pulseOpacity * 1.5)
      } else {
        particleMaterial.opacity = pulseOpacity * 1.5
      }
    }
  })
  
  return (
    <group>
      {/* Main connection line */}
      <primitive object={new THREE.Line(curveGeometry, lineMaterial)} ref={lineRef} />
      
      {/* Animated particles */}
      <primitive object={new THREE.Points(particleGeometry, particleMaterial)} ref={particlesRef} />
      
      {/* Connection nodes */}
      <mesh position={start}>
        <sphereGeometry args={[0.015, 8, 8]} />
        <meshBasicMaterial color={color} transparent opacity={opacity} />
      </mesh>
      
      <mesh position={end}>
        <sphereGeometry args={[0.015, 8, 8]} />
        <meshBasicMaterial color={color} transparent opacity={opacity} />
      </mesh>
    </group>
  )
}

export default ConnectionLine