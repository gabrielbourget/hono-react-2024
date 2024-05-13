import path from "path";
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { TanStackRouterVite } from "@tanstack/router-vite-plugin";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), TanStackRouterVite()], 
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./"),
      "@server": path.resolve(__dirname, "../backend/src"),
    }
  },
  server: {
    proxy: {
      "/api": {
        target: "http://localhost:3002",
        changeOrigin: true
      }
    }
  }
});
