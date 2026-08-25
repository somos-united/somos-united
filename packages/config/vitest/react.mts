import react from "@vitejs/plugin-react";
import { defineConfig, mergeConfig } from "vitest/config";

import baseConfig from "./base.mts";

/**
 * Shared Vitest config for anything that renders React components: layers
 * the jsdom DOM environment + the React JSX plugin on top of ./base.mts.
 * Used by @somos/ui today; the three Next.js apps can switch from ./base to
 * this once they grow component-level tests of their own.
 */
export default mergeConfig(
  baseConfig,
  defineConfig({
    plugins: [react()],
    test: {
      environment: "jsdom",
      setupFiles: [new URL("./setup-react.mts", import.meta.url).pathname],
    },
  }),
);
