'use client'

import dynamic from 'next/dynamic'

const InteractiveHomepage = dynamic(
  () => import('@/components/InteractiveHomepage'),
  { 
    ssr: false,
    loading: () => (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-gray-900 via-blue-900 to-black">
        <div className="text-white text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p>Loading Interactive Laboratory...</p>
        </div>
      </div>
    )
  }
)

export default function Home() {
  return <InteractiveHomepage />
}