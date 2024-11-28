import AutoImport from "unplugin-auto-import/vite";
import Components from "unplugin-vue-components/vite";
import { NaiveUiResolver } from "unplugin-vue-components/resolvers";

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
    // baseURL: "/web-tools/",
    buildAssetsDir: "/static/",
  },
  // 如果要要在移动端浏览器调试网页，请打开配置
  // devServer: {
  //   host: "0",
  // },
  modules: [
    "@nuxt/icon",
    "@nuxtjs/tailwindcss",
    "@vueuse/nuxt",
    "@nuxtjs/color-mode",
  ],
  routeRules: {
    "/**/**": { ssr: false },
    "/system/**": { ssr: false },
    "/tools-old/**": { ssr: false },
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
      noExternal: ["naive-ui", "date-fns", "crypto-js"],
    },
  },
  pages: true,
  icon: {
    // mode: "svg",
    serverBundle: {
      collections: ["ep", "ic", "ri", "material-symbols", "iconoir"],
    },
    customCollections: [
      {
        prefix: "custom",
        dir: "./assets/icons",
      },
    ],
  },
  colorMode: {
    preference: "system",
  },
  experimental: {
    payloadExtraction: false,
  },
});
