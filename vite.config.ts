import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'


// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  server: {
    proxy: {
       '/users': {
        target: 'http://51.20.65.235:8080',
        changeOrigin: true,
      },
      '/api': {
        target: 'http://51.20.65.235:8080',
        changeOrigin: true,
      },
    },
  },
})