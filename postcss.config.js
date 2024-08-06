module.exports = {
  plugins: {
    'postcss-import': {},
    'tailwindcss/nesting': {},
    tailwindcss: {config: "./src/tailwind.config.css"},
    autoprefixer: {},
  }
}