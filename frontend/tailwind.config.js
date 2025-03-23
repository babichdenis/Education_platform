/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
      './src/**/*.{js,jsx}', // Указываем пути к вашим файлам
    ],
    theme: {
      extend: {
        colors: {
          primary: '#1E3A8A',
          accent: '#3B82F6',
        },
        fontFamily: {
          sans: ['Inter', 'sans-serif'],
        },
      },
    },
    plugins: [],
  };
