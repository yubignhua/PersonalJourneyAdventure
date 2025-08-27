// Types for Adventure Map components

// Project Island Types
export interface ProjectIsland {
    id: string
    name: string
    description: string
    shortDescription?: string
    position: {
        x: number
        y: number
        size: 'small' | 'medium' | 'large'
        theme: 'tropical' | 'arctic' | 'volcanic' | 'mystical' | 'tech'
    }
    techStack: TechStackItem[]
    category: string
    status: 'planning' | 'in-development' | 'completed' | 'maintained' | 'archived'
    githubUrl?: string
    liveUrl?: string
    demoUrl?: string
    featured: boolean
    color: string
    metrics?: ProjectMetrics
    demoConfig?: DemoConfig
    achievements?: Achievement[]
}

export interface TechStackItem {
    name: string
    category: 'frontend' | 'backend' | 'database' | 'devops' | 'mobile' | 'desktop' | 'ai-ml' | 'blockchain' | 'other'
    proficiency: 'beginner' | 'intermediate' | 'advanced' | 'expert'
    icon?: string
    color?: string
}

export interface ProjectMetrics {
    githubStars: number
    githubForks: number
    githubWatchers: number
    commits: number
    contributors: number
    linesOfCode: number
    lastCommitDate?: Date
    deploymentStatus: 'deployed' | 'staging' | 'development' | 'archived'
    uptime: number
    performanceScore: number
}

export interface DemoConfig {
    type: 'iframe' | 'interactive-component' | 'code-sandbox' | 'video' | 'image-gallery'
    url?: string
    embedCode?: string
    interactiveFeatures?: InteractiveFeature[]
    screenshots?: string[]
    videoUrl?: string
}

export interface InteractiveFeature {
    name: string
    description: string
    action: string
}

export interface Achievement {
    id: string
    name: string
    description: string
    icon: string
    condition: string
    points: number
    rarity: 'common' | 'rare' | 'epic' | 'legendary'
    unlocked?: boolean
    unlockedAt?: Date
}

// Adventure Map Component Props
export interface AdventureMapProps {
    islands: ProjectIsland[]
    onIslandClick: (island: ProjectIsland) => void
    onIslandHover: (island: ProjectIsland | null) => void
    selectedIsland?: ProjectIsland | null
    className?: string
}

export interface ProjectIslandComponentProps {
    island: ProjectIsland
    onClick: (island: ProjectIsland) => void
    onHover: (island: ProjectIsland | null) => void
    isSelected: boolean
    isHovered: boolean
    scale?: number
}

export interface MapViewport {
    x: number
    y: number
    zoom: number
    width: number
    height: number
}

export interface MapControls {
    pan: (deltaX: number, deltaY: number) => void
    zoom: (factor: number, centerX?: number, centerY?: number) => void
    zoomToIsland: (island: ProjectIsland) => void
    resetView: () => void
    fitToContent: () => void
}

// Project Detail Modal Types
export interface ProjectDetailModalProps {
    island: ProjectIsland | null
    isOpen: boolean
    onClose: () => void
    onDemoLaunch?: (island: ProjectIsland) => void
    onGithubClick?: (island: ProjectIsland) => void
    onLiveUrlClick?: (island: ProjectIsland) => void
}

// Demo Interaction Types
export interface DemoInteraction {
    type: 'shopping-cart' | 'api-test' | 'performance-test' | 'custom'
    data: any
}

export interface DemoInteractionResult {
    success: boolean
    data: any
    error?: string
}

// Achievement System Types
export interface UserProgress {
    unlockedAchievements: string[]
    totalPoints: number
    visitedIslands: string[]
    completedDemos: string[]
    interactionCount: number
}

// Map Navigation Types
export interface MapNavigationState {
    currentView: MapViewport
    selectedIsland: ProjectIsland | null
    hoveredIsland: ProjectIsland | null
    isNavigating: boolean
}