'use client';

import React, { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';

interface NavigationBarProps {
  isAuthenticated?: boolean;
  user?: any;
  onLogin?: () => void;
  onRegister?: () => void;
  onLogout?: () => void;
}

const NavigationBar: React.FC<NavigationBarProps> = ({ 
  isAuthenticated = false, 
  user, 
  onLogin, 
  onRegister, 
  onLogout 
}) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  // Handle scroll effect for navigation bar
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  const navigationItems = [
    { 
      name: 'Laboratory', 
      href: '/', 
      icon: '🧪',
      description: 'Interactive 3D Skills'
    },
    { 
      name: 'Universe', 
      href: '/about', 
      icon: '🪐',
      description: 'Personal Universe'
    },
    { 
      name: 'Projects', 
      href: '/projects', 
      icon: '🗺️',
      description: 'Project Islands'
    },
    { 
      name: 'Blog', 
      href: '/blog', 
      icon: '📚',
      description: 'Tech Blog & Timeline'
    }
  ];

  const isActive = (href: string) => {
    if (href === '/') {
      return pathname === '/' || pathname === '';
    }
    return pathname.startsWith(href);
  };

  return (
    <>
      {/* Navigation Bar */}
      <nav className={`
        fixed top-0 left-0 right-0 z-50 transition-all duration-300
        ${isScrolled 
          ? 'bg-gray-900/98 backdrop-blur-md border-b border-blue-500/30 shadow-xl shadow-blue-500/10' 
          : 'bg-gradient-to-b from-gray-900/90 via-gray-900/70 to-transparent backdrop-blur-sm border-b border-blue-500/20'
        }
      `}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-20">
            {/* Logo and Brand */}
            <div className="flex items-center space-x-3">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                  <span className="text-white text-lg font-bold">A</span>
                </div>
                <div className="hidden sm:block">
                  <h1 className="text-white font-bold text-lg">第Aryse象限</h1>
                  <p className="text-gray-400 text-xs">Quadrant Aryse Digital Universe</p>
                </div>
              </div>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center space-x-1">
              {navigationItems.map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  className={`
                    group relative px-4 py-2 rounded-lg transition-all duration-200
                    ${isActive(item.href)
                      ? 'bg-blue-600/25 text-blue-300 border border-blue-500/50 shadow-lg shadow-blue-500/20'
                      : 'text-gray-300 hover:text-white hover:bg-gray-800/50 hover:border-gray-600/50 border border-transparent'
                    }
                  `}
                >
                  <div className="flex items-center space-x-2">
                    <span className="text-lg">{item.icon}</span>
                    <span className="font-medium">{item.name}</span>
                  </div>
                  
                  {/* Hover Description */}
                  <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 px-3 py-1 bg-gray-800 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-10">
                    {item.description}
                    <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-full w-0 h-0 border-l-4 border-r-4 border-b-4 border-transparent border-b-gray-800"></div>
                  </div>
                </a>
              ))}
            </div>

            {/* Auth Section */}
            <div className="hidden lg:flex items-center space-x-3">
              {isAuthenticated ? (
                <div className="flex items-center space-x-3">
                  <div className="bg-green-600/25 border border-green-500/50 rounded-lg px-3 py-2 shadow-lg shadow-green-500/10">
                    <div className="flex items-center space-x-2">
                      <span className="text-green-400 text-sm">🔐 {user?.username}</span>
                      {user?.role === 'admin' && (
                        <span className="text-xs text-green-300 bg-green-600/30 px-2 py-1 rounded">Admin</span>
                      )}
                    </div>
                  </div>
                  <button
                    onClick={onLogout}
                    className="text-red-400 hover:text-red-300 transition-colors px-3 py-2 rounded-lg hover:bg-red-600/20"
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <div className="flex items-center space-x-2">
                  <button
                    onClick={onLogin}
                    className="px-4 py-2 bg-gradient-to-r from-red-600/80 to-pink-600/80 hover:from-red-700 hover:to-pink-700 text-white rounded-lg font-medium transition-all duration-200 transform hover:scale-105 backdrop-blur-sm border border-red-500/50 shadow-lg shadow-red-500/20"
                  >
                    {/* 🔐  */}
                    Login
                  </button>
                  <button
                    onClick={onRegister}
                    className="px-4 py-2 bg-gradient-to-r from-blue-600/80 to-cyan-600/80 hover:from-blue-700 hover:to-cyan-700 text-white rounded-lg font-medium transition-all duration-200 transform hover:scale-105 backdrop-blur-sm border border-blue-500/50 shadow-lg shadow-blue-500/20"
                  >
                    {/* 📝  */}
                    Register
                  </button>
                </div>
              )}
            </div>

            {/* Mobile Menu Button */}
            <div className="lg:hidden">
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="text-gray-300 hover:text-white p-2 rounded-lg hover:bg-gray-800/50 transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  {isMobileMenuOpen ? (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  )}
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="lg:hidden bg-gray-900/98 backdrop-blur-md border-t border-blue-500/30 shadow-lg shadow-blue-500/10">
            <div className="px-4 py-4 space-y-2">
              {navigationItems.map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  className={`
                    flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200
                    ${isActive(item.href)
                      ? 'bg-blue-600/25 text-blue-300 border border-blue-500/50 shadow-lg shadow-blue-500/20'
                      : 'text-gray-300 hover:text-white hover:bg-gray-800/50 hover:border-gray-600/50 border border-transparent'
                    }
                  `}
                >
                  <span className="text-xl">{item.icon}</span>
                  <div>
                    <div className="font-medium">{item.name}</div>
                    <div className="text-xs text-gray-400">{item.description}</div>
                  </div>
                </a>
              ))}
              
              {/* Mobile Auth Section */}
              <div className="border-t border-gray-700/50 pt-4 mt-4">
                {isAuthenticated ? (
                  <div className="space-y-3">
                    <div className="bg-green-600/25 border border-green-500/50 rounded-lg px-4 py-3 shadow-lg shadow-green-500/10">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <span className="text-green-400">🔐 {user?.username}</span>
                          {user?.role === 'admin' && (
                            <span className="text-xs text-green-300 bg-green-600/30 px-2 py-1 rounded">Admin</span>
                          )}
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={onLogout}
                      className="w-full px-4 py-3 text-red-400 hover:text-red-300 hover:bg-red-600/20 rounded-lg transition-colors text-left"
                    >
                      Logout
                    </button>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <button
                      onClick={onLogin}
                      className="w-full px-4 py-3 bg-gradient-to-r from-red-600/80 to-pink-600/80 hover:from-red-700 hover:to-pink-700 text-white rounded-lg font-medium transition-all duration-200 backdrop-blur-sm border border-red-500/50 shadow-lg shadow-red-500/20"
                    >
                      🔐 Admin Login
                    </button>
                    <button
                      onClick={onRegister}
                      className="w-full px-4 py-3 bg-gradient-to-r from-blue-600/80 to-cyan-600/80 hover:from-blue-700 hover:to-cyan-700 text-white rounded-lg font-medium transition-all duration-200 backdrop-blur-sm border border-blue-500/50 shadow-lg shadow-blue-500/20"
                    >
                      📝 User Registration
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </nav>

      {/* Spacer for fixed navigation */}
      <div className="h-16 sm:h-20"></div>
    </>
  );
};

export default NavigationBar;