'use client'

import React, { useState, useCallback, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { SkillPoint } from '@/types/3d'

interface PuzzleInteractionProps {
  skills: SkillPoint[]
  onPuzzleComplete: (completedSkills: string[]) => void
  onSkillMatch: (skill1: SkillPoint, skill2: SkillPoint) => void
  animationTime: number
}

interface PuzzleMatch {
  skill1: SkillPoint
  skill2: SkillPoint
  position: [number, number, number]
  progress: number
}

const PuzzleInteraction: React.FC<PuzzleInteractionProps> = ({
  skills,
  onPuzzleComplete,
  onSkillMatch,
  animationTime
}) => {
  const [selectedSkill, setSelectedSkill] = useState<string | null>(null)
  const [matches, setMatches] = useState<PuzzleMatch[]>([])
  const [completedGroups, setCompletedGroups] = useState<Set<string>>(new Set())
  const [hintMode, setHintMode] = useState(false)
  const [draggedSkill, setDraggedSkill] = useState<string | null>(null)
  const groupRef = useRef<THREE.Group>(null)
  
  // Find matching skills based on category or connections
  const findMatches = useCallback((skillId: string) => {
    const skill = skills.find(s => s.id === skillId)
    if (!skill) return []
    
    return skills.filter(s => {
      if (s.id === skillId) return false
      
      // Match by category
      if (s.category === skill.category) return true
      
      // Match by puzzle connections
      if (skill.puzzlePiece && skill.puzzlePiece.connections.includes(s.id)) return true
      
      // Match by proficiency level (within 20%)
      if (Math.abs(s.proficiencyLevel - skill.proficiencyLevel) < 20) return true
      
      return false
    })
  }, [skills])
  
  // Handle skill selection
  const handleSkillSelect = useCallback((skillId: string) => {
    if (selectedSkill === null) {
      // First selection
      setSelectedSkill(skillId)
      setHintMode(true)
    } else if (selectedSkill === skillId) {
      // Deselect
      setSelectedSkill(null)
      setHintMode(false)
    } else {
      // Second selection - check for match
      const matches = findMatches(selectedSkill)
      const isMatch = matches.some(s => s.id === skillId)
      
      if (isMatch) {
        const skill1 = skills.find(s => s.id === selectedSkill)!
        const skill2 = skills.find(s => s.id === skillId)!
        
        // Create match animation
        const midPoint = [
          (skill1.position[0] + skill2.position[0]) / 2,
          (skill1.position[1] + skill2.position[1]) / 2,
          (skill1.position[2] + skill2.position[2]) / 2
        ] as [number, number, number]
        
        setMatches(prev => [...prev, {
          skill1,
          skill2,
          position: midPoint,
          progress: 0
        }])
        
        onSkillMatch(skill1, skill2)
        
        // Check for group completion
        const groupKey = `${skill1.category}-${Math.min(skill1.proficiencyLevel, skill2.proficiencyLevel)}`
        setCompletedGroups(prev => new Set([...Array.from(prev), groupKey]))
      }
      
      // Reset selection
      setSelectedSkill(null)
      setHintMode(false)
    }
  }, [selectedSkill, findMatches, skills, onSkillMatch])
  
  // Handle drag start
  const handleDragStart = useCallback((skillId: string) => {
    setDraggedSkill(skillId)
  }, [])
  
  // Handle drag end
  const handleDragEnd = useCallback(() => {
    setDraggedSkill(null)
  }, [])
  
  // Handle drop on another skill
  const handleDrop = useCallback((targetSkillId: string) => {
    if (draggedSkill && draggedSkill !== targetSkillId) {
      handleSkillSelect(targetSkillId)
    }
    setDraggedSkill(null)
  }, [draggedSkill, handleSkillSelect])
  
  // Animation loop
  useFrame((state, delta) => {
    // Update match animations
    setMatches(prev => 
      prev.map(match => ({
        ...match,
        progress: Math.min(match.progress + delta * 2, 1)
      })).filter(match => match.progress < 1.5)
    )
    
    // Check for puzzle completion
    const totalPossibleMatches = skills.length / 2
    const currentMatches = matches.length + completedGroups.size
    
    if (currentMatches >= totalPossibleMatches && matches.length > 0) {
      const completedSkillIds = matches.flatMap(m => [m.skill1.id, m.skill2.id])
      onPuzzleComplete(completedSkillIds)
    }
  })
  
  // Generate connection hints
  const renderHints = () => {
    if (!hintMode || !selectedSkill) return null
    
    const matchingSkills = findMatches(selectedSkill)
    
    return matchingSkills.map(skill => {
      const geometry = new THREE.BufferGeometry().setFromPoints([
        new THREE.Vector3(...skills.find(s => s.id === selectedSkill)!.position),
        new THREE.Vector3(...skill.position)
      ])
      const material = new THREE.LineBasicMaterial({
        color: skill.color,
        transparent: true,
        opacity: 0.3,
        linewidth: 2
      })
      
      return (
        <primitive
          key={`hint-${selectedSkill}-${skill.id}`}
          object={new THREE.Line(geometry, material)}
        />
      )
    })
  }
  
  // Render match animations
  const renderMatchAnimations = () => {
    return matches.map((match, index) => (
      <group key={`match-${index}`} position={match.position}>
        {/* Connection beam */}
        <mesh>
          <cylinderGeometry args={[0.02, 0.02, 0.5, 8]} />
          <meshBasicMaterial
            color={match.skill1.color}
            transparent
            opacity={match.progress * 0.8}
          />
        </mesh>
        
        {/* Energy particles */}
        {Array.from({ length: 10 }, (_, i) => (
          <mesh
            key={`particle-${i}`}
            position={[
              Math.sin(i * 0.628) * match.progress * 0.3,
              Math.cos(i * 0.628) * match.progress * 0.3,
              0
            ]}
          >
            <sphereGeometry args={[0.01, 4, 4]} />
            <meshBasicMaterial
              color={match.skill1.color}
              transparent
              opacity={1 - match.progress}
            />
          </mesh>
        ))}
        
        {/* Success ring */}
        {match.progress > 0.5 && (
          <mesh rotation={[Math.PI / 2, 0, 0]}>
            <ringGeometry args={[0.2, 0.3, 16]} />
            <meshBasicMaterial
              color={match.skill1.color}
              transparent
              opacity={(match.progress - 0.5) * 2}
            />
          </mesh>
        )}
      </group>
    ))
  }
  
  // Render completion effects
  const renderCompletionEffects = () => {
    if (completedGroups.size === 0) return null
    
    return (
      <group ref={groupRef}>
        {/* Completion celebration */}
        {Array.from({ length: 50 }, (_, i) => (
          <mesh
            key={`celebration-${i}`}
            position={[
              (Math.random() - 0.5) * 10,
              (Math.random() - 0.5) * 10,
              (Math.random() - 0.5) * 10
            ]}
          >
            <sphereGeometry args={[0.02, 4, 4]} />
            <meshBasicMaterial
              color={`hsl(${Math.random() * 360}, 70%, 60%)`}
              transparent
              opacity={0.8}
            />
          </mesh>
        ))}
      </group>
    )
  }
  
  return (
    <group>
      {/* Hints for matching */}
      {renderHints()}
      
      {/* Match animations */}
      {renderMatchAnimations()}
      
      {/* Completion effects */}
      {renderCompletionEffects()}
      
      {/* Interaction handlers (invisible mesh for click detection) */}
      {skills.map(skill => (
        <mesh
          key={`interaction-${skill.id}`}
          position={skill.position}
          onClick={() => handleSkillSelect(skill.id)}
          onPointerDown={() => handleDragStart(skill.id)}
          onPointerUp={() => handleDragEnd()}
          onPointerOver={() => {
            if (draggedSkill) {
              handleDrop(skill.id)
            }
          }}
        >
          <sphereGeometry args={[0.15, 8, 8]} />
          <meshBasicMaterial
            transparent
            opacity={0}
            visible={false}
          />
        </mesh>
      ))}
    </group>
  )
}

export default PuzzleInteraction