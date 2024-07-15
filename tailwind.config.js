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
      'white': '#FFFFFF',
      'black': '#000000',
    },
    fontFamily: {
      sans: ["Play", "Roboto", 'sans-serif'],
      sansModal: ["Poppins", "Roboto", 'sans-serif'],
    //   serif: ['Merriweather', 'serif'],
    },
    extend: {
      spacing: {
        '8xl': '96rem',
        '9xl': '128rem',
      },
      borderRadius: {
        '4xl': '2rem',
      }
    }
  },
  plugins: [],
}

