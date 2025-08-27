'use client'

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ProjectIsland, DemoInteraction, DemoInteractionResult } from '@/types/adventure-map'
import { useSocket } from '@/hooks/useSocket'
import { useAdventureMapStore } from '@/store/adventure-map'

interface InteractiveDemoProps {
  island: ProjectIsland
  onClose: () => void
  onComplete: (result: DemoInteractionResult) => void
}

export const InteractiveDemo: React.FC<InteractiveDemoProps> = ({
  island,
  onClose,
  onComplete
}) => {
  const [demoState, setDemoState] = useState<any>({})
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const { socket } = useSocket()
  const { completeDemo, incrementInteraction } = useAdventureMapStore()

  useEffect(() => {
    // Initialize demo state based on demo type
    if (island.demoConfig) {
      initializeDemo()
    }
  }, [island]) // eslint-disable-line react-hooks/exhaustive-deps

  const initializeDemo = () => {
    switch (island.demoConfig?.type) {
      case 'interactive-component':
        if (island.id === 'e-commerce-app') {
          setDemoState({
            cart: [],
            inventory: generateMockInventory(),
            totalPrice: 0
          })
        } else if (island.id === 'portfolio-website') {
          setDemoState({
            particleCount: 50,
            animationSpeed: 1,
            interactionCount: 0
          })
        }
        break
      default:
        setDemoState({})
    }
  }

  const generateMockInventory = () => [
    { id: 1, name: 'Wireless Headphones', price: 99.99, stock: 15, image: '🎧' },
    { id: 2, name: 'Smart Watch', price: 299.99, stock: 8, image: '⌚' },
    { id: 3, name: 'Laptop Stand', price: 49.99, stock: 25, image: '💻' },
    { id: 4, name: 'USB-C Hub', price: 79.99, stock: 12, image: '🔌' },
    { id: 5, name: 'Mechanical Keyboard', price: 149.99, stock: 6, image: '⌨️' }
  ]

  const handleDemoInteraction = async (interaction: DemoInteraction) => {
    setIsLoading(true)
    setError(null)
    incrementInteraction()

    try {
      // Send interaction to backend
      const response = await fetch(`/api/projects/${island.id}/demo-interaction`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          interactionType: interaction.type,
          data: interaction.data
        })
      })

      if (!response.ok) {
        throw new Error('Failed to process demo interaction')
      }

      const result = await response.json()

      if (result.success) {
        // Update local state based on interaction result
        updateDemoState(interaction, result.data)
        
        // Emit real-time event
        if (socket) {
          socket.emit('project-demo-interaction', {
            projectId: island.id,
            interactionType: interaction.type,
            result: result.data,
            timestamp: Date.now()
          })
        }

        onComplete(result)
      } else {
        throw new Error(result.error || 'Demo interaction failed')
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error'
      setError(errorMessage)
      console.error('Demo interaction error:', err)
    } finally {
      setIsLoading(false)
    }
  }

  const updateDemoState = (interaction: DemoInteraction, result: any) => {
    switch (interaction.type) {
      case 'shopping-cart':
        setDemoState((prev: any) => ({
          ...prev,
          cart: result.cartItems || prev.cart,
          totalPrice: result.total || prev.totalPrice,
          inventory: prev.inventory.map((item: any) => 
            result.cartItems?.find((cartItem: any) => cartItem.id === item.id)
              ? { ...item, stock: Math.max(0, item.stock - 1) }
              : item
          )
        }))
        break
      case 'performance-test':
        setDemoState((prev: any) => ({
          ...prev,
          lastPerformanceResult: result
        }))
        break
      default:
        setDemoState((prev: any) => ({ ...prev, ...result }))
    }
  }

  const renderShoppingCartDemo = () => (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-2xl font-bold text-gray-800 mb-2">🛒 E-commerce Demo</h3>
        <p className="text-gray-600">Try adding items to cart with real-time inventory updates!</p>
      </div>

      {/* Inventory Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {demoState.inventory?.map((item: any) => (
          <motion.div
            key={item.id}
            className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-lg transition-shadow"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <div className="text-center">
              <div className="text-4xl mb-2">{item.image}</div>
              <h4 className="font-semibold text-gray-800">{item.name}</h4>
              <p className="text-lg font-bold text-green-600">${item.price}</p>
              <p className="text-sm text-gray-500">Stock: {item.stock}</p>
              
              <button
                onClick={() => handleDemoInteraction({
                  type: 'shopping-cart',
                  data: { 
                    action: 'add',
                    items: [...(demoState.cart || []), { ...item, quantity: 1 }]
                  }
                })}
                disabled={item.stock === 0 || isLoading}
                className="mt-3 w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
              >
                {item.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
              </button>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Shopping Cart */}
      {demoState.cart && demoState.cart.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gray-50 rounded-lg p-4"
        >
          <h4 className="font-semibold text-gray-800 mb-3">Shopping Cart</h4>
          <div className="space-y-2">
            {demoState.cart.map((item: any, index: number) => (
              <div key={index} className="flex justify-between items-center">
                <span>{item.name} x{item.quantity}</span>
                <span className="font-semibold">${(item.price * item.quantity).toFixed(2)}</span>
              </div>
            ))}
          </div>
          <div className="border-t border-gray-300 mt-3 pt-3">
            <div className="flex justify-between items-center font-bold text-lg">
              <span>Total:</span>
              <span className="text-green-600">${demoState.totalPrice?.toFixed(2) || '0.00'}</span>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  )

  const renderPerformanceTestDemo = () => (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-2xl font-bold text-gray-800 mb-2">⚡ Performance Testing</h3>
        <p className="text-gray-600">Test API performance and see real-time metrics!</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <button
          onClick={() => handleDemoInteraction({
            type: 'performance-test',
            data: { testType: 'api-speed' }
          })}
          disabled={isLoading}
          className="p-6 bg-blue-50 rounded-lg border border-blue-200 hover:bg-blue-100 transition-colors"
        >
          <div className="text-3xl mb-2">🚀</div>
          <div className="font-semibold">API Speed Test</div>
          <div className="text-sm text-gray-600">Test response times</div>
        </button>

        <button
          onClick={() => handleDemoInteraction({
            type: 'performance-test',
            data: { testType: 'load-test' }
          })}
          disabled={isLoading}
          className="p-6 bg-green-50 rounded-lg border border-green-200 hover:bg-green-100 transition-colors"
        >
          <div className="text-3xl mb-2">📊</div>
          <div className="font-semibold">Load Test</div>
          <div className="text-sm text-gray-600">Simulate traffic</div>
        </button>

        <button
          onClick={() => handleDemoInteraction({
            type: 'performance-test',
            data: { testType: 'memory-test' }
          })}
          disabled={isLoading}
          className="p-6 bg-purple-50 rounded-lg border border-purple-200 hover:bg-purple-100 transition-colors"
        >
          <div className="text-3xl mb-2">🧠</div>
          <div className="font-semibold">Memory Test</div>
          <div className="text-sm text-gray-600">Check memory usage</div>
        </button>
      </div>

      {demoState.lastPerformanceResult && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-gray-50 rounded-lg p-6"
        >
          <h4 className="font-semibold text-gray-800 mb-4">Test Results</h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">
                {demoState.lastPerformanceResult.loadTime?.toFixed(0)}ms
              </div>
              <div className="text-sm text-gray-600">Load Time</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {demoState.lastPerformanceResult.memoryUsage?.toFixed(1)}MB
              </div>
              <div className="text-sm text-gray-600">Memory Usage</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">
                {demoState.lastPerformanceResult.score}/100
              </div>
              <div className="text-sm text-gray-600">Performance Score</div>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  )

  const renderDefaultDemo = () => (
    <div className="text-center py-12">
      <div className="text-6xl mb-4">🚧</div>
      <h3 className="text-2xl font-bold text-gray-800 mb-2">Demo Coming Soon</h3>
      <p className="text-gray-600">This interactive demo is currently under development.</p>
    </div>
  )

  const renderDemoContent = () => {
    if (!island.demoConfig) return renderDefaultDemo()

    switch (island.demoConfig.type) {
      case 'interactive-component':
        if (island.id === 'e-commerce-app') return renderShoppingCartDemo()
        if (island.id === 'performance-test') return renderPerformanceTestDemo()
        return renderDefaultDemo()
      default:
        return renderDefaultDemo()
    }
  }

  const handleDemoComplete = () => {
    completeDemo(island.id)
    onClose()
  }

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      
      {/* Demo Content */}
      <motion.div
        className="relative bg-white rounded-2xl shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-hidden"
        initial={{ scale: 0.8, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.8, opacity: 0, y: 20 }}
        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-green-600 to-blue-600 text-white p-6">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-3xl font-bold">{island.name} - Interactive Demo</h2>
              <p className="text-white/90 mt-1">Experience the project in action!</p>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 flex items-center justify-center rounded-full bg-white/20 hover:bg-white/30 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Demo Content */}
        <div className="p-6 overflow-y-auto max-h-[70vh]">
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6"
            >
              <div className="flex items-center gap-2 text-red-800">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="font-medium">Error: {error}</span>
              </div>
            </motion.div>
          )}

          {isLoading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex items-center justify-center py-8"
            >
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <span className="ml-3 text-gray-600">Processing interaction...</span>
            </motion.div>
          )}

          {renderDemoContent()}
        </div>

        {/* Footer */}
        <div className="border-t border-gray-200 p-6 bg-gray-50">
          <div className="flex justify-between items-center">
            <div className="text-sm text-gray-600">
              💡 This is a simulated demo showcasing project functionality
            </div>
            <button
              onClick={handleDemoComplete}
              className="px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors"
            >
              Complete Demo
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}