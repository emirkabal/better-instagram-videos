import { defineConfig } from "vite"
import react from "@vitejs/plugin-react"
import { crx } from "@crxjs/vite-plugin"
import manifest from "./src/manifest.json"
import svgr from "vite-plugin-svgr"
import path from "path"

export default defineConfig({
  plugins: [react(), svgr(), crx({ manifest })],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src/")
    }
  }
})
