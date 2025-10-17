// --- START OF FILE vite.config.ts ---
import path from "path"
import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      // This allows @ imports like "@/components/ui/button" to work
      "@": path.resolve(__dirname, "src"),
      // This allows shared imports
      "@shared": path.resolve(__dirname, "../shared"),
      // This allows bare imports like "utils/api" to work
      "utils": path.resolve(__dirname, "src/utils"),
      "hooks": path.resolve(__dirname, "src/hooks"),
      "components": path.resolve(__dirname, "src/components"),
      "lib": path.resolve(__dirname, "src/lib"),
      "pages": path.resolve(__dirname, "src/pages"),
    },
  },
  server: {
    proxy: {
      "/api": {
        target: "http://localhost:4001",
        changeOrigin: true,
      },
    },
  },
})
// --- END OF FILE vite.config.ts ---