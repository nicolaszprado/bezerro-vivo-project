import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  plugins: [react(), tailwindcss(), tsconfigPaths()],
  optimizeDeps: {
    // Some lucide-react installs ship empty *.js.map files, which can break
    // esbuild during Vite's dependency pre-bundling in dev mode.
    exclude: ["lucide-react"],
  },
});
