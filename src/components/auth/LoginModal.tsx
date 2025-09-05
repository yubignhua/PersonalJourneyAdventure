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
          <div className="bg-gray-900/95 backdrop-blur-md border border-green-500/20 rounded-2xl p-8 relative shadow-2xl shadow-green-500/10">
            <div className="text-center">
              <div className="flex items-center justify-center mb-6">
                <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center shadow-lg">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                </div>
              </div>
              <div className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-400 text-xl font-bold mb-4">
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
        <div ref={modalRef} className="bg-gray-900/95 backdrop-blur-md border border-blue-500/20 rounded-2xl p-8 relative shadow-2xl shadow-blue-500/10">
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-8 h-8 bg-gray-800/50 hover:bg-gray-700/50 rounded-lg flex items-center justify-center text-gray-400 hover:text-white transition-all duration-200 backdrop-blur-sm border border-gray-700/50 hover:border-gray-600/50"
            aria-label="Close modal"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
          
          <div className="text-center mb-8">
            <div className="flex items-center justify-center mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
                </svg>
              </div>
            </div>
            <div className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400 text-2xl font-bold mb-2">
              ADMINISTRATOR ACCESS
            </div>
            <div className="text-gray-400 text-sm">
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
                  w-full px-4 py-3 bg-gray-800/50 backdrop-blur-sm border rounded-xl text-white
                  placeholder-gray-400 focus:outline-none focus:ring-2
                  transition-all duration-300 shadow-sm
                  ${error
                    ? 'border-red-500/50 focus:ring-red-500/30 bg-red-500/5'
                    : 'border-gray-600/50 focus:border-blue-500 focus:ring-blue-500/30 hover:border-gray-500/70 hover:bg-gray-800/70'
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
                  w-full px-4 py-3 bg-gray-800/50 backdrop-blur-sm border rounded-xl text-white
                  placeholder-gray-400 focus:outline-none focus:ring-2
                  transition-all duration-300 shadow-sm
                  ${error
                    ? 'border-red-500/50 focus:ring-red-500/30 bg-red-500/5'
                    : 'border-gray-600/50 focus:border-blue-500 focus:ring-blue-500/30 hover:border-gray-500/70 hover:bg-gray-800/70'
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
                w-full py-3 px-6 rounded-xl font-bold text-sm tracking-wider
                transition-all duration-300 transform relative overflow-hidden
                ${formData.username.trim() && formData.password.trim() && !isLoading
                  ? 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-[0.98]'
                  : 'bg-gray-700/50 text-gray-500 cursor-not-allowed backdrop-blur-sm'
                }
                before:absolute before:inset-0 before:bg-gradient-to-r before:from-transparent before:via-white/20 before:to-transparent before:translate-x-[-100%] before:transition-transform before:duration-700
                hover:before:translate-x-[100%]
                disabled:before:translate-x-[-100%] disabled:hover:scale-100
              `}
            >
              <span className="relative z-10 flex items-center justify-center space-x-2">
                {isLoading ? (
                  <>
                    <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span>AUTHENTICATING...</span>
                  </>
                ) : (
                  <>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
                    </svg>
                    <span>AUTHENTICATE</span>
                  </>
                )}
              </span>
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