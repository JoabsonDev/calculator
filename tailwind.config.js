const plugin = require("tailwindcss/plugin")

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./*.html", "./js/**/*.js"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Arial", "sans-serif"],
        "ds-digital": ['"DS-Digital"', "sans-serif"]
      },
      boxShadow: {
        default: "0px 0px 2px 5px rgba(7, 11, 19, 0.6)",
        active: "0px 0px 2px 6px rgba(7, 11, 19, 0.6)"
      },
      pointerEvents: {
        "none-children": "none"
      }
    }
  },
  plugins: [
    function ({ addComponents }) {
      addComponents({
        ".pointer-events-none-children > *": {
          "pointer-events": "none"
        }
      })
    }
  ]
}
