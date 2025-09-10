'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { useAuth } from '@/lib/auth-context'
import { LoginModal } from '@/components/auth/LoginModal'
import RegisterModal from '@/components/auth/RegisterModal'

interface PersonalHeroSectionProps {
    className?: string
    showActions?: boolean
}

const PersonalHeroSection: React.FC<PersonalHeroSectionProps> = ({ 
    className = '',
    showActions = true 
}) => {
    const { isAuthenticated, logout } = useAuth()
    const [showLoginModal, setShowLoginModal] = useState(false)
    const [showRegisterModal, setShowRegisterModal] = useState(false)

    const handleLogin = () => setShowLoginModal(true)

    return (
        <div className={`relative ${className}`}>
            {/* Background decoration */}
            <div className="absolute inset-0 bg-gradient-to-br from-blue-900/20 via-purple-900/20 to-pink-900/20 rounded-2xl blur-xl"></div>
            
            <div className="relative bg-gray-900/60 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-8 md:p-12 overflow-hidden">
                {/* Animated background particles */}
                <div className="absolute inset-0 opacity-30">
                    <div className="absolute top-4 left-4 w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                    <div className="absolute top-8 right-8 w-1 h-1 bg-purple-500 rounded-full animate-pulse" style={{ animationDelay: '0.5s' }}></div>
                    <div className="absolute bottom-8 left-8 w-1.5 h-1.5 bg-pink-500 rounded-full animate-pulse" style={{ animationDelay: '1s' }}></div>
                    <div className="absolute bottom-4 right-4 w-1 h-1 bg-green-500 rounded-full animate-pulse" style={{ animationDelay: '1.5s' }}></div>
                </div>

                <div className="relative z-10">
                    {/* Avatar Section */}
                    <motion.div
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ duration: 0.6 }}
                        className="flex items-center space-x-6 mb-8"
                    >
                        <div className="relative">
                            <div className="w-24 h-24 md:w-32 md:h-32 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-3xl font-bold shadow-2xl">
                                AY
                            </div>
                            <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-green-500 rounded-full border-4 border-gray-900 flex items-center justify-center">
                                <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                            </div>
                        </div>
                        
                        <div className="flex-1">
                            <motion.h1
                                initial={{ y: 20, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ duration: 0.6, delay: 0.2 }}
                                className="text-3xl md:text-4xl font-bold text-white mb-2"
                            >
                                Aryse Yang
                            </motion.h1>
                            <motion.p
                                initial={{ y: 20, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ duration: 0.6, delay: 0.3 }}
                                className="text-lg text-blue-400 mb-3"
                            >
                                Full Stack Developer & Creative Technologist
                            </motion.p>
                            <motion.div
                                initial={{ y: 20, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ duration: 0.6, delay: 0.4 }}
                                className="flex flex-wrap gap-2"
                            >
                                <span className="px-3 py-1 bg-blue-900/50 text-blue-300 rounded-full text-sm border border-blue-700/50">
                                    React
                                </span>
                                <span className="px-3 py-1 bg-purple-900/50 text-purple-300 rounded-full text-sm border border-purple-700/50">
                                    TypeScript
                                </span>
                                <span className="px-3 py-1 bg-green-900/50 text-green-300 rounded-full text-sm border border-green-700/50">
                                    Node.js
                                </span>
                                <span className="px-3 py-1 bg-pink-900/50 text-pink-300 rounded-full text-sm border border-pink-700/50">
                                    3D Graphics
                                </span>
                            </motion.div>
                        </div>
                    </motion.div>

                    {/* Bio Section */}
                    <motion.div
                        initial={{ y: 30, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ duration: 0.6, delay: 0.5 }}
                        className="space-y-4 mb-8"
                    >
                        <div className="text-gray-300 leading-relaxed">
                            <p className="mb-3">
                                🚀 <strong className="text-white">创新的全栈开发者</strong>，专注于构建沉浸式的Web体验和交互式3D应用。
                            </p>
                            <p className="mb-3">
                                💡 <strong className="text-white">Creative Technologist</strong> passionate about creating beautiful, functional digital experiences that push the boundaries of web technology.
                            </p>
                            <p>
                                🌟 擅长将复杂的技术概念转化为直观、优雅的用户界面，热爱探索前沿技术并将其应用到实际项目中。
                            </p>
                        </div>
                    </motion.div>

                    {/* Stats Section */}
                    <motion.div
                        initial={{ y: 30, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ duration: 0.6, delay: 0.6 }}
                        className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8"
                    >
                        <div className="text-center p-4 bg-gray-800/50 rounded-lg border border-gray-700/50">
                            <div className="text-2xl font-bold text-blue-400 mb-1">5+</div>
                            <div className="text-sm text-gray-400">Years Experience</div>
                        </div>
                        <div className="text-center p-4 bg-gray-800/50 rounded-lg border border-gray-700/50">
                            <div className="text-2xl font-bold text-green-400 mb-1">50+</div>
                            <div className="text-sm text-gray-400">Projects</div>
                        </div>
                        <div className="text-center p-4 bg-gray-800/50 rounded-lg border border-gray-700/50">
                            <div className="text-2xl font-bold text-purple-400 mb-1">15+</div>
                            <div className="text-sm text-gray-400">Technologies</div>
                        </div>
                        <div className="text-center p-4 bg-gray-800/50 rounded-lg border border-gray-700/50">
                            <div className="text-2xl font-bold text-pink-400 mb-1">∞</div>
                            <div className="text-sm text-gray-400">Creativity</div>
                        </div>
                    </motion.div>

                    {/* Action Buttons */}
                    {showActions && (
                        <motion.div
                            initial={{ y: 30, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ duration: 0.6, delay: 0.7 }}
                            className="flex flex-wrap gap-4"
                        >
                            {isAuthenticated ? (
                                <>
                                    <button
                                        onClick={() => window.location.href = '/blog/create'}
                                        className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-medium hover:from-blue-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105"
                                    >
                                        ✍️ Write Article
                                    </button>
                                    <button
                                        onClick={() => window.location.href = '/about'}
                                        className="px-6 py-3 bg-gray-800 text-white rounded-lg font-medium hover:bg-gray-700 transition-all duration-300 border border-gray-700"
                                    >
                                        🚀 Explore Universe
                                    </button>
                                    <button
                                        onClick={logout}
                                        className="px-6 py-3 bg-gray-800 text-gray-300 rounded-lg font-medium hover:bg-gray-700 transition-all duration-300 border border-gray-700"
                                    >
                                        👋 Logout
                                    </button>
                                </>
                            ) : (
                                <>
                                    <button
                                        onClick={handleLogin}
                                        className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-medium hover:from-blue-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105"
                                    >
                                        🔐 Admin Login
                                    </button>
                                    <button
                                        onClick={() => window.location.href = '/about'}
                                        className="px-6 py-3 bg-gray-800 text-white rounded-lg font-medium hover:bg-gray-700 transition-all duration-300 border border-gray-700"
                                    >
                                        🚀 Explore Universe
                                    </button>
                                    <button
                                        onClick={() => window.location.href = '/blog'}
                                        className="px-6 py-3 bg-gray-800 text-white rounded-lg font-medium hover:bg-gray-700 transition-all duration-300 border border-gray-700"
                                    >
                                        📚 Tech Blog
                                    </button>
                                </>
                            )}
                        </motion.div>
                    )}

                    {/* Contact Info */}
                    <motion.div
                        initial={{ y: 30, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ duration: 0.6, delay: 0.8 }}
                        className="mt-8 pt-8 border-t border-gray-700/50"
                    >
                        <div className="flex flex-wrap gap-6 text-sm text-gray-400">
                            <div className="flex items-center space-x-2">
                                <span>📧</span>
                                <span>contact@aryse.dev</span>
                            </div>
                            <div className="flex items-center space-x-2">
                                <span>🌐</span>
                                <span>aryse.dev</span>
                            </div>
                            <div className="flex items-center space-x-2">
                                <span>📍</span>
                                <span>Shanghai, China</span>
                            </div>
                            <div className="flex items-center space-x-2">
                                <span>🎯</span>
                                <span>Available for freelance</span>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>

            {/* Login Modal */}
            <LoginModal
                isOpen={showLoginModal}
                onClose={() => setShowLoginModal(false)}
                onSwitchToRegister={() => {
                    setShowLoginModal(false)
                    setShowRegisterModal(true)
                }}
            />

            {/* Register Modal */}
            <RegisterModal
                isOpen={showRegisterModal}
                onClose={() => setShowRegisterModal(false)}
                onSwitchToLogin={() => {
                    setShowRegisterModal(false)
                    setShowLoginModal(true)
                }}
            />
        </div>
    )
}

export default PersonalHeroSection