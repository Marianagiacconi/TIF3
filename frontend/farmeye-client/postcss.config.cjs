// postcss.config.cjs
module.exports = {
  plugins: [
    require('@tailwindcss/postcss'),  // <— en vez de 'tailwindcss'
    require('autoprefixer'),
  ]
}
