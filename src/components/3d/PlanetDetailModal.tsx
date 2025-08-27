'use client'

import React, { useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls, Text } from '@react-three/drei'
import * as THREE from 'three'
import { SkillPlanet } from '@/types/3d'

interface PlanetDetailModalProps {
    planet: SkillPlanet | null
    isOpen: boolean
    onClose: () => void
}

// 3D Planet Model for detailed view
function DetailedPlanetModel({ planet }: { planet: SkillPlanet }) {
    const meshRef = useRef<THREE.Mesh>(null)

    useFrame(() => {
        if (meshRef.current) {
            meshRef.current.rotation.y += 0.005
        }
    })

    return (
        <group>
            <mesh ref={meshRef}>
                <sphereGeometry args={[2, 64, 64]} />
                <meshStandardMaterial
                    color={planet.color}
                    emissive={planet.color}
                    emissiveIntensity={0.2}
                    roughness={0.3}
                    metalness={0.7}
                />
            </mesh>

            {/* Skill level rings around planet */}
            {Array.from({ length: Math.floor(planet.proficiencyLevel / 20) }, (_, i) => (
                <mesh key={i} rotation={[Math.PI / 2, 0, 0]}>
                    <ringGeometry args={[2.5 + i * 0.3, 2.7 + i * 0.3, 32]} />
                    <meshBasicMaterial
                        color={planet.color}
                        transparent
                        opacity={0.3}
                        side={THREE.DoubleSide}
                    />
                </mesh>
            ))}

            <ambientLight intensity={0.4} />
            <pointLight position={[5, 5, 5]} intensity={1} />
        </group>
    )
}

export default function PlanetDetailModal({ planet, isOpen, onClose }: PlanetDetailModalProps) {
    if (!isOpen || !planet) return null

    return (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
            <div className="bg-gray-900 rounded-lg p-6 max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-2xl font-bold text-white">{planet.name}</h2>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-white text-xl"
                    >
                        ✕
                    </button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* 3D Planet View */}
                    <div className="h-64 bg-black rounded-lg overflow-hidden">
                        <Canvas camera={{ position: [0, 0, 8], fov: 45 }}>
                            <DetailedPlanetModel planet={planet} />
                            <OrbitControls enableZoom={true} enablePan={false} />
                        </Canvas>
                    </div>

                    {/* Planet Information */}
                    <div className="space-y-4">
                        <div>
                            <h3 className="text-lg font-semibold text-white mb-2">Description</h3>
                            <p className="text-gray-300">{planet.description}</p>
                        </div>

                        <div>
                            <h3 className="text-lg font-semibold text-white mb-2">Category</h3>
                            <span className="inline-block bg-blue-600 text-white px-3 py-1 rounded-full text-sm">
                                {planet.category}
                            </span>
                        </div>

                        <div>
                            <h3 className="text-lg font-semibold text-white mb-2">Proficiency Level</h3>
                            <div className="w-full bg-gray-700 rounded-full h-2">
                                <div
                                    className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-300"
                                    style={{ width: `${planet.proficiencyLevel}%` }}
                                />
                            </div>
                            <span className="text-sm text-gray-400 mt-1">{planet.proficiencyLevel}%</span>
                        </div>

                        {planet.technologies.length > 0 && (
                            <div>
                                <h3 className="text-lg font-semibold text-white mb-2">Technologies</h3>
                                <div className="flex flex-wrap gap-2">
                                    {planet.technologies.map((tech, index) => (
                                        <span
                                            key={index}
                                            className="bg-gray-700 text-gray-300 px-2 py-1 rounded text-sm"
                                        >
                                            {tech}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )}

                        {planet.experience.length > 0 && (
                            <div>
                                <h3 className="text-lg font-semibold text-white mb-2">Related Experience</h3>
                                <div className="space-y-2">
                                    {planet.experience.map((exp, index) => (
                                        <div key={index} className="bg-gray-800 p-3 rounded">
                                            <h4 className="font-medium text-white">{exp.title}</h4>
                                            <p className="text-sm text-gray-400">{exp.company} • {exp.duration}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}