'use client'

import { SkillPoint } from '@/types/3d'

export interface SkillApiResponse {
    skills: SkillPoint[]
    categories: string[]
    totalCount: number
}

class SkillService {
    private baseUrl: string
    private cache: Map<string, { data: SkillPoint[], timestamp: number }> = new Map()
    private cacheTimeout = 5 * 60 * 1000 // 5 minutes

    constructor() {
        this.baseUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:3001'
    }

    // Fallback skill data when API is not available
    private getFallbackSkills(): SkillPoint[] {
        return [
            {
                id: 'react',
                name: 'React',
                category: 'Frontend',
                position: [0, 0, 0],
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
            },
            {
                id: 'threejs',
                name: 'Three.js',
                category: 'Graphics',
                position: [0, 0, 0],
                color: '#000000',
                description: '3D graphics and interactive visualizations in the browser',
                codeSnippet: `const geometry = new THREE.SphereGeometry(1, 32, 32)
const material = new THREE.MeshPhongMaterial({
  color: 0x3b82f6
})
const sphere = new THREE.Mesh(geometry, material)`,
                proficiencyLevel: 75
            },
            {
                id: 'python',
                name: 'Python',
                category: 'Language',
                position: [0, 0, 0],
                color: '#3776ab',
                description: 'Data science, machine learning, and backend development',
                codeSnippet: `def analyze_data(dataset):
    return {
        'mean': np.mean(dataset),
        'std': np.std(dataset)
    }`,
                proficiencyLevel: 82
            },
            {
                id: 'docker',
                name: 'Docker',
                category: 'DevOps',
                position: [0, 0, 0],
                color: '#2496ed',
                description: 'Containerization and deployment automation',
                codeSnippet: `FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production`,
                proficiencyLevel: 78
            },
            {
                id: 'aws',
                name: 'AWS',
                category: 'Cloud',
                position: [0, 0, 0],
                color: '#ff9900',
                description: 'Cloud infrastructure and serverless applications',
                codeSnippet: `const lambda = new AWS.Lambda()
const params = {
  FunctionName: 'processData',
  Payload: JSON.stringify(data)
}
await lambda.invoke(params).promise()`,
                proficiencyLevel: 85
            },
            {
                id: 'mongodb',
                name: 'MongoDB',
                category: 'Database',
                position: [0, 0, 0],
                color: '#47a248',
                description: 'NoSQL database design and optimization',
                codeSnippet: `const users = await User.aggregate([
  { $match: { active: true } },
  { $group: { _id: '$department', count: { $sum: 1 } } },
  { $sort: { count: -1 } }
])`,
                proficiencyLevel: 80
            }
        ]
    }

    // Check if cached data is still valid
    private isCacheValid(key: string): boolean {
        const cached = this.cache.get(key)
        if (!cached) return false

        return Date.now() - cached.timestamp < this.cacheTimeout
    }

    // Fetch skills from API with caching
    async fetchSkills(): Promise<SkillPoint[]> {
        const cacheKey = 'skills'

        // Return cached data if valid
        if (this.isCacheValid(cacheKey)) {
            return this.cache.get(cacheKey)!.data
        }

        try {
            const response = await fetch(`${this.baseUrl}/api/portfolio/skills`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            })

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`)
            }

            const response_data = await response.json()
            const data = response_data.data || response_data

            // Distribute skills on sphere surface using fibonacci spiral
            const skillsWithPositions = data.skills.map((skill: any, index: number) => {
                const phi = Math.acos(1 - 2 * (index + 0.5) / data.skills.length)
                const theta = Math.PI * (1 + Math.sqrt(5)) * (index + 0.5)

                const radius = 2.5
                const x = Math.sin(phi) * Math.cos(theta) * radius
                const y = Math.cos(phi) * radius
                const z = Math.sin(phi) * Math.sin(theta) * radius

                return {
                    id: skill.id,
                    name: skill.name,
                    category: skill.category,
                    color: skill.color,
                    description: skill.description,
                    proficiencyLevel: skill.level || skill.proficiencyLevel || 75,
                    codeSnippet: skill.codeSnippet || `// ${skill.name} example code\nconsole.log('${skill.name} is awesome!');`,
                    position: [x, y, z] as [number, number, number]
                }
            })

            // Cache the result
            this.cache.set(cacheKey, {
                data: skillsWithPositions,
                timestamp: Date.now()
            })

            return skillsWithPositions
        } catch (error) {
            console.warn('Failed to fetch skills from API, using fallback:', error)

            // Use fallback data and distribute on sphere
            const fallbackSkills = this.getFallbackSkills()
            const skillsWithPositions = fallbackSkills.map((skill, index) => {
                const phi = Math.acos(1 - 2 * (index + 0.5) / fallbackSkills.length)
                const theta = Math.PI * (1 + Math.sqrt(5)) * (index + 0.5)

                const radius = 2.5
                const x = Math.sin(phi) * Math.cos(theta) * radius
                const y = Math.cos(phi) * radius
                const z = Math.sin(phi) * Math.sin(theta) * radius

                return {
                    ...skill,
                    position: [x, y, z] as [number, number, number]
                }
            })

            return skillsWithPositions
        }
    }

    // Fetch skill by ID
    async fetchSkillById(id: string): Promise<SkillPoint | null> {
        try {
            const response = await fetch(`${this.baseUrl}/api/portfolio/skills/${id}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            })

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`)
            }

            const skill: SkillPoint = await response.json()
            return skill
        } catch (error) {
            console.warn('Failed to fetch skill by ID:', error)

            // Fallback to local search
            const skills = await this.fetchSkills()
            return skills.find(skill => skill.id === id) || null
        }
    }

    // Update skill proficiency
    async updateSkillProficiency(id: string, proficiency: number): Promise<boolean> {
        try {
            const response = await fetch(`${this.baseUrl}/api/portfolio/skills/${id}/proficiency`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ proficiency })
            })

            if (response.ok) {
                // Invalidate cache
                this.cache.delete('skills')
                return true
            }

            return false
        } catch (error) {
            console.warn('Failed to update skill proficiency:', error)
            return false
        }
    }

    // Clear cache
    clearCache(): void {
        this.cache.clear()
    }
}

// Export singleton instance
export const skillService = new SkillService()
export default skillService