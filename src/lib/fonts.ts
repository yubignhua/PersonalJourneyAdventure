import { Inter } from 'next/font/google'

// Try to use Google Fonts, fallback to system font if it fails
let inter

try {
  inter = Inter({ 
    subsets: ['latin'],
    display: 'swap',
    fallback: ['system-ui', 'sans-serif']
  })
} catch (error) {
  console.log('Google Fonts not available, using system font')
  inter = {
    className: 'font-sans'
  }
}

export { inter }