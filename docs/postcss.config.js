export default {
  plugins: {
    'postcss-import': {},  // Optional, but good to have
    'tailwindcss/nesting': 'postcss-nesting',  // ← Add this BEFORE tailwindcss
    tailwindcss: {},
    autoprefixer: {},
  }
}