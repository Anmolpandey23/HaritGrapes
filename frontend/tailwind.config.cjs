module.exports = {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}'
  ],
  theme: {
    extend: {
      colors: {
        primary: '#2D6A4F',
        accent: '#DED36D',
        grape: {
          DEFAULT: '#6F2744',
          50: '#FDF7F9',
          100: '#F8E9F0',
          200: '#EFD0E1',
          300: '#DFAEC8',
          400: '#C2749D',
          500: '#9E3E6E',
          600: '#6F2744',
          700: '#541A33',
          800: '#3D1224',
          900: '#2A0B18',
        },
        vine: {
          DEFAULT: '#1B4332',
          50: '#F0FDF4',
          100: '#DCFCE7',
          200: '#BBF7D0',
          500: '#2D6A4F',
          600: '#1B4332',
          700: '#081C15',
        },
        gold: {
          DEFAULT: '#E9C46A',
          light: '#F4A261',
          glow: '#F39C12',
        }
      },
      keyframes: {
        'grape-float': {
          '0%, 100%': { transform: 'translateY(0px) rotate(0deg)' },
          '50%': { transform: 'translateY(-10px) rotate(3deg)' }
        },
        'scanline': {
          '0%': { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(400%)' }
        },
        'pulse-glow': {
          '0%, 100%': { opacity: '0.4', transform: 'scale(1)' },
          '50%': { opacity: '0.8', transform: 'scale(1.05)' }
        }
      },
      animation: {
        'grape-float': 'grape-float 4s ease-in-out infinite',
        'scanline': 'scanline 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'pulse-glow': 'pulse-glow 3s ease-in-out infinite'
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        logo: ['Comfortaa', 'cursive']
      }
    }
  },
  plugins: []
}
