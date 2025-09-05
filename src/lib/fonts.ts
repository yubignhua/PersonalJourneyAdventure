import { Inter } from 'next/font/google'

// Load Inter font with error handling
export const inter = Inter({ 
  subsets: ['latin'],
  display: 'swap',
  fallback: ['system-ui', 'sans-serif'],
  adjustFontFallback: true,
  variable: '--font-inter'
})