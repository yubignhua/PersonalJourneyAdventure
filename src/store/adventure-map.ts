import { create } from 'zustand'
import { devtools, persist } from 'zustand/middleware'
import { ProjectIsland, UserProgress, Achievement } from '@/types/adventure-map'

interface AdventureMapState {
    // Current state
    selectedIsland: ProjectIsland | null
    hoveredIsland: ProjectIsland | null
    islands: ProjectIsland[]
    isLoading: boolean
    error: string | null

    // User progress
    userProgress: UserProgress

    // Actions
    setSelectedIsland: (island: ProjectIsland | null) => void
    setHoveredIsland: (island: ProjectIsland | null) => void
    setIslands: (islands: ProjectIsland[]) => void
    setLoading: (loading: boolean) => void
    setError: (error: string | null) => void

    // Progress actions
    visitIsland: (islandId: string) => void
    completeDemo: (islandId: string) => void
    unlockAchievement: (achievement: Achievement) => void
    incrementInteraction: () => void

    // Data fetching
    fetchIslands: () => Promise<void>

    // Reset
    reset: () => void
}

const initialUserProgress: UserProgress = {
    unlockedAchievements: [],
    totalPoints: 0,
    visitedIslands: [],
    completedDemos: [],
    interactionCount: 0
}

export const useAdventureMapStore = create<AdventureMapState>()(
    devtools(
        persist(
            (set, get) => ({
                // Initial state
                selectedIsland: null,
                hoveredIsland: null,
                islands: [],
                isLoading: false,
                error: null,
                userProgress: initialUserProgress,

                // Basic actions
                setSelectedIsland: (island) => set({ selectedIsland: island }),
                setHoveredIsland: (island) => set({ hoveredIsland: island }),
                setIslands: (islands) => set({ islands }),
                setLoading: (loading) => set({ isLoading: loading }),
                setError: (error) => set({ error }),

                // Progress actions
                visitIsland: (islandId) => {
                    const { userProgress } = get()
                    if (!userProgress.visitedIslands.includes(islandId)) {
                        set({
                            userProgress: {
                                ...userProgress,
                                visitedIslands: [...userProgress.visitedIslands, islandId],
                                totalPoints: userProgress.totalPoints + 5
                            }
                        })
                    }
                },

                completeDemo: (islandId) => {
                    const { userProgress } = get()
                    if (!userProgress.completedDemos.includes(islandId)) {
                        set({
                            userProgress: {
                                ...userProgress,
                                completedDemos: [...userProgress.completedDemos, islandId],
                                totalPoints: userProgress.totalPoints + 15
                            }
                        })
                    }
                },

                unlockAchievement: (achievement) => {
                    const { userProgress } = get()
                    if (!userProgress.unlockedAchievements.includes(achievement.id)) {
                        set({
                            userProgress: {
                                ...userProgress,
                                unlockedAchievements: [...userProgress.unlockedAchievements, achievement.id],
                                totalPoints: userProgress.totalPoints + achievement.points
                            }
                        })
                    }
                },

                incrementInteraction: () => {
                    const { userProgress } = get()
                    set({
                        userProgress: {
                            ...userProgress,
                            interactionCount: userProgress.interactionCount + 1
                        }
                    })
                },

                // Data fetching
                fetchIslands: async () => {
                    set({ isLoading: true, error: null })

                    try {
                        const response = await fetch('/api/projects/map/islands')

                        if (!response.ok) {
                            throw new Error(`Failed to fetch islands: ${response.statusText}`)
                        }

                        const data = await response.json()

                        if (data.success) {
                            // Transform backend data to frontend format
                            const islands: ProjectIsland[] = data.data.map((island: any) => ({
                                id: island.id,
                                name: island.name,
                                description: island.description,
                                shortDescription: island.shortDescription,
                                position: island.position || {
                                    x: Math.random() * 10 - 5, // Random position if not set
                                    y: Math.random() * 10 - 5,
                                    size: island.size || 'medium',
                                    theme: island.theme || 'tropical'
                                },
                                techStack: island.techStack || [],
                                category: island.category,
                                status: island.status,
                                githubUrl: island.githubUrl,
                                liveUrl: island.liveUrl,
                                demoUrl: island.demoUrl,
                                featured: island.featured || false,
                                color: island.color || '#00f5ff',
                                metrics: island.metrics,
                                demoConfig: island.demoConfig,
                                achievements: island.achievements || []
                            }))

                            set({ islands, isLoading: false })
                        } else {
                            throw new Error(data.error || 'Failed to fetch islands')
                        }
                    } catch (error) {
                        console.error('Error fetching islands:', error)
                        set({
                            error: error instanceof Error ? error.message : 'Unknown error occurred',
                            isLoading: false
                        })

                        // Set fallback data for development
                        const fallbackIslands: ProjectIsland[] = [
                            {
                                id: 'portfolio-website',
                                name: 'Portfolio Website',
                                description: 'Interactive portfolio website with 3D elements and real-time features',
                                shortDescription: 'Interactive portfolio with 3D elements',
                                position: { x: 0, y: 0, size: 'large', theme: 'tech' },
                                techStack: [
                                    { name: 'Next.js', category: 'frontend', proficiency: 'advanced', color: '#000000' },
                                    { name: 'React Three Fiber', category: 'frontend', proficiency: 'intermediate', color: '#61DAFB' },
                                    { name: 'Node.js', category: 'backend', proficiency: 'advanced', color: '#339933' }
                                ],
                                category: 'web-app',
                                status: 'in-development',
                                githubUrl: 'https://github.com/example/portfolio',
                                featured: true,
                                color: '#00FFFF',
                                demoConfig: {
                                    type: 'interactive-component',
                                    interactiveFeatures: [
                                        { name: 'Particle System', description: 'Interactive 3D particles', action: 'particle-demo' },
                                        { name: 'Performance Test', description: 'Test system performance', action: 'performance-test' }
                                    ]
                                },
                                achievements: [
                                    {
                                        id: 'first-visit',
                                        name: 'Explorer',
                                        description: 'Visit your first project island',
                                        icon: '🗺️',
                                        condition: 'Visit any project island',
                                        points: 10,
                                        rarity: 'common'
                                    }
                                ]
                            },
                            {
                                id: 'e-commerce-app',
                                name: 'E-commerce Platform',
                                description: 'Full-stack e-commerce application with real-time inventory',
                                shortDescription: 'E-commerce platform with real-time features',
                                position: { x: 3, y: -2, size: 'medium', theme: 'tropical' },
                                techStack: [
                                    { name: 'React', category: 'frontend', proficiency: 'advanced', color: '#61DAFB' },
                                    { name: 'Express.js', category: 'backend', proficiency: 'advanced', color: '#000000' },
                                    { name: 'MongoDB', category: 'database', proficiency: 'intermediate', color: '#47A248' }
                                ],
                                category: 'web-app',
                                status: 'completed',
                                githubUrl: 'https://github.com/example/ecommerce',
                                liveUrl: 'https://example-ecommerce.com',
                                featured: false,
                                color: '#22C55E',
                                demoConfig: {
                                    type: 'interactive-component',
                                    interactiveFeatures: [
                                        { name: 'Shopping Cart', description: 'Add items to cart with real-time inventory', action: 'shopping-cart' },
                                        { name: 'Payment Flow', description: 'Simulate payment processing', action: 'payment-demo' }
                                    ]
                                },
                                metrics: {
                                    githubStars: 42,
                                    githubForks: 12,
                                    githubWatchers: 8,
                                    commits: 156,
                                    contributors: 3,
                                    linesOfCode: 8500,
                                    deploymentStatus: 'deployed',
                                    uptime: 99.8,
                                    performanceScore: 92
                                }
                            },
                            {
                                id: 'mobile-game',
                                name: 'Mobile Puzzle Game',
                                description: 'Cross-platform mobile game built with React Native',
                                shortDescription: 'Cross-platform mobile puzzle game',
                                position: { x: -2, y: 3, size: 'small', theme: 'mystical' },
                                techStack: [
                                    { name: 'React Native', category: 'mobile', proficiency: 'intermediate', color: '#61DAFB' },
                                    { name: 'Expo', category: 'mobile', proficiency: 'intermediate', color: '#000020' }
                                ],
                                category: 'mobile-app',
                                status: 'completed',
                                githubUrl: 'https://github.com/example/mobile-game',
                                featured: false,
                                color: '#9370DB'
                            }
                        ]

                        set({ islands: fallbackIslands })
                    }
                },

                // Reset
                reset: () => set({
                    selectedIsland: null,
                    hoveredIsland: null,
                    islands: [],
                    isLoading: false,
                    error: null,
                    userProgress: initialUserProgress
                })
            }),
            {
                name: 'adventure-map-storage',
                partialize: (state) => ({
                    userProgress: state.userProgress
                })
            }
        ),
        { name: 'adventure-map-store' }
    )
)