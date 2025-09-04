'use client';

import { useState, useEffect } from 'react';
import SimpleTypewriter from '../ui/SimpleTypewriter';
import { apiService } from '@/lib/api-service';
import { useClickOutside } from '@/hooks/useClickOutside';

interface RegisterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSwitchToLogin: () => void;
}

export default function RegisterModal({ isOpen, onClose, onSwitchToLogin }: RegisterModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [isLoading, setIsLoading] = useState(false);
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

    // Validation
    if (formData.password !== formData.confirmPassword) {
      setError('Password confirmation does not match');
      setTimeout(() => setError(''), 2000);
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      setTimeout(() => setError(''), 2000);
      return;
    }

    setIsLoading(true);

    try {
      const response = await apiService.register({
        name: formData.name,
        email: formData.email,
        password: formData.password
      });

      if (response.success) {
        // Store token in localStorage
        localStorage.setItem('auth_token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
        
        setShowSuccess(true);
        setTimeout(() => {
          window.location.reload();
        }, 1500);
      } else {
        setError(response.error || 'Registration failed');
        setTimeout(() => setError(''), 2000);
      }
    } catch (err: any) {
      setError(err.message || 'Registration failed');
      setTimeout(() => setError(''), 2000);
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
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
                  text="Registration Complete. Welcome to the Lab."
                  speed={50}
                />
              </div>
              <div className="flex items-center justify-center space-x-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                <span className="text-green-300 text-sm">Creating your identity...</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const isFormValid = formData.name.trim() && 
                     formData.email.trim() && 
                     formData.password.length >= 6 && 
                     formData.password === formData.confirmPassword;

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center">
      <div className="max-w-md mx-auto">
        <div ref={modalRef} className="bg-gray-900/90 backdrop-blur-sm border border-green-500/30 rounded-lg p-6 relative">
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors z-10"
            aria-label="Close modal"
          >
            ✕
          </button>
          
          <div className="text-center mb-6">
            <div className="text-green-400 text-xl mb-2">
              IDENTITY REGISTRATION
            </div>
            <div className="text-gray-300 text-sm">
              Create your credentials to access the laboratory
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Username"
                className={`
                  w-full px-4 py-3 bg-black/50 border rounded-lg text-white
                  placeholder-gray-400 focus:outline-none focus:ring-2
                  transition-all duration-200
                  ${error
                    ? 'border-red-500 focus:ring-red-500/50'
                    : 'border-gray-600 focus:border-green-500 focus:ring-green-500/50'
                  }
                `}
                required
              />
            </div>

            <div>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Email Address"
                className={`
                  w-full px-4 py-3 bg-black/50 border rounded-lg text-white
                  placeholder-gray-400 focus:outline-none focus:ring-2
                  transition-all duration-200
                  ${error
                    ? 'border-red-500 focus:ring-red-500/50'
                    : 'border-gray-600 focus:border-green-500 focus:ring-green-500/50'
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
                onChange={handleChange}
                placeholder="Password"
                className={`
                  w-full px-4 py-3 bg-black/50 border rounded-lg text-white
                  placeholder-gray-400 focus:outline-none focus:ring-2
                  transition-all duration-200
                  ${error
                    ? 'border-red-500 focus:ring-red-500/50'
                    : 'border-gray-600 focus:border-green-500 focus:ring-green-500/50'
                  }
                `}
                required
              />
            </div>

            <div>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Confirm Password"
                className={`
                  w-full px-4 py-3 bg-black/50 border rounded-lg text-white
                  placeholder-gray-400 focus:outline-none focus:ring-2
                  transition-all duration-200
                  ${error
                    ? 'border-red-500 focus:ring-red-500/50'
                    : formData.confirmPassword && formData.password !== formData.confirmPassword
                    ? 'border-yellow-500 focus:ring-yellow-500/50'
                    : 'border-gray-600 focus:border-green-500 focus:ring-green-500/50'
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
              disabled={!isFormValid || isLoading}
              className={`
                w-full py-3 rounded-lg font-semibold transition-all duration-200
                ${isFormValid && !isLoading
                  ? 'bg-green-600 hover:bg-green-700 text-white transform hover:scale-105'
                  : 'bg-gray-700 text-gray-400 cursor-not-allowed'
                }
              `}
            >
              {isLoading ? 'CREATING IDENTITY...' : 'CREATE IDENTITY'}
            </button>
          </form>

          <div className="mt-4 space-y-3">
            <div className="text-center">
              <div className="flex items-center justify-center space-x-2 text-xs text-gray-500">
                <div className="w-1 h-1 bg-green-500 rounded-full animate-pulse" />
                <span>MINIMUM 6 CHARACTERS</span>
                <div className="w-1 h-1 bg-green-500 rounded-full animate-pulse" />
              </div>
            </div>
            
            <div className="text-center">
              <button
                onClick={onSwitchToLogin}
                className="text-green-400 hover:text-green-300 text-sm transition-colors"
              >
                Existing identity? Sign in here →
              </button>
            </div>

            <div className="text-center">
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-300 text-sm transition-colors"
              >
                Cancel Registration
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}