import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import wasm from "vite-plugin-wasm";
import topLevelAwait from "vite-plugin-top-level-await";
import * as esbuild from "esbuild";

// https://vitejs.dev/config/

const sourceJSPattern = /\/src\/.*\.js$/;
export default defineConfig({
  plugins: [react(), wasm(), topLevelAwait()],
  optimizeDeps: {
    esbuildOptions: {
      loader: {
        ".js": "jsx",
      },
    },
    esbuild: {
      loader: "jsx",
      include: [sourceJSPattern],
      exclude: [],
    },
  },
});
