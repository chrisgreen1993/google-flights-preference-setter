import { defineConfig } from "vite";
import { crx } from "@crxjs/vite-plugin";
import manifest from "./manifest.json";

export default defineConfig({
  plugins: [crx({ manifest })],
  legacy: {
    // Worakaround for https://github.com/crxjs/chrome-extension-tools/issues/971
    skipWebSocketTokenCheck: true,
  },
});
