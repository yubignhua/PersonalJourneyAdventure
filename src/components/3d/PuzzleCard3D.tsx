'use client'

import React, { useRef, useEffect, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { PuzzleCard3DProps } from '@/types/3d'

const PuzzleCard3D: React.FC<PuzzleCard3DProps> = ({
  skill,
  isSelected,
  isHovered,
  onClick,
  onHover,
  animationTime,
  position,
  scale = 1,
  unlocked = true,
  showConnections = false,
  sphereRadius = 2
}) => {
  const cardRef = useRef<THREE.Group>(null)
  const cardMeshRef = useRef<THREE.Mesh>(null)
  const glowRef = useRef<THREE.Mesh>(null)
  
  // Calculate the normal vector from sphere center to card position
  const normal = useMemo(() => {
    const pos = new THREE.Vector3(...position)
    return pos.normalize()
  }, [position])
  
  // Calculate rotation to align card with sphere surface
  const surfaceRotation = useMemo(() => {
    const pos = new THREE.Vector3(...position)
    const normal = pos.normalize()
    
    // Create rotation matrix to align with normal
    const quaternion = new THREE.Quaternion()
    const up = new THREE.Vector3(0, 1, 0)
    quaternion.setFromUnitVectors(up, normal)
    
    return quaternion
  }, [position])
  
  // Generate realistic puzzle piece geometry
  const puzzleGeometry = useMemo(() => {
    const pieceSize = 0.11 // Even smaller for tighter packing
    const tabSize = 0.018 // Slightly larger tabs for better connection
    const segments = 48 // Higher resolution for smoother curves
    
    // Create a more realistic puzzle piece shape
    const shape = new THREE.Shape()
    
    // Create rounded rectangle base
    const cornerRadius = 0.008
    const width = pieceSize
    const height = pieceSize
    
    // Enhanced tab/blank generation with better connections
    const getTabType = (charCode: number, edgeIndex: number) => {
      // Create complementary tabs and blanks for better fitting
      const baseType = Math.abs(charCode + edgeIndex * 13) % 3
      return baseType
    }
    
    // Start from bottom-left with rounded corner
    shape.moveTo(-width/2 + cornerRadius, -height/2)
    shape.lineTo(-width/4, -height/2)
    
    // Bottom tab/blank based on position hash with complementary logic
    const bottomTabType = getTabType(skill.id.charCodeAt(0), 0)
    if (bottomTabType === 0) {
      // Tab pointing out - smoother curves
      shape.lineTo(-tabSize/2, -height/2)
      shape.quadraticCurveTo(-tabSize/2, -height/2 - tabSize * 0.8, 0, -height/2 - tabSize)
      shape.quadraticCurveTo(tabSize/2, -height/2 - tabSize * 0.8, tabSize/2, -height/2)
    } else if (bottomTabType === 1) {
      // Blank (indentation) - deeper for better fit
      shape.lineTo(-tabSize/2, -height/2)
      shape.quadraticCurveTo(-tabSize/2, -height/2 + tabSize * 1.2, 0, -height/2 + tabSize)
      shape.quadraticCurveTo(tabSize/2, -height/2 + tabSize * 1.2, tabSize/2, -height/2)
    }
    // else: straight edge
    
    shape.lineTo(width/4, -height/2)
    shape.lineTo(width/2, -height/2)
    shape.lineTo(width/2, -height/4)
    
    // Right tab/blank
    const rightTabType = getTabType(skill.id.charCodeAt(1), 1)
    if (rightTabType === 0) {
      // Tab pointing out
      shape.lineTo(width/2, -tabSize/2)
      shape.quadraticCurveTo(width/2 + tabSize * 0.8, -tabSize/2, width/2 + tabSize, 0)
      shape.quadraticCurveTo(width/2 + tabSize * 0.8, tabSize/2, width/2, tabSize/2)
    } else if (rightTabType === 1) {
      // Blank (indentation)
      shape.lineTo(width/2, -tabSize/2)
      shape.quadraticCurveTo(width/2 - tabSize * 1.2, -tabSize/2, width/2 - tabSize, 0)
      shape.quadraticCurveTo(width/2 - tabSize * 1.2, tabSize/2, width/2, tabSize/2)
    }
    
    shape.lineTo(width/2, height/4)
    shape.lineTo(width/2, height/2)
    shape.lineTo(width/4, height/2)
    
    // Top tab/blank
    const topTabType = getTabType(skill.id.charCodeAt(2), 2)
    if (topTabType === 0) {
      // Tab pointing out
      shape.lineTo(tabSize/2, height/2)
      shape.quadraticCurveTo(tabSize/2, height/2 + tabSize * 0.8, 0, height/2 + tabSize)
      shape.quadraticCurveTo(-tabSize/2, height/2 + tabSize * 0.8, -tabSize/2, height/2)
    } else if (topTabType === 1) {
      // Blank (indentation)
      shape.lineTo(tabSize/2, height/2)
      shape.quadraticCurveTo(tabSize/2, height/2 - tabSize * 1.2, 0, height/2 - tabSize)
      shape.quadraticCurveTo(-tabSize/2, height/2 - tabSize * 1.2, -tabSize/2, height/2)
    }
    
    shape.lineTo(-width/4, height/2)
    shape.lineTo(-width/2, height/2)
    shape.lineTo(-width/2, height/4)
    
    // Left tab/blank
    const leftTabType = getTabType(skill.id.charCodeAt(3), 3)
    if (leftTabType === 0) {
      // Tab pointing out
      shape.lineTo(-width/2, tabSize/2)
      shape.quadraticCurveTo(-width/2 - tabSize * 0.8, tabSize/2, -width/2 - tabSize, 0)
      shape.quadraticCurveTo(-width/2 - tabSize * 0.8, -tabSize/2, -width/2, -tabSize/2)
    } else if (leftTabType === 1) {
      // Blank (indentation)
      shape.lineTo(-width/2, tabSize/2)
      shape.quadraticCurveTo(-width/2 + tabSize * 1.2, tabSize/2, -width/2 + tabSize, 0)
      shape.quadraticCurveTo(-width/2 + tabSize * 1.2, -tabSize/2, -width/2, -tabSize/2)
    }
    
    shape.lineTo(-width/2, -height/4)
    shape.lineTo(-width/2, -height/2)
    
    // Create extruded geometry with enhanced 3D depth
    const extrudeSettings = {
      depth: 0.012, // Increased depth for better 3D effect
      bevelEnabled: true,
      bevelSegments: 3, // More segments for smoother bevels
      steps: 3, // More steps for better extrusion quality
      bevelSize: 0.004, // Larger bevel for more pronounced edge
      bevelThickness: 0.003
    }
    
    const flatGeometry = new THREE.ExtrudeGeometry(shape, extrudeSettings)
    
    // Apply enhanced sphere curvature with precise surface fitting
    const positions = flatGeometry.attributes.position.array
    const radius = sphereRadius
    
    for (let i = 0; i < positions.length; i += 3) {
      const x = positions[i]
      const y = positions[i + 1]
      const z = positions[i + 2] // Original Z from extrusion
      
      // Calculate distance from center
      const distance = Math.sqrt(x * x + y * y)
      
      // Calculate curvature offset
      const curvature = distance * distance / (2 * radius)
      
      // Apply curvature with depth-aware positioning
      // Front face (positive Z) gets more curvature, back face less
      const depthFactor = z > 0 ? 0.8 : 1.2
      positions[i + 2] = -curvature * depthFactor + z * 0.7
    }
    
    flatGeometry.attributes.position.needsUpdate = true
    flatGeometry.computeVertexNormals()
    
    // Apply edge highlighting for better piece definition
    const edges = new THREE.EdgesGeometry(flatGeometry)
    
    return flatGeometry
  }, [sphereRadius, skill.id])
  
  // Enhanced card material with better visual effects
  const cardMaterial = useMemo(() => {
    const baseColor = new THREE.Color(skill.color)
    const isLocked = !unlocked
    
    return new THREE.MeshPhongMaterial({
      color: isLocked ? '#444444' : baseColor,
      emissive: isHovered || isSelected ? baseColor : '#000000',
      emissiveIntensity: isHovered ? 0.4 : isSelected ? 0.25 : 0,
      shininess: isLocked ? 30 : 120,
      specular: isLocked ? '#222222' : new THREE.Color(0.3, 0.3, 0.3),
      transparent: true,
      opacity: isLocked ? 0.7 : 0.95,
      wireframe: isLocked,
      side: THREE.DoubleSide,
      flatShading: false // Smooth shading for better appearance
    })
  }, [skill.color, isHovered, isSelected, unlocked])
  
  // Edge highlighting material for better piece definition
  const edgeMaterial = useMemo(() => {
    return new THREE.LineBasicMaterial({
      color: new THREE.Color(skill.color).multiplyScalar(0.8),
      transparent: true,
      opacity: unlocked ? 0.6 : 0.3,
      linewidth: 1
    })
  }, [skill.color, unlocked])
  
  // Glow effect material
  const glowMaterial = useMemo(() => {
    return new THREE.MeshBasicMaterial({
      color: skill.color,
      transparent: true,
      opacity: (isHovered ? 0.35 : isSelected ? 0.25 : 0.15) * (unlocked ? 1 : 0.5),
      side: THREE.BackSide
    })
  }, [skill.color, isHovered, isSelected, unlocked])
  
  // Animation loop
  useFrame((state, delta) => {
    if (!cardRef.current) return
    
    // Position card on sphere surface
    const pos = new THREE.Vector3(...position)
    const surfacePos = pos.normalize().multiplyScalar(sphereRadius)
    cardRef.current.position.copy(surfacePos)
    
    // Apply surface rotation
    cardRef.current.quaternion.copy(surfaceRotation)
    
    // Add subtle pulsing for hover/selection
    const targetScale = (isHovered || isSelected) ? 1.1 : 1
    cardRef.current.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), delta * 5)
    
    // Card flip animation when selected (rotate around surface normal)
    if (isSelected && cardMeshRef.current) {
      const flipSpeed = Math.sin(animationTime * 3) * 0.1
      cardMeshRef.current.rotation.z = flipSpeed
    } else if (cardMeshRef.current) {
      cardMeshRef.current.rotation.z *= 0.9
    }
    
    // Glow pulsing
    if (glowRef.current) {
      const glowScale = 1 + Math.sin(animationTime * 4) * 0.05
      glowRef.current.scale.setScalar(glowScale)
    }
  })
  
  // Handle click
  const handleClick = () => {
    if (unlocked) {
      onClick(skill)
    }
  }
  
  // Handle hover
  const handlePointerEnter = () => {
    onHover(skill.id)
  }
  
  const handlePointerLeave = () => {
    onHover(null)
  }
  
  return (
    <group 
      ref={cardRef}
      scale={[scale, scale, scale]}
    >
      {/* Main curved puzzle piece */}
      <mesh
        ref={cardMeshRef}
        geometry={puzzleGeometry}
        material={cardMaterial}
        onClick={handleClick}
        onPointerEnter={handlePointerEnter}
        onPointerLeave={handlePointerLeave}
        castShadow
        receiveShadow
      />
      
      {/* Edge highlighting for better piece definition */}
      {unlocked && (
        <lineSegments>
          <edgesGeometry attach="geometry" args={[puzzleGeometry]} />
          <primitive object={edgeMaterial} attach="material" />
        </lineSegments>
      )}
      
      {/* Enhanced surface glow effect */}
      <mesh ref={glowRef} position={[0, 0, -0.015]}>
        <planeGeometry args={[0.16, 0.16]} />
        <meshBasicMaterial color={skill.color} transparent opacity={0.25} side={THREE.DoubleSide} />
      </mesh>
      
      {/* Enhanced tech circuit pattern overlay */}
      <mesh position={[0, 0, 0.012]}>
        <planeGeometry args={[0.11, 0.11]} />
        <meshBasicMaterial
          color={skill.color}
          transparent
          opacity={0.35}
          wireframe
        />
      </mesh>
      
      {/* Enhanced proficiency indicator */}
      {unlocked && (
        <mesh position={[0, 0.06, 0.012]}>
          <boxGeometry args={[skill.proficiencyLevel / 100 * 0.09, 0.004, 0.004]} />
          <meshBasicMaterial color={skill.color} />
        </mesh>
      )}
      
      {/* Enhanced lock indicator */}
      {!unlocked && (
        <mesh position={[0, 0, 0.018]}>
          <cylinderGeometry args={[0.012, 0.012, 0.008, 8]} />
          <meshBasicMaterial color="#666666" />
        </mesh>
      )}
      
      {/* Enhanced selection ring - appears on surface */}
      {(isHovered || isSelected) && unlocked && (
        <group>
          <mesh position={[0, 0, 0.018]} rotation={[0, 0, 0]}>
            <ringGeometry args={[0.08, 0.10, 24]} />
            <meshBasicMaterial
              color={skill.color}
              transparent
              opacity={0.7}
              side={THREE.DoubleSide}
            />
          </mesh>
          
          {/* Outer ring for selected state */}
          {isSelected && (
            <mesh position={[0, 0, 0.022]} rotation={[0, 0, 0]}>
              <ringGeometry args={[0.11, 0.13, 24]} />
              <meshBasicMaterial
                color={skill.color}
                transparent
                opacity={0.4}
                side={THREE.DoubleSide}
              />
            </mesh>
          )}
        </group>
      )}
    </group>
  )
}

export default PuzzleCard3D