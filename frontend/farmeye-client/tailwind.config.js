// tailwind.config.cjs
module.exports = {
    content: ["./index.html", "./src/**/*.{js,jsx}"],
    theme: {
      extend: {
        colors: {
          primary: {
            50:  "#f5fdf7",
            100: "#dafbf0",
            200: "#b3f7e0",
            300: "#8cf3d0",
            400: "#65eebf",
            500: "#3ddbaa",
            600: "#34c194",
            700: "#2ba97c",
            800: "#228264",
            900: "#196b4e",
          },
          accent: {
            50:  "#fef7f5",
            100: "#fdece8",
            200: "#fbd8d1",
            300: "#f9c4b9",
            400: "#f6ada0",
            500: "#f29383",
            600: "#e27e6e",
            700: "#c6675b",
            800: "#a45049",
            900: "#853d39",
          },
        },
        borderRadius: {
          xl: "1rem",
          "2xl": "1.5rem",
        },
      },
    },
    plugins: [require('daisyui')],
    
  daisyui: {
    themes: [ 'white' ], // elegimos el tema oscuro
    darkTheme: "white",
  },
  };
  