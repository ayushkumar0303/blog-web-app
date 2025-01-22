import flowbite from "flowbite-react/tailwind";

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "index.html",
    "./src/**/*.{js,jsx}",
    flowbite.content(),
  ],
  plugins: [
    
    flowbite.plugin(),
  ],
};
