/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        "primary": "#4d0408",
        "surface-container-low": "#fff0ef",
        "tertiary-fixed": "#b9ebfa",
        "surface-dim": "#e8d6d4",
        "surface-container-high": "#f7e4e2",
        "on-secondary-container": "#6e4900",
        "primary-fixed-dim": "#ffb3ae",
        "on-primary-container": "#f1817b",
        "on-secondary": "#ffffff",
        "error": "#ba1a1a",
        "inverse-on-surface": "#ffedeb",
        "secondary-fixed": "#ffddb0",
        "primary-container": "#6b1b1b",
        "error-container": "#ffdad6",
        "inverse-surface": "#392e2d",
        "secondary": "#805600",
        "on-tertiary-fixed": "#001f26",
        "surface": "#fff8f7",
        "on-primary": "#ffffff",
        "on-secondary-fixed": "#291800",
        "tertiary": "#00272f",
        "on-surface-variant": "#554241",
        "on-tertiary-container": "#78a9b7",
        "surface-bright": "#fff8f7",
        "on-surface": "#231919",
        "on-tertiary-fixed-variant": "#184d59",
        "surface-container": "#fdeae8",
        "on-error": "#ffffff",
        "on-primary-fixed-variant": "#7e2928",
        "outline-variant": "#dcc0be",
        "primary-fixed": "#ffdad7",
        "secondary-fixed-dim": "#ffba47",
        "on-background": "#231919",
        "tertiary-fixed-dim": "#9dcedd",
        "surface-container-lowest": "#ffffff",
        "on-secondary-fixed-variant": "#614000",
        "surface-variant": "#f1dedd",
        "inverse-primary": "#ffb3ae",
        "on-error-container": "#93000a",
        "surface-container-highest": "#f1dedd",
        "on-tertiary": "#ffffff",
        "outline": "#897270",
        "surface-tint": "#9d403d",
        "tertiary-container": "#003e4a",
        "on-primary-fixed": "#410004",
        "background": "#fff8f7",
        "secondary-container": "#fdb742"
      },
      borderRadius: {
        "DEFAULT": "0.125rem",
        "lg": "0.25rem",
        "xl": "0.5rem",
        "full": "0.75rem"
      },
      spacing: {
        "margin-desktop": "40px",
        "container-max": "1280px",
        "gutter": "24px",
        "margin-mobile": "16px",
        "base": "8px"
      },
      fontFamily: {
        "body-sm": ["Inter", "sans-serif"],
        "label-sm": ["Inter", "sans-serif"],
        "h2": ["Newsreader", "serif"],
        "body-lg": ["Inter", "sans-serif"],
        "body-md": ["Inter", "sans-serif"],
        "h3": ["Newsreader", "serif"],
        "h1": ["Newsreader", "serif"],
        "label-md": ["Inter", "sans-serif"]
      },
      fontSize: {
        "body-sm": ["14px", { "lineHeight": "1.5", "fontWeight": "400" }],
        "label-sm": ["12px", { "lineHeight": "1.2", "letterSpacing": "0.04em", "fontWeight": "600" }],
        "h2": ["32px", { "lineHeight": "1.3", "fontWeight": "600" }],
        "body-lg": ["18px", { "lineHeight": "1.6", "fontWeight": "400" }],
        "body-md": ["16px", { "lineHeight": "1.6", "fontWeight": "400" }],
        "h3": ["24px", { "lineHeight": "1.4", "fontWeight": "500" }],
        "h1": ["40px", { "lineHeight": "1.2", "fontWeight": "600" }],
        "label-md": ["14px", { "lineHeight": "1.2", "letterSpacing": "0.02em", "fontWeight": "600" }]
      }
    }
  },
  plugins: [],
}
