import path from "node:path";
import tailwindcss from "@tailwindcss/vite";
import { vanillaExtractPlugin } from "@vanilla-extract/vite-plugin";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

// 백엔드(FastAPI, :8000)로 프록시 — 프론트 코드에 백엔드 주소 하드코딩 없이 개발
const BACKEND = "http://localhost:8000";

export default defineConfig({
  plugins: [react(), tailwindcss(), vanillaExtractPlugin()],
  resolve: {
    alias: { "@": path.resolve(__dirname, "./src") },
  },
  server: {
    proxy: {
      "/api": BACKEND,
      "/static": BACKEND,
    },
  },
});
