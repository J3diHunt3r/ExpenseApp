import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from "path"
import { TanStackRouterVite } from '@tanstack/router-vite-plugin'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), TanStackRouterVite()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      "@server": path.resolve(__dirname, "../server"),
    },
  },
  server: {
    proxy: {
      "/api": {
        target: 'http://127.0.0.1:3000',
        changeOrigin: true,
      }
    }
  },
  build: {
    // Minification is enabled by default in production builds, but you can specify it explicitly here
    minify: 'esbuild', // You can also try 'terser' if needed for custom minification

    // Optional: Enable source maps for debugging (set to true in case you want sourcemaps)
    sourcemap: false,  // Disable sourcemaps for production build
  }
})
