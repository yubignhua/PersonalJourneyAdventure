'use client'

import React, { useState, useEffect } from 'react'
import SimpleTypewriter from './SimpleTypewriter'

interface PasswordUnlockProps {
  onUnlock: () => void
  correctPassword?: string
  placeholder?: string
  hint?: string
  className?: string
}

const PasswordUnlock: React.FC<PasswordUnlockProps> = ({
  onUnlock,
  correctPassword = 'portfolio2024',
  placeholder = 'Enter access code...',
  hint = 'Hint: portfolio + current year',
  className = ''
}) => {
  const [password, setPassword] = useState('react')
  const [isUnlocked, setIsUnlocked] = useState(false)
  const [showError, setShowError] = useState(false)
  const [attempts, setAttempts] = useState(0)
  const [showHint, setShowHint] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (password.toLowerCase() === correctPassword.toLowerCase()) {
      setIsUnlocked(true)
      setTimeout(() => {
        onUnlock()
      }, 1000)
    } else {
      setShowError(true)
      setAttempts(prev => prev + 1)
      setPassword('')

      // Show hint after 2 failed attempts
      if (attempts >= 1) {
        setShowHint(true)
      }

      setTimeout(() => {
        setShowError(false)
      }, 2000)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value)
    setShowError(false)
  }

  if (isUnlocked) {
    return (
      <div className={`text-center ${className}`}>
        <div className="text-green-400 text-lg mb-4">
          <SimpleTypewriter
            text="Access Granted. Welcome to the Lab."
            speed={50}
          />
        </div>
        <div className="flex items-center justify-center space-x-2">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
          <span className="text-green-300 text-sm">Initializing...</span>
        </div>
      </div>
    )
  }

  return (
    <div className={`max-w-md mx-auto ${className} w-250`}>
      <div className="bg-gray-900/90 backdrop-blur-sm border border-blue-500/30 rounded-lg p-6">
        <div className="text-center mb-6">
          <div className="text-blue-400 text-xl mb-2">
            {/* SECURE ACCESS REQUIRED */}
            欢迎探索我的宇宙坐标
          </div>
          <div className="text-gray-300 text-sm">
            {/* Please enter your access credentials to continue */}
            请输入您的访问凭据以继续
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <input
              type="password"
              value={password}
              onChange={handleInputChange}
              placeholder={placeholder}
              className={`
                w-full px-4 py-3 bg-black/50 border rounded-lg text-white
                placeholder-gray-400 focus:outline-none focus:ring-2
                transition-all duration-200
                ${showError
                  ? 'border-red-500 focus:ring-red-500/50'
                  : 'border-gray-600 focus:border-blue-500 focus:ring-blue-500/50'
                }
              `}
              autoComplete="off"
            />
          </div>

          {showError && (
            <div className="text-red-400 text-sm text-center animate-pulse">
              Access Denied. Invalid credentials.
            </div>
          )}

          {showHint && (
            <div className="text-yellow-400 text-xs text-center">
              💡 {hint}
            </div>
          )}

          <button
            type="submit"
            disabled={!password.trim()}
            className={`
              w-full py-3 rounded-lg font-semibold transition-all duration-200
              ${password.trim()
                ? 'bg-blue-600 hover:bg-blue-700 text-white transform hover:scale-105'
                : 'bg-gray-700 text-gray-400 cursor-not-allowed'
              }
            `}
          >
            {/* AUTHENTICATE */}
            进入宇宙坐标
          </button>
        </form>

        <div className="mt-4 text-center">
          <div className="flex items-center justify-center space-x-2 text-xs text-gray-500">
            <div className="w-1 h-1 bg-gray-500 rounded-full animate-pulse" />
            <span>Attempts: {attempts}/3</span>
            <div className="w-1 h-1 bg-gray-500 rounded-full animate-pulse" />
          </div>
        </div>
      </div>
    </div>
  )
}

export default PasswordUnlock