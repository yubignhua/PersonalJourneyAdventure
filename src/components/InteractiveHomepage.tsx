'use client'

import React, { useState, useEffect, Suspense, useCallback, useMemo } from 'react'
import { Canvas } from '@react-three/fiber'
import Globe3D from './3d/Globe3D'
import ParticleSystem from './3d/ParticleSystem'
import SimpleTypewriter from './ui/SimpleTypewriter'
import PasswordUnlock from './ui/PasswordUnlock'
import NavigationBar from './layout/NavigationBar'
import { LoginModal } from './auth/LoginModal'
import RegisterModal from './auth/RegisterModal'
import { SkillPoint, ParticleData } from '@/types/3d'
import { skillService } from '@/services/skillService'
import { useAuth } from '@/lib/auth-context'

import { socketManager } from '@/lib/socket'

// Sample skill data - this would come from API in task 4.2
const sampleSkills: SkillPoint[] = [
  {
    id: 'react',
    name: 'React',
    category: 'Frontend',
    position: [0, 0, 0], // Will be calculated by Globe3D
    color: '#61dafb',
    description: 'Building interactive user interfaces with React and modern hooks',
    codeSnippet: `const [state, setState] = useState(0)
    
useEffect(() => {
  // Component logic here
}, [state])`,
    proficiencyLevel: 95
  },
  {
    id: 'typescript',
    name: 'TypeScript',
    category: 'Language',
    position: [0, 0, 0],
    color: '#3178c6',
    description: 'Type-safe JavaScript development with advanced TypeScript features',
    codeSnippet: `interface User {
  id: string
  name: string
  skills: Skill[]
}

const createUser = (data: User): User => data`,
    proficiencyLevel: 90
  },
  {
    id: 'nodejs',
    name: 'Node.js',
    category: 'Backend',
    position: [0, 0, 0],
    color: '#339933',
    description: 'Server-side JavaScript with Express, APIs, and real-time features',
    codeSnippet: `app.get('/api/skills', async (req, res) => {
  const skills = await getSkills()
  res.json({ skills })
})`,
    proficiencyLevel: 88
  }
]

// Generate initial particle data
const generateParticles = (count: number): ParticleData[] => {
  return Array.from({ length: count }, (_, i) => ({
    id: `particle-${i}`,
    position: [
      (Math.random() - 0.5) * 10,
      (Math.random() - 0.5) * 10,
      (Math.random() - 0.5) * 10
    ] as [number, number, number],
    velocity: [
      (Math.random() - 0.5) * 0.02,
      (Math.random() - 0.5) * 0.02,
      (Math.random() - 0.5) * 0.02
    ] as [number, number, number],
    color: ['#3b82f6', '#8b5cf6', '#06d6a0', '#f72585', '#ffbe0b'][Math.floor(Math.random() * 5)],
    size: Math.random() * 3 + 1,
    life: Math.random() * 5 + 2,
    maxLife: Math.random() * 5 + 2
  }))
}

