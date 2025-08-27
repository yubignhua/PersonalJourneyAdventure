'use client'

import { useEffect, useState } from 'react'
import { useNavigationStore } from '@/store'

export default function AccessibilityAnnouncer() {
  const { currentSection } = useNavigationStore()
  const [announcement, setAnnouncement] = useState('')

  useEffect(() => {
    const sectionNames: Record<string, string> = {
      home: 'Homepage',
      lab: 'Interactive Laboratory',
      adventure: 'Adventure Map - Project Showcase',
      timeline: 'Time Machine - Blog Timeline',
      contact: 'Contact Portal',
      universe: 'Personal Universe - About Page',
    }

    const sectionName = sectionNames[currentSection] || currentSection
    setAnnouncement(`Navigated to ${sectionName}`)
  }, [currentSection])

  return (
    <div
      aria-live="polite"
      aria-atomic="true"
      className="sr-only"
      role="status"
    >
      {announcement}
    </div>
  )
}