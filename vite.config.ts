import path from "node:path";
import { fileURLToPath } from "node:url";
import react from "@vitejs/plugin-react";
import { defineConfig, lazyPlugins } from "vite-plus";
import { VitePWA } from "vite-plugin-pwa";

const rootDir = path.dirname(fileURLToPath(import.meta.url));
const base = process.env.VITE_BASE_PATH || "/";

export default defineConfig({
  fmt: {},
  lint: {
    jsPlugins: [{ name: "vite-plus", specifier: "vite-plus/oxlint-plugin" }],
    rules: { "vite-plus/prefer-vite-plus-imports": "error" },
    options: { typeAware: true, typeCheck: true },
  },
  base,
  plugins: lazyPlugins(() => [
    // Classic JSX so React.createElement applies the React 19 defaultProps
    // shim. reactstrap 8 function components still declare defaultProps.
    react({ jsxRuntime: "classic" }),
    VitePWA({
      registerType: "autoUpdate",
      injectRegister: "auto",
      includeAssets: [
        "favicon.ico",
        "robots.txt",
        "logo192.png",
        "logo512.png",
        "icon-192x192.png",
        "icon-256x256.png",
        "icon-384x384.png",
        "icon-512x512.png",
      ],
      manifest: {
        id: base,
        name: "Walk Hero",
        short_name: "Walk Hero",
        description: "Have an Epic Walk",
        theme_color: "#f4d7c7",
        background_color: "#f69435",
        display: "fullscreen",
        orientation: "portrait",
        scope: base,
        start_url: base,
        icons: [
          {
            src: "icon-192x192.png",
            sizes: "192x192",
            type: "image/png",
            purpose: "any",
          },
          {
            src: "icon-256x256.png",
            sizes: "256x256",
            type: "image/png",
            purpose: "any",
          },
          {
            src: "icon-384x384.png",
            sizes: "384x384",
            type: "image/png",
            purpose: "any",
          },
          {
            src: "icon-512x512.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "any",
          },
        ],
      },
      workbox: {
        navigateFallback: "index.html",
        globPatterns: ["**/*.{js,css,html,ico,png,gif,svg,webmanifest,txt}"],
        // The city lookup worker inlines the city database, which is larger
        // than Workbox's 2 MiB precache default. Keep it in the app shell so
        // a walk can resolve cities while offline.
        maximumFileSizeToCacheInBytes: 12 * 1024 * 1024,
      },
      devOptions: {
        enabled: false,
      },
    }),
  ]),
  resolve: {
    alias: {
      // Same path aliases the old craco config exposed to component templates.
      "@components": path.resolve(rootDir, "src/components"),
      "@data": path.resolve(rootDir, "src/data"),
      "@gif": path.resolve(rootDir, "src/gif"),
      "@minigames": path.resolve(rootDir, "src/minigames"),
      "@modals": path.resolve(rootDir, "src/modals"),
      "@root": rootDir,
      "@services": path.resolve(rootDir, "src/services"),
      "@store": path.resolve(rootDir, "src/store"),
      "@utils": path.resolve(rootDir, "src/utils"),
      "@views": path.resolve(rootDir, "src/views"),
      "@workers": path.resolve(rootDir, "src/workers"),
      store: path.resolve(rootDir, "src/store"),
      utils: path.resolve(rootDir, "src/utils"),
      // reactstrap 8 still imports react-transition-group, which calls the
      // findDOMNode API React 19 removed. This fork reads the child ref instead.
      "react-transition-group": path.resolve(
        rootDir,
        "node_modules/@fitzyracing/react-transition-group",
      ),
    },
  },
  server: {
    port: 3000,
    proxy: {
      "/auth": "http://localhost:8888",
    },
  },
  preview: {
    port: 3000,
  },
  css: {
    preprocessorOptions: {
      scss: {
        quietDeps: true,
        silenceDeprecations: [
          "import",
          "global-builtin",
          "color-functions",
          "if-function",
          "legacy-js-api",
          "slash-div",
        ],
      },
    },
  },
  test: {
    environment: "jsdom",
    setupFiles: ["./src/test/setup.ts"],
    css: true,
    restoreMocks: true,
  },
});
