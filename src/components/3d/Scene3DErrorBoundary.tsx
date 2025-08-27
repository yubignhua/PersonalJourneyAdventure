'use client'

import React from 'react'
import { FallbackProps } from 'react-error-boundary'

export interface Scene3DErrorBoundaryProps extends FallbackProps {
  className?: string
}

export const Scene3DErrorBoundary: React.FC<Scene3DErrorBoundaryProps> = ({
  error,
  resetErrorBoundary,
  className = '',
}) => {
  return (
    <div className={`scene-3d-error-boundary ${className}`}>
      <div className="flex flex-col items-center justify-center min-h-[400px] p-8 bg-gradient-to-br from-gray-900 to-gray-800 rounded-lg border border-gray-700">
        <div className="text-center space-y-4">
          {/* Error Icon */}
          <div className="mx-auto w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center">
            <svg 
              className="w-8 h-8 text-red-400" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" 
              />
            </svg>
          </div>

          {/* Error Message */}
          <div>
            <h3 className="text-xl font-semibold text-white mb-2">
              3D Rendering Error
            </h3>
            <p className="text-gray-300 mb-4 max-w-md">
              We encountered an issue with 3D rendering. Don&apos;t worry - you can still explore the content in 2D mode.
            </p>
          </div>

          {/* Error Details (Development Only) */}
          {process.env.NODE_ENV === 'development' && error && (
            <details className="text-left bg-gray-800 p-4 rounded border border-gray-600 max-w-lg">
              <summary className="text-red-400 cursor-pointer mb-2">
                Error Details (Development)
              </summary>
              <pre className="text-xs text-gray-300 overflow-auto">
                {error.message}
                {error.stack && (
                  <>
                    {'\n\nStack Trace:\n'}
                    {error.stack}
                  </>
                )}
              </pre>
            </details>
          )}

          {/* Action Buttons */}
          <div className="flex gap-3 justify-center">
            <button
              onClick={resetErrorBoundary}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-800"
            >
              Try 3D Again
            </button>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 focus:ring-offset-gray-800"
            >
              Reload Page
            </button>
          </div>

          {/* Fallback Message */}
          <p className="text-sm text-gray-400 mt-4">
            The page will continue to work with 2D fallback components.
          </p>
        </div>
      </div>
    </div>
  )
}

export default Scene3DErrorBoundary