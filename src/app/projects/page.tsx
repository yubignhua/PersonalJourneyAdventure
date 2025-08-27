'use client'

import dynamic from 'next/dynamic'

const ProjectsPage = dynamic(
  () => import('@/components/ProjectsPage'),
  { 
    ssr: false,
    loading: () => (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-blue-900 via-purple-900 to-black">
        <div className="text-white text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto mb-4"></div>
          <p>Loading Adventure Map...</p>
        </div>
      </div>
    )
  }
)

export default function Projects() {
  return <ProjectsPage />
}