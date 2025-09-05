import type { Metadata } from 'next'
import { inter } from '@/lib/fonts'
import { AuthProvider } from '@/lib/auth-context'
import './globals.css'

export const metadata: Metadata = {
  title: 'Interactive Portfolio - Tech Adventure Journey',
  description: 'An immersive portfolio experience showcasing full-stack development skills through interactive 3D elements and real-time features.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  )
}