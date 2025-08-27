'use client'

import { ParticleData } from '@/types/3d'

export interface ParticleApiResponse {
    particles: ParticleData[]
    timestamp: number
    count: number
}

class ParticleService {
    private baseUrl: string
    private wsConnection: WebSocket | null = null
    private listeners: ((data: ParticleData[]) => void)[] = []

    constructor() {
        this.baseUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:3001'
    }

    // Generate random particle data (fallback when API is not available)
    private generateRandomParticles(count: number): ParticleData[] {
        const colors = ['#3b82f6', '#8b5cf6', '#06d6a0', '#f72585', '#ffbe0b', '#ff6b6b', '#4ecdc4']

        return Array.from({ length: count }, (_, i) => ({
            id: `particle-${Date.now()}-${i}`,
            position: [
                (Math.random() - 0.5) * 15,
                (Math.random() - 0.5) * 15,
                (Math.random() - 0.5) * 15
            ] as [number, number, number],
            velocity: [
                (Math.random() - 0.5) * 0.03,
                (Math.random() - 0.5) * 0.03,
                (Math.random() - 0.5) * 0.03
            ] as [number, number, number],
            color: colors[Math.floor(Math.random() * colors.length)],
            size: Math.random() * 4 + 1,
            life: Math.random() * 8 + 3,
            maxLife: Math.random() * 8 + 3
        }))
    }

    // Fetch particle data from API
    async fetchParticles(count: number = 100): Promise<ParticleData[]> {
        try {
            const response = await fetch(`${this.baseUrl}/api/particles?count=${count}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            })

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`)
            }

            const data: ParticleApiResponse = await response.json()
            return data.particles
        } catch (error) {
            console.warn('Failed to fetch particles from API, using fallback:', error)
            return this.generateRandomParticles(count)
        }
    }

    // Initialize WebSocket connection for real-time updates
    initializeWebSocket(): Promise<void> {
        return new Promise((resolve, reject) => {
            try {
                const wsUrl = this.baseUrl.replace('http', 'ws')
                this.wsConnection = new WebSocket(`${wsUrl}/particles`)

                this.wsConnection.onopen = () => {
                    console.log('WebSocket connected for particle updates')
                    resolve()
                }

                this.wsConnection.onmessage = (event) => {
                    try {
                        const data = JSON.parse(event.data)
                        if (data.type === 'particle_update' && data.particles) {
                            this.notifyListeners(data.particles)
                        }
                    } catch (error) {
                        console.error('Error parsing WebSocket message:', error)
                    }
                }

                this.wsConnection.onerror = (error) => {
                    console.error('WebSocket error:', error)
                    reject(error)
                }

                this.wsConnection.onclose = () => {
                    console.log('WebSocket connection closed')
                    // Attempt to reconnect after 5 seconds
                    setTimeout(() => {
                        this.initializeWebSocket().catch(console.error)
                    }, 5000)
                }
            } catch (error) {
                console.error('Failed to initialize WebSocket:', error)
                reject(error)
            }
        })
    }

    // Subscribe to real-time particle updates
    onParticleUpdate(callback: (particles: ParticleData[]) => void): () => void {
        this.listeners.push(callback)

        // Return unsubscribe function
        return () => {
            const index = this.listeners.indexOf(callback)
            if (index > -1) {
                this.listeners.splice(index, 1)
            }
        }
    }

    // Notify all listeners of particle updates
    private notifyListeners(particles: ParticleData[]) {
        this.listeners.forEach(callback => callback(particles))
    }

    // Send particle interaction data to server
    async sendInteraction(skillId: string, position: [number, number, number]): Promise<void> {
        try {
            await fetch(`${this.baseUrl}/api/particles/interaction`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    skillId,
                    position,
                    timestamp: Date.now()
                })
            })
        } catch (error) {
            console.warn('Failed to send interaction data:', error)
        }
    }

    // Close WebSocket connection
    disconnect(): void {
        if (this.wsConnection) {
            this.wsConnection.close()
            this.wsConnection = null
        }
        this.listeners = []
    }
}

// Export singleton instance
export const particleService = new ParticleService()
export default particleService