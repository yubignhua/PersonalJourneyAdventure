'use client'

import React from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'

interface BlogEntryCardProps {
    className?: string
    variant?: 'compact' | 'featured'
}

const BlogEntryCard: React.FC<BlogEntryCardProps> = ({
    className = '',
    variant = 'compact'
}) => {
    const cardVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.6, ease: "easeOut" }
        },
        hover: {
            scale: 1.02,
            transition: { duration: 0.2 }
        }
    }

    const iconVariants = {
        hover: {
            rotate: 360,
            transition: { duration: 0.8, ease: "easeInOut" }
        }
    }

    if (variant === 'featured') {
        return (
            <motion.div
                variants={cardVariants}
                initial="hidden"
                animate="visible"
                whileHover="hover"
                className={`relative overflow-hidden rounded-xl bg-gradient-to-br from-green-900/20 to-teal-900/20 border border-green-500/30 backdrop-blur-sm ${className}`}
            >
                {/* Animated background */}
                <div className="absolute inset-0 bg-gradient-to-r from-green-600/10 via-transparent to-teal-600/10 animate-pulse" />

                <div className="relative p-6">
                    <div className="flex items-start justify-between mb-4">
                        <motion.div
                            variants={iconVariants}
                            className="text-3xl"
                        >
                            📚
                        </motion.div>
                        <div className="text-xs text-green-400 bg-green-500/20 px-2 py-1 rounded-full">
                            NEW
                        </div>
                    </div>

                    <h3 className="text-xl font-bold text-white mb-2">
                        Tech Blog & Insights
                    </h3>

                    <p className="text-gray-300 text-sm mb-4 leading-relaxed">
                        Dive into my technical journey with in-depth articles, tutorials, and insights
                        about modern web development, 3D graphics, and emerging technologies.
                    </p>

                    <div className="space-y-2 mb-4">
                        <div className="flex items-center text-xs text-gray-400">
                            <span className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse" />
                            Latest: &quot;Building Interactive 3D Experiences with React&quot;
                        </div>
                        <div className="flex items-center text-xs text-gray-400">
                            <span className="w-2 h-2 bg-teal-500 rounded-full mr-2 animate-pulse" />
                            Series: &quot;Modern Frontend Architecture&quot;
                        </div>
                    </div>

                    <Link href="/blog">
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="w-full px-4 py-3 bg-gradient-to-r from-green-600 to-teal-600 hover:from-green-700 hover:to-teal-700 text-white rounded-lg font-medium transition-all duration-300 flex items-center justify-center space-x-2"
                        >
                            <span>Explore Articles</span>
                            <motion.span
                                animate={{ x: [0, 4, 0] }}
                                transition={{ repeat: Infinity, duration: 1.5 }}
                            >
                                →
                            </motion.span>
                        </motion.button>
                    </Link>
                </div>

                {/* Glow effect */}
                <div className="absolute inset-0 rounded-xl opacity-20 pointer-events-none">
                    <div className="absolute inset-0 bg-gradient-to-r from-green-500/20 to-teal-500/20 blur-xl" />
                </div>
            </motion.div>
        )
    }

    return (
        <motion.div
            variants={cardVariants}
            initial="hidden"
            animate="visible"
            whileHover="hover"
            className={`relative overflow-hidden rounded-lg bg-gradient-to-br from-green-900/20 to-teal-900/20 border border-green-500/30 backdrop-blur-sm ${className}`}
        >
            <div className="relative p-4">
                <div className="flex items-center space-x-3 mb-3">
                    <motion.div
                        variants={iconVariants}
                        className="text-2xl"
                    >
                        📚
                    </motion.div>
                    <div>
                        <h3 className="text-lg font-semibold text-white">Tech Blog</h3>
                        <p className="text-xs text-gray-400">Articles & Tutorials</p>
                    </div>
                </div>

                <p className="text-gray-300 text-sm mb-3">
                    Explore technical insights and development stories
                </p>

                <Link href="/blog">
                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="w-full px-3 py-2 bg-green-600/20 hover:bg-green-600/40 text-green-400 rounded-lg text-sm font-medium transition-all duration-300 border border-green-500/30"
                    >
                        Read Articles →
                    </motion.button>
                </Link>
            </div>
        </motion.div>
    )
}

export default BlogEntryCard