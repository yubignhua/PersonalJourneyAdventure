'use client'

import React, { useState, useEffect } from 'react'
import { SkillPoint } from '@/types/3d'

interface SkillAnimationProps {
  skill: SkillPoint | null
  onClose: () => void
  position?: [number, number, number]
}

const SkillAnimation: React.FC<SkillAnimationProps> = ({
  skill,
  onClose,
  position = [0, 0, 0]
}) => {
  const [isVisible, setIsVisible] = useState(false)
  const [animationPhase, setAnimationPhase] = useState<'enter' | 'display' | 'exit'>('enter')

  useEffect(() => {
    if (skill) {
      setIsVisible(true)
      setAnimationPhase('enter')
      
      // Transition to display phase
      const enterTimer = setTimeout(() => {
        setAnimationPhase('display')
      }, 300)
      
      return () => clearTimeout(enterTimer)
    } else {
      setAnimationPhase('exit')
      
      // Hide after exit animation
      const exitTimer = setTimeout(() => {
        setIsVisible(false)
      }, 300)
      
      return () => clearTimeout(exitTimer)
    }
  }, [skill])

  if (!isVisible || !skill) return null

  const getAnimationClasses = () => {
    switch (animationPhase) {
      case 'enter':
        return 'opacity-0 scale-50 translate-y-4'
      case 'display':
        return 'opacity-100 scale-100 translate-y-0'
      case 'exit':
        return 'opacity-0 scale-75 -translate-y-2'
      default:
        return 'opacity-0'
    }
  }

  // For now, we'll return null and handle skill display in the UI overlay
  // This will be enhanced in task 4.2 with proper HTML overlay
  return null
}

export default SkillAnimation