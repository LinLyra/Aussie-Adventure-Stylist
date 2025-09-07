/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        background: "hsl(230 20% 8%)",
        foreground: "hsl(0 0% 98%)",
        card: "hsl(230 24% 12%)",
        "card-foreground": "hsl(0 0% 98%)",
        input: "hsl(230 22% 16%)",
        border: "hsl(230 22% 24%)",
        primary: "hsl(42 90% 55%)",
        accent: "hsl(200 90% 40%)"
      }
    }
  },
  plugins: []
}
