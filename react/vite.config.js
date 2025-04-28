import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    exclude: ['vite'] // מונע טעינה כפולה של קבצי Vite
  },
  server: {
    watch: {
      usePolling: true
    }
  }
});