const InteractiveHomepage: React.FC = () => {
  const { isAuthenticated, user, logout } = useAuth()
  const [selectedSkill, setSelectedSkill] = useState<SkillPoint | null>(null)
  const [particles, setParticles] = useState<ParticleData[]>(() => generateParticles(50))
  const [skills, setSkills] = useState<SkillPoint[]>(sampleSkills)
  const [isUnlocked, setIsUnlocked] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [showIntro, setShowIntro] = useState(true)
  const [introComplete, setIntroComplete] = useState(false)
  const [showPasswordUnlock, setShowPasswordUnlock] = useState(false)
  const [showLoginModal, setShowLoginModal] = useState(false)
  const [showRegisterModal, setShowRegisterModal] = useState(false)
  const [socketConnected, setSocketConnected] = useState(false)

  // Memoize expensive calculations
  const visibleParticles = useMemo(() => {
    return particles.slice(-200) // Keep only latest 200 particles for performance
  }, [particles])

  const sortedSkills = useMemo(() => {
    return [...skills].sort((a, b) => b.proficiencyLevel - a.proficiencyLevel)
  }, [skills])

  // Handle skill point clicks with enhanced particle burst
  const handleSkillClick = (skill: SkillPoint) => {
    setSelectedSkill(skill)

    // Generate burst of particles around the clicked skill
    const burstParticles = Array.from({ length: 20 }, (_, i) => {
      const angle = (i / 20) * Math.PI * 2
      const radius = 0.5 + Math.random() * 0.5
      const speed = 0.02 + Math.random() * 0.03

      return {
        id: `skill-burst-${skill.id}-${i}-${Date.now()}`,
        position: [
          skill.position[0] + Math.cos(angle) * radius * 0.2,
          skill.position[1] + Math.sin(angle) * radius * 0.2,
          skill.position[2] + (Math.random() - 0.5) * 0.2
        ] as [number, number, number],
        velocity: [
          Math.cos(angle) * speed,
          Math.sin(angle) * speed,
          (Math.random() - 0.5) * speed
        ] as [number, number, number],
        color: skill.color,
        size: Math.random() * 3 + 2,
        life: 2 + Math.random() * 2,
        maxLife: 2 + Math.random() * 2
      }
    })

    // Add some trailing particles
    const trailParticles = Array.from({ length: 15 }, (_, i) => ({
      id: `skill-trail-${skill.id}-${i}-${Date.now()}`,
      position: [
        skill.position[0] + (Math.random() - 0.5) * 1.5,
        skill.position[1] + (Math.random() - 0.5) * 1.5,
        skill.position[2] + (Math.random() - 0.5) * 1.5
      ] as [number, number, number],
      velocity: [
        (Math.random() - 0.5) * 0.01,
        (Math.random() - 0.5) * 0.01,
        (Math.random() - 0.5) * 0.01
      ] as [number, number, number],
      color: skill.color,
      size: Math.random() * 1.5 + 0.5,
      life: 4 + Math.random() * 3,
      maxLife: 4 + Math.random() * 3
    }))

    setParticles(prev => [...prev, ...burstParticles, ...trailParticles])
  }

  const handleCloseSkillAnimation = () => {
    setSelectedSkill(null)
  }

  // Initialize WebSocket connection and load skills
  useEffect(() => {
    const initializeApp = async () => {
      try {
        // Connect to WebSocket
        const socket = socketManager.connect()

        socket.on('connect', () => {
          setSocketConnected(true)
          console.log('Connected to backend for real-time features')
        })

        socket.on('disconnect', () => {
          setSocketConnected(false)
        })

        // Listen for real-time particle updates from socket
        socket.on('particle-update', (data: any) => {
          if (data.particles) {
            setParticles(prev => [...prev, ...data.particles])
          }
        })

        // Load skills from API
        const loadedSkills = await skillService.fetchSkills()
        setSkills(loadedSkills)

        setIsLoading(false)
      } catch (error) {
        console.warn('Failed to initialize app:', error)
        setIsLoading(false)
      }
    }

    initializeApp()

    return () => {
      socketManager.disconnect()
    }
  }, [])

  // Handle intro completion
  const handleIntroComplete = useCallback(() => {
    console.log('Intro completed') // Debug log
    setIntroComplete(true)
    setTimeout(() => {
      setShowPasswordUnlock(true)
    }, 1000)
  }, [])

  // Handle password unlock
  const handleUnlock = useCallback(() => {
    setIsUnlocked(true)
    setShowPasswordUnlock(false)

    // Emit unlock event to backend for particle generation
    if (socketConnected) {
      socketManager.emit('user-unlocked', { timestamp: Date.now() })
    }
  }, [socketConnected])

  // Generate random particle data from API
  const generateRandomParticles = useCallback(async () => {
    try {
      const apiUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:3001'
      const response = await fetch(`${apiUrl}/api/particles/random`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ count: 20 })
      })

      if (response.ok) {
        const newParticles = await response.json()
        setParticles(prev => [...prev, ...newParticles])
      }
    } catch (error) {
      console.warn('Failed to fetch random particles:', error)
      // Fallback to local generation
      const fallbackParticles = generateParticles(20)
      setParticles(prev => [...prev, ...fallbackParticles])
    }
  }, [])

  // Periodically generate new particles and clean up old ones
  useEffect(() => {
    if (isUnlocked) {
      const interval = setInterval(generateRandomParticles, 5000)

      // Clean up old particles every 10 seconds
      const cleanupInterval = setInterval(() => {
        setParticles(prev => {
          const now = Date.now()
          return prev.filter(particle => {
            const age = (now - parseInt(particle.id.split('-').pop() || '0')) / 1000
            return age < particle.maxLife
          }).slice(-200) // Keep only the latest 200 particles
        })
      }, 10000)

      return () => {
        clearInterval(interval)
        clearInterval(cleanupInterval)
      }
    }
  }, [isUnlocked, generateRandomParticles])

  return (
    <div className="relative w-full min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-black overflow-hidden">
      {/* Navigation Bar */}
      <NavigationBar
        isAuthenticated={isAuthenticated}
        user={user}
        onLogin={() => setShowLoginModal(true)}
        onRegister={() => setShowRegisterModal(true)}
        onLogout={logout}
      />

      {/* Background stars effect */}
      <div className="absolute inset-0 opacity-30">
        <div className="stars-small"></div>
        <div className="stars-medium"></div>
        <div className="stars-large"></div>
      </div>

      {/* 3D Scene - Only render when unlocked */}
      {isUnlocked && (
        <Canvas
          className="w-full h-full"
          camera={{ position: [0, 0, 8], fov: 60 }}
          gl={{
            antialias: true,
            alpha: true,
            powerPreference: 'high-performance'
          }}
        >
          <Suspense fallback={null}>
            {/* Lighting */}
            <ambientLight intensity={0.4} />
            <directionalLight position={[10, 10, 5]} intensity={0.8} />

            {/* Globe with skills */}
            <Globe3D
              skills={sortedSkills}
              onSkillClick={handleSkillClick}
              particleCount={50}
              radius={2.5}
              rotationSpeed={0.002}
              interactive={true}
            />

            {/* Particle system */}
            <ParticleSystem
              particles={visibleParticles}
              animationSpeed={1}
              interactive={true}
            />
          </Suspense>
        </Canvas>
      )}

      {/* Loading Screen */}
      {isLoading && (
        <div className="absolute inset-0 z-50 bg-black/90 flex items-center justify-center">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-4 mx-auto" />
            <SimpleTypewriter
              text="Initializing Interactive Laboratory..."
              speed={50}
              className="text-blue-400 text-lg"
            />
          </div>
        </div>
      )}

      {/* Intro Screen */}
      {!isLoading && showIntro && !introComplete && (
        <div className="absolute inset-0 z-40 bg-black/95 flex items-center justify-center">
          <div className="text-center max-w-2xl px-8">
            <div className="mb-8">
              <SimpleTypewriter
                text="Welcome to the Interactive Laboratory"
                speed={80}
                className="text-4xl font-bold text-white mb-4 block"
                onComplete={handleIntroComplete}
              />
              <div className="text-xl text-blue-300 mt-4">
                Where code meets creativity in three-dimensional space
              </div>
            </div>
            <div className="text-gray-400 text-sm mt-8">
              Preparing immersive experience...
            </div>
          </div>
        </div>
      )}

      {/* Password Unlock Screen */}
      {!isLoading && showPasswordUnlock && !isUnlocked && (
        <div className="absolute inset-0 z-30 bg-black/90 flex items-center justify-center">
          <PasswordUnlock
            onUnlock={handleUnlock}
            correctPassword="react"
            placeholder="Enter skill keyword..."
            hint="Try a popular frontend framework (starts with 'r')"
          />
        </div>
      )}

      {/* Main UI Overlay - Only show when unlocked */}

      {/* Skill Details Panel with Enhanced Animations */}
      {isUnlocked && selectedSkill && (
        <div className="absolute top-1/2 right-4 sm:right-8 transform -translate-y-1/2 z-20 max-w-xs sm:max-w-sm animate-in slide-in-from-right-4 duration-300">
          <div className="bg-gray-900/95 backdrop-blur-sm border border-blue-500/30 rounded-xl p-4 sm:p-6 shadow-2xl shadow-blue-500/20 transition-all duration-300 ease-out hover:shadow-blue-500/30">
            {/* Animated border glow */}
            <div
              className="absolute inset-0 rounded-xl opacity-20 animate-pulse"
              style={{
                background: `linear-gradient(45deg, ${selectedSkill.color}20, transparent, ${selectedSkill.color}20)`,
                filter: 'blur(1px)'
              }}
            />

            {/* Header */}
            <div className="relative flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div
                  className="w-4 h-4 rounded-full animate-pulse shadow-lg"
                  style={{
                    backgroundColor: selectedSkill.color,
                    boxShadow: `0 0 12px ${selectedSkill.color}60`
                  }}
                />
                <div>
                  <h3 className="text-white font-semibold text-base sm:text-lg">
                    {selectedSkill.name}
                  </h3>
                  <div className="text-xs text-blue-400 font-medium">
                    {selectedSkill.category}
                  </div>
                </div>
              </div>
              <button
                onClick={handleCloseSkillAnimation}
                className="text-gray-400 hover:text-white transition-all duration-200 hover:rotate-90 text-lg"
              >
                ✕
              </button>
            </div>

            {/* Proficiency */}
            <div className="relative mb-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-gray-400">Proficiency</span>
                <span className="text-xs text-gray-300 font-mono">
                  {selectedSkill.proficiencyLevel}%
                </span>
              </div>
              <div className="flex-1 bg-gray-800 rounded-full h-2.5 overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-1000 ease-out relative"
                  style={{
                    width: `${selectedSkill.proficiencyLevel}%`,
                    background: `linear-gradient(90deg, ${selectedSkill.color}, ${selectedSkill.color}80)`
                  }}
                >
                  <div className="absolute inset-0 bg-white/20 animate-pulse" />
                </div>
              </div>
            </div>

            {/* Description */}
            <p className="relative text-gray-300 text-sm mb-4 leading-relaxed">
              {selectedSkill.description}
            </p>

            {/* Code Snippet with Enhanced Styling */}
            {selectedSkill.codeSnippet && (
              <div className="relative bg-black/60 rounded-lg border border-gray-700 p-3 sm:p-4 overflow-hidden">
                {/* Terminal header */}
                <div className="flex items-center space-x-1.5 mb-3">
                  <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                  <div className="w-2 h-2 rounded-full bg-yellow-500 animate-pulse" style={{ animationDelay: '0.2s' }} />
                  <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" style={{ animationDelay: '0.4s' }} />
                  <span className="text-xs text-gray-500 ml-2 font-mono">
                    {selectedSkill.name.toLowerCase()}.{selectedSkill.category === 'Frontend' ? 'tsx' : selectedSkill.category === 'Backend' ? 'js' : 'py'}
                  </span>
                </div>

                {/* Code content */}
                <pre className="text-xs text-green-400 font-mono overflow-x-auto relative leading-relaxed">
                  <code>{selectedSkill.codeSnippet}</code>
                  <span className="inline-block w-2 h-4 bg-green-400 ml-1 animate-pulse align-middle" />
                </pre>

                {/* Scan line effect */}
                <div
                  className="absolute inset-0 opacity-10 pointer-events-none"
                  style={{
                    background: `linear-gradient(90deg, transparent, ${selectedSkill.color}40, transparent)`,
                    animation: 'scan 2s linear infinite'
                  }}
                />
              </div>
            )}
          </div>
        </div>
      )}

      {/* Right Side Panel - Desktop Only */}
      {isUnlocked && (
        <div className="hidden lg:block absolute top-8 right-8 z-10 w-80 space-y-4">
          {/* Featured Blog Entry */}
          <div className="bg-gradient-to-br from-green-900/30 to-teal-900/30 backdrop-blur-sm rounded-xl p-5 text-white border border-green-500/30 hover:border-green-500/50 transition-all duration-300">
            <div className="flex items-center space-x-2 mb-3">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              <span className="text-xs text-green-400 font-medium uppercase tracking-wider">Latest Post</span>
            </div>
            <h4 className="font-semibold text-base mb-3 leading-tight">Building Interactive 3D Experiences</h4>
            <p className="text-xs text-gray-300 mb-4 leading-relaxed">
              Learn how to create immersive 3D web experiences using React Three Fiber and modern web technologies.
            </p>
            <a
              href="/blog"
              className="inline-flex items-center space-x-2 text-xs text-green-400 hover:text-green-300 transition-colors group"
            >
              <span>Read more</span>
              <span className="transform group-hover:translate-x-1 transition-transform duration-200">→</span>
            </a>
          </div>

          {/* Quick Stats */}
          <div className="bg-black/40 backdrop-blur-sm rounded-xl p-4 border border-gray-700/50">
            <div className="grid grid-cols-2 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-blue-400 mb-1">{skills.length}</div>
                <div className="text-xs text-gray-400">Skills</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-green-400 mb-1">{visibleParticles.length}</div>
                <div className="text-xs text-gray-400">Particles</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Performance Indicator - Mobile Optimized */}
      {isUnlocked && (
        <div className="lg:hidden fixed bottom-20 right-4 z-10">
          <div className="bg-black/60 backdrop-blur-sm rounded-lg p-2 text-white text-xs border border-gray-700/50">
            <div className="flex items-center space-x-2">
              <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
              <span className="opacity-80">Active</span>
            </div>
          </div>
        </div>
      )}

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

// Add custom CSS animations
const customStyles = `
  @keyframes float {
    0%, 100% { transform: translateY(0px); }
    50% { transform: translateY(-10px); }
  }
  
  @keyframes glow {
    0%, 100% { opacity: 0.5; }
    50% { opacity: 1; }
  }
  
  @keyframes slideIn {
    from { 
      opacity: 0;
      transform: translateX(-20px);
    }
    to { 
      opacity: 1;
      transform: translateX(0);
    }
  }
  
  .float-animation {
    animation: float 3s ease-in-out infinite;
  }
  
  .glow-animation {
    animation: glow 2s ease-in-out infinite;
  }
  
  .slide-in-animation {
    animation: slideIn 0.5s ease-out;
  }
`;

// Inject styles into document head
if (typeof document !== 'undefined') {
  const styleSheet = document.createElement('style');
  styleSheet.textContent = customStyles;
  document.head.appendChild(styleSheet);
}

export default InteractiveHomepage