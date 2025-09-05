'use client'

import React, { useEffect, useRef } from 'react'
import { Canvas } from '@react-three/fiber'

interface SafeCanvasProps {
  children: React.ReactNode
  className?: string
  camera?: any
  gl?: any
}

const SafeCanvas: React.FC<SafeCanvasProps> = ({ children, ...props }) => {
  const canvasRef = useRef<HTMLDivElement>(null)
  const [mounted, setMounted] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)

  // Ensure component is mounted before rendering Canvas
  useEffect(() => {
    setMounted(true)
    return () => {
      setMounted(false)
    }
  }, [])

  // Error boundary fallback
  if (error) {
    return (
      <div ref={canvasRef} className={props.className}>
        <div className="w-full h-full flex items-center justify-center bg-black/20">
          <div className="text-center text-white">
            <div className="text-2xl mb-4">🌍</div>
            <p className="text-sm opacity-80">3D visualization unavailable</p>
            <p className="text-xs opacity-60 mt-2">{error}</p>
          </div>
        </div>
      </div>
    )
  }

  // Don't render Canvas until component is mounted
  if (!mounted) {
    return (
      <div ref={canvasRef} className={props.className}>
        <div className="w-full h-full flex items-center justify-center">
          <div className="text-white">Loading 3D scene...</div>
        </div>
      </div>
    )
  }

  try {
    return (
      <div ref={canvasRef}>
        <Canvas {...props}>
          {children}
        </Canvas>
      </div>
    )
  } catch (err) {
    setError(err instanceof Error ? err.message : 'Unknown error')
    return null
  }
}

export default SafeCanvas