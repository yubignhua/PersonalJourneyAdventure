'use client'

import React from 'react'

export interface Scene3DFallbackProps {
  reason: 'webgl-not-supported' | 'rendering-error' | 'performance-fallback'
  onRetry?: () => void
  className?: string
}

export const Scene3DFallback: React.FC<Scene3DFallbackProps> = ({
  reason,
  onRetry,
  className = '',
}) => {
  const getReasonMessage = () => {
    switch (reason) {
      case 'webgl-not-supported':
        return {
          title: 'WebGL Not Supported',
          message: 'Your browser doesn\'t support WebGL, which is required for 3D graphics. You can still explore the content in 2D mode.',
          showRetry: false,
        }
      case 'rendering-error':
        return {
          title: '3D Rendering Issue',
          message: 'We encountered a problem with 3D rendering. The content is available in 2D mode.',
          showRetry: true,
        }
      case 'performance-fallback':
        return {
          title: 'Performance Optimization',
          message: 'We\'ve switched to 2D mode to ensure smooth performance on your device.',
          showRetry: true,
        }
      default:
        return {
          title: 'Fallback Mode',
          message: 'Content is displayed in 2D mode for optimal compatibility.',
          showRetry: false,
        }
    }
  }

  const { title, message, showRetry } = getReasonMessage()

  return (
    <div className={`scene-3d-fallback ${className}`}>
      <div className="flex flex-col items-center justify-center min-h-[300px] p-6 bg-gradient-to-br from-blue-900/20 to-purple-900/20 rounded-lg border border-blue-500/30">
        <div className="text-center space-y-4 max-w-md">
          {/* Fallback Icon */}
          <div className="mx-auto w-16 h-16 bg-blue-500/20 rounded-full flex items-center justify-center">
            <svg 
              className="w-8 h-8 text-blue-400" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" 
              />
            </svg>
          </div>

          {/* Message */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-2">
              {title}
            </h3>
            <p className="text-gray-300 text-sm leading-relaxed">
              {message}
            </p>
          </div>

          {/* 2D Content Placeholder */}
          <div className="mt-6 p-4 bg-gray-800/50 rounded-lg border border-gray-600">
            <div className="grid grid-cols-3 gap-2 mb-3">
              {[...Array(6)].map((_, i) => (
                <div 
                  key={i}
                  className="h-8 bg-gradient-to-r from-blue-500/30 to-purple-500/30 rounded animate-pulse"
                  style={{ animationDelay: `${i * 0.1}s` }}
                />
              ))}
            </div>
            <p className="text-xs text-gray-400">
              Interactive 2D content available
            </p>
          </div>

          {/* Retry Button */}
          {showRetry && onRetry && (
            <button
              onClick={onRetry}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-900"
            >
              Try 3D Mode Again
            </button>
          )}

          {/* Browser Compatibility Info */}
          {reason === 'webgl-not-supported' && (
            <div className="mt-4 p-3 bg-yellow-900/20 border border-yellow-500/30 rounded text-xs text-yellow-200">
              <p className="font-medium mb-1">For the best experience:</p>
              <ul className="text-left space-y-1">
                <li>• Use a modern browser (Chrome, Firefox, Safari, Edge)</li>
                <li>• Enable hardware acceleration in browser settings</li>
                <li>• Update your graphics drivers</li>
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Scene3DFallback