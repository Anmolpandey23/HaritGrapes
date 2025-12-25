module.exports = {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}'
  ],
  theme: {
    extend: {
      colors: {
        primary: '#3E7C17',
        accent: '#DED36D',
        grape: '#6F2744'
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        logo: ['Comfortaa', 'cursive']
      }
    }
  },
  plugins: []
}
