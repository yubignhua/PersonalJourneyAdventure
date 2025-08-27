'use client'

import React, { useRef, useMemo, useCallback, useState } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { ParticleSystemProps, ParticleData } from '@/types/3d'

const ParticleSystem: React.FC<ParticleSystemProps> = ({
  particles,
  animationSpeed = 1,
  interactive = true
}) => {
  const meshRef = useRef<THREE.Points>(null)
  const particlesRef = useRef<ParticleData[]>(particles)
  const mousePosition = useRef<THREE.Vector3>(new THREE.Vector3())
  const [interactionRadius] = useState(2.0)
  
  // Create geometry and material for particles
  const { geometry, material } = useMemo(() => {
    const particleCount = particles.length
    const positions = new Float32Array(particleCount * 3)
    const colors = new Float32Array(particleCount * 3)
    const sizes = new Float32Array(particleCount)
    
    particles.forEach((particle, i) => {
      positions[i * 3] = particle.position[0]
      positions[i * 3 + 1] = particle.position[1]
      positions[i * 3 + 2] = particle.position[2]
      
      const color = new THREE.Color(particle.color)
      colors[i * 3] = color.r
      colors[i * 3 + 1] = color.g
      colors[i * 3 + 2] = color.b
      
      sizes[i] = particle.size
    })
    
    const geo = new THREE.BufferGeometry()
    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    geo.setAttribute('customColor', new THREE.BufferAttribute(colors, 3))
    geo.setAttribute('size', new THREE.BufferAttribute(sizes, 1))
    
    const mat = new THREE.ShaderMaterial({
      uniforms: {
        time: { value: 0 }
      },
      vertexShader: `
        attribute float size;
        attribute vec3 customColor;
        varying vec3 vColor;
        uniform float time;
        
        void main() {
          vColor = customColor;
          vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
          
          // Enhanced movement with multiple wave patterns
          float wave1 = sin(time * 2.0 + position.y * 0.1) * 0.05;
          float wave2 = cos(time * 1.5 + position.x * 0.15) * 0.03;
          float wave3 = sin(time * 3.0 + position.z * 0.08) * 0.02;
          
          mvPosition.x += wave1;
          mvPosition.y += wave2;
          mvPosition.z += wave3;
          
          // Distance-based size scaling
          float distance = length(mvPosition.xyz);
          float sizeMultiplier = 300.0 / max(distance, 1.0);
          
          gl_PointSize = size * sizeMultiplier;
          gl_Position = projectionMatrix * mvPosition;
        }
      `,
      fragmentShader: `
        varying vec3 vColor;
        
        void main() {
          float distanceToCenter = distance(gl_PointCoord, vec2(0.5));
          
          // Create a more interesting particle shape
          float alpha = 1.0 - smoothstep(0.0, 0.5, distanceToCenter);
          
          // Add inner glow effect
          float innerGlow = 1.0 - smoothstep(0.0, 0.2, distanceToCenter);
          alpha = max(alpha * 0.6, innerGlow);
          
          // Add sparkle effect
          float sparkle = step(0.9, sin(distanceToCenter * 20.0)) * 0.5;
          alpha += sparkle;
          
          gl_FragColor = vec4(vColor, alpha);
        }
      `,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    })
    
    return { geometry: geo, material: mat }
  }, [particles])

  // Update particle positions and properties with interaction
  const updateParticles = useCallback((delta: number) => {
    if (!meshRef.current) return
    
    const positions = meshRef.current.geometry.attributes.position.array as Float32Array
    const colors = meshRef.current.geometry.attributes.customColor.array as Float32Array
    const sizes = meshRef.current.geometry.attributes.size.array as Float32Array
    
    particlesRef.current.forEach((particle, i) => {
      // Update particle life
      particle.life -= delta * animationSpeed
      
      if (particle.life <= 0) {
        // Reset particle
        particle.life = particle.maxLife
        particle.position = [
          (Math.random() - 0.5) * 10,
          (Math.random() - 0.5) * 10,
          (Math.random() - 0.5) * 10
        ]
        particle.velocity = [
          (Math.random() - 0.5) * 0.02,
          (Math.random() - 0.5) * 0.02,
          (Math.random() - 0.5) * 0.02
        ]
      } else {
        // Interactive behavior - particles are attracted to mouse/interaction points
        if (interactive) {
          const particlePos = new THREE.Vector3(...particle.position)
          const distanceToMouse = particlePos.distanceTo(mousePosition.current)
          
          if (distanceToMouse < interactionRadius) {
            // Calculate attraction force
            const direction = new THREE.Vector3()
              .subVectors(mousePosition.current, particlePos)
              .normalize()
            
            const force = (interactionRadius - distanceToMouse) / interactionRadius
            const attraction = direction.multiplyScalar(force * 0.001)
            
            particle.velocity[0] += attraction.x
            particle.velocity[1] += attraction.y
            particle.velocity[2] += attraction.z
          }
        }
        
        // Apply velocity damping
        particle.velocity[0] *= 0.98
        particle.velocity[1] *= 0.98
        particle.velocity[2] *= 0.98
        
        // Update position based on velocity
        particle.position[0] += particle.velocity[0] * delta * animationSpeed
        particle.position[1] += particle.velocity[1] * delta * animationSpeed
        particle.position[2] += particle.velocity[2] * delta * animationSpeed
        
        // Add some orbital motion around the globe
        const orbitSpeed = 0.1 * delta * animationSpeed
        const distance = Math.sqrt(
          particle.position[0] ** 2 + 
          particle.position[1] ** 2 + 
          particle.position[2] ** 2
        )
        
        if (distance > 0.1) {
          const angle = Math.atan2(particle.position[2], particle.position[0]) + orbitSpeed
          const newX = Math.cos(angle) * distance
          const newZ = Math.sin(angle) * distance
          
          particle.position[0] = newX
          particle.position[2] = newZ
        }
      }
      
      // Update buffer attributes
      positions[i * 3] = particle.position[0]
      positions[i * 3 + 1] = particle.position[1]
      positions[i * 3 + 2] = particle.position[2]
      
      // Enhanced color and size animation
      const lifeRatio = particle.life / particle.maxLife
      const color = new THREE.Color(particle.color)
      
      // Add pulsing effect
      const pulse = Math.sin(particle.life * 5) * 0.2 + 0.8
      
      colors[i * 3] = color.r * lifeRatio * pulse
      colors[i * 3 + 1] = color.g * lifeRatio * pulse
      colors[i * 3 + 2] = color.b * lifeRatio * pulse
      
      sizes[i] = particle.size * lifeRatio * pulse
    })
    
    // Mark attributes as needing update
    meshRef.current.geometry.attributes.position.needsUpdate = true
    meshRef.current.geometry.attributes.customColor.needsUpdate = true
    meshRef.current.geometry.attributes.size.needsUpdate = true
  }, [animationSpeed, interactive, interactionRadius])

  // Animation loop
  useFrame((state, delta) => {
    if (material.uniforms) {
      material.uniforms.time.value = state.clock.elapsedTime
    }
    
    updateParticles(delta)
  })

  // Update particles reference when props change
  React.useEffect(() => {
    particlesRef.current = [...particles]
  }, [particles])

  return (
    <points ref={meshRef} geometry={geometry} material={material} />
  )
}

export default ParticleSystem