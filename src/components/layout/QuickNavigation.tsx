'use client'

import React from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'

interface QuickNavigationProps {
    currentPage?: 'home' | 'projects' | 'blog' | 'about'
    className?: string
}

const navigationItems = [
    {
        id: 'home',
        label: 'Home',
        icon: '🏠',
        href: '/',
        color: 'blue',
        description: 'Interactive Lab'
    },
    {
        id: 'about',
        label: 'Universe',
        icon: '🌌',
        href: '/about',
        color: 'indigo',
        description: 'Personal Universe'
    },
    {
        id: 'projects',
        label: 'Projects',
        icon: '🗺️',
        href: '/projects',
        color: 'purple',
        description: 'Adventure Map'
    },
    {
        id: 'blog',
        label: 'Blog',
        icon: '📚',
        href: '/blog',
        color: 'green',
        description: 'Tech Articles'
    },
]

const QuickNavigation: React.FC<QuickNavigationProps> = ({
    currentPage,
    className = ''
}) => {
    const getColorClasses = (color: string, isCurrent: boolean) => {
        const colors = {
            blue: isCurrent
                ? 'bg-blue-600/30 text-blue-400 border-blue-500/50'
                : 'bg-blue-600/10 hover:bg-blue-600/20 text-blue-400 border-blue-500/30',
            indigo: isCurrent
                ? 'bg-indigo-600/30 text-indigo-400 border-indigo-500/50'
                : 'bg-indigo-600/10 hover:bg-indigo-600/20 text-indigo-400 border-indigo-500/30',
            purple: isCurrent
                ? 'bg-purple-600/30 text-purple-400 border-purple-500/50'
                : 'bg-purple-600/10 hover:bg-purple-600/20 text-purple-400 border-purple-500/30',
            green: isCurrent
                ? 'bg-green-600/30 text-green-400 border-green-500/50'
                : 'bg-green-600/10 hover:bg-green-600/20 text-green-400 border-green-500/30',
        }
        return colors[color as keyof typeof colors] || colors.blue
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`flex items-center space-x-2 ${className}`}
        >
            {navigationItems.map((item) => {
                const isCurrent = currentPage === item.id

                return (
                    <motion.div key={item.id} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                        <Link
                            href={item.href}
                            className={`px-4 py-2 rounded-lg border transition-all duration-300 flex items-center space-x-2 ${getColorClasses(item.color, isCurrent)}`}
                            aria-current={isCurrent ? 'page' : undefined}
                        >
                            <span className="text-lg">{item.icon}</span>
                            <div className="hidden sm:block">
                                <div className="font-medium text-sm">{item.label}</div>
                                <div className="text-xs opacity-70">{item.description}</div>
                            </div>
                        </Link>
                    </motion.div>
                )
            })}
        </motion.div>
    )
}

export default QuickNavigation