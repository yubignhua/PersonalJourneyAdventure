'use client'

import React, { useState, useMemo } from 'react'
import dynamic from 'next/dynamic'
import { SkillPlanet, ExperienceEntry } from '@/types/3d'
import PlanetDetailModal from '@/components/3d/PlanetDetailModal'
import Scene3DErrorBoundaryWrapper from '@/components/3d/Scene3DErrorBoundaryWrapper'

// Dynamically import 3D components to avoid SSR issues
const SimpleGalaxyVisualization = dynamic(
    () => import('@/components/3d/SimpleGalaxyVisualization'),
    {
        ssr: false,
        loading: () => (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-b from-purple-900 via-blue-900 to-black">
                <div className="text-white text-xl">Loading Galaxy...</div>
            </div>
        )
    }
)

export default function AboutPage() {
    const [selectedPlanet, setSelectedPlanet] = useState<SkillPlanet | null>(null)
    const [selectedExperience, setSelectedExperience] = useState<ExperienceEntry | null>(null)

    // Mock data for skill planets - in a real app, this would come from an API
    const skillPlanets: SkillPlanet[] = useMemo(() => [
        {
            id: 'frontend',
            name: 'Frontend Development',
            category: 'Web Development',
            position: [0, 0, 0],
            orbitRadius: 6,
            orbitSpeed: 0.5,
            size: 1.2,
            color: '#61dafb',
            proficiencyLevel: 90,
            description: 'Expert in modern frontend technologies including React, Next.js, TypeScript, and advanced CSS frameworks.',
            technologies: ['React', 'Next.js', 'TypeScript', 'Tailwind CSS', 'Three.js', 'Framer Motion'],
            experience: [
                {
                    id: 'exp1',
                    title: 'Senior Frontend Developer',
                    company: 'Tech Corp',
                    duration: '2022-Present',
                    description: 'Leading frontend development for enterprise applications',
                    technologies: ['React', 'TypeScript', 'Next.js'],
                    startDate: new Date('2022-01-01')
                }
            ]
        },
        {
            id: 'backend',
            name: 'Backend Development',
            category: 'Web Development',
            position: [0, 0, 0],
            orbitRadius: 8,
            orbitSpeed: 0.3,
            size: 1.0,
            color: '#68d391',
            proficiencyLevel: 85,
            description: 'Proficient in server-side development with Node.js, Express, databases, and API design.',
            technologies: ['Node.js', 'Express', 'MongoDB', 'MySQL', 'Redis', 'Socket.IO'],
            experience: [
                {
                    id: 'exp2',
                    title: 'Full Stack Developer',
                    company: 'StartupXYZ',
                    duration: '2020-2022',
                    description: 'Built scalable backend systems and APIs',
                    technologies: ['Node.js', 'MongoDB', 'Express'],
                    startDate: new Date('2020-01-01'),
                    endDate: new Date('2022-01-01')
                }
            ]
        },
        {
            id: 'mobile',
            name: 'Mobile Development',
            category: 'Mobile',
            position: [0, 0, 0],
            orbitRadius: 10,
            orbitSpeed: 0.2,
            size: 0.8,
            color: '#f093fb',
            proficiencyLevel: 75,
            description: 'Experience with React Native and mobile app development for iOS and Android.',
            technologies: ['React Native', 'Expo', 'iOS', 'Android'],
            experience: []
        },
        {
            id: 'devops',
            name: 'DevOps & Cloud',
            category: 'Infrastructure',
            position: [0, 0, 0],
            orbitRadius: 12,
            orbitSpeed: 0.15,
            size: 0.9,
            color: '#ffd93d',
            proficiencyLevel: 70,
            description: 'Knowledge of cloud platforms, containerization, and CI/CD pipelines.',
            technologies: ['AWS', 'Docker', 'Kubernetes', 'GitHub Actions', 'Vercel'],
            experience: []
        },
        {
            id: 'ai-ml',
            name: 'AI & Machine Learning',
            category: 'Artificial Intelligence',
            position: [0, 0, 0],
            orbitRadius: 14,
            orbitSpeed: 0.1,
            size: 1.1,
            color: '#ff6b6b',
            proficiencyLevel: 60,
            description: 'Exploring AI integration, machine learning concepts, and modern AI APIs.',
            technologies: ['OpenAI API', 'TensorFlow', 'Python', 'Langchain'],
            experience: []
        }
    ], [])

    // Mock experience data
    const experiences: ExperienceEntry[] = useMemo(() => [
        {
            id: 'exp1',
            title: 'Senior Frontend Developer',
            company: 'Tech Corp',
            duration: '2022-Present',
            description: 'Leading frontend development for enterprise applications with React and TypeScript.',
            technologies: ['React', 'TypeScript', 'Next.js', 'Tailwind CSS'],
            startDate: new Date('2022-01-01')
        },
        {
            id: 'exp2',
            title: 'Full Stack Developer',
            company: 'StartupXYZ',
            duration: '2020-2022',
            description: 'Built scalable web applications and RESTful APIs using modern technologies.',
            technologies: ['Node.js', 'React', 'MongoDB', 'Express'],
            startDate: new Date('2020-01-01'),
            endDate: new Date('2022-01-01')
        },
        {
            id: 'exp3',
            title: 'Junior Developer',
            company: 'WebDev Agency',
            duration: '2019-2020',
            description: 'Developed responsive websites and learned modern web development practices.',
            technologies: ['HTML', 'CSS', 'JavaScript', 'PHP'],
            startDate: new Date('2019-01-01'),
            endDate: new Date('2020-01-01')
        }
    ], [])

    const handlePlanetSelect = (planet: SkillPlanet) => {
        setSelectedPlanet(planet)
    }

    const handleExperienceSelect = (experience: ExperienceEntry) => {
        setSelectedExperience(experience)
    }

    return (
        <div className="min-h-screen bg-black text-white">
            {/* Header */}
            <div className="relative z-10 p-6">
                <div className="max-w-4xl mx-auto text-center">
                    <h1 className="text-4xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 bg-clip-text text-transparent">
                        Personal Universe
                    </h1>
                    <p className="text-xl text-gray-300 mb-8">
                        Explore my skills and experience through an interactive galaxy
                    </p>
                </div>
            </div>

            {/* Galaxy Visualization */}
            <div className="h-[70vh] relative">
                <Scene3DErrorBoundaryWrapper
                    fallback={
                        <div className="w-full h-full flex items-center justify-center bg-gradient-to-b from-purple-900 via-blue-900 to-black">
                            <div className="text-center text-white">
                                <div className="text-6xl mb-4">🪐</div>
                                <h2 className="text-2xl font-bold mb-4">Personal Universe</h2>
                                <p className="text-gray-300 mb-6">3D visualization is not available on this device</p>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-w-4xl">
                                    {skillPlanets.map(planet => (
                                        <div
                                            key={planet.id}
                                            className="bg-gray-800 p-4 rounded-lg border border-gray-700 hover:border-blue-500 transition-colors cursor-pointer"
                                            onClick={() => handlePlanetSelect(planet)}
                                        >
                                            <div className="flex items-center space-x-3 mb-2">
                                                <div
                                                    className="w-4 h-4 rounded-full"
                                                    style={{ backgroundColor: planet.color }}
                                                />
                                                <h3 className="font-semibold">{planet.name}</h3>
                                            </div>
                                            <p className="text-sm text-gray-400 mb-2">{planet.category}</p>
                                            <div className="w-full bg-gray-700 rounded-full h-2">
                                                <div
                                                    className="h-2 rounded-full transition-all duration-300"
                                                    style={{
                                                        width: `${planet.proficiencyLevel}%`,
                                                        backgroundColor: planet.color
                                                    }}
                                                />
                                            </div>
                                            <span className="text-xs text-gray-500">{planet.proficiencyLevel}%</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    }
                >
                    <SimpleGalaxyVisualization
                        skillPlanets={skillPlanets}
                        experiences={experiences}
                        onPlanetSelect={handlePlanetSelect}
                        onExperienceSelect={handleExperienceSelect}
                        autoRotate={true}
                    />
                </Scene3DErrorBoundaryWrapper>
            </div>

            {/* Instructions */}
            <div className="p-6">
                <div className="max-w-4xl mx-auto">
                    <div className="bg-gray-900 rounded-lg p-6">
                        <h2 className="text-2xl font-bold mb-4">How to Navigate</h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                            <div className="flex items-center space-x-3">
                                <div className="w-4 h-4 bg-blue-500 rounded-full"></div>
                                <span>Click planets to explore skills in detail</span>
                            </div>
                            <div className="flex items-center space-x-3">
                                <div className="w-4 h-4 bg-purple-500 rounded-full"></div>
                                <span>Drag to rotate and zoom the galaxy</span>
                            </div>
                            <div className="flex items-center space-x-3">
                                <div className="w-4 h-4 bg-yellow-500 rounded-full"></div>
                                <span>Experience timeline orbits around the center</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Planet Detail Modal */}
            <PlanetDetailModal
                planet={selectedPlanet}
                isOpen={!!selectedPlanet}
                onClose={() => setSelectedPlanet(null)}
            />

            {/* Experience Detail Modal */}
            {selectedExperience && (
                <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
                    <div className="bg-gray-900 rounded-lg p-6 max-w-2xl w-full mx-4">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-2xl font-bold text-white">{selectedExperience.title}</h2>
                            <button
                                onClick={() => setSelectedExperience(null)}
                                className="text-gray-400 hover:text-white text-xl"
                            >
                                ✕
                            </button>
                        </div>
                        <div className="space-y-4">
                            <div>
                                <h3 className="text-lg font-semibold text-white">{selectedExperience.company}</h3>
                                <p className="text-gray-400">{selectedExperience.duration}</p>
                            </div>
                            <p className="text-gray-300">{selectedExperience.description}</p>
                            <div>
                                <h4 className="font-medium text-white mb-2">Technologies Used</h4>
                                <div className="flex flex-wrap gap-2">
                                    {selectedExperience.technologies.map((tech, index) => (
                                        <span
                                            key={index}
                                            className="bg-gray-700 text-gray-300 px-2 py-1 rounded text-sm"
                                        >
                                            {tech}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}