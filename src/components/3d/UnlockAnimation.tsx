'use client'

import React, { useRef, useEffect, useState } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

interface UnlockAnimationProps {
  position: [number, number, number]
  color: string
  onComplete?: () => void
  scale?: number
}

const UnlockAnimation: React.FC<UnlockAnimationProps> = ({
  position,
  color,
  onComplete,
  scale = 1
}) => {
  const groupRef = useRef<THREE.Group>(null)
  const particlesRef = useRef<THREE.Points>(null)
  const ringRef = useRef<THREE.Mesh>(null)
  const [animationPhase, setAnimationPhase] = useState(0)
  const [startTime] = useState(Date.now())
  
  // Create particle system
  const particleGeometry = React.useMemo(() => {
    const geometry = new THREE.BufferGeometry()
    const particleCount = 50
    const positions = new Float32Array(particleCount * 3)
    const velocities = new Float32Array(particleCount * 3)
    
    for (let i = 0; i < particleCount; i++) {
      // Start particles in a sphere
      const theta = Math.random() * Math.PI * 2
      const phi = Math.random() * Math.PI
      const radius = 0.05
      
      positions[i * 3] = Math.sin(phi) * Math.cos(theta) * radius
      positions[i * 3 + 1] = Math.sin(phi) * Math.sin(theta) * radius
      positions[i * 3 + 2] = Math.cos(phi) * radius
      
      // Random velocities
      velocities[i * 3] = (Math.random() - 0.5) * 0.1
      velocities[i * 3 + 1] = (Math.random() - 0.5) * 0.1
      velocities[i * 3 + 2] = (Math.random() - 0.5) * 0.1
    }
    
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    geometry.setAttribute('velocity', new THREE.BufferAttribute(velocities, 3))
    
    return geometry
  }, [])
  
  // Particle material
  const particleMaterial = React.useMemo(() => {
    return new THREE.PointsMaterial({
      color: new THREE.Color(color),
      size: 0.01,
      transparent: true,
      opacity: 0.8,
      blending: THREE.AdditiveBlending
    })
  }, [color])
  
  // Ring material
  const ringMaterial = React.useMemo(() => {
    return new THREE.MeshBasicMaterial({
      color: new THREE.Color(color),
      transparent: true,
      opacity: 0.6,
      side: THREE.DoubleSide
    })
  }, [color])
  
  // Animation phases:
  // 0: Lock breaking
  // 1: Particles exploding
  // 2: Success ring expanding
  // 3: Complete
  
  useFrame((state, delta) => {
    if (!groupRef.current) return
    
    const elapsed = (Date.now() - startTime) / 1000
    
    // Phase 0: Lock breaking (0-0.5s)
    if (elapsed < 0.5) {
      const progress = elapsed / 0.5
      groupRef.current.rotation.z = progress * Math.PI * 2
      groupRef.current.scale.setScalar(1 + Math.sin(progress * Math.PI) * 0.3)
    }
    // Phase 1: Particles exploding (0.5-1.5s)
    else if (elapsed < 1.5 && particlesRef.current) {
      if (animationPhase === 0) setAnimationPhase(1)
      
      const positions = particlesRef.current.geometry.attributes.position.array
      const velocities = particlesRef.current.geometry.attributes.velocity.array
      
      for (let i = 0; i < positions.length / 3; i++) {
        positions[i * 3] += velocities[i * 3] * delta * 2
        positions[i * 3 + 1] += velocities[i * 3 + 1] * delta * 2
        positions[i * 3 + 2] += velocities[i * 3 + 2] * delta * 2
      }
      
      particlesRef.current.geometry.attributes.position.needsUpdate = true
      
      // Fade out particles
      const fadeProgress = (elapsed - 0.5) / 1.0
      particleMaterial.opacity = 0.8 * (1 - fadeProgress)
    }
    // Phase 2: Success ring (1.5-2.5s)
    else if (elapsed < 2.5 && ringRef.current) {
      if (animationPhase === 1) setAnimationPhase(2)
      
      const ringProgress = (elapsed - 1.5) / 1.0
      ringRef.current.scale.setScalar(1 + ringProgress * 3)
      ringMaterial.opacity = 0.6 * (1 - ringProgress)
      
      // Rotate ring
      ringRef.current.rotation.x += delta * 2
      ringRef.current.rotation.y += delta * 3
    }
    // Phase 3: Complete
    else if (animationPhase !== 3) {
      setAnimationPhase(3)
      if (onComplete) onComplete()
    }
  })
  
  // Clean up after animation
  useEffect(() => {
    if (animationPhase === 3) {
      const timer = setTimeout(() => {
        if (groupRef.current) {
          groupRef.current.visible = false
        }
      }, 500)
      
      return () => clearTimeout(timer)
    }
  }, [animationPhase])
  
  return (
    <group ref={groupRef} position={position} scale={[scale, scale, scale]}>
      {/* Lock icon (breaks apart) */}
      {animationPhase < 2 && (
        <group>
          <mesh position={[0, 0, 0]}>
            <boxGeometry args={[0.03, 0.05, 0.01]} />
            <meshBasicMaterial color="#666666" />
          </mesh>
          <mesh position={[0, 0.035, 0]}>
            <torusGeometry args={[0.02, 0.005, 8, 16, Math.PI]} />
            <meshBasicMaterial color="#666666" />
          </mesh>
        </group>
      )}
      
      {/* Particle explosion */}
      {animationPhase >= 1 && animationPhase < 3 && (
        <points ref={particlesRef} geometry={particleGeometry} material={particleMaterial} />
      )}
      
      {/* Success ring */}
      {animationPhase >= 2 && animationPhase < 4 && (
        <mesh ref={ringRef} rotation={[Math.PI / 2, 0, 0]}>
          <ringGeometry args={[0.1, 0.15, 16]} />
          <meshBasicMaterial color={color} transparent opacity={0.6} />
        </mesh>
      )}
      
      {/* Sparkle effects */}
      {animationPhase >= 1 && animationPhase < 3 && (
        <group>
          {Array.from({ length: 8 }, (_, i) => (
            <mesh
              key={i}
              position={[
                Math.cos((i / 8) * Math.PI * 2) * 0.2,
                Math.sin((i / 8) * Math.PI * 2) * 0.2,
                0
              ]}
            >
              <sphereGeometry args={[0.005, 4, 4]} />
              <meshBasicMaterial color={color} />
            </mesh>
          ))}
        </group>
      )}
    </group>
  )
}

export default UnlockAnimation