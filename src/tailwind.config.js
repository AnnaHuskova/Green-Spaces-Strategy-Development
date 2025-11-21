/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    colors: {
      "accent": "#00FF29",
      "navlink": "#8484A0",
      "navlinkActive": "#000000",
      "areasProtected": "#56ff53",
      "areasUnprotected": "#5bcaff",
      "areasAll": "#02F0FF",
      'white': '#FFFFFF',
      'black': '#000000',
      'form-unchecked': "#94A3B8",
      'form-hover': "#81FF8663",
    },
    fontFamily: {
      sans: ["Play", "Roboto", 'sans-serif'],
      sansModal: ["Poppins", "Roboto", 'sans-serif'],
    },
    extend: {
      spacing: {
        '8xl': '96rem',
        '9xl': '128rem',
      },
      borderRadius: {
        '4xl': '2rem',
      },

      
      keyframes: {
        auraBreath: {
          '0%':   { boxShadow: '0 0 7px #00FF29, 0 0 12px #00FF29' },
          '50%':  { boxShadow: '0 0 20px #00FF29, 0 0 30px #00FF29' },
          '100%': { boxShadow: '0 0 7px #00FF29, 0 0 12px #00FF29' },
        },
      },
      animation: {
        auraBreath: 'auraBreath 5.0s ease-in-out infinite',
      }
    }
  },
  plugins: [],
}
