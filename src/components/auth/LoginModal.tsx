'use client';

import React, { useState, useEffect } from 'react';
import SimpleTypewriter from '../ui/SimpleTypewriter';
import { useAuth } from '@/lib/auth-context';
import { useClickOutside } from '@/hooks/useClickOutside';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSwitchToRegister?: () => void;
}

export const LoginModal: React.FC<LoginModalProps> = ({ isOpen, onClose, onSwitchToRegister }) => {
  const { login, isLoading } = useAuth();
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);

  // Handle ESC key to close modal
  useEffect(() => {
    const handleEscapeKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscapeKey);
      // Prevent background scrolling when modal is open
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscapeKey);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  // Handle click outside to close modal
  const modalRef = useClickOutside<HTMLDivElement>(onClose, isOpen);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const success = await login(formData);
    
    if (success) {
      setShowSuccess(true);
      setTimeout(() => {
        onClose();
      }, 1000);
    } else {
      setError('Access Denied. Invalid credentials.');
      setTimeout(() => {
        setError('');
      }, 2000);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setError('');
  };

  if (!isOpen) return null;

  if (showSuccess) {
    return (
      <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center">
        <div className="max-w-md mx-auto">
          <div className="bg-gray-900/90 backdrop-blur-sm border border-green-500/30 rounded-lg p-6 relative">
            <div className="text-center">
              <div className="text-green-400 text-lg mb-4">
                <SimpleTypewriter
                  text="Access Granted. Welcome back."
                  speed={50}
                />
              </div>
              <div className="flex items-center justify-center space-x-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                <span className="text-green-300 text-sm">Initializing session...</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center">
      <div className="max-w-md mx-auto">
        <div ref={modalRef} className="bg-gray-900/90 backdrop-blur-sm border border-blue-500/30 rounded-lg p-6 relative">
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors z-10"
            aria-label="Close modal"
          >
            ✕
          </button>
          
          <div className="text-center mb-6">
            <div className="text-blue-400 text-xl mb-2">
              ADMINISTRATOR ACCESS
            </div>
            <div className="text-gray-300 text-sm">
              Enter your credentials to access the control panel
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <input
                type="text"
                id="username"
                name="username"
                value={formData.username}
                onChange={handleInputChange}
                placeholder="Username"
                className={`
                  w-full px-4 py-3 bg-black/50 border rounded-lg text-white
                  placeholder-gray-400 focus:outline-none focus:ring-2
                  transition-all duration-200
                  ${error
                    ? 'border-red-500 focus:ring-red-500/50'
                    : 'border-gray-600 focus:border-blue-500 focus:ring-blue-500/50'
                  }
                `}
                required
              />
            </div>

            <div>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                placeholder="Password"
                className={`
                  w-full px-4 py-3 bg-black/50 border rounded-lg text-white
                  placeholder-gray-400 focus:outline-none focus:ring-2
                  transition-all duration-200
                  ${error
                    ? 'border-red-500 focus:ring-red-500/50'
                    : 'border-gray-600 focus:border-blue-500 focus:ring-blue-500/50'
                  }
                `}
                required
              />
            </div>

            {error && (
              <div className="text-red-400 text-sm text-center animate-pulse">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={!formData.username.trim() || !formData.password.trim() || isLoading}
              className={`
                w-full py-3 rounded-lg font-semibold transition-all duration-200
                ${formData.username.trim() && formData.password.trim() && !isLoading
                  ? 'bg-blue-600 hover:bg-blue-700 text-white transform hover:scale-105'
                  : 'bg-gray-700 text-gray-400 cursor-not-allowed'
                }
              `}
            >
              {isLoading ? 'AUTHENTICATING...' : 'AUTHENTICATE'}
            </button>
          </form>

          <div className="mt-4 space-y-3">
            <div className="text-center">
              <div className="flex items-center justify-center space-x-2 text-xs text-gray-500">
                <div className="w-1 h-1 bg-blue-500 rounded-full animate-pulse" />
                <span>DEMO: admin / admin123</span>
                <div className="w-1 h-1 bg-blue-500 rounded-full animate-pulse" />
              </div>
            </div>
            
            {onSwitchToRegister && (
              <div className="text-center">
                <button
                  onClick={onSwitchToRegister}
                  className="text-blue-400 hover:text-blue-300 text-sm transition-colors"
                >
                  Need access? Request credentials →
                </button>
              </div>
            )}

            <div className="text-center">
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-300 text-sm transition-colors"
              >
                Cancel Login
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};