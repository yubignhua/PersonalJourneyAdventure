import { ReactNode } from 'react'
import { Object3D, Material, BufferGeometry } from 'three'

// 3D Scene Types
export interface Scene3DConfig {
    antialias: boolean
    shadows: boolean
    toneMapping: boolean
    pixelRatio: number
    powerPreference: 'default' | 'high-performance' | 'low-power'
}

export interface PerformanceLevel {
    level: 'low' | 'medium' | 'high'
    fps: number
    frameTime: number
    memoryUsage: number
}

export interface DeviceCapabilities {
    isMobile: boolean
    hasWebGL: boolean
    deviceMemory: number
    hardwareConcurrency: number
    performanceLevel: PerformanceLevel['level']
}

// LOD Types
export interface LODLevel {
    distance: number
    component: ReactNode
}

// Error Types
export interface Scene3DError {
    type: 'webgl-not-supported' | 'rendering-error' | 'performance-fallback'
    message: string
    stack?: string
}

// Performance Metrics
export interface PerformanceMetrics {
    fps: number
    frameTime: number
    memoryUsage: number
    drawCalls: number
    triangles: number
    geometries: number
    textures: number
}

// Component Props
export interface OptimizedMeshProps {
    geometry: BufferGeometry
    material: Material | Material[]
    position?: [number, number, number]
    rotation?: [number, number, number]
    scale?: [number, number, number] | number
    castShadow?: boolean
    receiveShadow?: boolean
    frustumCulled?: boolean
    renderOrder?: number
    onUpdate?: (mesh: Object3D) => void
    children?: ReactNode
}

export interface Scene3DManagerProps {
    children: ReactNode
    fallbackComponent?: React.ComponentType<any>
    enablePerformanceMonitoring?: boolean
    adaptiveQuality?: boolean
    className?: string
}

// Hook Types
export interface Scene3DState {
    isLoaded: boolean
    performanceLevel: PerformanceLevel['level']
    hasError: boolean
    metrics: {
        fps: number
        frameTime: number
        memoryUsage: number
    }
}

export interface Scene3DControls {
    resetError: () => void
    forceQualityLevel: (level: PerformanceLevel['level']) => void
    enablePerformanceMode: () => void
    disablePerformanceMode: () => void
}

// Globe and Skill Point Types
export interface SkillPoint {
    id: string
    name: string
    category: string
    position: [number, number, number] // 3D position on globe surface
    color: string
    description: string
    codeSnippet?: string
    proficiencyLevel: number // 0-100
}

export interface ParticleData {
    id: string
    position: [number, number, number]
    velocity: [number, number, number]
    color: string
    size: number
    life: number
    maxLife: number
}

export interface Globe3DProps {
    skills: SkillPoint[]
    onSkillClick: (skill: SkillPoint) => void
    particleCount: number
    radius?: number
    rotationSpeed?: number
    interactive?: boolean
}

export interface ParticleSystemProps {
    particles: ParticleData[]
    animationSpeed?: number
    interactive?: boolean
}