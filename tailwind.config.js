/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        pending: '#888888',
        copied: '#007BFF',
        generated: '#00D4AA',
        shared: '#9B59B6',
        youtube: '#FF0000',
        tiktok: '#000000',
        facebook: '#1877F2',
        instagram: '#E1306C',
      }
    },
  },
  plugins: [],
}
