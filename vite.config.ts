import { defineConfig } from "vite";
import { resolve } from "path";
import "~/tailwind.css?url"

import tsconfigPaths from "vite-tsconfig-paths";

// Entferne installGlobals(), da es nicht mehr notwendig ist (wird von Remix gehandhabt)
export default defineConfig({
  plugins: [
    remix({
      ignoredRouteFiles: ["**/.*"], // Ignoriere versteckte Dateien
    }),
  ],
  server: {
    port: 5173, // Standardport für Vite
    hmr: {
      overlay: false, // Deaktiviert HMR-Overlay (optional)
    },
  },
  css: {
    postcss: {
      plugins: [
        require("tailwindcss"),
        require("autoprefixer"),
      ],
    },
  },
  resolve: {
    alias: {
      "~": resolve(__dirname, "app"),
    },
  },
});

function remix(arg0: { ignoredRouteFiles: string[]; }): import("vite").PluginOption {
  throw new Error("Function not implemented.");
}
