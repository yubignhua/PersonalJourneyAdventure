# 3D Scene Management System

This directory contains a comprehensive 3D scene management system built with React Three Fiber, designed for optimal performance and reliability across different devices and browsers.

## Features

- **Automatic Performance Optimization**: Adapts quality based on device capabilities and real-time performance
- **Error Boundaries**: Graceful fallback to 2D mode when 3D rendering fails
- **Level of Detail (LOD)**: Automatic quality reduction based on distance and performance
- **Mobile Optimization**: Specific optimizations for mobile devices
- **Performance Monitoring**: Real-time FPS, frame time, and memory usage tracking
- **React.memo Optimization**: Prevents unnecessary re-renders for better performance

## Components

### Scene3DManager

The main component that wraps your 3D content with error boundaries, performance monitoring, and adaptive quality.

```tsx
import { Scene3DManager } from '@/components/3d'

<Scene3DManager
  enablePerformanceMonitoring={true}
  adaptiveQuality={true}
  className="w-full h-full"
>
  {/* Your 3D content */}
</Scene3DManager>
```

### OptimizedScene3D

A performance-optimized wrapper for 3D scenes with automatic lighting and quality adjustments.

```tsx
import { OptimizedScene3D } from '@/components/3d'

<OptimizedScene3D enableLOD={true}>
  {/* Your 3D objects */}
</OptimizedScene3D>
```

### LODComponent

Implements Level of Detail optimization by showing different components based on distance from camera.

```tsx
import { LODComponent } from '@/components/3d'

const lodLevels = [
  {
    distance: 10,
    component: <HighDetailMesh />
  },
  {
    distance: 25,
    component: <MediumDetailMesh />
  },
  {
    distance: 50,
    component: <LowDetailMesh />
  }
]

<LODComponent levels={lodLevels} position={[0, 0, 0]} />
```

### OptimizedMesh

A performance-optimized mesh component with automatic shadow and quality adjustments.

```tsx
import { OptimizedMesh } from '@/components/3d'

<OptimizedMesh
  geometry={boxGeometry}
  material={material}
  position={[0, 0, 0]}
  castShadow={true}
  receiveShadow={true}
/>
```

## Hooks

### useScene3D

Provides access to 3D scene state and controls.

```tsx
import { useScene3D } from '@/hooks/useScene3D'

const [sceneState, sceneControls] = useScene3D()

// Access performance metrics
console.log(sceneState.metrics.fps)

// Force quality level
sceneControls.forceQualityLevel('low')

// Enable performance mode
sceneControls.enablePerformanceMode()
```

## Error Handling

The system includes comprehensive error handling:

1. **WebGL Detection**: Automatically falls back to 2D mode if WebGL is not supported
2. **Rendering Errors**: Catches and handles 3D rendering errors gracefully
3. **Performance Fallback**: Switches to 2D mode if performance is too low
4. **Custom Fallbacks**: Support for custom fallback components

## Performance Optimization

### Automatic Quality Adjustment

The system automatically adjusts quality based on:
- Device type (mobile vs desktop)
- Available memory
- CPU cores
- Real-time FPS monitoring
- Frame time analysis

### Quality Levels

- **High**: Full quality with shadows, antialiasing, and high pixel ratio
- **Medium**: Reduced shadows and pixel ratio
- **Low**: Minimal shadows, wireframe materials, reduced geometry

### Mobile Optimizations

- Reduced pixel ratio
- Disabled antialiasing
- Simplified shadows
- Lower geometry detail
- Automatic performance mode switching

## Usage Examples

### Basic 3D Scene

```tsx
import { Scene3DManager, OptimizedScene3D } from '@/components/3d'

export default function My3DComponent() {
  return (
    <Scene3DManager className="w-full h-96">
      <OptimizedScene3D>
        <mesh>
          <boxGeometry args={[1, 1, 1]} />
          <meshStandardMaterial color="blue" />
        </mesh>
      </OptimizedScene3D>
    </Scene3DManager>
  )
}
```

### Advanced Scene with LOD

```tsx
import { Scene3DManager, OptimizedScene3D, LODComponent, OptimizedMesh } from '@/components/3d'
import { useScene3D } from '@/hooks/useScene3D'

export default function AdvancedScene() {
  const [sceneState, sceneControls] = useScene3D()

  const lodLevels = [
    {
      distance: 10,
      component: <OptimizedMesh geometry={highDetailGeometry} material={material} />
    },
    {
      distance: 25,
      component: <OptimizedMesh geometry={mediumDetailGeometry} material={material} />
    },
    {
      distance: 50,
      component: <OptimizedMesh geometry={lowDetailGeometry} material={wireframeMaterial} />
    }
  ]

  return (
    <div className="relative w-full h-96">
      <Scene3DManager
        enablePerformanceMonitoring={true}
        adaptiveQuality={true}
      >
        <OptimizedScene3D enableLOD={true}>
          <LODComponent levels={lodLevels} position={[0, 0, 0]} />
        </OptimizedScene3D>
      </Scene3DManager>

      {/* Performance controls */}
      <div className="absolute top-4 right-4 bg-black/50 text-white p-2 rounded">
        <div>FPS: {sceneState.metrics.fps}</div>
        <button onClick={() => sceneControls.enablePerformanceMode()}>
          Performance Mode
        </button>
      </div>
    </div>
  )
}
```

## Testing

The system includes comprehensive tests for all components. Run tests with:

```bash
npm test -- --testPathPattern=3d
```

## Browser Support

- **Chrome/Chromium**: Full support
- **Firefox**: Full support
- **Safari**: Full support (iOS 12+)
- **Edge**: Full support
- **Mobile browsers**: Optimized support with automatic fallbacks

## Performance Guidelines

1. **Use LOD Components**: Always use LOD for objects that can be viewed from different distances
2. **Optimize Geometries**: Use appropriate detail levels for your use case
3. **Limit Shadow Casters**: Only enable shadows on important objects
4. **Monitor Performance**: Use the built-in performance monitoring in development
5. **Test on Mobile**: Always test on actual mobile devices, not just browser dev tools

## Troubleshooting

### Common Issues

1. **Black screen**: Check browser console for WebGL errors
2. **Poor performance**: Enable performance monitoring to identify bottlenecks
3. **Memory leaks**: Ensure geometries and materials are properly disposed
4. **Mobile issues**: Check if automatic mobile optimizations are working

### Debug Mode

Enable debug mode in development:

```tsx
<Scene3DManager enablePerformanceMonitoring={true}>
  {/* Performance overlay will show in development */}
</Scene3DManager>
```


Now let me verify that all the components work together by running a quick test:

npx tsc --noEmit --skipLibCheck