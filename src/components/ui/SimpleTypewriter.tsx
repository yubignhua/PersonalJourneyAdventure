'use client'

import React, { useState, useEffect } from 'react'

interface SimpleTypewriterProps {
  text: string
  speed?: number
  onComplete?: () => void
  className?: string
}

const SimpleTypewriter: React.FC<SimpleTypewriterProps> = ({
  text,
  speed = 100,
  onComplete,
  className = ''
}) => {
  const [displayText, setDisplayText] = useState('')
  const [currentIndex, setCurrentIndex] = useState(0)

  useEffect(() => {
    if (currentIndex < text.length) {
      const timer = setTimeout(() => {
        setDisplayText(prev => prev + text[currentIndex])
        setCurrentIndex(prev => prev + 1)
      }, speed)

      return () => clearTimeout(timer)
    } else if (currentIndex === text.length && onComplete) {
      onComplete()
    }
  }, [currentIndex, text, speed, onComplete])

  return (
    <span className={className}>
      {displayText}
      <span className="animate-pulse">|</span>
    </span>
  )
}

export default SimpleTypewriter