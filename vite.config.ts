import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  base: '/EnRuta/', // 👈 cambia esto si tu repo tiene otro nombre
  plugins: [react()],
})