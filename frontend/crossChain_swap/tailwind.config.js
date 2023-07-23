const colors = require("tailwindcss/colors");
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    colors: {
      ...colors,
      pink: "#EF2A89",
      green: "rgb(187 247 208)",
      bgCardNavbar: "#FAFAFA",
      borderCardNavbar: "#00000014",
      borderBottomConnectedCard: "#00000040",
      white: "#FFFFFF",
      yellow: "#FFD12F1F",
      ethBalance: "#F5F5F5",
      borderCardAbout: "#00000026",
      textGray: "#00000066",
      textGrayFonce: "#000000B2",
      gray800: "#1F2937",
      magicWallet: "#6851FF",
      darkgreen: "#394A46",
    },
    extend: {},
  },
  plugins: [],
};
