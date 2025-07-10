import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  root: 'Client',
  build: {
    outDir: '../dist', // Build output will go to root/dist
    emptyOutDir: true,
  },
  plugins: [tailwindcss(), react()],
})
