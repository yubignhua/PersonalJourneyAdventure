import { NextResponse } from 'next/server'

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:3001'

export async function GET() {
    try {
        const response = await fetch(`${BACKEND_URL}/api/projects/map/islands`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        })

        if (!response.ok) {
            throw new Error(`Backend responded with status: ${response.status}`)
        }

        const data = await response.json()
        return NextResponse.json(data)
    } catch (error) {
        console.error('Error fetching islands:', error)

        // Return fallback data if backend is not available
        const fallbackData = {
            success: true,
            data: [
                {
                    id: 'portfolio-website',
                    name: 'Portfolio Website',
                    description: 'Interactive portfolio website with 3D elements and real-time features',
                    shortDescription: 'Interactive portfolio with 3D elements',
                    position: { x: 0, y: 0, size: 'large', theme: 'tech' },
                    techStack: [
                        { name: 'Next.js', category: 'frontend', proficiency: 'advanced', color: '#000000' },
                        { name: 'React Three Fiber', category: 'frontend', proficiency: 'intermediate', color: '#61DAFB' },
                        { name: 'Node.js', category: 'backend', proficiency: 'advanced', color: '#339933' },
                        { name: 'TypeScript', category: 'frontend', proficiency: 'advanced', color: '#3178c6' },
                        { name: 'Framer Motion', category: 'frontend', proficiency: 'intermediate', color: '#0055FF' }
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
                    description: 'Full-stack e-commerce application with real-time inventory management and payment processing',
                    shortDescription: 'E-commerce platform with real-time features',
                    position: { x: 3, y: -2, size: 'medium', theme: 'tropical' },
                    techStack: [
                        { name: 'React', category: 'frontend', proficiency: 'advanced', color: '#61DAFB' },
                        { name: 'Express.js', category: 'backend', proficiency: 'advanced', color: '#000000' },
                        { name: 'MongoDB', category: 'database', proficiency: 'intermediate', color: '#47A248' },
                        { name: 'Socket.io', category: 'backend', proficiency: 'intermediate', color: '#010101' },
                        { name: 'Stripe', category: 'backend', proficiency: 'intermediate', color: '#635BFF' }
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
                    description: 'Cross-platform mobile game built with React Native featuring engaging puzzles and smooth animations',
                    shortDescription: 'Cross-platform mobile puzzle game',
                    position: { x: -2, y: 3, size: 'small', theme: 'mystical' },
                    techStack: [
                        { name: 'React Native', category: 'mobile', proficiency: 'intermediate', color: '#61DAFB' },
                        { name: 'Expo', category: 'mobile', proficiency: 'intermediate', color: '#000020' },
                        { name: 'Redux', category: 'frontend', proficiency: 'advanced', color: '#764ABC' }
                    ],
                    category: 'mobile-app',
                    status: 'completed',
                    githubUrl: 'https://github.com/example/mobile-game',
                    featured: false,
                    color: '#9370DB',
                    demoConfig: {
                        type: 'interactive-component',
                        interactiveFeatures: [
                            { name: 'Game Demo', description: 'Try the puzzle mechanics', action: 'game-demo' }
                        ]
                    }
                },
                {
                    id: 'ai-chatbot',
                    name: 'AI Chatbot Platform',
                    description: 'Intelligent chatbot platform with natural language processing and machine learning capabilities',
                    shortDescription: 'AI-powered chatbot with NLP',
                    position: { x: -3, y: -1, size: 'medium', theme: 'arctic' },
                    techStack: [
                        { name: 'Python', category: 'ai-ml', proficiency: 'advanced', color: '#3776AB' },
                        { name: 'TensorFlow', category: 'ai-ml', proficiency: 'intermediate', color: '#FF6F00' },
                        { name: 'FastAPI', category: 'backend', proficiency: 'advanced', color: '#009688' },
                        { name: 'React', category: 'frontend', proficiency: 'advanced', color: '#61DAFB' }
                    ],
                    category: 'ai-ml',
                    status: 'in-development',
                    githubUrl: 'https://github.com/example/ai-chatbot',
                    featured: true,
                    color: '#FF6B6B',
                    demoConfig: {
                        type: 'interactive-component',
                        interactiveFeatures: [
                            { name: 'Chat Interface', description: 'Talk with the AI assistant', action: 'chat-demo' },
                            { name: 'NLP Analysis', description: 'See how text is processed', action: 'nlp-demo' }
                        ]
                    }
                },
                {
                    id: 'blockchain-dapp',
                    name: 'Blockchain DApp',
                    description: 'Decentralized application built on Ethereum with smart contracts and Web3 integration',
                    shortDescription: 'Ethereum-based decentralized app',
                    position: { x: 2, y: 2, size: 'medium', theme: 'volcanic' },
                    techStack: [
                        { name: 'Solidity', category: 'blockchain', proficiency: 'intermediate', color: '#363636' },
                        { name: 'Web3.js', category: 'blockchain', proficiency: 'intermediate', color: '#F16822' },
                        { name: 'React', category: 'frontend', proficiency: 'advanced', color: '#61DAFB' },
                        { name: 'Hardhat', category: 'blockchain', proficiency: 'intermediate', color: '#FFF100' }
                    ],
                    category: 'blockchain',
                    status: 'completed',
                    githubUrl: 'https://github.com/example/blockchain-dapp',
                    liveUrl: 'https://example-dapp.com',
                    featured: false,
                    color: '#F7931E'
                }
            ]
        }

        return NextResponse.json(fallbackData)
    }
}