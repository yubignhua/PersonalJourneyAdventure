import { create } from 'zustand'
import { devtools } from 'zustand/middleware'

// Theme store
interface ThemeState {
  theme: 'light' | 'dark'
  setTheme: (theme: 'light' | 'dark') => void
  toggleTheme: () => void
}

export const useThemeStore = create<ThemeState>()(
  devtools(
    (set) => ({
      theme: 'dark',
      setTheme: (theme) => set({ theme }),
      toggleTheme: () => set((state) => ({ theme: state.theme === 'light' ? 'dark' : 'light' })),
    }),
    { name: 'theme-store' }
  )
)

// Navigation store
interface NavigationState {
  currentSection: string
  isPortalUnlocked: boolean
  setCurrentSection: (section: string) => void
  unlockPortal: () => void
}

export const useNavigationStore = create<NavigationState>()(
  devtools(
    (set) => ({
      currentSection: 'home',
      isPortalUnlocked: false,
      setCurrentSection: (section) => set({ currentSection: section }),
      unlockPortal: () => set({ isPortalUnlocked: true }),
    }),
    { name: 'navigation-store' }
  )
)

// Performance store
interface PerformanceState {
  is3DEnabled: boolean
  performanceLevel: 'low' | 'medium' | 'high'
  setPerformanceLevel: (level: 'low' | 'medium' | 'high') => void
  toggle3D: () => void
}

export const usePerformanceStore = create<PerformanceState>()(
  devtools(
    (set) => ({
      is3DEnabled: true,
      performanceLevel: 'high',
      setPerformanceLevel: (level) => set({ performanceLevel: level }),
      toggle3D: () => set((state) => ({ is3DEnabled: !state.is3DEnabled })),
    }),
    { name: 'performance-store' }
  )
)