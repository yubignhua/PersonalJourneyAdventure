import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
// import '../../globals.css' // Corrected path
// import { getDictionary } from '@/lib/dictionaries' // Import getDictionary

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Interactive Portfolio - Tech Adventure Journey',
  description: 'An immersive portfolio experience showcasing full-stack development skills through interactive 3D elements and real-time features.',
}

export default async function RootLayout({
  children,
  params: { lang }
}: {
  children: React.ReactNode,
  params: { lang: string }
}) {
  // const dictionary = await getDictionary(lang) // Get dictionary based on lang

  return (
    <html lang={lang}> {/* Use lang prop here */}
      <body className={inter.className}>{children}</body>
    </html>
  )
}