/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      animation: {
        'particle-float': 'particleFloat 6s ease-in-out infinite',
        'typewriter': 'typewriter 3s steps(40) 1s 1 normal both',
        'portal-spin': 'portalSpin 2s linear infinite',
        'shake': 'shake 0.5s ease-in-out',
        'pulse-glow': 'pulseGlow 2s ease-in-out infinite',
        'float-up': 'floatUp 3s ease-out forwards',
      },
      keyframes: {
        particleFloat: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        typewriter: {
          'from': { width: '0' },
          'to': { width: '100%' },
        },
        portalSpin: {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' },
        },
        shake: {
          '0%, 100%': { transform: 'translateX(0)' },
          '10%, 30%, 50%, 70%, 90%': { transform: 'translateX(-2px)' },
          '20%, 40%, 60%, 80%': { transform: 'translateX(2px)' },
        },
        pulseGlow: {
          '0%, 100%': { 
            boxShadow: '0 0 5px currentColor',
            opacity: '0.5'
          },
          '50%': { 
            boxShadow: '0 0 20px currentColor, 0 0 30px currentColor',
            opacity: '1'
          },
        },
        floatUp: {
          '0%': { 
            transform: 'translateY(0px) scale(1)',
            opacity: '1'
          },
          '100%': { 
            transform: 'translateY(-100px) scale(0)',
            opacity: '0'
          },
        },
      },
      colors: {
        'cyber-blue': '#00f5ff',
        'cyber-purple': '#8b5cf6',
        'cyber-green': '#00ff88',
      },
    },
  },
  plugins: [require('@tailwindcss/typography')],
}