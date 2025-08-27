'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { ProjectIslandComponentProps } from '@/types/adventure-map'

const ISLAND_THEMES = {
  tropical: {
    colors: ['#228B22', '#32CD32', '#90EE90'],
    accent: '#FFD700',
    water: '#00CED1'
  },
  arctic: {
    colors: ['#E0E0E0', '#F0F8FF', '#B0E0E6'],
    accent: '#87CEEB',
    water: '#4682B4'
  },
  volcanic: {
    colors: ['#8B4513', '#A0522D', '#CD853F'],
    accent: '#FF4500',
    water: '#DC143C'
  },
  mystical: {
    colors: ['#9370DB', '#8A2BE2', '#9932CC'],
    accent: '#FFB6C1',
    water: '#4B0082'
  },
  tech: {
    colors: ['#2F4F4F', '#708090', '#778899'],
    accent: '#00FFFF',
    water: '#191970'
  }
}

const SIZE_CONFIGS = {
  small: { radius: 25, strokeWidth: 2, glowRadius: 30 },
  medium: { radius: 35, strokeWidth: 3, glowRadius: 40 },
  large: { radius: 50, strokeWidth: 4, glowRadius: 60 }
}

export const ProjectIslandComponent: React.FC<ProjectIslandComponentProps> = ({
  island,
  onClick,
  onHover,
  isSelected,
  isHovered,
  scale = 1
}) => {
  const theme = ISLAND_THEMES[island.position.theme]
  const sizeConfig = SIZE_CONFIGS[island.position.size]
  
  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    onClick(island)
  }
  
  const handleMouseEnter = () => {
    onHover(island)
  }
  
  const handleMouseLeave = () => {
    onHover(null)
  }

  // Generate island shape based on theme and size
  const generateIslandPath = () => {
    const { radius } = sizeConfig
    const centerX = island.position.x * 100
    const centerY = island.position.y * 100
    
    // Create organic island shape using multiple curves
    const points = []
    const numPoints = 8
    
    for (let i = 0; i < numPoints; i++) {
      const angle = (i / numPoints) * Math.PI * 2
      const variation = 0.7 + Math.sin(angle * 3) * 0.3 // Organic variation
      const x = centerX + Math.cos(angle) * radius * variation
      const y = centerY + Math.sin(angle) * radius * variation
      points.push({ x, y })
    }
    
    // Create smooth path using quadratic curves
    let path = `M ${points[0].x} ${points[0].y}`
    
    for (let i = 0; i < points.length; i++) {
      const current = points[i]
      const next = points[(i + 1) % points.length]
      const controlX = (current.x + next.x) / 2
      const controlY = (current.y + next.y) / 2
      
      path += ` Q ${current.x} ${current.y} ${controlX} ${controlY}`
    }
    
    path += ' Z'
    return path
  }

  // Status indicator color
  const getStatusColor = () => {
    switch (island.status) {
      case 'completed': return '#22C55E'
      case 'in-development': return '#F59E0B'
      case 'planning': return '#6B7280'
      case 'maintained': return '#3B82F6'
      case 'archived': return '#9CA3AF'
      default: return '#6B7280'
    }
  }

  // Animation variants
  const islandVariants = {
    idle: {
      scale: 1,
      filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.2))'
    },
    hovered: {
      scale: 1.1,
      filter: 'drop-shadow(0 8px 16px rgba(0,0,0,0.3))'
    },
    selected: {
      scale: 1.15,
      filter: 'drop-shadow(0 12px 24px rgba(0,0,0,0.4))'
    }
  }

  const glowVariants = {
    idle: { opacity: 0 },
    hovered: { opacity: 0.6 },
    selected: { opacity: 0.8 }
  }

  const currentState = isSelected ? 'selected' : isHovered ? 'hovered' : 'idle'

  return (
    <g className="cursor-pointer">
      {/* Glow effect */}
      <motion.circle
        cx={island.position.x * 100}
        cy={island.position.y * 100}
        r={sizeConfig.glowRadius}
        fill={theme.accent}
        variants={glowVariants}
        animate={currentState}
        transition={{ duration: 0.3 }}
        style={{ filter: 'blur(8px)' }}
      />
      
      {/* Main island shape */}
      <motion.path
        d={generateIslandPath()}
        fill={`url(#island-gradient-${island.id})`}
        stroke={theme.accent}
        strokeWidth={sizeConfig.strokeWidth}
        variants={islandVariants}
        animate={currentState}
        transition={{ duration: 0.3, type: 'spring', stiffness: 300 }}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onClick={handleClick}
      />
      
      {/* Island gradient definition */}
      <defs>
        <radialGradient id={`island-gradient-${island.id}`}>
          <stop offset="0%" stopColor={theme.colors[2]} />
          <stop offset="50%" stopColor={theme.colors[1]} />
          <stop offset="100%" stopColor={theme.colors[0]} />
        </radialGradient>
      </defs>
      
      {/* Status indicator */}
      <motion.circle
        cx={island.position.x * 100 + sizeConfig.radius * 0.7}
        cy={island.position.y * 100 - sizeConfig.radius * 0.7}
        r={6}
        fill={getStatusColor()}
        stroke="#ffffff"
        strokeWidth="2"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.5, type: 'spring' }}
      />
      
      {/* Featured star */}
      {island.featured && (
        <motion.g
          transform={`translate(${island.position.x * 100 - sizeConfig.radius * 0.7}, ${island.position.y * 100 - sizeConfig.radius * 0.7})`}
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ delay: 0.7, type: 'spring' }}
        >
          <path
            d="M0,-8 L2.4,-2.4 L8,0 L2.4,2.4 L0,8 L-2.4,2.4 L-8,0 L-2.4,-2.4 Z"
            fill="#FFD700"
            stroke="#FFA500"
            strokeWidth="1"
          />
        </motion.g>
      )}
      
      {/* Tech stack indicators (small dots around the island) */}
      {island.techStack.slice(0, 6).map((tech, index) => {
        const angle = (index / 6) * Math.PI * 2
        const dotRadius = sizeConfig.radius + 15
        const x = island.position.x * 100 + Math.cos(angle) * dotRadius
        const y = island.position.y * 100 + Math.sin(angle) * dotRadius
        
        return (
          <motion.circle
            key={tech.name}
            cx={x}
            cy={y}
            r={3}
            fill={tech.color || theme.accent}
            stroke="#ffffff"
            strokeWidth="1"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 1 + index * 0.1, type: 'spring' }}
          />
        )
      })}
      
      {/* Island name (visible when hovered or selected) */}
      {(isHovered || isSelected) && (
        <motion.text
          x={island.position.x * 100}
          y={island.position.y * 100 + sizeConfig.radius + 20}
          textAnchor="middle"
          className="fill-white text-sm font-semibold"
          style={{ 
            filter: 'drop-shadow(1px 1px 2px rgba(0,0,0,0.8))',
            fontSize: Math.max(12, 14 / scale) // Adjust font size based on zoom
          }}
          initial={{ opacity: 0, y: island.position.y * 100 + sizeConfig.radius + 10 }}
          animate={{ opacity: 1, y: island.position.y * 100 + sizeConfig.radius + 20 }}
          exit={{ opacity: 0, y: island.position.y * 100 + sizeConfig.radius + 10 }}
          transition={{ duration: 0.2 }}
        >
          {island.name}
        </motion.text>
      )}
      
      {/* Interaction ripple effect */}
      {isSelected && (
        <motion.circle
          cx={island.position.x * 100}
          cy={island.position.y * 100}
          r={sizeConfig.radius}
          fill="none"
          stroke={theme.accent}
          strokeWidth="2"
          initial={{ r: sizeConfig.radius, opacity: 1 }}
          animate={{ r: sizeConfig.radius * 2, opacity: 0 }}
          transition={{ duration: 1, repeat: Infinity }}
        />
      )}
    </g>
  )
}