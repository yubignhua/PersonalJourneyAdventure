'use client'

import React from 'react'

export interface LoadingSpinnerProps {
  message?: string
  className?: string
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  message = 'Loading 3D Scene...',
  className = '',
}) => {
  return (
    <div className={`loading-spinner ${className}`}>
      <div className="flex flex-col items-center justify-center min-h-[300px] p-6">
        {/* Animated 3D-style loader */}
        <div className="relative">
          {/* Outer ring */}
          <div className="w-16 h-16 border-4 border-blue-500/30 rounded-full animate-spin">
            <div className="absolute top-0 left-0 w-full h-full border-4 border-transparent border-t-blue-500 rounded-full animate-spin" 
                 style={{ animationDuration: '1s' }} />
          </div>
          
          {/* Inner ring */}
          <div className="absolute top-2 left-2 w-12 h-12 border-4 border-purple-500/30 rounded-full animate-spin" 
               style={{ animationDirection: 'reverse', animationDuration: '1.5s' }}>
            <div className="absolute top-0 left-0 w-full h-full border-4 border-transparent border-t-purple-500 rounded-full animate-spin" 
                 style={{ animationDirection: 'reverse', animationDuration: '1.5s' }} />
          </div>
          
          {/* Center dot */}
          <div className="absolute top-1/2 left-1/2 w-2 h-2 bg-white rounded-full transform -translate-x-1/2 -translate-y-1/2 animate-pulse" />
        </div>

        {/* Loading message */}
        <div className="mt-4 text-center">
          <p className="text-white font-medium">{message}</p>
          <div className="flex justify-center mt-2 space-x-1">
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"
                style={{ animationDelay: `${i * 0.2}s` }}
              />
            ))}
          </div>
        </div>

        {/* Progress indicators */}
        <div className="mt-6 w-full max-w-xs">
          <div className="flex justify-between text-xs text-gray-400 mb-2">
            <span>Initializing WebGL</span>
            <span>Loading Assets</span>
            <span>Ready</span>
          </div>
          <div className="w-full bg-gray-700 rounded-full h-1">
            <div className="bg-gradient-to-r from-blue-500 to-purple-500 h-1 rounded-full animate-pulse" 
                 style={{ width: '60%' }} />
          </div>
        </div>

        {/* Tip */}
        <p className="mt-4 text-xs text-gray-400 text-center max-w-sm">
          First time loading may take a moment while we initialize the 3D environment
        </p>
      </div>
    </div>
  )
}

export default LoadingSpinner