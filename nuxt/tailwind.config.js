const tailwindForms = require('@tailwindcss/forms')

module.exports = {
  theme: {},
  plugins: [tailwindForms],
  content: [
    `components/**/*.{vue,js}`,
    `layouts/**/*.vue`,
    `pages/**/*.vue`,
    `plugins/**/*.{js,ts}`,
    `nuxt.config.{js,ts}`,
  ],
}
