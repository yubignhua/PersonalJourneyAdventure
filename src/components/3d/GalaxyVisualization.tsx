'use client'

import React, { useRef, useMemo, useState } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { OrbitControls, Stars, Text } from '@react-three/drei'
import * as THREE from 'three'
import { GalaxyVisualizationProps, SkillPlanet, ExperienceEntry } from '@/types/3d'

// Individual Skill Planet Component
function SkillPlanetMesh({
    planet,
    isSelected,
    onClick,
    animationTime
}: {
    planet: SkillPlanet
    isSelected: boolean
    onClick: (planet: SkillPlanet) => void
    animationTime: number
}) {
    const meshRef = useRef<THREE.Mesh>(null)
    const [hovered, setHovered] = useState(false)

    // Calculate orbital position
    const orbitPosition = useMemo(() => {
        const angle = animationTime * planet.orbitSpeed + (planet.id.charCodeAt(0) * 0.1)
        const x = Math.cos(angle) * planet.orbitRadius
        const z = Math.sin(angle) * planet.orbitRadius
        const y = planet.position[1]
        return [x, y, z] as [number, number, number]
    }, [animationTime, planet])

    useFrame(() => {
        if (meshRef.current) {
            // Rotate the planet on its axis
            meshRef.current.rotation.y += 0.01

            // Scale effect when hovered or selected
            const targetScale = hovered || isSelected ? 1.2 : 1
            meshRef.current.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), 0.1)
        }
    })

    return (
        <group position={orbitPosition}>
            <mesh
                ref={meshRef}
                onClick={() => onClick(planet)}
                onPointerOver={() => setHovered(true)}
                onPointerOut={() => setHovered(false)}
            >
                <sphereGeometry args={[planet.size, 32, 32]} />
                <meshStandardMaterial
                    color={planet.color}
                    emissive={planet.color}
                    emissiveIntensity={isSelected ? 0.3 : hovered ? 0.2 : 0.1}
                    roughness={0.3}
                    metalness={0.7}
                />
            </mesh>

            {/* Planet label */}
            {(hovered || isSelected) && (
                <Text
                    position={[0, planet.size + 0.5, 0]}
                    fontSize={0.3}
                    color="white"
                    anchorX="center"
                    anchorY="middle"
                >
                    {planet.name}
                </Text>
            )}

            {/* Orbit path */}
            <mesh rotation={[Math.PI / 2, 0, 0]}>
                <ringGeometry args={[planet.orbitRadius - 0.02, planet.orbitRadius + 0.02, 64]} />
                <meshBasicMaterial
                    color={planet.color}
                    transparent
                    opacity={0.1}
                    side={THREE.DoubleSide}
                />
            </mesh>
        </group>
    )
}

// Experience Timeline Orbit Component
function ExperienceOrbit({
    experiences,
    orbitRadius,
    onExperienceClick,
    animationTime
}: {
    experiences: ExperienceEntry[]
    orbitRadius: number
    onExperienceClick: (experience: ExperienceEntry) => void
    animationTime: number
}) {
    return (
        <group>
            {experiences.map((experience, index) => {
                const angle = (index / experiences.length) * Math.PI * 2 + animationTime * 0.1
                const x = Math.cos(angle) * orbitRadius
                const z = Math.sin(angle) * orbitRadius

                return (
                    <group key={experience.id} position={[x, 0, z]}>
                        <mesh onClick={() => onExperienceClick(experience)}>
                            <boxGeometry args={[0.2, 0.2, 0.2]} />
                            <meshStandardMaterial
                                color="#4f46e5"
                                emissive="#4f46e5"
                                emissiveIntensity={0.2}
                            />
                        </mesh>
                        <Text
                            position={[0, 0.5, 0]}
                            fontSize={0.15}
                            color="white"
                            anchorX="center"
                            anchorY="middle"
                        >
                            {experience.company}
                        </Text>
                    </group>
                )
            })}
        </group>
    )
}

// Main Galaxy Scene Component
function GalaxyScene({
    skillPlanets,
    experiences,
    onPlanetSelect,
    onExperienceSelect,
    cameraPosition = [0, 5, 10],
    autoRotate = true
}: GalaxyVisualizationProps) {
    const [selectedPlanet, setSelectedPlanet] = useState<SkillPlanet | null>(null)
    const [animationTime, setAnimationTime] = useState(0)
    const { camera } = useThree()

    useFrame((state, delta) => {
        setAnimationTime(prev => prev + delta)

        // Auto-rotate camera around the galaxy
        if (autoRotate && !selectedPlanet) {
            const time = state.clock.getElapsedTime()
            camera.position.x = Math.cos(time * 0.1) * 15
            camera.position.z = Math.sin(time * 0.1) * 15
            camera.lookAt(0, 0, 0)
        }
    })

    const handlePlanetClick = (planet: SkillPlanet) => {
        setSelectedPlanet(planet)
        onPlanetSelect(planet)
    }

    return (
        <>
            {/* Ambient lighting */}
            <ambientLight intensity={0.2} />
            <pointLight position={[0, 0, 0]} intensity={1} color="#ffffff" />

            {/* Galaxy center */}
            <mesh>
                <sphereGeometry args={[0.5, 32, 32]} />
                <meshStandardMaterial
                    color="#ffd700"
                    emissive="#ffd700"
                    emissiveIntensity={0.5}
                />
            </mesh>

            {/* Skill planets */}
            {skillPlanets.map(planet => (
                <SkillPlanetMesh
                    key={planet.id}
                    planet={planet}
                    isSelected={selectedPlanet?.id === planet.id}
                    onClick={handlePlanetClick}
                    animationTime={animationTime}
                />
            ))}

            {/* Experience timeline orbit */}
            <ExperienceOrbit
                experiences={experiences}
                orbitRadius={12}
                onExperienceClick={onExperienceSelect}
                animationTime={animationTime}
            />

            {/* Background stars */}
            <Stars
                radius={100}
                depth={50}
                count={5000}
                factor={4}
                saturation={0}
                fade
                speed={1}
            />

            {/* Controls */}
            <OrbitControls
                enablePan={true}
                enableZoom={true}
                enableRotate={true}
                minDistance={5}
                maxDistance={50}
                target={[0, 0, 0]}
            />
        </>
    )
}

// Main Galaxy Visualization Component
export default function GalaxyVisualization(props: GalaxyVisualizationProps) {
    return (
        <div className="w-full h-full">
            <Canvas
                camera={{ position: props.cameraPosition || [0, 5, 10], fov: 75 }}
                gl={{
                    antialias: true,
                    alpha: true,
                    powerPreference: 'high-performance',
                    failIfMajorPerformanceCaveat: false
                }}
                className="bg-gradient-to-b from-purple-900 via-blue-900 to-black"
                onCreated={({ gl }) => {
                    gl.setClearColor('#000000', 0)
                }}
            >
                <GalaxyScene {...props} />
            </Canvas>
        </div>
    )
}