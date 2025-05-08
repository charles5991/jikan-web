import path from "path";
// import AutoImport from 'unplugin-auto-import/vite';
import { defineConfig } from "vite";

// vite plugins
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react-swc";
import Fonts from "unplugin-fonts/vite";
// @ts-ignore
import imagemin from "unplugin-imagemin/vite";
import { compression } from "vite-plugin-compression2";
import Inspect from "vite-plugin-inspect";
import svgr from "vite-plugin-svgr";

import { fonts } from "./configs/fonts.config";

export default defineConfig({
  base: "/",
  plugins: [
    svgr(),
    react(),
    Inspect(),
    compression(),
    imagemin(),
    tailwindcss(),
    Fonts({ google: { families: fonts } }),
    // AutoImport({
    //   imports: ['react', 'react-router'],
    //   dts: './auto-imports.d.ts',
    //   eslintrc: { filepath: './.eslintrc-auto-import.json' },
    //   dirs: ['./src/components/ui'],
    // }),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    outDir: "dist",
    sourcemap: false,
    minify: "terser",
    terserOptions: {
      compress: {
        drop_console: true,
      },
    },
  },
});
