'use client'

import React, { useRef, useMemo, useState, useCallback } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import { Globe3DProps, SkillPoint } from '@/types/3d'

const Globe3D: React.FC<Globe3DProps> = ({
  skills,
  onSkillClick,
  particleCount = 100,
  radius = 2,
  rotationSpeed = 0.005,
  interactive = true
}) => {
  const globeRef = useRef<THREE.Mesh>(null)
  const groupRef = useRef<THREE.Group>(null)
  const skillPointsRef = useRef<THREE.Group[]>([])
  const [hoveredSkill, setHoveredSkill] = useState<string | null>(null)
  const [selectedSkill, setSelectedSkill] = useState<string | null>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 })
  const [rotation, setRotation] = useState({ x: 0, y: 0 })
  const [animationTime, setAnimationTime] = useState(0)
  
  const { camera, gl } = useThree()

  // Generate skill points positioned on sphere surface
  const skillPoints = useMemo(() => {
    return skills.map((skill, index) => {
      // Distribute points evenly on sphere using fibonacci spiral
      const phi = Math.acos(1 - 2 * (index + 0.5) / skills.length)
      const theta = Math.PI * (1 + Math.sqrt(5)) * (index + 0.5)
      
      const x = Math.sin(phi) * Math.cos(theta) * radius
      const y = Math.cos(phi) * radius
      const z = Math.sin(phi) * Math.sin(theta) * radius
      
      return {
        ...skill,
        position: [x, y, z] as [number, number, number],
        originalPosition: [x, y, z] as [number, number, number]
      }
    })
  }, [skills, radius])

  // Enhanced skill click handler with animation
  const handleSkillClick = useCallback((skill: SkillPoint & { originalPosition: [number, number, number] }) => {
    setSelectedSkill(skill.id)
    onSkillClick(skill)
    
    // Trigger particle burst animation
    const skillGroup = skillPointsRef.current.find(group => 
      group.userData.skillId === skill.id
    )
    if (skillGroup) {
      // Add click animation
      skillGroup.scale.setScalar(1.5)
      setTimeout(() => {
        if (skillGroup) skillGroup.scale.setScalar(1)
      }, 200)
    }
  }, [onSkillClick])

  // Globe material properties are now defined inline in JSX

  // Handle mouse interactions for dragging
  const handlePointerDown = useCallback((event: any) => {
    if (!interactive) return
    
    setIsDragging(true)
    setDragStart({
      x: event.clientX,
      y: event.clientY
    })
    gl.domElement.style.cursor = 'grabbing'
  }, [interactive, gl])

  const handlePointerMove = useCallback((event: any) => {
    if (!isDragging || !interactive) return
    
    const deltaX = event.clientX - dragStart.x
    const deltaY = event.clientY - dragStart.y
    
    setRotation(prev => ({
      x: prev.x + deltaY * 0.01,
      y: prev.y + deltaX * 0.01
    }))
    
    setDragStart({
      x: event.clientX,
      y: event.clientY
    })
  }, [isDragging, dragStart, interactive])

  const handlePointerUp = useCallback(() => {
    setIsDragging(false)
    gl.domElement.style.cursor = 'grab'
  }, [gl])

  // Set up mouse event listeners
  React.useEffect(() => {
    const canvas = gl.domElement
    
    canvas.addEventListener('pointerdown', handlePointerDown)
    canvas.addEventListener('pointermove', handlePointerMove)
    canvas.addEventListener('pointerup', handlePointerUp)
    canvas.addEventListener('pointerleave', handlePointerUp)
    
    return () => {
      canvas.removeEventListener('pointerdown', handlePointerDown)
      canvas.removeEventListener('pointermove', handlePointerMove)
      canvas.removeEventListener('pointerup', handlePointerUp)
      canvas.removeEventListener('pointerleave', handlePointerUp)
    }
  }, [gl, handlePointerDown, handlePointerMove, handlePointerUp])

  // Animation loop
  useFrame((state, delta) => {
    setAnimationTime(prev => prev + delta)
    
    if (groupRef.current) {
      // Apply manual rotation from dragging
      groupRef.current.rotation.x = rotation.x
      groupRef.current.rotation.y = rotation.y
      
      // Auto-rotation when not dragging
      if (!isDragging) {
        groupRef.current.rotation.y += rotationSpeed
      }
    }

    // Animate skill points
    skillPointsRef.current.forEach((skillGroup, index) => {
      if (!skillGroup) return
      
      const skill = skillPoints[index]
      const isHovered = hoveredSkill === skill.id
      const isSelected = selectedSkill === skill.id
      
      // Floating animation
      const floatOffset = Math.sin(animationTime * 2 + index * 0.5) * 0.02
      skillGroup.position.y = skill.position[1] + floatOffset
      
      // Pulsing animation for hovered/selected skills
      if (isHovered || isSelected) {
        const pulseScale = 1 + Math.sin(animationTime * 8) * 0.1
        skillGroup.scale.setScalar(pulseScale)
      } else {
        skillGroup.scale.lerp(new THREE.Vector3(1, 1, 1), delta * 5)
      }
      
      // Rotation animation for skill points
      skillGroup.rotation.y += delta * 0.5
    })
  })

  return (
    <group ref={groupRef}>
      {/* Main globe sphere */}
      <mesh ref={globeRef}>
        <sphereGeometry args={[radius, 32, 32]} />
        <meshPhongMaterial
          color="#1e40af"
          transparent
          opacity={0.1}
          wireframe
        />
      </mesh>
      
      {/* Skill points */}
      {skillPoints.map((skill, index) => (
        <group 
          key={skill.id} 
          position={skill.position}
          ref={(ref) => {
            if (ref) {
              skillPointsRef.current[index] = ref
              ref.userData.skillId = skill.id
            }
          }}
        >
          {/* Skill point sphere with enhanced visuals */}
          <mesh
            onPointerEnter={() => setHoveredSkill(skill.id)}
            onPointerLeave={() => setHoveredSkill(null)}
            onClick={() => handleSkillClick(skill)}
            castShadow
            receiveShadow
          >
            <sphereGeometry args={[0.06, 12, 12]} />
            <meshPhongMaterial
              color={skill.color}
              emissive={hoveredSkill === skill.id || selectedSkill === skill.id ? skill.color : '#000000'}
              emissiveIntensity={hoveredSkill === skill.id || selectedSkill === skill.id ? 0.4 : 0}
              shininess={100}
            />
          </mesh>
          
          {/* Inner glow effect */}
          <mesh>
            <sphereGeometry args={[0.08, 12, 12]} />
            <meshBasicMaterial
              color={skill.color}
              transparent
              opacity={hoveredSkill === skill.id ? 0.2 : 0.1}
              side={THREE.BackSide}
            />
          </mesh>
          
          {/* Pulsing ring for interactive feedback */}
          {(hoveredSkill === skill.id || selectedSkill === skill.id) && (
            <>
              <mesh rotation={[Math.PI / 2, 0, 0]}>
                <ringGeometry args={[0.1, 0.15, 16]} />
                <meshBasicMaterial
                  color={skill.color}
                  transparent
                  opacity={0.6}
                  side={THREE.DoubleSide}
                />
              </mesh>
              
              {/* Outer ring for selected state */}
              {selectedSkill === skill.id && (
                <mesh rotation={[Math.PI / 2, 0, 0]}>
                  <ringGeometry args={[0.18, 0.22, 16]} />
                  <meshBasicMaterial
                    color={skill.color}
                    transparent
                    opacity={0.3}
                    side={THREE.DoubleSide}
                  />
                </mesh>
              )}
            </>
          )}
          
          {/* Skill level indicator */}
          <mesh position={[0, 0.12, 0]} rotation={[0, 0, 0]}>
            <cylinderGeometry args={[0.01, 0.01, skill.proficiencyLevel / 100 * 0.2, 8]} />
            <meshBasicMaterial color={skill.color} transparent opacity={0.8} />
          </mesh>
        </group>
      ))}
      
      {/* Ambient glow effect */}
      <mesh>
        <sphereGeometry args={[radius * 1.1, 32, 32]} />
        <meshBasicMaterial
          color="#3b82f6"
          transparent
          opacity={0.05}
          side={THREE.BackSide}
        />
      </mesh>
    </group>
  )
}

export default Globe3D