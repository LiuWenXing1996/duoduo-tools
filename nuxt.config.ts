import AutoImport from "unplugin-auto-import/vite";
import Components from "unplugin-vue-components/vite";
import { NaiveUiResolver } from "unplugin-vue-components/resolvers";
import { cpSync } from "node:fs";
import path from "node:path";

export default defineNuxtConfig({
  compatibilityDate: "2024-04-03",
  devtools: { enabled: true },
  app: {
    head: {
      link: [{ rel: "icon", type: "image/x-icon", href: "/favicon.svg" }],
    },
    rootAttrs: {
      style: "height:100%;width:100%;",
    },
    buildAssetsDir: "/static/",
  },
  // 如果要要在移动端浏览器调试网页，请打开配置
  // devServer: {
  //   host: "0",
  // },
  modules: [
    "nuxt-icons",
    "@nuxtjs/tailwindcss",
    "@vueuse/nuxt",
    "@nuxtjs/color-mode",
  ],
  routeRules: {
    "/tools/**": { ssr: false },
  },
  vite: {
    plugins: [
      AutoImport({
        dts: true,
        imports: [
          {
            "naive-ui": [
              "useDialog",
              "useMessage",
              "useNotification",
              "useLoadingBar",
            ],
          },
        ],
      }),
      Components({
        resolvers: [NaiveUiResolver()],
      }),
    ],
    ssr: {
      noExternal: ["naive-ui", "date-fns", "crypto-js", "vueuc"],
    },
  },
  pages: true,
  colorMode: {
    preference: "system",
  },
  experimental: {
    payloadExtraction: false,
    asyncContext: true,
  },
  hooks: {
    "nitro:build:public-assets": (nitro) => {
      console.log("nitro:build:public-assets");
      const targetDir = path.join(
        nitro.options.output.publicDir,
        "static/node_modules/monaco-editor/min/vs"
      );
      console.log({ targetDir });
      cpSync("./node_modules/monaco-editor/min/vs", targetDir, {
        recursive: true,
      });
    },
  },
  autoImportTypes: {
    dirs: [
      {
        path: "~/components",
        import: "Props",
        prefix: "",
        suffix: "ComponentProps",
      },
      {
        path: "~/components",
        import: "Model",
        prefix: "",
        suffix: "ComponentModel",
      },
      {
        path: "~/server/api",
        import: "Params",
        prefix: "",
        suffix: "ApiParams",
      },
    ],
  },
});
