import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { viteSingleFile } from "vite-plugin-singlefile";

// `npm run build:preview` genera un único HTML autocontenido (útil para compartir una vista previa).
export default defineConfig(({ mode }) => ({
  plugins: [react(), ...(mode === "singlefile" ? [viteSingleFile()] : [])],
  build: { outDir: mode === "singlefile" ? "dist-preview" : "dist" },
}));
