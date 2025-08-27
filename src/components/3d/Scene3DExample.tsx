'use client'

import React from 'react'
import { Scene3DManager, OptimizedScene3D, LODComponent, OptimizedMesh } from './index'
import { BoxGeometry, MeshStandardMaterial, SphereGeometry } from 'three'
import { useScene3D } from '@/hooks/useScene3D'

// Example component demonstrating 3D scene usage
const Scene3DExample: React.FC = () => {
  const [sceneState, sceneControls] = useScene3D()

  // Create geometries and materials (memoized for performance)
  const boxGeometry = React.useMemo(() => new BoxGeometry(1, 1, 1), [])
  const sphereGeometry = React.useMemo(() => new SphereGeometry(0.5, 16, 16), [])
  const material = React.useMemo(() => new MeshStandardMaterial({ color: '#4f46e5' }), [])
  const lowDetailMaterial = React.useMemo(() => new MeshStandardMaterial({ color: '#6366f1', wireframe: true }), [])

  // LOD levels for performance optimization
  const lodLevels = React.useMemo(() => [
    {
      distance: 10,
      component: (
        <OptimizedMesh
          geometry={sphereGeometry}
          material={material}
          castShadow
          receiveShadow
        />
      ),
    },
    {
      distance: 25,
      component: (
        <OptimizedMesh
          geometry={boxGeometry}
          material={material}
          castShadow={false}
          receiveShadow={false}
        />
      ),
    },
    {
      distance: 50,
      component: (
        <OptimizedMesh
          geometry={boxGeometry}
          material={lowDetailMaterial}
          castShadow={false}
          receiveShadow={false}
        />
      ),
    },
  ], [boxGeometry, sphereGeometry, material, lowDetailMaterial])

  return (
    <div className="w-full h-[600px] relative">
      <Scene3DManager
        enablePerformanceMonitoring={true}
        adaptiveQuality={true}
        className="w-full h-full"
      >
        <OptimizedScene3D enableLOD={true}>
          {/* Camera controls */}
          <perspectiveCamera position={[0, 0, 10]} />
          
          {/* LOD optimized objects */}
          <LODComponent levels={lodLevels} position={[0, 0, 0]} />
          <LODComponent levels={lodLevels} position={[3, 0, 0]} />
          <LODComponent levels={lodLevels} position={[-3, 0, 0]} />
          
          {/* Ground plane */}
          <OptimizedMesh
            geometry={new BoxGeometry(20, 0.1, 20)}
            material={new MeshStandardMaterial({ color: '#374151' })}
            position={[0, -2, 0]}
            receiveShadow
            castShadow={false}
          />
        </OptimizedScene3D>
      </Scene3DManager>

      {/* Performance controls overlay */}
      <div className="absolute top-4 left-4 bg-black/70 text-white p-4 rounded-lg space-y-2">
        <h3 className="font-semibold">3D Scene Controls</h3>
        
        <div className="text-sm space-y-1">
          <div>FPS: {sceneState.metrics.fps}</div>
          <div>Frame Time: {sceneState.metrics.frameTime.toFixed(2)}ms</div>
          <div>Memory: {sceneState.metrics.memoryUsage.toFixed(1)}MB</div>
          <div>Level: {sceneState.performanceLevel}</div>
        </div>

        <div className="space-y-2">
          <button
            onClick={() => sceneControls.forceQualityLevel('high')}
            className="block w-full px-3 py-1 bg-green-600 hover:bg-green-700 rounded text-sm"
          >
            High Quality
          </button>
          <button
            onClick={() => sceneControls.forceQualityLevel('medium')}
            className="block w-full px-3 py-1 bg-yellow-600 hover:bg-yellow-700 rounded text-sm"
          >
            Medium Quality
          </button>
          <button
            onClick={() => sceneControls.forceQualityLevel('low')}
            className="block w-full px-3 py-1 bg-red-600 hover:bg-red-700 rounded text-sm"
          >
            Low Quality
          </button>
          <button
            onClick={sceneControls.enablePerformanceMode}
            className="block w-full px-3 py-1 bg-blue-600 hover:bg-blue-700 rounded text-sm"
          >
            Performance Mode
          </button>
        </div>

        {sceneState.hasError && (
          <button
            onClick={sceneControls.resetError}
            className="block w-full px-3 py-1 bg-purple-600 hover:bg-purple-700 rounded text-sm"
          >
            Reset Error
          </button>
        )}
      </div>
    </div>
  )
}

export default Scene3DExample