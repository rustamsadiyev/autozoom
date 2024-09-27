/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      screens: {
        iphone: "350px",
        iphone14:"415px", 
        tablet:"1080px",
        ipad:"910px",
        sm: "55px",
        small:"500px",
        md: "780px",  
        xl:"1600px",
        lg:"1240px"
      },
    },
  },
  plugins: [],
}