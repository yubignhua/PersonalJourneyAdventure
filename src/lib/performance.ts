export interface PerformanceMetrics {
  fps: number
  frameTime: number
  memoryUsage: number
  drawCalls: number
  triangles: number
  geometries: number
  textures: number
}

export class PerformanceMonitor {
  private static instance: PerformanceMonitor
  private frameCount = 0
  private lastTime = 0
  private fps = 60
  private isMonitoring = false
  private frameTimeHistory: number[] = []
  private maxHistoryLength = 60 // Keep 1 second of frame times at 60fps
  private threeRenderer: any = null

  static getInstance(): PerformanceMonitor {
    if (!PerformanceMonitor.instance) {
      PerformanceMonitor.instance = new PerformanceMonitor()
    }
    return PerformanceMonitor.instance
  }

  startMonitoring() {
    if (this.isMonitoring) return

    this.isMonitoring = true
    this.lastTime = performance.now()
    this.measureFPS()
  }

  stopMonitoring() {
    this.isMonitoring = false
  }

  private measureFPS() {
    if (!this.isMonitoring) return

    const currentTime = performance.now()
    this.frameCount++

    if (currentTime - this.lastTime >= 1000) {
      this.fps = Math.round((this.frameCount * 1000) / (currentTime - this.lastTime))
      this.frameCount = 0
      this.lastTime = currentTime
    }

    requestAnimationFrame(() => this.measureFPS())
  }

  getFPS(): number {
    return this.fps
  }

  getPerformanceLevel(): 'low' | 'medium' | 'high' {
    if (this.fps < 30) return 'low'
    if (this.fps < 50) return 'medium'
    return 'high'
  }

  isMobile(): boolean {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
      navigator.userAgent
    )
  }

  hasWebGL(): boolean {
    try {
      const canvas = document.createElement('canvas')
      return !!(
        window.WebGLRenderingContext &&
        (canvas.getContext('webgl') || canvas.getContext('experimental-webgl'))
      )
    } catch (e) {
      return false
    }
  }

  // Set Three.js renderer for advanced metrics
  setThreeRenderer(renderer: any) {
    this.threeRenderer = renderer
  }

  // Get comprehensive performance metrics
  getPerformanceMetrics(): PerformanceMetrics {
    const info = this.threeRenderer?.info || {}

    return {
      fps: this.getFPS(),
      frameTime: this.getAverageFrameTime(),
      memoryUsage: this.getMemoryUsage(),
      drawCalls: info.render?.calls || 0,
      triangles: info.render?.triangles || 0,
      geometries: info.memory?.geometries || 0,
      textures: info.memory?.textures || 0,
    }
  }

  // Get average frame time over recent history
  private getAverageFrameTime(): number {
    if (this.frameTimeHistory.length === 0) return 16.67 // Default to 60fps
    const sum = this.frameTimeHistory.reduce((a, b) => a + b, 0)
    return sum / this.frameTimeHistory.length
  }

  // Get memory usage (if available)
  private getMemoryUsage(): number {
    const memory = (performance as any).memory
    if (memory) {
      return memory.usedJSHeapSize / 1024 / 1024 // MB
    }
    return 0
  }

  // Update frame time history
  updateFrameTime(deltaTime: number) {
    const frameTime = deltaTime * 1000 // Convert to milliseconds
    this.frameTimeHistory.push(frameTime)

    if (this.frameTimeHistory.length > this.maxHistoryLength) {
      this.frameTimeHistory.shift()
    }
  }

  // Check if performance is degrading
  isPerformanceDegrading(): boolean {
    if (this.frameTimeHistory.length < 30) return false

    const recent = this.frameTimeHistory.slice(-10)
    const older = this.frameTimeHistory.slice(-30, -10)

    const recentAvg = recent.reduce((a, b) => a + b, 0) / recent.length
    const olderAvg = older.reduce((a, b) => a + b, 0) / older.length

    return recentAvg > olderAvg * 1.2 // 20% increase in frame time
  }

  getDeviceCapabilities() {
    return {
      isMobile: this.isMobile(),
      hasWebGL: this.hasWebGL(),
      deviceMemory: (navigator as any).deviceMemory || 4,
      hardwareConcurrency: navigator.hardwareConcurrency || 4,
      fps: this.getFPS(),
      performanceLevel: this.getPerformanceLevel(),
      metrics: this.getPerformanceMetrics(),
    }
  }
}

export const performanceMonitor = PerformanceMonitor.getInstance()