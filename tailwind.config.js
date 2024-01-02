/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  content: ["./src/webserver/views/**/*.ejs"],
  theme: {
    extend: {
      "colors": [
        {
          "biru_tua": "rgba(40,56,98,255)"
        },
        {
          "biru_tua": "rgba(15,33,79,255)"
        },
        {
          "abu_abu": "rgba(246,247,251,255)"
        }
      ]
    },
  },
  plugins: [],
}

