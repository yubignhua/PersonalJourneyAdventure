'use client'

import React, { useState, useEffect, useCallback, useRef } from 'react'

interface TypewriterEffectProps {
  text: string | string[]
  speed?: number
  delay?: number
  onComplete?: () => void
  className?: string
  cursor?: boolean
  loop?: boolean
  pauseBetween?: number
}

const TypewriterEffect: React.FC<TypewriterEffectProps> = ({
  text,
  speed = 50,
  delay = 0,
  onComplete,
  className = '',
  cursor = true,
  loop = false,
  pauseBetween = 2000
}) => {
  const [displayText, setDisplayText] = useState('')
  const [showCursor, setShowCursor] = useState(true)
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)
  const completedRef = useRef(false)

  const textArray = Array.isArray(text) ? text : [text]
  const fullText = textArray[0] // For simplicity, just use the first text for now

  const typeText = useCallback(() => {
    if (completedRef.current) return

    let currentIndex = 0
    
    const type = () => {
      if (currentIndex <= fullText.length) {
        setDisplayText(fullText.slice(0, currentIndex))
        currentIndex++
        
        if (currentIndex <= fullText.length) {
          timeoutRef.current = setTimeout(type, currentIndex === 1 ? delay : speed)
        } else {
          // Typing complete
          completedRef.current = true
          if (onComplete) {
            onComplete()
          }
        }
      }
    }

    // Start typing after initial delay
    timeoutRef.current = setTimeout(type, delay)
  }, [fullText, speed, delay, onComplete])

  // Start typing effect
  useEffect(() => {
    completedRef.current = false
    setDisplayText('')
    typeText()

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [typeText])

  // Cursor blinking effect
  useEffect(() => {
    if (cursor) {
      intervalRef.current = setInterval(() => {
        setShowCursor(prev => !prev)
      }, 500)
      
      return () => {
        if (intervalRef.current) {
          clearInterval(intervalRef.current)
        }
      }
    }
  }, [cursor])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [])

  return (
    <span className={className}>
      {displayText}
      {cursor && (
        <span 
          className={`inline-block w-0.5 h-5 bg-current ml-1 ${
            showCursor ? 'opacity-100' : 'opacity-0'
          } transition-opacity duration-100`}
        />
      )}
    </span>
  )
}

export default TypewriterEffect