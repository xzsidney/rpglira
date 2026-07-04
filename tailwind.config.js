/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#050505",
        surface: "#1A1A1A",
        vampire: "#8B0000",
        werewolf: "#1B4332",
        mage: "#0D2CCC",
        hunter: "#D9480F",
      },
      fontFamily: {
        headline: ["'EB Garamond'", "serif"],
        body: ["'Hanken Grotesk'", "sans-serif"],
      },
    },
  },
  plugins: [],
}
