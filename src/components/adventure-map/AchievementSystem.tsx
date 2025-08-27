'use client'

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Achievement, UserProgress } from '@/types/adventure-map'
import { useAdventureMapStore } from '@/store/adventure-map'
import { useSocket } from '@/hooks/useSocket'

interface AchievementSystemProps {
  className?: string
}

interface AchievementNotificationProps {
  achievement: Achievement
  onClose: () => void
}

const AchievementNotification: React.FC<AchievementNotificationProps> = ({
  achievement,
  onClose
}) => {
  useEffect(() => {
    const timer = setTimeout(onClose, 5000) // Auto-close after 5 seconds
    return () => clearTimeout(timer)
  }, [onClose])

  return (
    <motion.div
      initial={{ opacity: 0, x: 300, scale: 0.8 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={{ opacity: 0, x: 300, scale: 0.8 }}
      className="fixed top-4 right-4 z-50 bg-gradient-to-r from-yellow-400 to-orange-500 text-white rounded-lg shadow-2xl p-6 max-w-sm"
    >
      <div className="flex items-start gap-4">
        <div className="text-4xl">{achievement.icon}</div>
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="font-bold text-lg">Achievement Unlocked!</h3>
            <span className="text-xs bg-white/20 px-2 py-1 rounded-full uppercase">
              {achievement.rarity}
            </span>
          </div>
          <h4 className="font-semibold text-yellow-100">{achievement.name}</h4>
          <p className="text-sm text-yellow-100/90 mt-1">{achievement.description}</p>
          <div className="flex items-center gap-2 mt-2">
            <span className="text-xs bg-white/20 px-2 py-1 rounded-full">
              +{achievement.points} points
            </span>
          </div>
        </div>
        <button
          onClick={onClose}
          className="text-white/70 hover:text-white transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </motion.div>
  )
}

export const AchievementSystem: React.FC<AchievementSystemProps> = ({ className }) => {
  const [showPanel, setShowPanel] = useState(false)
  const [notifications, setNotifications] = useState<Achievement[]>([])
  const { userProgress, islands, unlockAchievement } = useAdventureMapStore()
  const { socket } = useSocket()

  // Define all available achievements
  const allAchievements: Achievement[] = [
    {
      id: 'first-visit',
      name: 'Explorer',
      description: 'Visit your first project island',
      icon: '🗺️',
      condition: 'Visit any project island',
      points: 10,
      rarity: 'common'
    },
    {
      id: 'demo-master',
      name: 'Demo Master',
      description: 'Complete 3 interactive demos',
      icon: '🎮',
      condition: 'Complete 3 demos',
      points: 50,
      rarity: 'rare'
    },
    {
      id: 'tech-enthusiast',
      name: 'Tech Enthusiast',
      description: 'Explore projects with 10+ different technologies',
      icon: '🛠️',
      condition: 'View 10+ tech stack items',
      points: 30,
      rarity: 'common'
    },
    {
      id: 'interaction-champion',
      name: 'Interaction Champion',
      description: 'Perform 50 interactions across the portfolio',
      icon: '⚡',
      condition: 'Reach 50 interactions',
      points: 75,
      rarity: 'epic'
    },
    {
      id: 'completionist',
      name: 'Completionist',
      description: 'Visit all project islands and complete all demos',
      icon: '🏆',
      condition: 'Complete everything',
      points: 200,
      rarity: 'legendary'
    },
    {
      id: 'speed-runner',
      name: 'Speed Runner',
      description: 'Complete a demo in under 30 seconds',
      icon: '🏃‍♂️',
      condition: 'Fast demo completion',
      points: 25,
      rarity: 'rare'
    },
    {
      id: 'social-butterfly',
      name: 'Social Butterfly',
      description: 'Use the real-time chat feature',
      icon: '💬',
      condition: 'Send a chat message',
      points: 15,
      rarity: 'common'
    },
    {
      id: 'code-collaborator',
      name: 'Code Collaborator',
      description: 'Participate in collaborative coding session',
      icon: '👥',
      condition: 'Join code collaboration',
      points: 40,
      rarity: 'rare'
    }
  ]

  // Check for achievement unlocks
  useEffect(() => {
    checkAchievements()
  }, [userProgress, islands]) // eslint-disable-line react-hooks/exhaustive-deps

  // Listen for real-time achievement events
  useEffect(() => {
    if (socket) {
      socket.on('achievement-unlocked', (achievement: Achievement) => {
        showAchievementNotification(achievement)
      })

      return () => {
        socket.off('achievement-unlocked')
      }
    }
  }, [socket])

  const checkAchievements = () => {
    allAchievements.forEach(achievement => {
      if (!userProgress.unlockedAchievements.includes(achievement.id)) {
        if (shouldUnlockAchievement(achievement)) {
          unlockAchievement(achievement)
          showAchievementNotification(achievement)
          
          // Emit to socket for real-time sharing
          if (socket) {
            socket.emit('achievement-unlock', achievement)
          }
        }
      }
    })
  }

  const shouldUnlockAchievement = (achievement: Achievement): boolean => {
    switch (achievement.id) {
      case 'first-visit':
        return userProgress.visitedIslands.length >= 1
      
      case 'demo-master':
        return userProgress.completedDemos.length >= 3
      
      case 'tech-enthusiast':
        const uniqueTechCount = new Set(
          islands.flatMap(island => island.techStack.map(tech => tech.name))
        ).size
        return uniqueTechCount >= 10
      
      case 'interaction-champion':
        return userProgress.interactionCount >= 50
      
      case 'completionist':
        return userProgress.visitedIslands.length === islands.length &&
               userProgress.completedDemos.length === islands.filter(i => i.demoConfig).length
      
      case 'speed-runner':
        // This would be tracked separately with timing data
        return false // Implement timing logic as needed
      
      case 'social-butterfly':
        // This would be tracked when chat is used
        return false // Implement chat tracking as needed
      
      case 'code-collaborator':
        // This would be tracked when code collaboration is used
        return false // Implement collaboration tracking as needed
      
      default:
        return false
    }
  }

  const showAchievementNotification = (achievement: Achievement) => {
    setNotifications(prev => [...prev, achievement])
  }

  const removeNotification = (achievementId: string) => {
    setNotifications(prev => prev.filter(a => a.id !== achievementId))
  }

  const getRarityColor = (rarity: Achievement['rarity']) => {
    switch (rarity) {
      case 'common': return 'text-gray-600 bg-gray-100'
      case 'rare': return 'text-blue-600 bg-blue-100'
      case 'epic': return 'text-purple-600 bg-purple-100'
      case 'legendary': return 'text-yellow-600 bg-yellow-100'
      default: return 'text-gray-600 bg-gray-100'
    }
  }

  const getProgressPercentage = () => {
    const unlockedCount = userProgress.unlockedAchievements.length
    const totalCount = allAchievements.length
    return Math.round((unlockedCount / totalCount) * 100)
  }

  return (
    <>
      {/* Achievement Panel Toggle */}
      <motion.button
        onClick={() => setShowPanel(!showPanel)}
        className={`fixed bottom-4 right-4 z-40 bg-gradient-to-r from-yellow-500 to-orange-500 text-white p-4 rounded-full shadow-lg hover:shadow-xl transition-shadow ${className}`}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      >
        <div className="relative">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
          </svg>
          {userProgress.unlockedAchievements.length > 0 && (
            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
              {userProgress.unlockedAchievements.length}
            </span>
          )}
        </div>
      </motion.button>

      {/* Achievement Panel */}
      <AnimatePresence>
        {showPanel && (
          <motion.div
            initial={{ opacity: 0, x: 400 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 400 }}
            className="fixed top-0 right-0 h-full w-96 bg-white shadow-2xl z-30 overflow-hidden"
          >
            <div className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold">Achievements</h2>
                <button
                  onClick={() => setShowPanel(false)}
                  className="text-white/70 hover:text-white transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Progress</span>
                  <span>{userProgress.unlockedAchievements.length}/{allAchievements.length}</span>
                </div>
                <div className="w-full bg-white/20 rounded-full h-2">
                  <div 
                    className="bg-white rounded-full h-2 transition-all duration-500"
                    style={{ width: `${getProgressPercentage()}%` }}
                  />
                </div>
                <div className="text-center text-sm">
                  <span className="font-semibold">{userProgress.totalPoints}</span> total points
                </div>
              </div>
            </div>

            <div className="p-4 h-full overflow-y-auto pb-20">
              <div className="space-y-3">
                {allAchievements.map(achievement => {
                  const isUnlocked = userProgress.unlockedAchievements.includes(achievement.id)
                  
                  return (
                    <motion.div
                      key={achievement.id}
                      className={`p-4 rounded-lg border-2 transition-all ${
                        isUnlocked 
                          ? 'bg-yellow-50 border-yellow-300 shadow-md' 
                          : 'bg-gray-50 border-gray-200'
                      }`}
                      whileHover={{ scale: 1.02 }}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                    >
                      <div className="flex items-start gap-3">
                        <div className={`text-2xl ${isUnlocked ? '' : 'grayscale opacity-50'}`}>
                          {achievement.icon}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className={`font-semibold ${isUnlocked ? 'text-gray-800' : 'text-gray-500'}`}>
                              {achievement.name}
                            </h3>
                            <span className={`text-xs px-2 py-1 rounded-full uppercase ${getRarityColor(achievement.rarity)}`}>
                              {achievement.rarity}
                            </span>
                          </div>
                          <p className={`text-sm ${isUnlocked ? 'text-gray-600' : 'text-gray-400'}`}>
                            {achievement.description}
                          </p>
                          <div className="flex items-center justify-between mt-2">
                            <span className={`text-xs ${isUnlocked ? 'text-green-600' : 'text-gray-400'}`}>
                              {achievement.points} points
                            </span>
                            {isUnlocked && (
                              <span className="text-xs text-green-600 font-medium">
                                ✓ Unlocked
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )
                })}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Achievement Notifications */}
      <AnimatePresence>
        {notifications.map((achievement, index) => (
          <motion.div
            key={achievement.id}
            style={{ top: `${4 + index * 120}px` }}
            className="absolute"
          >
            <AchievementNotification
              achievement={achievement}
              onClose={() => removeNotification(achievement.id)}
            />
          </motion.div>
        ))}
      </AnimatePresence>
    </>
  )
}