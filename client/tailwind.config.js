/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        cafe: {
          50: '#FDFCF9',
          100: '#FAF6F0',
          150: '#F5EFE6',
          200: '#ECE2D3',
          300: '#DCBEA2',
          400: '#C99A73',
          500: '#A46B43',
          600: '#8E542D',
          700: '#6D3F1E',
          800: '#432612',
          900: '#23150A',
          950: '#150B05',
        },
        roast: {
          DEFAULT: '#221610',
          dark: '#160E0A',
          light: '#2D1E16',
          card: '#1F140E',
        },
        caramel: {
          DEFAULT: '#9A5B2D',
          light: '#B5743D',
          hover: '#7E4720',
          gold: '#C48A45',
        },
        cream: {
          bg: '#F8F4EE',
          card: '#FDFBF7',
          chip: '#F4ECE1',
          border: '#EDE3D5',
        }
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'Inter', 'sans-serif'],
        display: ['"Playfair Display"', 'serif'],
        handwriting: ['"Caveat"', 'cursive'],
      },
      boxShadow: {
        'cafe-sm': '0 2px 8px -2px rgba(67, 38, 18, 0.08)',
        'cafe-md': '0 8px 24px -4px rgba(67, 38, 18, 0.12)',
        'cafe-lg': '0 16px 36px -6px rgba(67, 38, 18, 0.16)',
        'cafe-float': '0 12px 30px -4px rgba(35, 21, 10, 0.25)',
      },
      borderRadius: {
        '3xl': '1.75rem',
        '4xl': '2.25rem',
      }
    },
  },
  plugins: [],
}
