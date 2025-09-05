'use client'

import React, { Component, ReactNode } from 'react'

interface Props {
    children: ReactNode
    fallback?: ReactNode
}

interface State {
    hasError: boolean
    error?: Error
}

class Scene3DErrorBoundaryWrapper extends Component<Props, State> {
    constructor(props: Props) {
        super(props)
        this.state = { hasError: false }
    }

    static getDerivedStateFromError(error: Error): State {
        return { hasError: true, error }
    }

    componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
        console.error('3D Scene Error:', error, errorInfo)
    }

    render() {
        if (this.state.hasError) {
            if (this.props.fallback) {
                return this.props.fallback
            }

            return (
                <div className="w-full h-full flex items-center justify-center bg-gradient-to-b from-purple-900 via-blue-900 to-black">
                    <div className="text-center text-white">
                        <div className="mx-auto w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mb-4">
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
                        <h3 className="text-xl font-semibold mb-2">3D Rendering Error</h3>
                        <p className="text-gray-300 mb-4">
                            We encountered an issue with 3D rendering. Don&apos;t worry - you can still explore the content in 2D mode.
                        </p>
                        <div className="flex gap-3 justify-center">
                            <button
                                onClick={() => this.setState({ hasError: false })}
                                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                            >
                                Try 3D Again
                            </button>
                            <button
                                onClick={() => window.location.reload()}
                                className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors"
                            >
                                Reload Page
                            </button>
                        </div>
                        <p className="text-sm text-gray-400 mt-4">
                            The page will continue to work with 2D fallback components.
                        </p>
                    </div>
                </div>
            )
        }

        return this.props.children
    }
}

export default Scene3DErrorBoundaryWrapper