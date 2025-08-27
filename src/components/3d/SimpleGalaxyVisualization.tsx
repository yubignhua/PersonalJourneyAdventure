'use client'

import React, { useRef, useState } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import * as THREE from 'three'
import { GalaxyVisualizationProps, SkillPlanet } from '@/types/3d'

// Simple Planet Component
function SimplePlanet({
    planet,
    isSelected,
    onClick
}: {
    planet: SkillPlanet
    isSelected: boolean
    onClick: (planet: SkillPlanet) => void
}) {
    const meshRef = useRef<THREE.Mesh>(null)
    const [hovered, setHovered] = useState(false)

    // Calculate orbital position
    const angle = (planet.id.charCodeAt(0) * 0.1)
    const x = Math.cos(angle) * planet.orbitRadius
    const z = Math.sin(angle) * planet.orbitRadius
    const y = planet.position[1]

    useFrame((state) => {
        if (meshRef.current) {
            // Simple rotation
            meshRef.current.rotation.y += 0.01

            // Update orbital position with time
            const time = state.clock.getElapsedTime()
            const orbitAngle = time * planet.orbitSpeed + angle
            meshRef.current.position.x = Math.cos(orbitAngle) * planet.orbitRadius
            meshRef.current.position.z = Math.sin(orbitAngle) * planet.orbitRadius

            // Simple scale animation
            const scale = (hovered || isSelected) ? 1.2 : 1
            meshRef.current.scale.setScalar(scale)
        }
    })

    return (
        <mesh
            ref={meshRef}
            position={[x, y, z]}
            onClick={() => onClick(planet)}
            onPointerOver={() => setHovered(true)}
            onPointerOut={() => setHovered(false)}
        >
            <sphereGeometry args={[planet.size, 16, 16]} />
            <meshStandardMaterial
                color={planet.color}
                emissive={planet.color}
                emissiveIntensity={isSelected ? 0.3 : hovered ? 0.2 : 0.1}
            />
        </mesh>
    )
}

// Simple Galaxy Scene
function SimpleGalaxyScene({
    skillPlanets,
    onPlanetSelect
}: {
    skillPlanets: SkillPlanet[]
    onPlanetSelect: (planet: SkillPlanet) => void
}) {
    const [selectedPlanet, setSelectedPlanet] = useState<SkillPlanet | null>(null)

    const handlePlanetClick = (planet: SkillPlanet) => {
        setSelectedPlanet(planet)
        onPlanetSelect(planet)
    }

    return (
        <>
            {/* Lighting */}
            <ambientLight intensity={0.4} />
            <pointLight position={[0, 0, 0]} intensity={1} color="#ffffff" />

            {/* Galaxy center */}
            <mesh>
                <sphereGeometry args={[0.5, 16, 16]} />
                <meshStandardMaterial
                    color="#ffd700"
                    emissive="#ffd700"
                    emissiveIntensity={0.5}
                />
            </mesh>

            {/* Skill planets */}
            {skillPlanets.map(planet => (
                <SimplePlanet
                    key={planet.id}
                    planet={planet}
                    isSelected={selectedPlanet?.id === planet.id}
                    onClick={handlePlanetClick}
                />
            ))}

            {/* Controls */}
            <OrbitControls
                enablePan={true}
                enableZoom={true}
                enableRotate={true}
                minDistance={5}
                maxDistance={30}
            />
        </>
    )
}

// Main Simple Galaxy Visualization Component
export default function SimpleGalaxyVisualization(props: GalaxyVisualizationProps) {
    return (
        <div className="w-full h-full">
            <Canvas
                camera={{ position: [0, 5, 10], fov: 75 }}
                gl={{
                    antialias: false, // Disable for better compatibility
                    alpha: true,
                    powerPreference: 'default'
                }}
                className="bg-gradient-to-b from-purple-900 via-blue-900 to-black"
            >
                <SimpleGalaxyScene
                    skillPlanets={props.skillPlanets}
                    onPlanetSelect={props.onPlanetSelect}
                />
            </Canvas>
        </div>
    )
}