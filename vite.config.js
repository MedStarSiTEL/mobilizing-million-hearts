import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from "@tailwindcss/vite";
import { version,name } from './package.json';
import path from "path"

// https://vitejs.dev/config/
export default defineConfig({
  base: "/mesa-risk",
  plugins: [react(),tailwindcss()],
  define: {
      '__APP_VERSION__': JSON.stringify(version),
      '__APP_NAME__':    JSON.stringify(name)
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    port: 3001 // change here
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.js'],
  }
})
