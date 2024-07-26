import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    proxy: {
      "/api":{
        // target: "http://localhos  t:5000",
        target: "https://x-clone-ndql.onrender.com",
        changeOrigin: true,
      }
    }
  }
})
